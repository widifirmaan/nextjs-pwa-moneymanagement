CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    password TEXT NOT NULL DEFAULT '',
    colorScheme TEXT NOT NULL DEFAULT 'dark',
    isSetupCompleted INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wallets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('bank', 'ewallet', 'cash')),
    balance REAL NOT NULL DEFAULT 0,
    color TEXT NOT NULL,
    accountNumber TEXT,
    userId TEXT NOT NULL,
    isFrozen INTEGER NOT NULL DEFAULT 0,
    expenseLimitsDaily REAL NOT NULL DEFAULT 0,
    expenseLimitsWeekly REAL NOT NULL DEFAULT 0,
    expenseLimitsMonthly REAL NOT NULL DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    categoryId TEXT NOT NULL,
    walletId TEXT NOT NULL,
    date TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    receiptUrl TEXT,
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_cards (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    cardName TEXT NOT NULL,
    cardHolderName TEXT NOT NULL,
    cardNumber TEXT NOT NULL,
    expiryDate TEXT NOT NULL,
    cvv TEXT NOT NULL,
    cardType TEXT NOT NULL,
    color TEXT NOT NULL,
    bankName TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
