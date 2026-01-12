import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { CategoryModel, WalletModel, TransactionModel } from '@/lib/models';

export async function GET() {
    try {
        await dbConnect();

        const [categories, wallets, transactions] = await Promise.all([
            CategoryModel.find({}).lean(),
            WalletModel.find({}).lean(),
            TransactionModel.find({}).sort({ date: -1 }).lean(),
        ]);

        // Remove _id and __v if needed, or mapped. 
        // Since we used 'id' in schema, we can just return them. 
        // Mongoose .lean() returns POJOs.

        return NextResponse.json({
            categories,
            wallets,
            transactions,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
