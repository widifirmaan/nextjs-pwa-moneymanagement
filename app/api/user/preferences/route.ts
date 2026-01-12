import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/db';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection('users').findOne({
            _id: session.user.id
        });

        return NextResponse.json({
            colorScheme: user?.colorScheme || 'dark',
            expenseLimits: user?.expenseLimits || { daily: 0, weekly: 0, monthly: 0 },
            isSetupCompleted: user?.isSetupCompleted || false
        });
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { colorScheme, expenseLimits, isSetupCompleted } = body;

        const updateData: any = {};
        if (colorScheme) updateData.colorScheme = colorScheme;
        if (expenseLimits) updateData.expenseLimits = expenseLimits;
        if (typeof isSetupCompleted === 'boolean') updateData.isSetupCompleted = isSetupCompleted;

        const client = await clientPromise;
        const db = client.db();

        await db.collection('users').updateOne(
            { _id: session.user.id },
            { $set: updateData },
            { upsert: false }
        );

        return NextResponse.json({
            success: true,
            ...updateData
        });
    } catch (error) {
        console.error('Error saving user preferences:', error);
        return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
    }
}
