const { Pool } = require('pg');

// Neon (veya herhangi bir Postgres) bağlantısı. DATABASE_URL ortam değişkeninden okunur.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
});

// Uygulama açılışında tabloyu oluşturur (yoksa).
async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      progress      JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at    TIMESTAMPTZ DEFAULT now(),
      updated_at    TIMESTAMPTZ DEFAULT now()
    );
  `);
}

module.exports = { pool, initSchema };
