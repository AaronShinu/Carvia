import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listApplications } from "../api/applications";
import './ApplicationsPage.css'

export default function ApplicationsPage() {
    const [ applications, setApplications ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)  
    const [ error, setError ] = useState('')

    useEffect(() => {
        listApplications()
            .then(({ data }) => {
                setApplications(data.results || data)
            })
            .catch(() => setError('Failed to fetch applications. Please try again later.'))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) return <p>Loading applications...</p>
    if (error) return <p className="error-text">{error}</p>

    return (
        <div>
            <div className="page-header">
                <h1>Applications</h1>
            </div>

            {applications.length === 0 ? (
                <p className="empty-state">No applications yet, Add your first one to begin your career journey!</p>
            ) : (
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
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td>{app.company_name}</td>
                                <td>
                                    <Link to={`/applications/${app.id}`}>{app.job_title}</Link>    
                                </td>
                                <td>
                                    <span className={`status-badge status-${app.job_status}`}>
                                        {app.job_status_display}
                                    </span>
                                </td>
                                <td>{app.application_deadline || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>    
    )
}