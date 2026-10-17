import test from 'node:test'
import assert from 'node:assert/strict'
import { getAssistantReply } from '../src/services/assistant.js'

test('Gemini requests use the configured model and keep the API key out of the URL', async () => {
  const previousKey = process.env.GEMINI_API_KEY
  const previousModel = process.env.GEMINI_MODEL
  const previousFetch = globalThis.fetch
  process.env.GEMINI_API_KEY = 'test-secret'
  process.env.GEMINI_MODEL = 'gemini-test-flash'
  let request
  globalThis.fetch = async (url, options) => {
    request = { url, options }
    return Response.json({ candidates: [{ content: { parts: [{ text: 'A helpful answer.' }] } }] })
  }

  try {
    const result = await getAssistantReply({ message: 'Hello', language: 'en' })
    assert.deepEqual(result, { reply: 'A helpful answer.', demo: false })
    assert.equal(request.url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-test-flash:generateContent')
    assert.equal(request.options.headers['x-goog-api-key'], 'test-secret')
    assert.equal(request.url.includes('test-secret'), false)
  } finally {
    globalThis.fetch = previousFetch
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = previousKey
    if (previousModel === undefined) delete process.env.GEMINI_MODEL
    else process.env.GEMINI_MODEL = previousModel
  }
})

test('missing Gemini model returns an actionable configuration error', async () => {
  const previousKey = process.env.GEMINI_API_KEY
  const previousModel = process.env.GEMINI_MODEL
  const previousFetch = globalThis.fetch
  process.env.GEMINI_API_KEY = 'test-secret'
  process.env.GEMINI_MODEL = 'missing-model'
  globalThis.fetch = async () => new Response('{}', { status: 404 })

  try {
    await assert.rejects(
      getAssistantReply({ message: 'Hello', language: 'en' }),
      (error) => error.statusCode === 502 && error.message.includes('GEMINI_MODEL') && error.message.includes('missing-model')
    )
  } finally {
    globalThis.fetch = previousFetch
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = previousKey
    if (previousModel === undefined) delete process.env.GEMINI_MODEL
    else process.env.GEMINI_MODEL = previousModel
  }
})
