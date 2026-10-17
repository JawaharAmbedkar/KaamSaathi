import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'

const router = Router()
const schema = z.object({ title: z.string().trim().min(3).max(120), body: z.string().trim().min(20).max(12000) })

router.get('/', async (req, res, next) => {
  try {
    const complaints = await prisma.complaint.findMany({ where: { userId: req.userId }, orderBy: { updatedAt: 'desc' } })
    return res.json({ complaints })
  } catch (error) { return next(error) }
})

router.post('/', async (req, res, next) => {
  try {
    const input = schema.parse(req.body)
    const complaint = await prisma.complaint.create({ data: { ...input, userId: req.userId } })
    return res.status(201).json({ complaint })
  } catch (error) { return next(error) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const input = schema.parse(req.body)
    const result = await prisma.complaint.updateMany({ where: { id: req.params.id, userId: req.userId }, data: input })
    if (!result.count) return res.status(404).json({ error: 'Complaint draft not found.' })
    const complaint = await prisma.complaint.findFirst({ where: { id: req.params.id, userId: req.userId } })
    return res.json({ complaint })
  } catch (error) { return next(error) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await prisma.complaint.deleteMany({ where: { id: req.params.id, userId: req.userId } })
    if (!result.count) return res.status(404).json({ error: 'Complaint draft not found.' })
    return res.status(204).end()
  } catch (error) { return next(error) }
})

export default router
