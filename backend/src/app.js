import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import { requireAuth } from './middleware/auth.js'
import { errorHandler, notFound } from './middleware/errors.js'
import authRoutes from './routes/auth.js'
import transactionRoutes from './routes/transactions.js'
import complaintRoutes from './routes/complaints.js'
import assistantRoutes from './routes/assistant.js'

export const app = express()
export default app

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '40kb' }))
app.use(cookieParser())
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 180, standardHeaders: 'draft-7', legacyHeaders: false }))
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: 'draft-7', legacyHeaders: false }), authRoutes)
app.use('/api/transactions', requireAuth, transactionRoutes)
app.use('/api/complaints', requireAuth, complaintRoutes)
app.use('/api/assistant', requireAuth, assistantRoutes)
app.use(notFound)
app.use(errorHandler)
