import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/lib/models';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Try fetch fresh from DB
        const user = await UserModel.findById(session.user.id);

        return NextResponse.json({
            name: user?.name || session.user.name || 'User'
        });
    } catch (error) {
        console.error("Profile GET Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        // Validation
        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        if (name.length > 20) {
            return NextResponse.json({ error: 'Name too long (max 20 chars)' }, { status: 400 });
        }

        // Sanitize? Simple text check ok.

        await dbConnect();

        await UserModel.findByIdAndUpdate(session.user.id, { name });

        return NextResponse.json({ message: 'Profile updated', name });
    } catch (error) {
        console.error("Profile PUT Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
