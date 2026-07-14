import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS diagnoses (
      id SERIAL PRIMARY KEY,
      crop TEXT NOT NULL,
      disease TEXT NOT NULL,
      is_healthy BOOLEAN NOT NULL,
      confidence NUMERIC NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
}
