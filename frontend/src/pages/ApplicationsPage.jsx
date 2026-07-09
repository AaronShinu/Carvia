import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { listApplications } from '../api/applications'
import { formatDate } from '../utils/formatDate'
import './ApplicationsPage.css'

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        listApplications()
        .then(({ data }) => {
            setApplications(data.results || data)
        })
        .catch(() => setError('Could not load applications.'))
        .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) return <p className="loading-text">Loading applications...</p>
    if (error) return <p className="error-text">{error}</p>

    return (
        <div>
        <div className="page-header">
            <div>
            <h1>Applications</h1>
            <p className="page-subtitle">
                {applications.length} {applications.length === 1 ? 'application' : 'applications'} tracked
            </p>
            </div>
            <Link to="/applications/new" className="btn-primary">
            New Application
            </Link>
        </div>

        {applications.length === 0 ? (
            <div className="empty-state">
            <p>No applications yet.</p>
            <Link to="/applications/new" className="btn-primary">Add your first one</Link>
            </div>
        ) : (
            <div className="table-wrapper">
            <table className="applications-table">
                <thead>
                <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Deadline</th>
                </tr>
                </thead>
                <tbody>
                {applications.map((app, index) => (
                    <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04, ease: 'easeOut' }}
                    >
                    <td className="company-cell">{app.company_name}</td>
                    <td>
                        <Link to={`/applications/${app.id}`} className="role-link">
                        {app.job_title}
                        </Link>
                    </td>
                    <td>
                        <span className={`status-badge status-${app.job_status}`}>
                        {app.job_status_display}
                        </span>
                    </td>
                    <td className="deadline-cell">
                        {formatDate(app.application_deadline) || '—'}
                    </td>
                    </motion.tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    )
    }