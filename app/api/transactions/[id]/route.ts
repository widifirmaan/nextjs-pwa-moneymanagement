import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { TransactionModel, WalletModel } from '@/lib/models';
import { auth } from '@/auth';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        await dbConnect();
        const { id } = await params;

        const transaction = await TransactionModel.findOne({ id, userId });
        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // Reverse Wallet Balance
        const wallet = await WalletModel.findOne({ id: transaction.walletId, userId });
        if (wallet) {
            if (transaction.type === 'income') {
                wallet.balance -= transaction.amount;
            } else {
                wallet.balance += transaction.amount;
            }
            await wallet.save();
        }

        await TransactionModel.deleteOne({ id, userId });

        return NextResponse.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
    }
}
