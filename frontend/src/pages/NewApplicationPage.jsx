import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createApplication } from "../api/applications"
import './ApplicationForm.css'

const STATUS_OPTIONS = [
    ['bookmarked', 'Bookmarked'],
    ['not_applied', 'Not Applied'],
    ['applied', 'Applied'],
    ['online_assessment', 'Online Assessment'],
    ['hirevue', 'HireVue'],
    ['interview', 'Interview'],
    ['offer', 'Offer'],
    ['rejected', 'Rejected'],
    ['withdrawn', 'Withdrawn'],
    ['accepted', 'Accepted']
]

const WORK_TYPE_OPTIONS = [
    ['graduate_scheme', 'Graduate Scheme'],
    ['internship', 'Internship'],
    ['full_time', 'Full Time'],
    ['part_time', 'Part Time'],
]

export default function NewApplicationPage() {
    const navigate = useNavigate() 
    const [ form, setForm ] = useState({ 
        company_name: '',
        job_title: '',
        job_url: '',
        job_location: '',
        work_type: 'graduate_scheme',
        job_status: 'not_applied',
        application_deadline: '',
        applied_date: '',
        job_notes: '',
    }) 
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => { 
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault() 
        setError('')
        setIsSubmitting(true)
        try {
            const payload = { 
                ...form,
                application_deadline: form.application_deadline || null,
                applied_date: form.applied_date || null,
            }
            await createApplication(payload)
            navigate('/applications')
        } catch (err) {
            setError('An error occurred while creating the application.')
        } finally {
            setIsSubmitting(false) 
        }
    }

        return (
            <div className="form-page">
                <h1>New Application</h1>
                <form onSubmit={handleSubmit} className="application-form">
                    <div className="form-row">
                        <label>Company Name</label>
                        <input name="company_name" value={form.company_name} onChange={handleChange}/>
                    </div>

                    <div className="form-row">
                        <label>Job Title</label>
                        <input name="job_title" value={form.job_title} onChange={handleChange}/>
                    </div>

                    <div className="form-row">
                        <label>Job URL</label>
                        <input name="job_url" value={form.job_url} onChange={handleChange}/>
                    </div>

                    <div className="form-row">
                        <label>Job Location</label>
                        <input name="job_location" value={form.job_location} onChange={handleChange}/>
                    </div>

                    <div className="form-row">
                        <label>Work Type</label>
                        <select name="work_type" value={form.work_type} onChange={handleChange}>
                            {WORK_TYPE_OPTIONS.map(([value, label]) => ( 
                                <option key={value} value={value}>{label}</option> 
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <label>Job Status</label>
                        <select name="job_status" value={form.job_status} onChange={handleChange}>
                            {STATUS_OPTIONS.map(([value, label]) => ( 
                                <option key={value} value={value}>{label}</option> 
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <label>Application Deadline</label>
                        <input type="date" name="application_deadline" value={form.application_deadline} onChange={handleChange}/>
                    </div>

                    <div className="form-row">
                        <label>Date Applied</label>
                        <input type="date" name="applied_date" value={form.applied_date} onChange={handleChange}/>
                    </div>

                    <div className="form-row">
                        <label>Job Notes</label>
                        <textarea name="job_notes" value={form.job_notes} onChange={handleChange} rows={4}/>
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/applications')} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Application'}
                        </button>
                    </div>
                </form>
            </div>
    )
}