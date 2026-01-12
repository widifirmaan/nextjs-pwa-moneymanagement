import { NextResponse } from 'next/server';
import { WalletModel } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';

// GET all wallets
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const wallets = await WalletModel.find({ userId: session.user.id }).sort({ createdAt: -1 });
        return NextResponse.json(wallets);
    } catch (error) {
        console.error('GET /api/wallets error:', error);
        return NextResponse.json({ error: 'Failed to fetch wallets' }, { status: 500 });
    }
}

// POST create new wallet
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        const wallet = await WalletModel.create({
            ...body,
            userId: session.user.id,
            isFrozen: false,
        });

        return NextResponse.json(wallet, { status: 201 });
    } catch (error) {
        console.error('POST /api/wallets error:', error);
        return NextResponse.json({ error: 'Failed to create wallet' }, { status: 500 });
    }
}
