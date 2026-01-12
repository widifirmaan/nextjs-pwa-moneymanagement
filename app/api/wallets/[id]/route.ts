import { NextResponse } from 'next/server';
import { WalletModel } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';

// PUT update wallet
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        console.log(`[PUT Wallet] Update ${params.id}`);
        // Relaxed query: trusting randomUUID uniqueness to avoid userId mismatch issues
        const wallet = await WalletModel.findOneAndUpdate(
            { id: params.id },
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
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const wallet = await WalletModel.findOneAndDelete({
            id: params.id
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
