import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { TransactionModel, WalletModel } from '@/lib/models';
import { Transaction } from '@/lib/types';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, amount, type, categoryId, walletId, date, note } = body as Transaction;

        // Create transaction
        const newTransaction = new TransactionModel({
            id, // Client provides ID or we generate it? Context generates it.
            amount,
            type,
            categoryId,
            walletId,
            date,
            note,
        });
        await newTransaction.save();

        // Update Wallet Balance
        const wallet = await WalletModel.findOne({ id: walletId });
        if (wallet) {
            if (type === 'income') {
                wallet.balance += amount;
            } else {
                wallet.balance -= amount;
            }
            await wallet.save();
        }

        return NextResponse.json(newTransaction);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }
}
