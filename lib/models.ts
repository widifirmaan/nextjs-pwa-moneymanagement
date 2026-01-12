import mongoose, { Schema, Model } from 'mongoose';
import { Category, Wallet, Transaction, SavedCard, UserPreferences } from './types';

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
    isFrozen: { type: Boolean, default: false },
    expenseLimits: {
        daily: { type: Number, default: 0 },
        weekly: { type: Number, default: 0 },
        monthly: { type: Number, default: 0 },
    },
});

// SavedCard Schema
const SavedCardSchema = new Schema<SavedCard>({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    cardName: { type: String, required: true },
    cardHolderName: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true },
    cardType: { type: String, required: true },
    color: { type: String, required: true },
    bankName: { type: String },
});

// UserPreferences Schema
const UserPreferencesSchema = new Schema<UserPreferences>({
    userId: { type: String, required: true, unique: true, index: true }, // Added userId field to schema definition strictly
    colorScheme: { type: String, default: 'default' },
    expenseLimits: {
        daily: { type: Number, default: 0 },
        weekly: { type: Number, default: 0 },
        monthly: { type: Number, default: 0 },
    },
    isSetupCompleted: { type: Boolean, default: false },
}, { strict: false }); // Allow userId injection or flexible schema if needed

// Transaction Schema
const TransactionSchema = new Schema<Transaction>({
    id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    categoryId: { type: String, required: true },
    walletId: { type: String, required: true },
    date: { type: String, required: true },
    note: { type: String, default: '' },
    receiptUrl: { type: String, required: false },
    userId: { type: String, required: true, index: true },
});

// User Schema (Minimal for manual interaction)
// Use strict: false to allow NextAuth fields to exist without definition
const UserSchema = new Schema({}, { strict: false, collection: 'users' });

// Prevent compilation errors if models are already defined
export const CategoryModel = (mongoose.models.Category as Model<Category>) || mongoose.model<Category>('Category', CategorySchema);
export const WalletModel = (mongoose.models.Wallet as Model<Wallet>) || mongoose.model<Wallet>('Wallet', WalletSchema);
export const TransactionModel = (mongoose.models.Transaction as Model<Transaction>) || mongoose.model<Transaction>('Transaction', TransactionSchema);
export const SavedCardModel = (mongoose.models.SavedCard as Model<SavedCard>) || mongoose.model<SavedCard>('SavedCard', SavedCardSchema);
export const UserPreferencesModel = (mongoose.models.UserPreferences as Model<any>) || mongoose.model('UserPreferences', UserPreferencesSchema);
export const UserModel = (mongoose.models.User as Model<any>) || mongoose.model('User', UserSchema);
