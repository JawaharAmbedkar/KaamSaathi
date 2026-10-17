import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const credentials = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(72),
})
const signupInput = credentials.extend({ name: z.string().trim().min(2).max(80) })

function issueSession(user, res) {
  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: '7d' })
  res.cookie('kaamsaathi_session', token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  return { id: user.id, name: user.name, email: user.email }
}

router.post('/register', async (req, res, next) => {
  try {
    const input = signupInput.parse(req.body)
    const existing = await prisma.user.findUnique({ where: { email: input.email } })
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' })
    const passwordHash = await bcrypt.hash(input.password, 12)
    const user = await prisma.user.create({ data: { name: input.name, email: input.email, passwordHash } })
    return res.status(201).json({ user: issueSession(user, res) })
  } catch (error) { return next(error) }
})

router.post('/login', async (req, res, next) => {
  try {
    const input = credentials.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email: input.email } })
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      return res.status(401).json({ error: 'Email or password is incorrect.' })
    }
    return res.json({ user: issueSession(user, res) })
  } catch (error) { return next(error) }
})

router.post('/logout', (req, res) => {
  res.clearCookie('kaamsaathi_session', { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true', sameSite: 'strict', path: '/' })
  res.status(204).end()
})

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, name: true, email: true } })
    if (!user) return res.status(401).json({ error: 'Please sign in to continue.' })
    return res.json({ user })
  } catch (error) { return next(error) }
})

export default router
