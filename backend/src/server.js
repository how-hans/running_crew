import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { randomMockDiagnosis } from './mockClasses.js'
import { pool, initDb } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist')

const app = express()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

app.use(cors())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// FR-1: image -> crop/disease classification.
// Returns mock data for now; the trained InceptionV3 classifier
// replaces this handler's body once it's ready (Part 5).
app.post('/api/diagnose', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '이미지 파일이 필요해요' })
  }

  const diagnosis = randomMockDiagnosis()

  const { rows } = await pool.query(
    `INSERT INTO diagnoses (crop, disease, is_healthy, confidence)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at`,
    [diagnosis.crop, diagnosis.disease, diagnosis.isHealthy, diagnosis.confidence],
  )

  res.json({ ...diagnosis, id: rows[0].id, createdAt: rows[0].created_at })
})

// History of past diagnoses (foundation for FR-5 follow-up).
app.get('/api/diagnoses', async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT id, crop, disease, is_healthy AS "isHealthy", confidence, created_at AS "createdAt"
     FROM diagnoses
     ORDER BY created_at DESC
     LIMIT 50`,
  )
  res.json(rows)
})

// Production: the frontend is built to frontend/dist and served from here,
// so the whole app runs as a single Render web service.
app.use(express.static(frontendDist))
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})

const PORT = process.env.PORT || 4000
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`AgriSage backend listening on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err)
    process.exit(1)
  })
