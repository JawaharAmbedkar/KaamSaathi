import test from 'node:test'
import assert from 'node:assert/strict'
import { app } from '../src/app.js'

test('health endpoint reports service status', async () => {
  const server = app.listen(0)
  try {
    const address = server.address()
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { status: 'ok' })
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
})

test('protected transaction endpoint requires authentication', async () => {
  const server = app.listen(0)
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/transactions`)
    assert.equal(response.status, 401)
    assert.equal((await response.json()).error, 'Please sign in to continue.')
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
})
