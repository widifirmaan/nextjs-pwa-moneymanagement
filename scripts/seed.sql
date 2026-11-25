-- MoneW SQLite Seed Data
-- Turnkey database seeder for local development and remote Cloudflare D1

-- 1. Ensure User Exists
INSERT OR IGNORE INTO users (id, email, name, password, colorScheme, isSetupCompleted)
VALUES ('620c27fa-2024-4863-8ac5-2c2f1514a4aa', 'vejoyf@gmail.com', 'Widi Firmansyah', 'f70F2ynBrXm6ZdfRodJudYHG+mHpQ19XQTeHA7l5Lpc=', 'green', 1);

UPDATE users SET name = 'Widi Firmansyah', colorScheme = 'green', isSetupCompleted = 1 
WHERE id = '620c27fa-2024-4863-8ac5-2c2f1514a4aa';

-- 2. Seed Standard Categories
INSERT OR IGNORE INTO categories (id, name, icon, color, type, userId) VALUES
('535f0fe3-d905-499a-a760-5b764d023b12', 'Food & Drink', 'Utensils', 'bg-orange-500', 'expense', '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('9482c1ed-4ce3-44da-8f67-8928126cf0a8', 'Transport', 'Car', 'bg-blue-500', 'expense', '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('61ebc88b-6216-4ffe-a0d5-dbb2b604fc27', 'Shopping', 'ShoppingBag', 'bg-pink-500', 'expense', '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('b090bc69-ac8b-458e-b261-bc5965061835', 'Bills', 'Receipt', 'bg-red-500', 'expense', '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('2b29c317-bafe-4aa0-a910-878b71f6d3d0', 'Salary', 'Briefcase', 'bg-green-500', 'income', '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('8cb20012-3d53-4d3f-b54e-ac3886645648', 'Investments', 'TrendingUp', 'bg-emerald-500', 'income', '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('89a406b8-051f-48eb-9a66-19e646821450', 'Entertainment', 'Film', 'bg-purple-500', 'expense', '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('f7f8a730-df88-4868-b231-6d19298c7191', 'Health', 'Heart', 'bg-rose-500', 'expense', '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('ded8d588-c232-492d-870a-c60400862159', 'Education', 'BookOpen', 'bg-indigo-500', 'expense', '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('2186b7ba-a8ad-48cc-9663-56deb679340c', 'Others', 'MoreHorizontal', 'bg-slate-500', 'expense', '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('037f0493-c93d-4c81-930b-2f231c4910f0', 'Other', 'MoreHorizontal', 'bg-slate-500', 'income', '620c27fa-2024-4863-8ac5-2c2f1514a4aa');

-- 3. Seed Multi-Wallet Accounts
INSERT OR IGNORE INTO wallets (id, name, type, balance, color, accountNumber, userId, isFrozen, expenseLimitsDaily, expenseLimitsWeekly, expenseLimitsMonthly) VALUES
('74181ade-ecbc-40ef-a14c-2b874896903c', 'BCA', 'bank', 18450000, 'bg-blue-600', '527-098-4421', '620c27fa-2024-4863-8ac5-2c2f1514a4aa', 0, 0, 0, 0),
('24a6697f-a0db-48d1-afba-b092b997d5b2', 'Cash', 'cash', 1250000, 'bg-green-600', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa', 0, 0, 0, 0),
('3a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'Bank Mandiri', 'bank', 24800000, 'bg-indigo-600', '132-00-9876543-1', '620c27fa-2024-4863-8ac5-2c2f1514a4aa', 0, 0, 0, 0),
('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'GoPay E-Wallet', 'ewallet', 2150000, 'bg-cyan-500', '0812-3456-7890', '620c27fa-2024-4863-8ac5-2c2f1514a4aa', 0, 0, 0, 0);

UPDATE wallets SET balance = 18450000, accountNumber = '527-098-4421', color = 'bg-blue-600' WHERE id = '74181ade-ecbc-40ef-a14c-2b874896903c';
UPDATE wallets SET balance = 1250000, color = 'bg-green-600' WHERE id = '24a6697f-a0db-48d1-afba-b092b997d5b2';
UPDATE wallets SET balance = 24800000, accountNumber = '132-00-9876543-1', color = 'bg-indigo-600' WHERE id = '3a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d';
UPDATE wallets SET balance = 2150000, accountNumber = '0812-3456-7890', color = 'bg-cyan-500' WHERE id = '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b';

-- 4. Seed Saved Payment Cards
DELETE FROM saved_cards WHERE userId = '620c27fa-2024-4863-8ac5-2c2f1514a4aa';
INSERT INTO saved_cards (id, userId, cardName, cardHolderName, cardNumber, expiryDate, cvv, cardType, color, bankName) VALUES
('card-1-bca', '620c27fa-2024-4863-8ac5-2c2f1514a4aa', 'BCA Everyday Platinum', 'Widi Firmansyah', '4556 8920 1234 5678', '08/29', '892', 'visa', 'from-blue-500 to-cyan-500', 'Bank Central Asia'),
('card-2-mandiri', '620c27fa-2024-4863-8ac5-2c2f1514a4aa', 'Mandiri Prioritas Gold', 'Widi Firmansyah', '5214 3409 8765 4321', '12/28', '412', 'mastercard', 'from-purple-500 to-indigo-600', 'Bank Mandiri'),
('card-3-jenius', '620c27fa-2024-4863-8ac5-2c2f1514a4aa', 'Jenius Contactless', 'Widi Firmansyah', '4365 2109 4567 8901', '05/30', '315', 'visa', 'from-emerald-500 to-teal-600', 'BTPN Jenius');

-- 5. Seed Realistic Monthly Transactions
DELETE FROM transactions WHERE userId = '620c27fa-2024-4863-8ac5-2c2f1514a4aa';
INSERT INTO transactions (id, amount, type, categoryId, walletId, date, note, receiptUrl, userId) VALUES
('tx-nov-01', 28500000, 'income', '2b29c317-bafe-4aa0-a910-878b71f6d3d0', '74181ade-ecbc-40ef-a14c-2b874896903c', '2026-11-01T09:00:00.000Z', 'Monthly Engineering Salary', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('tx-nov-02', 1250000, 'expense', 'b090bc69-ac8b-458e-b261-bc5965061835', '74181ade-ecbc-40ef-a14c-2b874896903c', '2026-11-03T10:15:00.000Z', 'Home Electricity & Fiber Internet', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('tx-nov-03', 450000, 'expense', 'f7f8a730-df88-4868-b231-6d19298c7191', '74181ade-ecbc-40ef-a14c-2b874896903c', '2026-11-05T14:30:00.000Z', 'Fitness & Gym Monthly Pass', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('tx-nov-04', 390000, 'expense', 'ded8d588-c232-492d-870a-c60400862159', '3a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', '2026-11-07T16:00:00.000Z', 'Cloud Architecture Online Course', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('tx-nov-05', 680000, 'expense', '535f0fe3-d905-499a-a760-5b764d023b12', '24a6697f-a0db-48d1-afba-b092b997d5b2', '2026-11-08T11:20:00.000Z', 'Weekly Specialty Groceries', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('tx-nov-06', 7500000, 'income', '8cb20012-3d53-4d3f-b54e-ac3886645648', '3a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', '2026-11-10T11:00:00.000Z', 'Client UI/UX & Web Consultation', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('tx-nov-07', 189000, 'expense', '89a406b8-051f-48eb-9a66-19e646821450', '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', '2026-11-11T20:45:00.000Z', 'Cinema Premiere & Snacks', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('tx-nov-08', 2450000, 'expense', '61ebc88b-6216-4ffe-a0d5-dbb2b604fc27', '3a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', '2026-11-12T15:10:00.000Z', 'Ergonomic Desk & Monitor Arm', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('tx-nov-09', 420000, 'expense', 'b090bc69-ac8b-458e-b261-bc5965061835', '74181ade-ecbc-40ef-a14c-2b874896903c', '2026-11-14T09:30:00.000Z', 'Cloud Infrastructure Hosting', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('tx-nov-10', 350000, 'expense', '9482c1ed-4ce3-44da-8f67-8928126cf0a8', '3a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', '2026-11-15T08:15:00.000Z', 'Vehicle Fuel & Toll Balance', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('tx-nov-11', 520000, 'expense', '535f0fe3-d905-499a-a760-5b764d023b12', '74181ade-ecbc-40ef-a14c-2b874896903c', '2026-11-15T19:30:00.000Z', 'Family Dinner at Artisan Bistro', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('tx-nov-12', 185000, 'expense', '535f0fe3-d905-499a-a760-5b764d023b12', '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', '2026-11-16T12:45:00.000Z', 'Cold Brew & Artisan Lunch', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa'),
('tx-nov-13', 250000, 'expense', '2186b7ba-a8ad-48cc-9663-56deb679340c', '24a6697f-a0db-48d1-afba-b092b997d5b2', '2026-11-17T09:15:00.000Z', 'Workspace Supplies & Stationery', null, '620c27fa-2024-4863-8ac5-2c2f1514a4aa');

-- 6. Seed Local Demo Account (demo@monew.app / demo123)
INSERT OR IGNORE INTO users (id, email, name, password, colorScheme, isSetupCompleted)
VALUES ('11111111-1111-4111-8111-111111111111', 'demo@monew.app', 'Demo User', 'Xq4U3+oDK0W+icJeCeAyBaefFlyKrDo1/UPFnB1b4NI=', 'dark', 1);

INSERT OR IGNORE INTO categories (id, name, icon, color, type, userId) VALUES
('demo-cat-food', 'Food & Drink', 'Utensils', 'bg-orange-500', 'expense', '11111111-1111-4111-8111-111111111111'),
('demo-cat-trans', 'Transport', 'Car', 'bg-blue-500', 'expense', '11111111-1111-4111-8111-111111111111'),
('demo-cat-shop', 'Shopping', 'ShoppingBag', 'bg-pink-500', 'expense', '11111111-1111-4111-8111-111111111111'),
('demo-cat-bills', 'Bills', 'Receipt', 'bg-red-500', 'expense', '11111111-1111-4111-8111-111111111111'),
('demo-cat-salary', 'Salary', 'Briefcase', 'bg-green-500', 'income', '11111111-1111-4111-8111-111111111111'),
('demo-cat-invest', 'Investments', 'TrendingUp', 'bg-emerald-500', 'income', '11111111-1111-4111-8111-111111111111'),
('demo-cat-others', 'Others', 'MoreHorizontal', 'bg-slate-500', 'expense', '11111111-1111-4111-8111-111111111111'),
('demo-cat-other', 'Other', 'MoreHorizontal', 'bg-slate-500', 'income', '11111111-1111-4111-8111-111111111111');

INSERT OR IGNORE INTO wallets (id, name, type, balance, color, accountNumber, userId, isFrozen, expenseLimitsDaily, expenseLimitsWeekly, expenseLimitsMonthly) VALUES
('demo-wallet-bca', 'BCA', 'bank', 12500000, 'bg-blue-600', '527-112-8801', '11111111-1111-4111-8111-111111111111', 0, 500000, 2500000, 8000000),
('demo-wallet-cash', 'Cash', 'cash', 950000, 'bg-green-600', null, '11111111-1111-4111-8111-111111111111', 0, 0, 0, 0),
('demo-wallet-gopay', 'GoPay', 'ewallet', 1450000, 'bg-cyan-500', '0812-0000-1234', '11111111-1111-4111-8111-111111111111', 0, 0, 0, 0);

INSERT OR IGNORE INTO saved_cards (id, userId, cardName, cardHolderName, cardNumber, expiryDate, cvv, cardType, color, bankName) VALUES
('demo-card-1', '11111111-1111-4111-8111-111111111111', 'Demo Everyday Visa', 'Demo User', '4556 1234 5678 9012', '09/29', '421', 'visa', 'from-blue-500 to-cyan-500', 'Bank Central Asia');

INSERT OR IGNORE INTO transactions (id, amount, type, categoryId, walletId, date, note, receiptUrl, userId) VALUES
('demo-tx-01', 15000000, 'income', 'demo-cat-salary', 'demo-wallet-bca', '2026-11-01T09:00:00.000Z', 'Monthly Salary', null, '11111111-1111-4111-8111-111111111111'),
('demo-tx-02', 450000, 'expense', 'demo-cat-bills', 'demo-wallet-bca', '2026-11-05T10:30:00.000Z', 'Internet & Utilities', null, '11111111-1111-4111-8111-111111111111'),
('demo-tx-03', 185000, 'expense', 'demo-cat-food', 'demo-wallet-gopay', '2026-11-10T12:15:00.000Z', 'Team Lunch', null, '11111111-1111-4111-8111-111111111111'),
('demo-tx-04', 120000, 'expense', 'demo-cat-trans', 'demo-wallet-cash', '2026-11-12T18:00:00.000Z', 'Fuel & Parking', null, '11111111-1111-4111-8111-111111111111');
