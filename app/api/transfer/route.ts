import { NextResponse } from 'next/server';
import { TransactionModel, WalletModel } from '@/lib/models';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        await dbConnect();
        const { amount, sourceWalletId, targetWalletId, date, note } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const sourceWallet = await WalletModel.findOne({ id: sourceWalletId, userId });
        const targetWallet = await WalletModel.findOne({ id: targetWalletId, userId });

        if (!sourceWallet || !targetWallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        if (sourceWalletId === targetWalletId) {
            return NextResponse.json({ error: 'Cannot transfer to the same wallet' }, { status: 400 });
        }

        // 1. Create Expense Transaction on Source Wallet
        const expenseTx = new TransactionModel({
            id: crypto.randomUUID(),
            amount,
            type: 'expense',
            categoryId: 'c10', // Others (Expense)
            walletId: sourceWalletId,
            date,
            note: `Transfer to ${targetWallet.name}${note ? ': ' + note : ''}`,
            userId
        });

        // 2. Create Income Transaction on Target Wallet
        const incomeTx = new TransactionModel({
            id: crypto.randomUUID(),
            amount,
            type: 'income',
            categoryId: 'c11', // Other (Income)
            walletId: targetWalletId,
            date,
            note: `Transfer from ${sourceWallet.name}${note ? ': ' + note : ''}`,
            userId
        });

        // 3. Update Wallet Balances
        sourceWallet.balance -= Number(amount);
        targetWallet.balance += Number(amount);

        // Save everything
        await expenseTx.save();
        await incomeTx.save();
        await sourceWallet.save();
        await targetWallet.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Transfer error:', error);
        return NextResponse.json({ error: 'Transfer failed' }, { status: 500 });
    }
}
