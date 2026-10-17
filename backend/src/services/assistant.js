const demoReplies = {
  en: 'I can help you think through this. Keep a record of dates, amounts, and messages, and use official government channels for decisions. This is general guidance, not legal advice.',
  hi: 'मैं आपकी बात समझने में मदद कर सकता/सकती हूँ। तारीख़ों, रकम और संदेशों का रिकॉर्ड रखें। सही जानकारी के लिए सरकारी स्रोत देखें। यह सामान्य जानकारी है, कानूनी सलाह नहीं।',
  pa: 'ਮੈਂ ਤੁਹਾਡੀ ਗੱਲ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ। ਤਾਰੀਖਾਂ, ਰਕਮਾਂ ਅਤੇ ਸੁਨੇਹਿਆਂ ਦਾ ਰਿਕਾਰਡ ਰੱਖੋ। ਅਧਿਕਾਰਤ ਜਾਣਕਾਰੀ ਲਈ ਸਰਕਾਰੀ ਸਰੋਤ ਵੇਖੋ। ਇਹ ਆਮ ਜਾਣਕਾਰੀ ਹੈ, ਕਾਨੂੰਨੀ ਸਲਾਹ ਨਹੀਂ।',
}

export async function getAssistantReply({ message, language, context }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return { reply: demoReplies[language] ?? demoReplies.en, demo: true }

  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest'
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: `You are KaamSaathi, a careful, empathetic assistant for workers in India. Respond in ${language === 'pa' ? 'Punjabi' : language === 'hi' ? 'Hindi' : 'simple English'}. Use simple language, distinguish general guidance from legal advice, never invent scheme eligibility or legal claims, and suggest official sources when appropriate. Treat the user's context as private.` }] },
      contents: [{ role: 'user', parts: [{ text: `Context: ${context || 'none'}\n\nQuestion: ${message}` }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 700 },
    }),
    signal: AbortSignal.timeout(45000),
  })
  if (!response.ok) {
    console.error(`Gemini request failed with status ${response.status} for model ${model}`)
    const error = new Error(
      response.status === 404
        ? `Gemini could not find model "${model}". Set GEMINI_MODEL to an available Gemini model in backend/.env, then restart the backend.`
        : response.status === 400 || response.status === 401 || response.status === 403
          ? 'Gemini rejected the request. Check that GEMINI_API_KEY is valid and the Gemini API is enabled for its project.'
          : response.status === 429
            ? 'Gemini rate limit or quota reached. Check the API quota and try again later.'
            : 'Gemini is temporarily unavailable. Please try again later.'
    )
    error.statusCode = 502
    throw error
  }
  const data = await response.json()
  const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim()
  if (!reply) throw new Error('The assistant could not prepare a reply. Please try again.')
  return { reply, demo: false }
}
