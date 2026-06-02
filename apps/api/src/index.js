import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import authRouter from './routes/auth.js'
import articlesRouter from './routes/articles.js'
import insightsRouter from './routes/insights.js'
import leadsRouter from './routes/leads.js'
import analyticsRouter from './routes/analytics.js'

const app = express()
const PORT = process.env.PORT || 3001

// Security + logging
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(globalLimiter)

// Routes
app.use('/api/auth', authRouter)
app.use('/api/articles', articlesRouter)
app.use('/api/insights', insightsRouter)
app.use('/api/leads', leadsRouter)
app.use('/api/analytics', analyticsRouter)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
