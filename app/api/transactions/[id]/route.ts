import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { TransactionModel, WalletModel } from '@/lib/models';
import { auth } from '@/auth';

export async function PUT(
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
        const body = await req.json();

        const oldTransaction = await TransactionModel.findOne({ id, userId });
        if (!oldTransaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // Revert old transaction effect on wallet
        const oldWallet = await WalletModel.findOne({ id: oldTransaction.walletId, userId });
        if (oldWallet) {
            if (oldTransaction.type === 'income') {
                oldWallet.balance -= oldTransaction.amount;
            } else {
                oldWallet.balance += oldTransaction.amount;
            }
            await oldWallet.save();
        }

        // Update transaction
        Object.assign(oldTransaction, body);
        await oldTransaction.save();

        // Apply new transaction effect on wallet
        const newWallet = await WalletModel.findOne({ id: oldTransaction.walletId, userId });
        if (newWallet) {
            if (oldTransaction.type === 'income') {
                newWallet.balance += oldTransaction.amount;
            } else {
                newWallet.balance -= oldTransaction.amount;
            }
            await newWallet.save();
        }

        return NextResponse.json({ message: 'Transaction updated successfully', transaction: oldTransaction });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
    }
}

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
