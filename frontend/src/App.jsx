import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, BadgeIndianRupee, Bell, Bike, BriefcaseBusiness, Check,
  CheckCircle2, ChevronDown, CircleHelp, Clock3, Download, ExternalLink, FileCheck2, FileText, Gauge, HandCoins,
  HeartHandshake, IndianRupee, Languages, LifeBuoy, LogOut, Menu, MessageCircle, Phone, Plus, Send, Shield, ShieldCheck,
  Sparkles, Trash2, TrendingDown, TrendingUp, Upload, Wallet, X,
} from 'lucide-react'
import { api, demoReply } from './api.js'
import { rightsResources, schemes, suggestions } from './data.js'

const DashboardChart = lazy(() => import('./DashboardChart.jsx'))

const money = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
const todayISO = () => new Date().toISOString().slice(0, 10)
const pageMotion = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } }

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [backendAvailable, setBackendAvailable] = useState(true)
  const [language, setLanguage] = useState('en')
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    api.me().then((profile) => setUser(profile)).catch((error) => {
      if (error instanceof TypeError || error.status >= 500) setBackendAvailable(false)
      else setUser(null)
    }).finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    try {
      await api.logout()
      setUser(null)
      navigate('/login')
    } catch (error) {
      window.alert(error.message)
    }
  }
  const signInDemo = async () => {
    setUser(await api.enterDemo())
    setBackendAvailable(false)
    navigate('/')
  }
  const authenticate = async (method, values) => {
    const profile = await api[method](...values)
    setUser(profile)
    setBackendAvailable(true)
    navigate('/')
  }

  useEffect(() => setMobileOpen(false), [location.pathname])

  if (loading) return <div className="boot-screen"><div className="brand-mark"><HeartHandshake size={22} /></div><span>KaamSaathi</span></div>
  if (!user) return <AuthPage onAuthenticate={authenticate} onDemo={signInDemo} backendAvailable={backendAvailable} />

  return (
    <div className="app-shell">
      <AnimatePresence>
        {mobileOpen && <motion.button aria-label="Close menu" className="mobile-overlay" onClick={() => setMobileOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
      </AnimatePresence>
      <Sidebar user={user} onLogout={logout} mobileOpen={mobileOpen} />
      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-dot">/</span><strong>{pageNames[location.pathname] || 'Overview'}</strong></div>
          <div className="topbar-actions">
            {api.isDemo() && <span className="demo-chip"><span /> Demo mode</span>}
            <label className="language-select"><Languages size={15} /><select aria-label="Assistant language" value={language} onChange={(event) => setLanguage(event.target.value)}><option value="en">EN</option><option value="hi">हिंदी</option><option value="pa">ਪੰਜਾਬੀ</option></select><ChevronDown size={13} /></label>
            <div className="top-avatar" title={user.name}>{user.name.charAt(0).toUpperCase()}</div>
          </div>
        </header>
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/assistant" element={<Assistant language={language} />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/documents" element={<Documents language={language} />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <footer className="footer"><span>Made for the people who keep India moving.</span><span>KaamSaathi <span className="footer-sep">·</span> Your companion at work</span></footer>
      </main>
    </div>
  )
}

const pageNames = {
  '/': 'Overview', '/earnings': 'My earnings', '/assistant': 'AI Saathi', '/schemes': 'Schemes',
  '/safety': 'Safety & rights', '/documents': 'Document assistant', '/complaints': 'Complaint drafts',
}

const navItems = [
  { to: '/', label: 'Overview', icon: Gauge, end: true },
  { to: '/earnings', label: 'My earnings', icon: Wallet },
  { to: '/assistant', label: 'AI Saathi', icon: Sparkles, badge: 'AI' },
  { to: '/schemes', label: 'Schemes', icon: HandCoins },
  { to: '/safety', label: 'Safety & rights', icon: ShieldCheck },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/complaints', label: 'Complaints', icon: MessageCircle },
]

function Sidebar({ user, onLogout, mobileOpen }) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <Link to="/" className="brand"><div className="brand-mark"><HeartHandshake size={21} strokeWidth={2.1} /></div><div className="brand-word">kaam<span>saathi</span><small>YOUR WORK, YOUR RIGHTS</small></div></Link>
      <div className="nav-section-label">YOUR WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {navItems.map(({ to, label, icon: Icon, badge, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{badge && <span className="nav-badge">{badge}</span>}</NavLink>
        ))}
      </nav>
      <div className="sidebar-help"><div className="help-glow"><LifeBuoy size={19} /></div><strong>Need a helping hand?</strong><p>Your Saathi is always here to help you figure things out.</p><Link to="/assistant">Chat with Saathi <ArrowRight size={14} /></Link></div>
      <div className="profile-row"><div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div><div className="profile-copy"><strong>{user.name}</strong><span>Worker account</span></div><button aria-label="Sign out" className="logout-button" onClick={onLogout}><LogOut size={17} /></button></div>
    </aside>
  )
}

function AuthPage({ onAuthenticate, onDemo, backendAvailable }) {
  const [register, setRegister] = useState(false)
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await onAuthenticate(register ? 'register' : 'login', register ? [values.name, values.email, values.password] : [values.email, values.password])
    } catch (problem) { setError(problem.message || 'Could not sign in. Please try again.') } finally { setBusy(false) }
  }
  return (
    <div className="auth-screen">
      <div className="auth-decoration auth-decoration-one" /><div className="auth-decoration auth-decoration-two" />
      <div className="auth-left">
        <Link to="/login" className="brand auth-brand"><div className="brand-mark"><HeartHandshake size={21} /></div><div className="brand-word">kaam<span>saathi</span><small>YOUR WORK, YOUR RIGHTS</small></div></Link>
        <div className="auth-story"><div className="eyebrow"><span className="eyebrow-line" /> BUILT FOR YOUR EVERYDAY</div><h1>Your hard work<br />deserves <em>support.</em></h1><p>One trusted companion for your earnings, your rights, and everything in between.</p>
          <div className="auth-quote"><div className="quote-icon"><Sparkles size={18} /></div><div><strong>Small steps. Stronger tomorrow.</strong><span>Know where your money goes. Know what support is out there. Never figure it out alone.</span></div></div>
          <div className="auth-social-proof"><div className="mini-avatars"><span>A</span><span>R</span><span>S</span><span>M</span></div><span>Here for the hands that move us forward.</span></div>
        </div>
        <span className="auth-footer">© 2026 KaamSaathi <span>·</span> Made with care in India</span>
      </div>
      <div className="auth-right"><div className="auth-card">
        <div className="auth-card-top"><span className="auth-kicker">{register ? 'A BETTER WORKDAY STARTS HERE' : 'WELCOME BACK'}</span><div className="auth-sparkle"><Sparkles size={16} /></div></div>
        <h2>{register ? 'Create your account' : 'Sign in to your Saathi'}</h2><p className="auth-subtitle">{register ? 'Your work life, a little more in your hands.' : 'Good to have you back. Let’s get to work.'}</p>
        {error && <div role="alert" className="form-error">{error}</div>}
        <form onSubmit={submit} className="auth-form">
          {register && <label>Your name<input required minLength="2" maxLength="80" autoComplete="name" placeholder="e.g. Aman Singh" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} /></label>}
          <label>Email address<input type="email" required autoComplete="email" placeholder="you@example.com" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} /></label>
          <label>Password<input type="password" required minLength="8" maxLength="72" autoComplete={register ? 'new-password' : 'current-password'} placeholder="At least 8 characters" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} /></label>
          <button className="button button-primary auth-submit" disabled={busy}>{busy ? 'Just a moment…' : register ? 'Create my account' : 'Sign in'}<ArrowRight size={16} /></button>
        </form>
        <div className="auth-switch">{register ? 'Already have an account?' : 'New to KaamSaathi?'} <button onClick={() => { setRegister(!register); setError('') }}>{register ? 'Sign in' : 'Create an account'}</button></div>
        <div className="auth-divider"><span>OR</span></div>
        {!backendAvailable && <div className="demo-notice"><span className="demo-dot" /> API isn’t connected. Demo data stays in this browser.</div>}
        <button className="button button-secondary demo-button" onClick={onDemo}><Sparkles size={16} /> Explore the demo <ArrowRight size={15} /></button>
        <p className="auth-privacy"><Shield size={13} /> Your information stays yours. Always.</p>
      </div><span className="auth-mobile-footer">© 2026 KaamSaathi · Made with care in India</span></div>
    </div>
  )
}

function PageHeading({ eyebrow, title, subtitle, action }) {
  return <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" />{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>
}

function Card({ children, className = '' }) { return <section className={`card ${className}`}>{children}</section> }

function Dashboard({ user }) {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')
  const load = useCallback(() => api.listTransactions().then(setTransactions).catch((problem) => setError(problem.message)), [])
  useEffect(() => { load() }, [load])
  const now = new Date()
  const thisWeek = transactions.filter((item) => new Date(item.occurredAt) >= new Date(Date.now() - 7 * 86400000))
  const earned = thisWeek.filter((item) => item.kind === 'income').reduce((total, item) => total + Number(item.amount), 0)
  const spent = thisWeek.filter((item) => item.kind === 'expense').reduce((total, item) => total + Number(item.amount), 0)
  const chart = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now)
    date.setDate(now.getDate() - 6 + index)
    const key = date.toDateString()
    const day = thisWeek.filter((item) => new Date(item.occurredAt).toDateString() === key)
    return { day: date.toLocaleDateString('en-IN', { weekday: 'short' }), income: day.filter((item) => item.kind === 'income').reduce((sum, item) => sum + Number(item.amount), 0), expense: day.filter((item) => item.kind === 'expense').reduce((sum, item) => sum + Number(item.amount), 0) }
  }), [transactions])
  return (
    <motion.div {...pageMotion} className="page-stack">
      <PageHeading eyebrow="YOUR WORK, AT A GLANCE" title={<>Good morning, {user.name.split(' ')[0]} <span className="heading-wave">✳</span></>} subtitle="Here’s how things are looking for you this week." action={<div className="today-pill"><span /> {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</div>} />
      {error && <div className="inline-error" role="alert">{error}</div>}
      <div className="stats-grid">
        <StatCard label="Earned this week" value={money(earned)} detail="Across all your work" icon={TrendingUp} color="green" trend="Your effort, counted." />
        <StatCard label="Spent this week" value={money(spent)} detail="Everyday work expenses" icon={TrendingDown} color="gold" trend="Every rupee has a story." />
        <StatCard label="Take-home so far" value={money(earned - spent)} detail="Earnings minus expenses" icon={BadgeIndianRupee} color="blue" trend="Yours to keep." />
      </div>
      <div className="dashboard-grid">
        <Card className="chart-card"><div className="card-heading"><div><span className="section-kicker">YOUR WEEKLY PICTURE</span><h3>Money in, money out</h3></div><Link className="text-link" to="/earnings">See all activity <ArrowRight size={14} /></Link></div>
          {transactions.length ? <><div className="chart-legend"><span><i className="legend-dot green-dot" /> Earned</span><span><i className="legend-dot gold-dot" /> Spent</span></div><Suspense fallback={<div className="chart-loading">Loading your weekly picture…</div>}><DashboardChart data={chart} /></Suspense></> : <EmptyState icon={Wallet} title="Your money story starts here" text="Add your first earning or expense and your weekly picture will show up here." action={<Link className="button button-secondary button-small" to="/earnings"><Plus size={15} /> Add a transaction</Link>} />}
        </Card>
        <Card className="quick-card"><div className="card-heading"><div><span className="section-kicker">HERE FOR YOU</span><h3>Quick steps</h3></div><span className="sparkle-soft"><Sparkles size={16} /></span></div><div className="quick-list">
          <QuickLink to="/earnings" icon={Wallet} title="Add today’s earnings" description="Keep your hard work on record" tone="green" />
          <QuickLink to="/assistant" icon={Sparkles} title="Ask your Saathi" description="Get simple, helpful guidance" tone="violet" />
          <QuickLink to="/schemes" icon={HandCoins} title="Explore support" description="See verified government portals" tone="gold" />
        </div><div className="quick-note"><ShieldCheck size={15} /> One step at a time. You’ve got this.</div></Card>
      </div>
      <div className="recent-heading"><div><span className="section-kicker">A LITTLE PAPER TRAIL</span><h3>Recent activity</h3></div><Link to="/earnings" className="text-link">Full history <ArrowRight size={14} /></Link></div>
      <Card className="recent-card">{transactions.length ? <div className="transaction-list">{transactions.slice(0, 4).map((item) => <TransactionRow key={item.id} item={item} compact />)}</div> : <EmptyState icon={Clock3} title="Nothing to show just yet" text="Your newest earnings and expenses will land here." />}</Card>
    </motion.div>
  )
}

function StatCard({ label, value, detail, icon: Icon, color, trend }) {
  return <Card className="stat-card"><div className="stat-top"><span>{label}</span><div className={`stat-icon stat-${color}`}><Icon size={18} /></div></div><strong className="stat-value">{value}</strong><span className="stat-detail">{detail}</span><div className="stat-foot"><span className={`stat-foot-mark stat-${color}`}><Check size={11} /></span>{trend}</div></Card>
}

function QuickLink({ to, icon: Icon, title, description, tone }) {
  return <Link to={to} className="quick-link"><span className={`quick-icon quick-${tone}`}><Icon size={17} /></span><span className="quick-copy"><strong>{title}</strong><small>{description}</small></span><ArrowRight size={15} className="quick-arrow" /></Link>
}

function EmptyState({ icon: Icon, title, text, action }) {
  return <div className="empty-state"><span className="empty-icon"><Icon size={20} /></span><strong>{title}</strong><p>{text}</p>{action}</div>
}

function TransactionRow({ item, compact = false, onDelete }) {
  const income = item.kind === 'income'
  return <div className={`transaction-row ${compact ? 'transaction-compact' : ''}`}><div className={`transaction-icon ${income ? 'transaction-income' : 'transaction-expense'}`}>{income ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</div><div className="transaction-main"><strong>{item.category}</strong><span>{item.note || (income ? 'Work earnings' : 'Work expense')}</span></div><div className="transaction-date">{new Date(item.occurredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div><strong className={`transaction-amount ${income ? 'amount-positive' : 'amount-negative'}`}>{income ? '+' : '−'}{money(item.amount)}</strong>{onDelete && <button className="icon-button delete-button" onClick={() => onDelete(item.id)} aria-label={`Delete ${item.category} transaction`}><Trash2 size={15} /></button>}</div>
}

function Earnings() {
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ kind: 'income', amount: '', category: '', note: '', occurredAt: todayISO() })
  const refresh = useCallback(() => api.listTransactions().then(setItems).catch((problem) => setError(problem.message)), [])
  useEffect(() => { refresh() }, [refresh])
  const totalIn = items.filter((i) => i.kind === 'income').reduce((s, i) => s + Number(i.amount), 0)
  const totalOut = items.filter((i) => i.kind === 'expense').reduce((s, i) => s + Number(i.amount), 0)
  const filtered = items.filter((i) => filter === 'all' || i.kind === filter)
  const add = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.createTransaction({ ...form, amount: Number(form.amount), occurredAt: new Date(`${form.occurredAt}T12:00:00`).toISOString() })
      setModal(false)
      setForm({ kind: 'income', amount: '', category: '', note: '', occurredAt: todayISO() })
      await refresh()
    } catch (problem) { setError(problem.message) } finally { setSaving(false) }
  }
  const remove = async (id) => {
    if (!window.confirm('Remove this transaction from your records?')) return
    try { await api.deleteTransaction(id); await refresh() } catch (problem) { setError(problem.message) }
  }
  const exportCsv = () => {
    const rows = [['Date', 'Type', 'Category', 'Note', 'Amount'], ...items.map((i) => [new Date(i.occurredAt).toLocaleDateString('en-IN'), i.kind, i.category, i.note || '', i.amount])]
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    link.download = 'kaamsaathi-earnings.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }
  return <motion.div {...pageMotion} className="page-stack">
    <PageHeading eyebrow="YOUR MONEY, YOUR RECORD" title="My earnings" subtitle="A clear picture of what you earn and what work costs you." action={<div className="heading-actions"><button disabled={!items.length} className="button button-secondary" onClick={exportCsv}><Download size={15} /> Export CSV</button><button className="button button-primary" onClick={() => setModal(true)}><Plus size={16} /> Add entry</button></div>} />
    {error && <div className="inline-error" role="alert">{error}</div>}
    <div className="stats-grid earnings-stats"><StatCard label="Total earned" value={money(totalIn)} detail={`${items.filter((i) => i.kind === 'income').length} income entries`} icon={TrendingUp} color="green" trend="Every bit counts." /><StatCard label="Total spent" value={money(totalOut)} detail={`${items.filter((i) => i.kind === 'expense').length} expense entries`} icon={TrendingDown} color="gold" trend="Work costs, in view." /><StatCard label="Net earnings" value={money(totalIn - totalOut)} detail="Income after expenses" icon={IndianRupee} color="blue" trend="Your take-home picture." /></div>
    <Card className="ledger-card"><div className="ledger-top"><div><span className="section-kicker">YOUR PERSONAL LEDGER</span><h3>Transaction history</h3></div><div className="filter-tabs" role="group" aria-label="Filter transactions">{[['all', 'All'], ['income', 'Earned'], ['expense', 'Spent']].map(([key, label]) => <button key={key} className={filter === key ? 'filter-active' : ''} onClick={() => setFilter(key)}>{label}</button>)}</div></div>
      {filtered.length ? <div className="transaction-list">{filtered.map((item) => <TransactionRow key={item.id} item={item} onDelete={remove} />)}</div> : <EmptyState icon={Wallet} title={items.length ? 'Nothing in this view' : 'A fresh page, just for you'} text={items.length ? 'Try another filter to see your records.' : 'Add your first earning or expense to start understanding where your money goes.'} action={!items.length && <button className="button button-primary button-small" onClick={() => setModal(true)}><Plus size={15} /> Add your first entry</button>} />}
    </Card>
    <p className="privacy-note"><ShieldCheck size={15} /> Your ledger is private to your account. Demo records stay in this browser.</p>
    <Modal open={modal} onClose={() => setModal(false)} title="Add to your ledger" subtitle="Every entry gives you a clearer picture.">
      <form onSubmit={add} className="modal-form"><div className="type-toggle"><button type="button" className={form.kind === 'income' ? 'type-selected income-selected' : ''} onClick={() => setForm({ ...form, kind: 'income' })}><ArrowDownLeft size={15} /> I earned</button><button type="button" className={form.kind === 'expense' ? 'type-selected expense-selected' : ''} onClick={() => setForm({ ...form, kind: 'expense' })}><ArrowUpRight size={15} /> I spent</button></div><label>Amount<input autoFocus required min="1" step="0.01" type="number" placeholder="e.g. 850" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></label><label>Category<input required maxLength="60" placeholder="e.g. Delivery, fuel, food" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label><label>Note <span className="optional-label">optional</span><input maxLength="240" placeholder="A little detail for later" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label><label>Date<input required type="date" value={form.occurredAt} onChange={(e) => setForm({ ...form, occurredAt: e.target.value })} /></label><button disabled={saving} className="button button-primary modal-submit">{saving ? 'Saving…' : 'Save this entry'}<Check size={15} /></button></form>
    </Modal>
  </motion.div>
}

function Modal({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    if (!open) return undefined
    const close = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [open, onClose])
  return <AnimatePresence>{open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}><motion.div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="modal-card" initial={{ y: 14, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 8, opacity: 0, scale: 0.98 }}><div className="modal-heading"><div><h3 id="modal-title">{title}</h3><p>{subtitle}</p></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></div>{children}</motion.div></motion.div>}</AnimatePresence>
}

function Assistant({ language }) {
  const [messages, setMessages] = useState([{ role: 'assistant', text: language === 'en' ? 'Namaste! I’m your Saathi. Ask me about your earnings, work, or where to find support. I’ll keep it simple.' : language === 'hi' ? 'नमस्ते! मैं आपका साथी हूँ। कमाई, काम या मदद के बारे में पूछें। मैं आसान भाषा में जवाब दूँगा।' : 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਸਾਥੀ ਹਾਂ। ਕਮਾਈ, ਕੰਮ ਜਾਂ ਮਦਦ ਬਾਰੇ ਪੁੱਛੋ। ਮੈਂ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਜਵਾਬ ਦੇਵਾਂਗਾ।' }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const send = async (text = input) => {
    const message = text.trim()
    if (!message || busy) return
    setInput('')
    setError('')
    setMessages((prev) => [...prev, { role: 'user', text: message }])
    setBusy(true)
    try {
      const answer = api.isDemo() ? { reply: demoReply[language], demo: true } : await api.chat(message, language)
      setMessages((prev) => [...prev, { role: 'assistant', text: answer.reply, demo: answer.demo }])
    } catch (problem) { setError(problem.message) } finally { setBusy(false) }
  }
  return <motion.div {...pageMotion} className="page-stack">
    <PageHeading eyebrow="A LITTLE HELP GOES A LONG WAY" title="AI Saathi" subtitle="A friendly place to ask work-life questions, in the language that feels like you." action={<div className="ai-status"><span /> HERE WITH YOU</div>} />
    <div className="assistant-layout"><Card className="chat-card"><div className="chat-top"><div className="saathi-avatar"><Sparkles size={19} /></div><div><strong>Your Saathi</strong><span><i /> Ready when you are</span></div><span className="chat-language">{language === 'hi' ? 'हिंदी' : language === 'pa' ? 'ਪੰਜਾਬੀ' : 'English'}</span></div>
      <div className="chat-messages" aria-live="polite">{messages.map((message, index) => <div key={`${index}-${message.role}`} className={`chat-message message-${message.role}`}><div className="message-avatar">{message.role === 'assistant' ? <Sparkles size={14} /> : 'A'}</div><div className="message-body"><p>{message.text}</p>{message.demo && <small className="reply-demo">General demo guidance · not legal advice</small>}</div></div>)}{busy && <div className="chat-message message-assistant"><div className="message-avatar"><Sparkles size={14} /></div><div className="typing-dots" aria-label="Saathi is thinking"><i /><i /><i /></div></div>}</div>
      {error && <div role="alert" className="chat-error">{error}</div>}
      {messages.length === 1 && <div className="suggestion-block"><span>NOT SURE WHERE TO START?</span><div>{suggestions.map(({ icon: name, title, prompt }) => { const Icon = name === 'Wallet' ? Wallet : name === 'ShieldCheck' ? ShieldCheck : FileText; return <button key={title} className="suggestion-chip" onClick={() => send(prompt)}><Icon size={15} /><span>{title}</span><ArrowRight size={13} /></button> })}</div></div>}
      <form className="chat-compose" onSubmit={(e) => { e.preventDefault(); send() }}><input aria-label="Your question" value={input} onChange={(e) => setInput(e.target.value)} placeholder={language === 'hi' ? 'यहाँ अपना सवाल लिखें…' : language === 'pa' ? 'ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ…' : 'Ask anything on your mind…'} maxLength={2000} /><button className="send-button" disabled={!input.trim() || busy} aria-label="Send message"><Send size={17} /></button></form><p className="chat-disclaimer"><ShieldCheck size={13} /> Helpful general information, not legal or financial advice.</p></Card>
      <div className="assistant-aside"><Card className="gentle-card"><span className="gentle-icon"><HeartHandshake size={19} /></span><span className="section-kicker">A LITTLE REMINDER</span><h3>You know your work best.</h3><p>I’m here to help you find information and think through next steps. You’re always in charge.</p><div className="gentle-divider" /><div className="gentle-foot"><Shield size={14} /> Your conversation is private to your account.</div></Card><Card className="help-resource"><span className="section-kicker">NEED URGENT HELP?</span><h3>You don’t have to handle it alone.</h3><a href="https://112.gov.in/" target="_blank" rel="noreferrer"><span className="resource-num">112</span><span><strong>Emergency response</strong><small>India-wide emergency number</small></span><ExternalLink size={14} /></a></Card></div>
    </div>
  </motion.div>
}

function Schemes() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const categories = ['All', ...new Set(schemes.map((scheme) => scheme.category))]
  const filtered = schemes.filter((scheme) => (category === 'All' || scheme.category === category) && `${scheme.name} ${scheme.description}`.toLowerCase().includes(query.toLowerCase()))
  return <motion.div {...pageMotion} className="page-stack"><PageHeading eyebrow="SUPPORT, FROM OFFICIAL SOURCES" title="Schemes & support" subtitle="A starting point for exploring government worker resources. Always confirm current details with the official portal." />
    <div className="notice-banner"><div className="notice-icon"><ShieldCheck size={17} /></div><div><strong>We link to official portals, not promises.</strong><span>Scheme rules and benefits can change. Check the official source before you apply or share personal information.</span></div></div>
    <div className="scheme-toolbar"><div className="search-field"><span>⌕</span><input aria-label="Search schemes" placeholder="Search schemes and support…" value={query} onChange={(e) => setQuery(e.target.value)} /></div><div className="filter-tabs scheme-filters">{categories.map((item) => <button className={category === item ? 'filter-active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
    <div className="scheme-grid">{filtered.map((scheme, index) => <motion.div key={scheme.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}><Card className="scheme-card"><div className="scheme-card-top"><div className={`scheme-symbol scheme-symbol-${index % 3}`}>{scheme.icon === 'workers' ? <HeartHandshake size={19} /> : scheme.icon === 'shield' ? <ShieldCheck size={19} /> : scheme.icon === 'vendors' ? <HandCoins size={19} /> : scheme.icon === 'skills' || scheme.icon === 'apprenticeship' ? <BriefcaseBusiness size={19} /> : <CircleHelp size={19} />}</div><span className="verified-tag"><CheckCircle2 size={12} /> OFFICIAL SOURCE</span></div><span className="scheme-category">{scheme.category}</span><h3>{scheme.name}</h3><p>{scheme.description}</p><div className="eligibility-note"><span>BEFORE YOU APPLY</span><p>{scheme.eligibility}</p></div><a className="scheme-url" href={scheme.url} target="_blank" rel="noreferrer">{new URL(scheme.url).hostname} <ExternalLink size={11} /></a><a className="button button-secondary scheme-link" href={scheme.url} target="_blank" rel="noreferrer">Visit official portal <ExternalLink size={14} /></a></Card></motion.div>)}</div>
    {!filtered.length && <Card><EmptyState icon={CircleHelp} title="No matches yet" text="Try another search or clear the category filter." /></Card>}
    <p className="scheme-disclaimer"><ShieldCheck size={14} /> KaamSaathi is not a government website and does not process applications.</p>
  </motion.div>
}

function Safety() {
  return <motion.div {...pageMotion} className="page-stack"><PageHeading eyebrow="LOOK OUT FOR YOURSELF" title="Safety & rights" subtitle="Practical reminders and trusted places to start. Your safety comes first." action={<a className="emergency-button" href="tel:112" aria-label="Call emergency number 112 from your phone"><Phone size={16} /> Call <strong>112</strong></a>} />
    <div className="safety-hero"><div className="safety-hero-text"><span className="section-kicker">YOUR WELLBEING MATTERS</span><h2>Getting home safe<br />is part of the job.</h2><p>A few small habits can help you stay safer on every shift.</p></div><div className="safety-illustration"><div className="safety-orbit orbit-one" /><div className="safety-orbit orbit-two" /><div className="safety-shield"><ShieldCheck size={43} /></div><span className="safety-spark spark-one">✳</span><span className="safety-spark spark-two">✳</span></div></div>
    <div className="safety-content-grid"><Card className="safety-tips"><div className="card-heading"><div><span className="section-kicker">SMALL HABITS, EVERY SHIFT</span><h3>A few good reminders</h3></div><span className="safety-checkmark"><Check size={16} /></span></div><div className="tip-list">{[['01', 'Let someone know your route', 'Share your shift details and expected arrival with a trusted person when you can.'], ['02', 'Take a pause when you need one', 'Rest, hydrate, and avoid riding or driving when you feel too tired.'], ['03', 'Keep a record of your work', 'Save payout statements, work messages, and records of any deductions.'], ['04', 'Trust your instincts', 'If a situation feels unsafe, move to a safer place and contact someone you trust.']].map(([number, title, text]) => <div className="tip-row" key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div></Card>
      <Card className="resource-card"><span className="section-kicker">TRUSTED PLACES TO START</span><h3>Keep these close</h3><div className="official-resource-list">{rightsResources.map((resource, index) => <a className="official-resource" key={resource.title} href={resource.url} target={resource.url.startsWith('http') ? '_blank' : undefined} rel={resource.url.startsWith('http') ? 'noreferrer' : undefined}><span className={`official-icon official-${index}`}>{index === 0 ? <Phone size={17} /> : index === 1 ? <HeartHandshake size={17} /> : <Shield size={17} />}</span><span><strong>{resource.title}</strong><small>{resource.detail}</small><em>{resource.label} {resource.url.startsWith('http') ? <ExternalLink size={11} /> : <Phone size={11} />}</em></span><ArrowUpRight className="resource-arrow" size={15} /></a>)}</div><div className="resource-caution"><CircleHelp size={14} /> For case-specific advice, speak to a qualified local professional.</div></Card></div>
    <div className="rights-note"><ShieldCheck size={16} /><span><strong>Information, not a legal verdict.</strong> Workplace protections and processes depend on your situation and current local rules. For tailored guidance, contact your state labour department or legal-aid provider.</span></div>
  </motion.div>
}

function Documents({ language }) {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState('')
  const [demo, setDemo] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const chooseFile = async (file) => {
    if (!file) return
    if (!/\.(txt|md)$/i.test(file.name) || file.size > 100000) { setError('For now, choose a plain text (.txt or .md) file under 100 KB.'); return }
    setError('')
    setResult('')
    setFileName(file.name)
    setText(await file.text())
  }
  const explain = async () => {
    setBusy(true); setError(''); setResult('')
    try {
      const response = api.isDemo()
        ? { reply: `DEMO EXPLANATION\n\nYour document has ${text.trim().split(/\s+/).length} words. This demo can’t analyze its meaning yet. Review dates, payment amounts, deductions, and any actions requested. Never share sensitive documents with someone you do not trust. Configure Gemini in the backend for AI explanations.`, demo: true }
        : await api.explainDocument(text, language)
      setResult(response.reply); setDemo(response.demo)
    } catch (problem) { setError(problem.message) } finally { setBusy(false) }
  }
  return <motion.div {...pageMotion} className="page-stack"><PageHeading eyebrow="MAKE THE FINE PRINT FEEL SMALLER" title="Document assistant" subtitle="Get a plain-language starting point for a document. You stay in control of what you share." />
    <div className="document-notice"><ShieldCheck size={17} /><span><strong>Private by choice.</strong> Only text you submit is sent to the configured AI service. Remove account numbers and personal IDs first.</span></div>
    <div className="document-grid"><Card className="document-input-card"><div className="card-heading"><div><span className="section-kicker">YOUR DOCUMENT</span><h3>Let’s look at it together</h3></div><div className="document-file-icon"><FileText size={18} /></div></div><label className="upload-drop" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); chooseFile(e.dataTransfer.files[0]) }}><input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={(e) => chooseFile(e.target.files[0])} /><span className="upload-icon"><Upload size={19} /></span><strong>{fileName || 'Choose a file, or drop it here'}</strong><small>Plain text files only · .txt or .md · under 100 KB</small></label><div className="or-divider"><span>OR PASTE TEXT</span></div><textarea className="document-textarea" value={text} onChange={(e) => { setText(e.target.value); setResult(''); setFileName('') }} maxLength={12000} placeholder="Paste the part you’d like help understanding…" /><div className="textarea-foot"><span>Keep personal ID and bank details private.</span><span>{text.length.toLocaleString()} / 12,000</span></div>{error && <div className="inline-error" role="alert">{error}</div>}<button disabled={busy || text.trim().length < 20} className="button button-primary explain-button" onClick={explain}>{busy ? 'Reading carefully…' : 'Explain this document'}<Sparkles size={15} /></button></Card>
      <Card className="document-result-card"><div className="card-heading"><div><span className="section-kicker">A CLEARER PICTURE</span><h3>Simple explanation</h3></div><span className="result-sparkle"><Sparkles size={17} /></span></div>{result ? <div className="explanation-result"><div className="explanation-label"><CheckCircle2 size={14} /> {demo ? 'DEMO RESPONSE' : 'READY FOR YOU'}</div><div className="explanation-text">{result}</div><div className="explanation-caution"><CircleHelp size={15} /> This is a helpful starting point, not legal or financial advice. Check important details with a qualified person.</div></div> : <div className="document-placeholder"><span className="placeholder-stack"><FileText size={25} /><Sparkles size={14} /></span><strong>Your explanation will appear here</strong><p>Dates, payments, deductions, and next steps — in clearer language.</p></div>}</Card></div>
  </motion.div>
}

function Complaints() {
  const [drafts, setDrafts] = useState([])
  const [form, setForm] = useState({ id: '', title: '', issue: 'Missing payment', recipient: '', amount: '', details: '' })
  const [error, setError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [generated, setGenerated] = useState(false)
  const refresh = useCallback(() => api.listComplaints().then(setDrafts).catch((problem) => setError(problem.message)), [])
  useEffect(() => { refresh() }, [refresh])
  const makeDraft = () => {
    if (!form.recipient.trim() || form.details.trim().length < 8) { setError('Add who this is for and a few details, so your letter has enough context.'); return }
    const amountLine = form.amount ? `The amount involved is ₹${Number(form.amount).toLocaleString('en-IN')}.` : ''
    const body = `To,\n${form.recipient.trim()}\n\nSubject: Request for assistance regarding ${form.issue.toLowerCase()}\n\nDear Sir/Madam,\n\nI am writing to request your help regarding ${form.issue.toLowerCase()} related to my work. ${form.details.trim()}${amountLine ? ` ${amountLine}` : ''}\n\nI request that you kindly review this matter and share the outcome or next steps with me. I can provide relevant records, such as payout statements, work messages, or dates, if needed.\n\nThank you for your time and consideration.\n\nYours sincerely,\n[Your name]\n[Your contact details]\n[Date]`
    setForm((current) => ({ ...current, title: current.title || `${current.issue} — ${current.recipient}` }))
    setGenerated(body)
    setError('')
  }
  const save = async () => {
    if (!generated) return
    setBusy(true); setError(''); setSavedMessage('')
    try {
      const saved = await api.saveComplaint({ id: form.id || undefined, title: form.title.trim() || `${form.issue} — ${form.recipient}`, body: generated })
      setForm((current) => ({ ...current, id: saved.id }))
      setSavedMessage('Your draft is saved.')
      await refresh()
    } catch (problem) { setError(problem.message) } finally { setBusy(false) }
  }
  const openDraft = (draft) => { setForm({ id: draft.id, title: draft.title, issue: 'Workplace concern', recipient: '', amount: '', details: '' }); setGenerated(draft.body); setSavedMessage('') }
  const download = () => {
    const blob = new Blob([`${form.title || 'Complaint draft'}\n\n${generated}`], { type: 'text/plain;charset=utf-8' })
    const anchor = document.createElement('a')
    anchor.href = URL.createObjectURL(blob); anchor.download = 'kaamsaathi-complaint-draft.txt'; anchor.click(); URL.revokeObjectURL(anchor.href)
  }
  const clear = () => { setForm({ id: '', title: '', issue: 'Missing payment', recipient: '', amount: '', details: '' }); setGenerated(false); setSavedMessage('') }
  const removeDraft = async (event, id) => {
    event.stopPropagation()
    if (!window.confirm('Delete this saved draft?')) return
    try { await api.deleteComplaint(id); if (form.id === id) clear(); await refresh() } catch (problem) { setError(problem.message) }
  }
  return <motion.div {...pageMotion} className="page-stack"><PageHeading eyebrow="YOUR WORDS, WITH A LITTLE STRUCTURE" title="Complaint letter helper" subtitle="Put your concern into a clear, respectful letter. Review every detail before sending it." action={<span className="draft-count"><FileCheck2 size={14} /> {drafts.length} saved {drafts.length === 1 ? 'draft' : 'drafts'}</span>} />
    <div className="complaint-layout"><div className="complaint-editor"><Card className="complaint-form-card"><div className="card-heading"><div><span className="section-kicker">FIRST, THE BASICS</span><h3>What would you like to address?</h3></div><div className="complaint-form-icon"><FileText size={18} /></div></div><div className="modal-form"><label>Type of concern<select value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value, id: '' })}>{['Missing payment', 'Unfair deduction', 'Account deactivation', 'Workplace safety', 'Other work concern'].map((issue) => <option key={issue}>{issue}</option>)}</select></label><label>Who is the letter for?<input value={form.recipient} maxLength={100} onChange={(e) => setForm({ ...form, recipient: e.target.value, id: '' })} placeholder="e.g. Platform support team" /></label><label>Amount involved <span className="optional-label">optional</span><div className="amount-input-wrap"><span>₹</span><input type="number" min="0" max="10000000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value, id: '' })} placeholder="0" /></div></label><label>What happened?<textarea rows="4" maxLength={1500} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value, id: '' })} placeholder="Share the facts: dates, what happened, and any steps you have already taken." /></label><button className="button button-primary" onClick={makeDraft}><Sparkles size={15} /> Create a letter draft</button></div></Card><div className="complaint-tip"><ShieldCheck size={15} /><span>Stick to facts you can verify. You can edit every word before saving or sharing.</span></div>
      {drafts.length > 0 && <Card className="saved-drafts"><div className="card-heading"><div><span className="section-kicker">PICK UP WHERE YOU LEFT OFF</span><h3>Your saved drafts</h3></div></div>{drafts.map((draft) => <div key={draft.id} className="saved-draft-row"><button className="saved-draft-open" onClick={() => openDraft(draft)}><span className="saved-draft-icon"><FileText size={16} /></span><span><strong>{draft.title}</strong><small>{new Date(draft.updatedAt).toLocaleDateString('en-IN')}</small></span></button><button className="icon-button" aria-label={`Delete ${draft.title}`} onClick={(e) => removeDraft(e, draft.id)}><Trash2 size={14} /></button></div>)}</Card>}
    </div><Card className="letter-preview-card"><div className="card-heading"><div><span className="section-kicker">YOUR LETTER, READY TO REVIEW</span><h3>Draft preview</h3></div>{generated && <button className="icon-button" aria-label="Start a new draft" onClick={clear}><Plus size={17} /></button>}</div>{error && <div className="inline-error" role="alert">{error}</div>}{generated ? <><input className="letter-title-input" aria-label="Draft title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><textarea className="letter-body" aria-label="Edit your letter" value={generated} onChange={(e) => setGenerated(e.target.value)} /><div className="letter-actions"><button className="button button-secondary" onClick={download}><Download size={15} /> Download</button><button className="button button-primary" disabled={busy} onClick={save}>{busy ? 'Saving…' : form.id ? 'Update draft' : 'Save draft'}<Check size={15} /></button></div>{savedMessage && <div className="saved-confirm"><CheckCircle2 size={15} /> {savedMessage}</div>}</> : <div className="letter-empty"><span><FileCheck2 size={23} /></span><strong>A clear first draft, whenever you’re ready.</strong><p>Tell us what happened and we’ll help organize the details into a letter you can edit.</p><div className="letter-steps"><span><i>1</i> Share the basics</span><span><i>2</i> Review together</span><span><i>3</i> Save or download</span></div></div>}</Card></div>
    <div className="rights-note"><CircleHelp size={16} /><span><strong>A helpful starting point, not legal advice.</strong> Check that all facts are accurate and seek qualified local help for advice about your situation.</span></div>
  </motion.div>
}

export default App
