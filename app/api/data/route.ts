import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { CategoryModel, WalletModel, TransactionModel } from '@/lib/models';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        await dbConnect();

        const [categories, wallets, transactions] = await Promise.all([
            CategoryModel.find({ userId }).lean(),
            WalletModel.find({ userId }).lean(),
            TransactionModel.find({ userId }).sort({ date: -1 }).lean(),
        ]);

        return NextResponse.json({
            categories,
            wallets,
            transactions,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
