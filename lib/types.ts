export type TransactionType = 'income' | 'expense';
export type ColorScheme = 'dark' | 'light' | 'blue' | 'purple' | 'green' | 'rose' | 'orange' | 'emerald' | 'dark-emerald';

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: TransactionType;
    userId?: string;
}

export interface Wallet {
    id: string;
    name: string;
    type: 'bank' | 'ewallet' | 'cash';
    balance: number;
    color: string;
    accountNumber?: string;
    userId?: string;
    isFrozen?: boolean;
    expenseLimits?: ExpenseLimits;
}

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    walletId: string;
    date: string;
    note: string;
    receiptUrl?: string;
    userId?: string;
}

export interface ExpenseLimits {
    daily: number;
    weekly: number;
    monthly: number;
}

export interface UserPreferences {
    colorScheme: ColorScheme;
    expenseLimits?: ExpenseLimits; // Deprecated, moved to Wallet
    isSetupCompleted: boolean;
}

export interface Notification {
    id: string;
    type: 'limit-daily' | 'limit-weekly' | 'limit-monthly';
    message: string;
    date: string;
    read: boolean;
}

export interface SavedCard {
    id: string;
    userId: string;
    cardName: string;
    cardHolderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardType: 'visa' | 'mastercard' | 'jcb' | 'amex' | 'other';
    color: string;
    bankName?: string;
}
