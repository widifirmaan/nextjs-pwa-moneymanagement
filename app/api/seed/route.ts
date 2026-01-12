import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { CategoryModel, WalletModel, TransactionModel } from '@/lib/models';
import { initialCategories, initialWallets, initialTransactions } from '@/lib/data';
import { auth } from '@/auth';

export async function POST() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log("SEEDING STARTED for user:", session.user.id, "USING UUID LOGIC");

        const userId = session.user.id;

        await dbConnect();

        // Check if user already has data to prevent accidental re-seeding
        const count = await CategoryModel.countDocuments({ userId });
        if (count > 0) {
            return NextResponse.json({ message: 'Data already exists' });
        }

        // Add userId to data and Generate Unique IDs to prevent collision
        const categoriesWithUser = initialCategories.map(c => ({
            ...c,
            id: crypto.randomUUID(),
            userId
        }));
        const walletsWithUser = initialWallets.map(w => ({
            ...w,
            id: crypto.randomUUID(),
            userId
        }));

        await CategoryModel.insertMany(categoriesWithUser);
        await WalletModel.insertMany(walletsWithUser);
        // Transactions initially empty for real usage
        // await TransactionModel.insertMany(transactionsWithUser);

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
