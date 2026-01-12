import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { CategoryModel, WalletModel, TransactionModel } from '@/lib/models';
import { initialCategories, initialWallets, initialTransactions } from '@/lib/data';

export async function POST() {
    try {
        await dbConnect();

        // Clear existing data (optional, or just check count)
        // For now, let's just wipe and recreate to ensure state matches initialData
        await CategoryModel.deleteMany({});
        await WalletModel.deleteMany({});
        await TransactionModel.deleteMany({});

        await CategoryModel.insertMany(initialCategories);
        await WalletModel.insertMany(initialWallets);
        await TransactionModel.insertMany(initialTransactions);

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
