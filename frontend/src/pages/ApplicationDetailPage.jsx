import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getApplication, deleteApplication, createInterviewStage } from '../api/applications'
import './ApplicationDetailPage.css'
import { formatDate, formatDateTime } from '../utils/formatDate'
import { STATUS_OPTIONS } from '../utils/statusOptions'
import { updateApplication } from '../api/applications'


const STAGE_TYPE_OPTIONS = [
    ['phone_screen', 'Phone Screen'],
    ['online_assessment', 'Online Assessment'],
    ['video_interview', 'Video Interview'],
    ['assessment_centre', 'Assessment Centre'],
    ['technical_interview', 'Technical Interview'],
    ['hr_interview', 'HR Interview'],
    ['final_interview', 'Final Interview'],
    ['offer_call', 'Offer Call'],
    ['other', 'Other'],
]

export default function ApplicationDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [application, setApplication] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [showStageForm, setShowStageForm] = useState(false)
    const [stageForm, setStageForm] = useState({
        stage_phase: 'phone_screen',
        scheduled_date: '',
        link_or_location: '',
        interviewer: '',
    })
    const [isAddingStage, setIsAddingStage] = useState(false)

    const loadApplication = () => {
        getApplication(id)
        .then(({ data }) => setApplication(data))
        .catch(() => setError('Could not load this application.'))
        .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        loadApplication()
    }, [id])

    const handleDelete = async () => {
        if (!window.confirm('Delete this application? This cannot be undone.')) return
        try {
        await deleteApplication(id)
        navigate('/applications')
        } catch (err) {
        setError('Could not delete this application.')
        }
    }

    const handleStageChange = (e) => {
        setStageForm({ ...stageForm, [e.target.name]: e.target.value })
    }

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value
        try {
            const { data } = await updateApplication(id, { job_status: newStatus })
            setApplication(data)
        } catch (err) {
            setError('Could not update application status.')
        }
    }

    const handleAddStage = async (e) => {
        e.preventDefault()
        setIsAddingStage(true)
        try {
        const payload = {
            ...stageForm,
            application: id,
            scheduled_date: stageForm.scheduled_date ?
            new Date(stageForm.scheduled_date).toISOString() : null,
        }
        await createInterviewStage(payload)
        setStageForm({ stage_phase: 'phone_screen', scheduled_date: '', link_or_location: '', interviewer: '' })
        setShowStageForm(false)
        loadApplication()
        } catch (err) {
        setError('Could not add interview stage.')
        } finally {
        setIsAddingStage(false)
        }
    }

    if (isLoading) return <p>Loading...</p>
    if (error) return <p className="error-text">{error}</p>
    if (!application) return null

    return (
        <div className="detail-page">
        <div className="detail-header">
            <div>
            <h1>{application.job_title}</h1>
            <p className="detail-subtitle">{application.company_name}</p>
            </div>
            <div className="detail-actions">
            <select
                className={`status-select  status-${application.job_status}`}
                value ={application.job_status}
                onChange={handleStatusChange}
            >   
                {STATUS_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
            <Link to={`/applications/${id}/edit`} className="btn-secondary">Edit</Link>
            <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </div>
        </div>

        <div className="detail-grid">
            <div className="detail-card">
            <h3>Details</h3>
            <dl>
                <dt>Location</dt>
                <dd>{application.job_location || '—'}</dd>
                <dt>Work Type</dt>
                <dd>{application.work_type}</dd>
                <dt>Job URL</dt>
                <dd>
                {application.job_url ? (
                    <a href={application.job_url} target="_blank" rel="noreferrer">View posting</a>
                ) : '—'}
                </dd>
                <dt>Application Deadline</dt>
                <dd>{formatDate(application.application_deadline) || '—'}</dd>
                <dt>Date Applied</dt>
                <dd>{formatDate(application.applied_date) || '—'}</dd>
            </dl>
            </div>

            <div className="detail-card">
            <h3>Notes</h3>
            <p className="notes-text">{application.job_notes || 'No notes added yet.'}</p>
            </div>
        </div>

        <div className="detail-card">
            <div className="stage-header">
            <h3>Interview Stages</h3>
            <button className="btn-secondary" onClick={() => setShowStageForm(!showStageForm)}>
                {showStageForm ? 'Cancel' : '+ Add Stage'}
            </button>
            </div>

            {showStageForm && (
            <form onSubmit={handleAddStage} className="stage-form">
                <div className="form-row-group">
                <div className="form-row">
                    <label>Stage Type</label>
                    <select name="stage_phase" value={stageForm.stage_phase} onChange={handleStageChange}>
                    {STAGE_TYPE_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                    </select>
                </div>
                <div className="form-row">
                    <label>Scheduled Date/Time</label>
                    <input type="datetime-local" name="scheduled_date" value={stageForm.scheduled_date} onChange={handleStageChange} />
                </div>
                </div>
                <div className="form-row-group">
                <div className="form-row">
                    <label>Location / Link</label>
                    <input name="link_or_location" value={stageForm.link_or_location} onChange={handleStageChange} />
                </div>
                <div className="form-row">
                    <label>Interviewer</label>
                    <input name="interviewer" value={stageForm.interviewer} onChange={handleStageChange} />
                </div>
                </div>
                <button type="submit" className="btn-primary" disabled={isAddingStage}>
                {isAddingStage ? 'Adding...' : 'Add Stage'}
                </button>
            </form>
            )}

            {application.interview_stages && application.interview_stages.length > 0 ? (
            <ul className="stage-list">
                {application.interview_stages.map((stage) => (
                <li key={stage.id} className="stage-item">
                    <span className="stage-type">{stage.stage_phase_display}</span>
                    <span className="stage-date">
                    {stage.scheduled_date
                        ? formatDateTime(stage.scheduled_date)
                        : 'Not scheduled'}
                    </span>
                    <span className={`stage-status ${stage.completed ? 'completed' : 'pending'}`}>
                    {stage.completed ? 'Completed' : 'Pending'}
                    </span>
                </li>
                ))}
            </ul>
            ) : (
            !showStageForm && <p className="empty-state-small">No interview stages yet.</p>
            )}
        </div>
        </div>
    )
    }