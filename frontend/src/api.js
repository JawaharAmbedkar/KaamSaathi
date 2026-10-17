const API = import.meta.env.VITE_API_URL || ''
const DEMO_KEY = 'kaamsaathi-demo-v1'
const SESSION_KEY = 'kaamsaathi-demo-user'
let demoMode = Boolean(localStorage.getItem(SESSION_KEY))

function readDemo() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KEY)) || { transactions: [], complaints: [] }
  } catch {
    return { transactions: [], complaints: [] }
  }
}

function saveDemo(data) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(data))
}

async function request(path, options = {}) {
  const response = await fetch(`${API}/api${path}`, {
    credentials: 'include',
    ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (!response.ok) {
    const result = await response.json().catch(() => ({}))
    const error = new Error(result.error || 'Something went wrong. Please try again.')
    error.status = response.status
    throw error
  }
  return response.status === 204 ? null : response.json()
}

export const api = {
  isDemo: () => demoMode,
  async me() {
    if (demoMode) return JSON.parse(localStorage.getItem(SESSION_KEY))
    return (await request('/auth/me')).user
  },
  async login(email, password) {
    const result = await request('/auth/login', { method: 'POST', body: { email, password } })
    demoMode = false
    localStorage.removeItem(SESSION_KEY)
    return result.user
  },
  async register(name, email, password) {
    const result = await request('/auth/register', { method: 'POST', body: { name, email, password } })
    demoMode = false
    localStorage.removeItem(SESSION_KEY)
    return result.user
  },
  async enterDemo() {
    const user = { id: 'demo-worker', name: 'Aman Singh', email: 'aman@example.com' }
    demoMode = true
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    if (!localStorage.getItem(DEMO_KEY)) {
      saveDemo({
        transactions: [
          { id: 'd1', kind: 'income', amount: 2450, category: 'Delivery', note: 'Weekly payout', occurredAt: new Date().toISOString() },
          { id: 'd2', kind: 'expense', amount: 320, category: 'Fuel', note: 'Bike fuel', occurredAt: new Date(Date.now() - 86400000).toISOString() },
          { id: 'd3', kind: 'income', amount: 1850, category: 'Delivery', note: 'Weekend shifts', occurredAt: new Date(Date.now() - 2 * 86400000).toISOString() },
          { id: 'd4', kind: 'expense', amount: 180, category: 'Food', note: 'Lunch on shift', occurredAt: new Date(Date.now() - 3 * 86400000).toISOString() },
          { id: 'd5', kind: 'income', amount: 2100, category: 'Delivery', note: 'Weekly payout', occurredAt: new Date(Date.now() - 5 * 86400000).toISOString() },
        ],
        complaints: [],
      })
    }
    return user
  },
  async logout() {
    if (!demoMode) await request('/auth/logout', { method: 'POST' })
    demoMode = false
    localStorage.removeItem(SESSION_KEY)
  },
  async listTransactions() {
    if (demoMode) return readDemo().transactions
    return (await request('/transactions')).transactions
  },
  async createTransaction(transaction) {
    if (demoMode) {
      const data = readDemo()
      const item = { ...transaction, id: crypto.randomUUID(), occurredAt: transaction.occurredAt || new Date().toISOString() }
      data.transactions.unshift(item)
      saveDemo(data)
      return item
    }
    return (await request('/transactions', { method: 'POST', body: transaction })).transaction
  },
  async deleteTransaction(id) {
    if (demoMode) {
      const data = readDemo()
      data.transactions = data.transactions.filter((entry) => entry.id !== id)
      saveDemo(data)
      return
    }
    await request(`/transactions/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
  async listComplaints() {
    if (demoMode) return readDemo().complaints
    return (await request('/complaints')).complaints
  },
  async saveComplaint(complaint) {
    if (demoMode) {
      const data = readDemo()
      const existing = data.complaints.find((item) => item.id === complaint.id)
      const saved = { ...complaint, id: complaint.id || crypto.randomUUID(), updatedAt: new Date().toISOString() }
      data.complaints = existing
        ? data.complaints.map((item) => item.id === saved.id ? saved : item)
        : [saved, ...data.complaints]
      saveDemo(data)
      return saved
    }
    const path = complaint.id ? `/complaints/${encodeURIComponent(complaint.id)}` : '/complaints'
    return (await request(path, { method: complaint.id ? 'PUT' : 'POST', body: complaint })).complaint
  },
  async deleteComplaint(id) {
    if (demoMode) {
      const data = readDemo()
      data.complaints = data.complaints.filter((item) => item.id !== id)
      saveDemo(data)
      return
    }
    await request(`/complaints/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
  async chat(message, language) {
    return request('/assistant/chat', { method: 'POST', body: { message, language } })
  },
  async explainDocument(text, language) {
    return request('/assistant/document', { method: 'POST', body: { text, language } })
  },
}

export const demoReply = {
  en: 'I can help you think through this. Keep a record of dates, amounts, and messages, and use official government channels for decisions. This is general guidance, not legal advice.',
  hi: 'मैं आपकी बात समझने में मदद कर सकता/सकती हूँ। तारीख़ों, रकम और संदेशों का रिकॉर्ड रखें। सही जानकारी के लिए सरकारी स्रोत देखें। यह सामान्य जानकारी है, कानूनी सलाह नहीं।',
  pa: 'ਮੈਂ ਤੁਹਾਡੀ ਗੱਲ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ। ਤਾਰੀਖਾਂ, ਰਕਮਾਂ ਅਤੇ ਸੁਨੇਹਿਆਂ ਦਾ ਰਿਕਾਰਡ ਰੱਖੋ। ਅਧਿਕਾਰਤ ਜਾਣਕਾਰੀ ਲਈ ਸਰਕਾਰੀ ਸਰੋਤ ਵੇਖੋ। ਇਹ ਆਮ ਜਾਣਕਾਰੀ ਹੈ, ਕਾਨੂੰਨੀ ਸਲਾਹ ਨਹੀਂ।',
}
