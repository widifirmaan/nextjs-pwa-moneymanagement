const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
}

async function createJWT(payload, secret) {
    const encoder = new TextEncoder();
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }));
    const key = await crypto.subtle.importKey(
        'raw', encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const sig = btoa(String.fromCharCode(...new Uint8Array(
        await crypto.subtle.sign('HMAC', key, encoder.encode(`${header}.${body}`))
    )));
    return `${header}.${body}.${sig}`;
}

async function verifyJWT(token, secret) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw', encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
        );
        const valid = await crypto.subtle.verify(
            'HMAC', key,
            new Uint8Array([...atob(parts[2])].map(c => c.charCodeAt(0))),
            encoder.encode(`${parts[0]}.${parts[1]}`)
        );
        if (!valid) return null;
        return JSON.parse(atob(parts[1]));
    } catch { return null; }
}

async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw', encoder.encode(password + salt),
        'PBKDF2', false, ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' },
        key, 256
    );
    return btoa(String.fromCharCode(...new Uint8Array(bits)));
}

async function getUser(request, env) {
    const auth = request.headers.get('Authorization');
    if (!auth || !auth.startsWith('Bearer ')) return null;
    const payload = await verifyJWT(auth.slice(7), env.JWT_SECRET || 'dev-secret');
    return payload;
}

function getUserId(url) {
    const parts = url.pathname.split('/');
    return parts[parts.length - 1];
}

export default {
    async fetch(request, env, ctx) {
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        if (!path.startsWith('/api/')) {
            return env.ASSETS.fetch(request);
        }

        try {
            if (path === '/api/ping') return json({ pong: true, path });
            if (path === '/api/debug-env') return json({
                hasJWT: !!env.JWT_SECRET,
                hasD1: !!env.MONEY_DB,
                hasR2: !!env.MONEY_IMAGES,
                jwtType: typeof env.JWT_SECRET,
                d1Type: typeof env.MONEY_DB,
            });
            if (path === '/api/debug-test') {
                const results = {};
                try { results.uuid = crypto.randomUUID(); } catch(e) { results.uuidErr = e.message; }
                try { results.hash = await hashPassword('test', 'salt'); } catch(e) { results.hashErr = e.message; }
                try { results.jwt = await createJWT({test:1}, env.JWT_SECRET || 'dev-secret'); } catch(e) { results.jwtErr = e.message; }
                try {
                    if (env.MONEY_DB) {
                        const r = await env.MONEY_DB.prepare('SELECT 1 as val').all();
                        results.d1 = r.results;
                    } else {
                        results.d1 = 'no D1';
                    }
                } catch(e) { results.d1Err = e.message; }
                return json(results);
            }

            if (path === '/api/auth/login' && request.method === 'POST') return handleLogin(request, env);
            if (path === '/api/auth/register' && request.method === 'POST') return handleRegister(request, env);
            if (path === '/api/ios-profile' && request.method === 'GET') return handleIosProfile(request, env);

            const user = await getUser(request, env);
            if (!user) return json({ error: 'Unauthorized' }, 401);

            if (path === '/api/auth/profile') {
                if (request.method === 'GET') return handleGetProfile(env, user);
                if (request.method === 'PUT') return handleUpdateProfile(request, env, user);
            }
            if (path === '/api/data' && request.method === 'GET') return handleGetData(env, user);
            if (path === '/api/seed' && request.method === 'POST') return handleSeed(env, user);
            if (path === '/api/user/preferences') {
                if (request.method === 'GET') return handleGetPreferences(env, user);
                if (request.method === 'POST') return handleUpdatePreferences(request, env, user);
            }
            if (path === '/api/user/reset' && request.method === 'POST') return handleReset(env, user);
            if (path === '/api/transfer' && request.method === 'POST') return handleTransfer(request, env, user);
            if (path === '/api/upload' && request.method === 'POST') return handleUpload(request, env, user);
            if (path === '/api/transactions' && request.method === 'POST') return handleCreateTransaction(request, env, user);
            if (path.match(/^\/api\/transactions\/[^\/]+$/) && request.method === 'PUT') return handleUpdateTransaction(request, env, user);
            if (path.match(/^\/api\/transactions\/[^\/]+$/) && request.method === 'DELETE') return handleDeleteTransaction(request, env, user);
            if (path === '/api/wallets' && request.method === 'GET') return handleGetWallets(env, user);
            if (path === '/api/wallets' && request.method === 'POST') return handleCreateWallet(request, env, user);
            if (path.match(/^\/api\/wallets\/[^\/]+$/) && request.method === 'PUT') return handleUpdateWallet(request, env, user);
            if (path.match(/^\/api\/wallets\/[^\/]+$/) && request.method === 'DELETE') return handleDeleteWallet(request, env, user);
            if (path === '/api/cards' && request.method === 'GET') return handleGetCards(env, user);
            if (path === '/api/cards' && request.method === 'POST') return handleCreateCard(request, env, user);
            if (path.match(/^\/api\/cards\/[^\/]+$/) && request.method === 'PUT') return handleUpdateCard(request, env, user);
            if (path.match(/^\/api\/cards\/[^\/]+$/) && request.method === 'DELETE') return handleDeleteCard(request, env, user);
            if (path === '/api/debug-db' && request.method === 'GET') return handleDebugDb(env, user);

            return json({ error: 'Not found' }, 404);
        } catch (error) {
            return json({ error: error.message || 'Internal error' }, 500);
        }
    }
};

async function handleLogin(request, env) {
    const { email, password } = await request.json();
    if (!email || !password) return json({ error: 'Email and password required' }, 400);

    const db = env.MONEY_DB;
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    if (!user) return json({ error: 'User not found' }, 404);

    const hash = await hashPassword(password, user.id);
    if (hash !== user.password) return json({ error: 'Invalid password' }, 401);

    const token = await createJWT({ id: user.id, email: user.email, name: user.name }, env.JWT_SECRET || 'dev-secret');
    return json({ token, user: { id: user.id, email: user.email, name: user.name } });
}

async function handleRegister(request, env) {
    try {
        const { email, password, name } = await request.json();
        if (!email || !password) return json({ error: 'Email and password required' }, 400);

        const db = env.MONEY_DB;
        const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
        if (existing) return json({ error: 'Email already registered' }, 409);

        const id = crypto.randomUUID();
        const hash = await hashPassword(password, id);
        await db.prepare('INSERT INTO users (id, email, name, password) VALUES (?, ?, ?, ?)').bind(id, email, name || email.split('@')[0], hash).run();

        const token = await createJWT({ id, email, name: name || email.split('@')[0] }, env.JWT_SECRET || 'dev-secret');
        return json({ token, user: { id, email, name: name || email.split('@')[0] } }, 201);
    } catch (e) {
        return json({ error: e.message, stack: e.stack, name: e.name }, 500);
    }
}

async function handleGetProfile(env, user) {
    const dbUser = await env.MONEY_DB.prepare('SELECT id, email, name, colorScheme FROM users WHERE id = ?').bind(user.id).first();
    return json({ id: dbUser.id, email: dbUser.email, name: dbUser.name || user.name, colorScheme: dbUser.colorScheme || 'dark' });
}

async function handleUpdateProfile(request, env, user) {
    const { name } = await request.json();
    if (!name || typeof name !== 'string' || name.length > 20) return json({ error: 'Name required (max 20 chars)' }, 400);
    await env.MONEY_DB.prepare('UPDATE users SET name = ? WHERE id = ?').bind(name, user.id).run();
    return json({ message: 'Profile updated', name });
}

async function handleGetData(env, user) {
    const db = env.MONEY_DB;
    const [categories, wallets, transactions, dbUser] = await Promise.all([
        db.prepare('SELECT * FROM categories WHERE userId = ? ORDER BY name').bind(user.id).all(),
        db.prepare('SELECT * FROM wallets WHERE userId = ? ORDER BY name').bind(user.id).all(),
        db.prepare('SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC').bind(user.id).all(),
        db.prepare('SELECT name FROM users WHERE id = ?').bind(user.id).first(),
    ]);
    return json({
        categories: categories.results || [],
        wallets: (wallets.results || []).map(w => ({
            ...w,
            isFrozen: !!w.isFrozen,
            expenseLimits: { daily: w.expenseLimitsDaily, weekly: w.expenseLimitsWeekly, monthly: w.expenseLimitsMonthly }
        })),
        transactions: transactions.results || [],
        user: { name: dbUser?.name || user.name || 'User' }
    });
}

async function handleSeed(env, user) {
    const db = env.MONEY_DB;
    const existing = await db.prepare('SELECT COUNT(*) as count FROM categories WHERE userId = ?').bind(user.id).first();
    if (existing.count > 0) return json({ message: 'Data already exists' });

    const defaultCategories = [
        { name: 'Food & Drink', icon: 'Utensils', color: 'bg-orange-500', type: 'expense' },
        { name: 'Transport', icon: 'Car', color: 'bg-blue-500', type: 'expense' },
        { name: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-500', type: 'expense' },
        { name: 'Bills', icon: 'Receipt', color: 'bg-red-500', type: 'expense' },
        { name: 'Salary', icon: 'Briefcase', color: 'bg-green-500', type: 'income' },
        { name: 'Investments', icon: 'TrendingUp', color: 'bg-emerald-500', type: 'income' },
        { name: 'Entertainment', icon: 'Film', color: 'bg-purple-500', type: 'expense' },
        { name: 'Health', icon: 'Heart', color: 'bg-rose-500', type: 'expense' },
        { name: 'Education', icon: 'BookOpen', color: 'bg-indigo-500', type: 'expense' },
        { name: 'Others', icon: 'MoreHorizontal', color: 'bg-slate-500', type: 'expense' },
        { name: 'Other', icon: 'MoreHorizontal', color: 'bg-slate-500', type: 'income' },
    ];

    const catIds = {};
    for (const cat of defaultCategories) {
        const id = crypto.randomUUID();
        catIds[cat.name] = id;
        await db.prepare('INSERT INTO categories (id, name, icon, color, type, userId) VALUES (?, ?, ?, ?, ?, ?)').bind(id, cat.name, cat.icon, cat.color, cat.type, user.id).run();
    }

    const walletId = crypto.randomUUID();
    await db.prepare('INSERT INTO wallets (id, name, type, balance, color, userId) VALUES (?, ?, ?, ?, ?, ?)').bind(walletId, 'Cash', 'cash', 0, 'bg-green-600', user.id).run();

    return json({ message: 'Database seeded successfully' });
}

async function handleGetPreferences(env, user) {
    const dbUser = await env.MONEY_DB.prepare('SELECT colorScheme, isSetupCompleted FROM users WHERE id = ?').bind(user.id).first();
    return json({
        colorScheme: dbUser?.colorScheme || 'dark',
        expenseLimits: { daily: 0, weekly: 0, monthly: 0 },
        isSetupCompleted: !!dbUser?.isSetupCompleted
    });
}

async function handleUpdatePreferences(request, env, user) {
    const body = await request.json();
    const updates = [];
    const params = [];
    if (body.colorScheme) { updates.push('colorScheme = ?'); params.push(body.colorScheme); }
    if (typeof body.isSetupCompleted === 'boolean') { updates.push('isSetupCompleted = ?'); params.push(body.isSetupCompleted ? 1 : 0); }
    if (updates.length === 0) return json({ error: 'No fields to update' }, 400);
    params.push(user.id);
    await env.MONEY_DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
    return json({ success: true, ...body });
}

async function handleReset(env, user) {
    const db = env.MONEY_DB;
    await Promise.all([
        db.prepare('DELETE FROM transactions WHERE userId = ?').bind(user.id).run(),
        db.prepare('DELETE FROM wallets WHERE userId = ?').bind(user.id).run(),
        db.prepare('DELETE FROM categories WHERE userId = ?').bind(user.id).run(),
        db.prepare('DELETE FROM saved_cards WHERE userId = ?').bind(user.id).run(),
    ]);
    await db.prepare('UPDATE users SET isSetupCompleted = 0 WHERE id = ?').bind(user.id).run();
    return json({ success: true, message: 'Data reset successfully' });
}

async function handleTransfer(request, env, user) {
    const { amount, sourceWalletId, targetWalletId, date, note } = await request.json();
    if (!amount || amount <= 0) return json({ error: 'Invalid amount' }, 400);
    if (sourceWalletId === targetWalletId) return json({ error: 'Cannot transfer to the same wallet' }, 400);

    const db = env.MONEY_DB;

    const sourceWallet = await db.prepare('SELECT * FROM wallets WHERE id = ? AND userId = ?').bind(sourceWalletId, user.id).first();
    const targetWallet = await db.prepare('SELECT * FROM wallets WHERE id = ? AND userId = ?').bind(targetWalletId, user.id).first();
    if (!sourceWallet || !targetWallet) return json({ error: 'Wallet not found' }, 404);

    const catExpense = await db.prepare("SELECT id FROM categories WHERE userId = ? AND name = 'Others' AND type = 'expense'").bind(user.id).first();
    const catIncome = await db.prepare("SELECT id FROM categories WHERE userId = ? AND name = 'Other' AND type = 'income'").bind(user.id).first();
    if (!catExpense || !catIncome) return json({ error: 'Categories not found. Run seed first.' }, 400);

    const expenseId = crypto.randomUUID();
    const incomeId = crypto.randomUUID();
    const ts = date || new Date().toISOString();

    await db.prepare('INSERT INTO transactions (id, amount, type, categoryId, walletId, date, note, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(expenseId, amount, 'expense', catExpense.id, sourceWalletId, ts, `Transfer to ${targetWallet.name}${note ? ': ' + note : ''}`, user.id).run();
    await db.prepare('INSERT INTO transactions (id, amount, type, categoryId, walletId, date, note, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(incomeId, amount, 'income', catIncome.id, targetWalletId, ts, `Transfer from ${sourceWallet.name}${note ? ': ' + note : ''}`, user.id).run();
    await db.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ? AND userId = ?').bind(amount, sourceWalletId, user.id).run();
    await db.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ? AND userId = ?').bind(amount, targetWalletId, user.id).run();

    return json({ success: true });
}

async function handleUpload(request, env, user) {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return json({ error: 'No file uploaded' }, 400);

    const ext = file.name.split('.').pop() || 'jpg';
    const key = `receipts/${user.id}/${Date.now()}_${crypto.randomUUID()}.${ext}`;
    const buffer = await file.arrayBuffer();

    await env.MONEY_IMAGES.put(key, buffer, {
        httpMetadata: { contentType: file.type || 'image/jpeg' },
    });

    return json({ url: `https://pub-${env.MONEY_IMAGES}.r2.dev/${key}` });
}

async function handleCreateTransaction(request, env, user) {
    const { id, amount, type, categoryId, walletId, date, note } = await request.json();

    const wallet = await env.MONEY_DB.prepare('SELECT * FROM wallets WHERE id = ? AND userId = ?').bind(walletId, user.id).first();
    if (!wallet) return json({ error: 'Wallet not found' }, 404);

    await env.MONEY_DB.prepare('INSERT INTO transactions (id, amount, type, categoryId, walletId, date, note, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, amount, type, categoryId, walletId, date, note || '', user.id).run();

    const sign = type === 'income' ? 1 : -1;
    await env.MONEY_DB.prepare('UPDATE wallets SET balance = balance + (? * ?) WHERE id = ? AND userId = ?').bind(sign, amount, walletId, user.id).run();

    return json({ id, amount, type, categoryId, walletId, date, note, userId: user.id });
}

async function handleUpdateTransaction(request, env, user) {
    const txnId = getUserId(new URL(request.url));
    const body = await request.json();
    const db = env.MONEY_DB;

    const oldTxn = await db.prepare('SELECT * FROM transactions WHERE id = ? AND userId = ?').bind(txnId, user.id).first();
    if (!oldTxn) return json({ error: 'Transaction not found' }, 404);

    const oldSign = oldTxn.type === 'income' ? 1 : -1;
    await db.prepare('UPDATE wallets SET balance = balance - (? * ?) WHERE id = ? AND userId = ?').bind(oldSign, oldTxn.amount, oldTxn.walletId, user.id).run();

    const merged = { ...oldTxn, ...body };
    await db.prepare('UPDATE transactions SET amount = ?, type = ?, categoryId = ?, walletId = ?, date = ?, note = ? WHERE id = ? AND userId = ?').bind(merged.amount, merged.type, merged.categoryId, merged.walletId, merged.date, merged.note || '', txnId, user.id).run();

    const newSign = merged.type === 'income' ? 1 : -1;
    await db.prepare('UPDATE wallets SET balance = balance + (? * ?) WHERE id = ? AND userId = ?').bind(newSign, merged.amount, merged.walletId, user.id).run();

    return json({ message: 'Transaction updated' });
}

async function handleDeleteTransaction(request, env, user) {
    const txnId = getUserId(new URL(request.url));
    const db = env.MONEY_DB;

    const txn = await db.prepare('SELECT * FROM transactions WHERE id = ? AND userId = ?').bind(txnId, user.id).first();
    if (!txn) return json({ error: 'Transaction not found' }, 404);

    const sign = txn.type === 'income' ? 1 : -1;
    await db.prepare('UPDATE wallets SET balance = balance - (? * ?) WHERE id = ? AND userId = ?').bind(sign, txn.amount, txn.walletId, user.id).run();
    await db.prepare('DELETE FROM transactions WHERE id = ? AND userId = ?').bind(txnId, user.id).run();

    return json({ message: 'Transaction deleted' });
}

async function handleGetWallets(env, user) {
    const wallets = await env.MONEY_DB.prepare('SELECT * FROM wallets WHERE userId = ? ORDER BY name').bind(user.id).all();
    return json((wallets.results || []).map(w => ({
        ...w, isFrozen: !!w.isFrozen,
        expenseLimits: { daily: w.expenseLimitsDaily, weekly: w.expenseLimitsWeekly, monthly: w.expenseLimitsMonthly }
    })));
}

async function handleCreateWallet(request, env, user) {
    const body = await request.json();
    const id = crypto.randomUUID();
    await env.MONEY_DB.prepare('INSERT INTO wallets (id, name, type, balance, color, accountNumber, userId, isFrozen, expenseLimitsDaily, expenseLimitsWeekly, expenseLimitsMonthly) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, body.name, body.type, body.balance || 0, body.color, body.accountNumber || null, user.id, body.isFrozen ? 1 : 0, body.expenseLimits?.daily || 0, body.expenseLimits?.weekly || 0, body.expenseLimits?.monthly || 0).run();
    return json({ id, ...body, userId: user.id, isFrozen: !!body.isFrozen }, 201);
}

async function handleUpdateWallet(request, env, user) {
    const walletId = getUserId(new URL(request.url));
    const body = await request.json();

    const sets = []; const params = [];
    if (body.name !== undefined) { sets.push('name = ?'); params.push(body.name); }
    if (body.type !== undefined) { sets.push('type = ?'); params.push(body.type); }
    if (body.color !== undefined) { sets.push('color = ?'); params.push(body.color); }
    if (body.balance !== undefined) { sets.push('balance = ?'); params.push(body.balance); }
    if (body.accountNumber !== undefined) { sets.push('accountNumber = ?'); params.push(body.accountNumber); }
    if (body.isFrozen !== undefined) { sets.push('isFrozen = ?'); params.push(body.isFrozen ? 1 : 0); }
    if (body.expenseLimits?.daily !== undefined) { sets.push('expenseLimitsDaily = ?'); params.push(body.expenseLimits.daily); }
    if (body.expenseLimits?.weekly !== undefined) { sets.push('expenseLimitsWeekly = ?'); params.push(body.expenseLimits.weekly); }
    if (body.expenseLimits?.monthly !== undefined) { sets.push('expenseLimitsMonthly = ?'); params.push(body.expenseLimits.monthly); }

    if (sets.length === 0) return json({ error: 'No fields to update' }, 400);
    params.push(walletId, user.id);
    await env.MONEY_DB.prepare(`UPDATE wallets SET ${sets.join(', ')} WHERE id = ? AND userId = ?`).bind(...params).run();
    return json({ message: 'Wallet updated' });
}

async function handleDeleteWallet(request, env, user) {
    const walletId = getUserId(new URL(request.url));
    await env.MONEY_DB.prepare('DELETE FROM transactions WHERE walletId = ? AND userId = ?').bind(walletId, user.id).run();
    await env.MONEY_DB.prepare('DELETE FROM wallets WHERE id = ? AND userId = ?').bind(walletId, user.id).run();
    return json({ message: 'Wallet deleted' });
}

async function handleGetCards(env, user) {
    const cards = await env.MONEY_DB.prepare('SELECT * FROM saved_cards WHERE userId = ? ORDER BY cardName').bind(user.id).all();
    return json(cards.results || []);
}

async function handleCreateCard(request, env, user) {
    const { cardName, cardHolderName, cardNumber, expiryDate, cvv, cardType, color, bankName, id } = await request.json();
    const cardId = id || crypto.randomUUID();
    await env.MONEY_DB.prepare('INSERT INTO saved_cards (id, userId, cardName, cardHolderName, cardNumber, expiryDate, cvv, cardType, color, bankName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(cardId, user.id, cardName, cardHolderName, cardNumber, expiryDate, cvv, cardType, color, bankName || null).run();
    return json({ id: cardId, cardName, cardHolderName, cardNumber, expiryDate, cvv, cardType, color, bankName, userId: user.id }, 201);
}

async function handleUpdateCard(request, env, user) {
    const cardId = getUserId(new URL(request.url));
    const body = await request.json();
    const sets = []; const params = [];
    for (const key of ['cardName', 'cardHolderName', 'cardNumber', 'expiryDate', 'cvv', 'cardType', 'color', 'bankName']) {
        if (body[key] !== undefined) { sets.push(`${key} = ?`); params.push(body[key]); }
    }
    if (sets.length === 0) return json({ error: 'No fields to update' }, 400);
    params.push(cardId, user.id);
    await env.MONEY_DB.prepare(`UPDATE saved_cards SET ${sets.join(', ')} WHERE id = ? AND userId = ?`).bind(...params).run();
    return json({ success: true });
}

async function handleDeleteCard(request, env, user) {
    const cardId = getUserId(new URL(request.url));
    await env.MONEY_DB.prepare('DELETE FROM saved_cards WHERE id = ? AND userId = ?').bind(cardId, user.id).run();
    return json({ success: true });
}

async function handleDebugDb(env, user) {
    const db = env.MONEY_DB;
    const [wallets, categories, transactions, cards] = await Promise.all([
        db.prepare('SELECT COUNT(*) as c FROM wallets WHERE userId = ?').bind(user.id).first(),
        db.prepare('SELECT COUNT(*) as c FROM categories WHERE userId = ?').bind(user.id).first(),
        db.prepare('SELECT COUNT(*) as c FROM transactions WHERE userId = ?').bind(user.id).first(),
        db.prepare('SELECT COUNT(*) as c FROM saved_cards WHERE userId = ?').bind(user.id).first(),
    ]);
    return json({
        counts: {
            wallets: wallets.c,
            categories: categories.c,
            transactions: transactions.c,
            cards: cards.c,
        }
    });
}

async function handleIosProfile(request, env) {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    let iconBase64 = '';
    try {
        const iconReq = await env.ASSETS.fetch(new URL('/monew-logo.png', url.origin));
        if (iconReq.ok) {
            const buffer = await iconReq.arrayBuffer();
            iconBase64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        }
    } catch {}

    const uuid = () => crypto.randomUUID();
    const mobileConfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>FullScreen</key>
            <true/>
            <key>Icon</key>
            <data>${iconBase64}</data>
            <key>IsRemovable</key>
            <true/>
            <key>Label</key>
            <string>MoneW</string>
            <key>PayloadDescription</key>
            <string>Install MoneW Web App</string>
            <key>PayloadDisplayName</key>
            <string>MoneW Web Clip</string>
            <key>PayloadIdentifier</key>
            <string>com.monew.webclip</string>
            <key>PayloadOrganization</key>
            <string>MoneW Finance</string>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadUUID</key>
            <string>${uuid()}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>Precomposed</key>
            <true/>
            <key>URL</key>
            <string>${baseUrl}</string>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string>Installs the MoneW Web App to your Home Screen</string>
    <key>PayloadDisplayName</key>
    <string>MoneW Installer</string>
    <key>PayloadIdentifier</key>
    <string>com.monew.profile</string>
    <key>PayloadOrganization</key>
    <string>MoneW Finance</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${uuid()}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>`;

    return new Response(mobileConfig, {
        headers: {
            'Content-Type': 'application/x-apple-aspen-config',
            'Content-Disposition': 'attachment; filename="monew-installer.mobileconfig"',
            ...corsHeaders,
        },
    });
}
