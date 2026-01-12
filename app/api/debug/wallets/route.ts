import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { WalletModel } from '@/lib/models';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'No user' });

    await dbConnect();
    const wallets = await WalletModel.find({ userId: session.user.id });
    return NextResponse.json({
        userId: session.user.id,
        count: wallets.length,
        wallets
    });
}
