import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { startOfMonth, subMonths, subDays, format } from 'date-fns';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email query parameter is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        // 1. Find User
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return NextResponse.json({ error: `User with email ${email} not found` }, { status: 404 });
        }

        // Handle ID: NextAuth usually returns string ID in session, but in DB it is ObjectId.
        // We will confirm what format other collections use. 
        // Based on previous code: userId: session.user.id
        const userId = user._id.toString();

        console.log(`Seeding data for user: ${email} (${userId})`);

        // 2. Clear existing data for this user
        await db.collection('wallets').deleteMany({ userId });
        await db.collection('categories').deleteMany({ userId });
        await db.collection('transactions').deleteMany({ userId });
        await db.collection('cards').deleteMany({ userId });

        // 3. Create Wallets
        const wallets = [
            { id: crypto.randomUUID(), userId, name: "BCA Tahapan", type: "bank", balance: 25000000, color: "#005596", icon: "Wallet", currency: "IDR" },
            { id: crypto.randomUUID(), userId, name: "Mandiri", type: "bank", balance: 10000000, color: "#FFB700", icon: "Wallet", currency: "IDR" },
            { id: crypto.randomUUID(), userId, name: "Cash Wallet", type: "cash", balance: 1500000, color: "#10B981", icon: "Banknote", currency: "IDR" },
            { id: crypto.randomUUID(), userId, name: "GoPay", type: "ewallet", balance: 450000, color: "#00AED6", icon: "Smartphone", currency: "IDR" },
            { id: crypto.randomUUID(), userId, name: "OVO", type: "ewallet", balance: 200000, color: "#4C3494", icon: "Smartphone", currency: "IDR" },
        ];

        // 4. Create Categories
        const categories = [
            { id: crypto.randomUUID(), userId, name: "Food & Beverage", type: "expense", icon: "Utensils", color: "#EF4444" },
            { id: crypto.randomUUID(), userId, name: "Transportation", type: "expense", icon: "Bus", color: "#F59E0B" },
            { id: crypto.randomUUID(), userId, name: "Shopping", type: "expense", icon: "ShoppingBag", color: "#EC4899" },
            { id: crypto.randomUUID(), userId, name: "Entertainment", type: "expense", icon: "Film", color: "#8B5CF6" },
            { id: crypto.randomUUID(), userId, name: "Bills & Utilities", type: "expense", icon: "Zap", color: "#3B82F6" },
            { id: crypto.randomUUID(), userId, name: "Health", type: "expense", icon: "Heart", color: "#10B981" },
            { id: crypto.randomUUID(), userId, name: "Salary", type: "income", icon: "DollarSign", color: "#10B981" },
            { id: crypto.randomUUID(), userId, name: "Freelance", type: "income", icon: "Briefcase", color: "#6366F1" },
            { id: crypto.randomUUID(), userId, name: "Investments", type: "income", icon: "TrendingUp", color: "#8B5CF6" },
        ];

        // 5. Create Saved Cards
        const cards = [
            {
                _id: crypto.randomUUID(), // API routes use _id as id for cards usually or expect id in body
                id: crypto.randomUUID(),
                userId,
                cardName: "BCA Platinum",
                cardHolderName: "VEJOY FIRMAAN",
                cardNumber: "4556 1234 5678 9012",
                expiryDate: "12/28",
                cvv: "123",
                cardType: "visa",
                color: "from-purple-500 to-indigo-600",
                bankName: "BCA"
            },
            {
                _id: crypto.randomUUID(),
                id: crypto.randomUUID(),
                userId,
                cardName: "Mandiri Prioritas",
                cardHolderName: "VEJOY FIRMAAN",
                cardNumber: "5423 9876 5432 1098",
                expiryDate: "09/27",
                cvv: "456",
                cardType: "mastercard",
                color: "from-slate-800 to-slate-900",
                bankName: "Mandiri"
            },
            {
                _id: crypto.randomUUID(),
                id: crypto.randomUUID(),
                userId,
                cardName: "Jenius Debit",
                cardHolderName: "VEJOY FIRMAAN",
                cardNumber: "4222 3333 4444 5555",
                expiryDate: "11/26",
                cvv: "789",
                cardType: "visa",
                color: "from-orange-500 to-amber-500",
                bankName: "BTPN"
            }
        ];
        // Fix cards ID structure to match what POST route likely does (it lets mongo gen _id or uses id as _id). 
        // Let's stick to what we need. The UI needs 'id'.
        const cardsToInsert = cards.map(c => ({ ...c, _id: c.id })); // Force _id to be UUID string for consistency

        // 6. Generate Transactions
        const transactions = [];
        const today = new Date();
        const expenseCategories = categories.filter(c => c.type === 'expense');
        const incomeCategories = categories.filter(c => c.type === 'income');

        // Generate 150 transactions over the last 90 days
        for (let i = 0; i < 150; i++) {
            const isExpense = Math.random() > 0.3; // 70% expenses
            const targetCategories = isExpense ? expenseCategories : incomeCategories;
            const category = targetCategories[Math.floor(Math.random() * targetCategories.length)];
            const wallet = wallets[Math.floor(Math.random() * wallets.length)];

            // Random date within last 90 days
            const date = subDays(today, Math.floor(Math.random() * 90));

            // Random amount
            let amount = 0;
            if (isExpense) {
                amount = Math.floor(Math.random() * 500000) + 10000; // 10k - 510k
                if (Math.random() > 0.9) amount += 1000000; // Occasional large expense
            } else {
                amount = Math.floor(Math.random() * 5000000) + 1000000; // 1m - 6m
            }

            transactions.push({
                id: crypto.randomUUID(),
                userId,
                type: isExpense ? 'expense' : 'income',
                amount,
                categoryId: category.id,
                walletId: wallet.id,
                date: date.toISOString(), // Store as ISO string
                description: `${isExpense ? 'Paid for' : 'Received'} ${category.name}`,
            });
        }

        // 7. Insert All Data
        if (wallets.length > 0) await db.collection('wallets').insertMany(wallets as any);
        if (categories.length > 0) await db.collection('categories').insertMany(categories as any);
        if (cardsToInsert.length > 0) await db.collection('cards').insertMany(cardsToInsert as any);
        if (transactions.length > 0) await db.collection('transactions').insertMany(transactions as any);

        // 8. Update User Preferences (Expense Limits)
        await db.collection('users').updateOne(
            { _id: user._id },
            {
                $set: {
                    expenseLimits: {
                        daily: 500000,
                        weekly: 3000000,
                        monthly: 10000000
                    }
                }
            }
        );

        return NextResponse.json({
            success: true,
            stats: {
                wallets: wallets.length,
                categories: categories.length,
                cards: cards.length,
                transactions: transactions.length
            }
        });

    } catch (error) {
        console.error("Seeding Error:", error);
        return NextResponse.json({ error: 'Failed to seed data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
