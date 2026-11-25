import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@libsql/client';

function resolveDbConfig() {
  if (process.env.TURSO_DATABASE_URL) {
    return {
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
      isRemote: true,
    };
  }
  if (process.env.VERCEL) {
    return { url: 'file:/tmp/monew.db', isRemote: false };
  }
  return { url: `file:${path.resolve(process.cwd(), 'local.db')}`, isRemote: false };
}

function createD1Wrapper(client) {
  const wrapStmt = (sql, boundArgs = []) => ({
    _sql: sql,
    _args: boundArgs,
    bind(...args) {
      return wrapStmt(sql, args.map((v) => (v === undefined ? null : v)));
    },
    async first(colName) {
      const res = await client.execute({ sql, args: boundArgs });
      const row = res.rows?.[0];
      if (!row) return null;
      const obj = { ...row };
      return colName ? obj[colName] : obj;
    },
    async all() {
      const res = await client.execute({ sql, args: boundArgs });
      return { results: (res.rows || []).map((r) => ({ ...r })) };
    },
    async run() {
      const res = await client.execute({ sql, args: boundArgs });
      return {
        success: true,
        meta: {
          changes: res.rowsAffected ?? 0,
          last_row_id: res.lastInsertRowid ? Number(res.lastInsertRowid) : 0,
        },
      };
    },
  });

  return {
    prepare(sql) {
      return wrapStmt(sql);
    },
    async batch(statements) {
      if (!Array.isArray(statements) || statements.length === 0) return [];
      const tx = await client.transaction('write');
      const results = [];
      try {
        for (const stmt of statements) {
          const res = await tx.execute({
            sql: stmt._sql,
            args: stmt._args || [],
          });
          results.push({
            success: true,
            results: (res.rows || []).map((r) => ({ ...r })),
            meta: {
              changes: res.rowsAffected ?? 0,
              last_row_id: res.lastInsertRowid ? Number(res.lastInsertRowid) : 0,
            },
          });
        }
        await tx.commit();
        return results;
      } catch (err) {
        try {
          await tx.rollback();
        } catch {}
        throw err;
      }
    },
    async executeMultiple(sql) {
      await client.executeMultiple(sql);
    },
  };
}

function resolveUploadPath(uploadDir, key) {
  const cleaned = key.replace(/^\/+/, '');
  const resolved = path.resolve(uploadDir, cleaned);
  if (!resolved.startsWith(uploadDir + path.sep) && resolved !== uploadDir) {
    throw new Error('Invalid storage key path');
  }
  return resolved;
}

function createLocalImagesStore(uploadDir) {
  fs.mkdirSync(uploadDir, { recursive: true });
  return {
    async put(key, arrayBuffer, options = {}) {
      const filePath = resolveUploadPath(uploadDir, key);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
      if (options?.httpMetadata?.contentType) {
        fs.writeFileSync(`${filePath}.meta`, options.httpMetadata.contentType);
      }
    },
    async get(key) {
      const filePath = resolveUploadPath(uploadDir, key);
      if (!fs.existsSync(filePath)) return null;
      const buf = fs.readFileSync(filePath);
      const metaPath = `${filePath}.meta`;
      const contentType = fs.existsSync(metaPath)
        ? fs.readFileSync(metaPath, 'utf8')
        : 'application/octet-stream';
      return {
        async blob() {
          return new Blob([buf], { type: contentType });
        },
      };
    },
    async delete(key) {
      const filePath = resolveUploadPath(uploadDir, key);
      const metaPath = `${filePath}.meta`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath);
    },
  };
}

let cachedLocalEnv = null;
let initPromise = null;

export async function initializeDatabase(client, { forceSeed = false } = {}) {
  const check = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
  );
  if (check.rows.length === 0) {
    const schemaSql = fs.readFileSync(path.resolve(process.cwd(), 'schema.sql'), 'utf8');
    await client.executeMultiple(schemaSql);
    const seedSql = fs.readFileSync(path.resolve(process.cwd(), 'scripts/seed.sql'), 'utf8');
    await client.executeMultiple(seedSql);
    return { initialized: true, seeded: true };
  }
  if (forceSeed) {
    const seedSql = fs.readFileSync(path.resolve(process.cwd(), 'scripts/seed.sql'), 'utf8');
    await client.executeMultiple(seedSql);
    return { initialized: false, seeded: true };
  }
  return { initialized: false, seeded: false };
}

function readPublicLogoBase64() {
  try {
    const logoPath = path.resolve(process.cwd(), 'public/monew-logo.png');
    if (fs.existsSync(logoPath)) {
      return fs.readFileSync(logoPath).toString('base64');
    }
  } catch {}
  return '';
}

export async function getLocalEnv() {
  if (!initPromise) {
    initPromise = (async () => {
      const cfg = resolveDbConfig();
      const client = createClient({ url: cfg.url, authToken: cfg.authToken });
      await client.execute('PRAGMA foreign_keys = ON');
      await initializeDatabase(client);
      const isVercel = Boolean(process.env.VERCEL);
      const imagesStore = isVercel
        ? null
        : createLocalImagesStore(path.resolve(process.cwd(), '.local-uploads'));
      cachedLocalEnv = {
        MONEY_DB: createD1Wrapper(client),
        MONEY_IMAGES: imagesStore,
        JWT_SECRET: process.env.JWT_SECRET,
        ALLOW_DEBUG: process.env.NODE_ENV === 'production' ? process.env.ALLOW_DEBUG : '1',
        PUBLIC_LOGO_BASE64: readPublicLogoBase64(),
      };
      return cachedLocalEnv;
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

export function resetCachedEnv() {
  cachedLocalEnv = null;
  initPromise = null;
}
