import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@libsql/client';
import { initializeDatabase } from '../lib/db-adapter.mjs';

const args = process.argv.slice(2);
const reset = args.includes('--reset');

const dbUrl = process.env.TURSO_DATABASE_URL || `file:${path.resolve(process.cwd(), 'local.db')}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (reset && dbUrl.startsWith('file:')) {
  const filePath = dbUrl.slice('file:'.length);
  for (const suffix of ['', '-wal', '-shm']) {
    if (fs.existsSync(`${filePath}${suffix}`)) {
      fs.unlinkSync(`${filePath}${suffix}`);
    }
  }
  console.log(`Removed existing SQLite file: ${filePath}`);
}

const client = createClient({ url: dbUrl, authToken });
const result = await initializeDatabase(client, { forceSeed: !reset });

const [users, wallets, categories, transactions, cards] = await Promise.all([
  client.execute('SELECT COUNT(*) AS count FROM users'),
  client.execute('SELECT COUNT(*) AS count FROM wallets'),
  client.execute('SELECT COUNT(*) AS count FROM categories'),
  client.execute('SELECT COUNT(*) AS count FROM transactions'),
  client.execute('SELECT COUNT(*) AS count FROM saved_cards'),
]);

console.log(
  `Database ready (${dbUrl}) | initialized=${result.initialized} seeded=${result.seeded}`
);
console.log(
  `Counts -> users: ${users.rows[0].count}, categories: ${categories.rows[0].count}, wallets: ${wallets.rows[0].count}, transactions: ${transactions.rows[0].count}, cards: ${cards.rows[0].count}`
);

client.close();
