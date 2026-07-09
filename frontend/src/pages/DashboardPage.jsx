import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts'
import { fetchDashboardSummary } from '../api/analytics'
import './DashboardPage.css'

const STATUS_COLORS = {
    bookmarked: '#9ca3af',
    not_applied: '#d1d5db',
    applied: '#3b82f6',
    online_assessment: '#0ea5e9',
    hirevue: '#06b6d4',
    interview: '#f59e0b',
    offer: '#10b981',
    accepted: '#22c55e',
    rejected: '#ef4444',
    withdrawn: '#6b7280',
}

const STAT_CARDS = [
    { key: 'total_applications', label: 'Total Applications' },
    { key: 'total_interviews', label: 'Interviews' },
    { key: 'total_offers', label: 'Offers' },
    { key: 'response_rate', label: 'Response Rate', suffix: '%' },
]

export default function DashboardPage() {
    const [summary, setSummary] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchDashboardSummary()
            .then(({ data }) => setSummary(data))
            .catch(() => setError('Could not load dashboard data.'))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) return <p className="loading-text">Loading dashboard...</p>
    if (error) return <p className="error-text">{error}</p>
    if (!summary) return null

    const weeklyData = (summary.applications_per_week || []).map((item) => ({
        week: new Date(item.week).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        count: item.count,
    }))

    const formatStatusLabel = (status) =>
        status
            .replace(/_/g, ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

    const pieData = Object.entries(summary.status_breakdown || {}).map(([status, count]) => ({
        name: formatStatusLabel(status),
        value: count,
        color: STATUS_COLORS[status] || '#9ca3af',
    }))

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p className="page-subtitle">Your job search at a glance</p>
                </div>
            </div>

            <div className="stat-grid">
                {STAT_CARDS.map((card, index) => (
                    <motion.div
                        key={card.key}
                        className="stat-card"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.06, ease: 'easeOut' }}
                    >
                        <span className="stat-value">
                            {summary[card.key] ?? 0}{card.suffix || ''}
                        </span>
                        <span className="stat-label">{card.label}</span>
                    </motion.div>
                ))}
            </div>

            <div className="chart-grid">
                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
                >
                    <h3>Applications per week</h3>
                    {weeklyData.length === 0 ? (
                        <p className="empty-state-small">Not enough data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={weeklyData}>
                                <CartesianGrid stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#4f46e5"
                                    strokeWidth={2.5}
                                    dot={{ fill: '#4f46e5', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>

                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.28, ease: 'easeOut' }}
                >
                    <h3>Status breakdown</h3>
                    {pieData.length === 0 ? (
                        <p className="empty-state-small">Not enough data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="42%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={90}
                                    paddingAngle={3}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '0.8rem', color: '#374151' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>
            </div>
        </div>
    )
}