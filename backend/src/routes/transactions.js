import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'

const router = Router()
const inputSchema = z.object({
  kind: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive().max(10000000),
  category: z.string().trim().min(1).max(60),
  note: z.string().trim().max(240).optional(),
  occurredAt: z.coerce.date().optional(),
})

router.get('/', async (req, res, next) => {
  try {
    const items = await prisma.transaction.findMany({
      where: { userId: req.userId },
      orderBy: { occurredAt: 'desc' },
      take: 250,
    })
    return res.json({ transactions: items })
  } catch (error) { return next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const input = inputSchema.parse(req.body)
    const transaction = await prisma.transaction.create({
      data: { ...input, userId: req.userId, amount: input.amount },
    })
    return res.status(201).json({ transaction })
  } catch (error) { return next(error) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await prisma.transaction.deleteMany({ where: { id: req.params.id, userId: req.userId } })
    if (!result.count) return res.status(404).json({ error: 'Transaction not found.' })
    return res.status(204).end()
  } catch (error) { return next(error) }
})

export default router
