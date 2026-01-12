import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { TransactionModel, WalletModel } from '@/lib/models';
import { Transaction } from '@/lib/types';
import { auth } from '@/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        await dbConnect();
        const body = await req.json();
        const { id, amount, type, categoryId, walletId, date, note } = body as Transaction;

        // Verify wallet belongs to user
        const wallet = await WalletModel.findOne({ id: walletId, userId });
        if (!wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        // Create transaction
        const newTransaction = new TransactionModel({
            id,
            amount,
            type,
            categoryId,
            walletId,
            date,
            note,
            userId
        });
        await newTransaction.save();

        // Update Wallet Balance
        if (type === 'income') {
            wallet.balance += amount;
        } else {
            wallet.balance -= amount;
        }
        await wallet.save();

        return NextResponse.json(newTransaction);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }
}
