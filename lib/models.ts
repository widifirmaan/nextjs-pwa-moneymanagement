import mongoose, { Schema, Model } from 'mongoose';
import { Category, Wallet, Transaction } from './types';

// Category Schema
const CategorySchema = new Schema<Category>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    userId: { type: String, required: true, index: true },
});

// Wallet Schema
const WalletSchema = new Schema<Wallet>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['bank', 'ewallet', 'cash'], required: true },
    balance: { type: Number, required: true, default: 0 },
    color: { type: String, required: true },
    accountNumber: { type: String },
    userId: { type: String, required: true, index: true },
});

// Transaction Schema
const TransactionSchema = new Schema<Transaction>({
    id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    categoryId: { type: String, required: true },
    walletId: { type: String, required: true },
    date: { type: String, required: true }, // Keeping as string to match interface, usually Date is better
    note: { type: String, default: '' },
    userId: { type: String, required: true, index: true },
});

// Prevent compilation errors if models are already defined
export const CategoryModel = (mongoose.models.Category as Model<Category>) || mongoose.model<Category>('Category', CategorySchema);
export const WalletModel = (mongoose.models.Wallet as Model<Wallet>) || mongoose.model<Wallet>('Wallet', WalletSchema);
export const TransactionModel = (mongoose.models.Transaction as Model<Transaction>) || mongoose.model<Transaction>('Transaction', TransactionSchema);
