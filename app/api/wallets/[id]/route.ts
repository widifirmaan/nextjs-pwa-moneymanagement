import { NextResponse } from 'next/server';
import { WalletModel } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';

// PUT update wallet
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        const wallet = await WalletModel.findOneAndUpdate(
            { id: params.id, userId: session.user.id },
            body,
            { new: true }
        );

        if (!wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        return NextResponse.json(wallet);
    } catch (error) {
        console.error('PUT /api/wallets/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update wallet' }, { status: 500 });
    }
}

// DELETE wallet
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const wallet = await WalletModel.findOneAndDelete({
            id: params.id,
            userId: session.user.id
        });

        if (!wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Wallet deleted' });
    } catch (error) {
        console.error('DELETE /api/wallets/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete wallet' }, { status: 500 });
    }
}
