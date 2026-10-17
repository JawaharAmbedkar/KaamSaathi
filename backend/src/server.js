import 'dotenv/config'
import { app } from './app.js'
import { prisma } from './lib/prisma.js'

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set to a random value at least 32 characters long.')
}

const port = Number(process.env.PORT) || 4000
const server = app.listen(port, () => console.log(`KaamSaathi API listening on port ${port}`))

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
