export type TransactionType = 'income' | 'expense';

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: TransactionType;
}

export interface Wallet {
    id: string;
    name: string;
    type: 'bank' | 'ewallet' | 'cash';
    balance: number;
    color: string;
    accountNumber?: string;
}

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    walletId: string;
    date: string;
    note: string;
}
