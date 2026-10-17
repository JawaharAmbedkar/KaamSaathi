import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const money = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export default function DashboardChart({ data }) {
  return (
    <div className="dashboard-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: -14 }}>
          <defs>
            <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#80dfa9" stopOpacity={0.2} /><stop offset="100%" stopColor="#80dfa9" stopOpacity={0} /></linearGradient>
            <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#eebc70" stopOpacity={0.12} /><stop offset="100%" stopColor="#eebc70" stopOpacity={0} /></linearGradient>
          </defs>
          <CartesianGrid stroke="#27322d" strokeDasharray="3 5" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#78867d', fontSize: 11 }} dy={9} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78867d', fontSize: 10 }} tickFormatter={(value) => value ? `₹${value / 1000}k` : '₹0'} />
          <Tooltip contentStyle={{ background: '#17201b', border: '1px solid #303d35', borderRadius: 12, color: '#fff', fontSize: 12 }} formatter={(value) => [money(value)]} />
          <Area type="monotone" dataKey="income" name="Earned" stroke="#80dfa9" strokeWidth={2.4} fill="url(#incomeFill)" />
          <Area type="monotone" dataKey="expense" name="Spent" stroke="#e8b76c" strokeWidth={2} fill="url(#expenseFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
