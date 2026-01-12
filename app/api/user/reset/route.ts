import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { TransactionModel, WalletModel, CategoryModel, SavedCardModel } from '@/lib/models';
import { auth } from '@/auth';

export async function POST() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        await dbConnect();

        // Delete all user related data
        await Promise.all([
            TransactionModel.deleteMany({ userId }),
            WalletModel.deleteMany({ userId }),
            CategoryModel.deleteMany({ userId }),
            SavedCardModel.deleteMany({ userId })
        ]);

        // Reset user preferences using native driver to match existing pattern
        // We import mongoose dynamically to access the native db connection if managed there
        const mongoose = await import('mongoose');
        if (mongoose.connection.db) {
            await mongoose.connection.db.collection('users').updateOne(
                { _id: userId },
                {
                    $set: {
                        isSetupCompleted: false,
                        expenseLimits: { daily: 0, weekly: 0, monthly: 0 }
                    },
                    // Optional: Reset color scheme? User might want to keep it. Let's keep colorScheme.
                }
            );
        }

        return NextResponse.json({ success: true, message: 'Data reset successfully' });
    } catch (error: any) {
        console.error('Reset error:', error);
        return NextResponse.json({ error: error.message || 'Failed to reset data' }, { status: 500 });
    }
}
