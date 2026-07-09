import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import './DashboardLayout.css'

const NAV_ITEMS = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/applications', label: 'Applications' },
    { to: '/calendar', label: 'Calendar' },
    { to: '/documents', label: 'Documents' },
    ]

    export default function DashboardLayout() {
    const { user, logout } = useAuth()
    const location = useLocation()

    const initials = (user?.first_name?.[0] || user?.email?.[0] || '?').toUpperCase()

    return (
        <div className="layout">
        <aside className="sidebar">
            <div className="sidebar-brand">Carvia</div>

            <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
                <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                {item.label}
                </NavLink>
            ))}
            </nav>

            <div className="sidebar-footer">
            <div className="sidebar-user">
                <div className="sidebar-avatar">{initials}</div>
                <div className="sidebar-user-info">
                <span className="sidebar-user-name">
                    {user?.first_name || 'Account'}
                </span>
                <span className="sidebar-user-email">{user?.email}</span>
                </div>
            </div>
            <motion.button
                className="logout-button"
                onClick={logout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
            >
                Log out
            </motion.button>
            </div>
        </aside>

        <main className="content">
            <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            >
            <Outlet />
            </motion.div>
        </main>
        </div>
    )
    }