import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createApplication, getApplication, updateApplication } from '../api/applications'
import './ApplicationForm.css'
import { motion } from 'framer-motion'
import { parseAPIError } from '../utils/parseAPIError'

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
    ['accepted', 'Accepted'],
]

const WORK_TYPE_OPTIONS = [
    ['graduate_scheme', 'Graduate Scheme'],
    ['internship', 'Internship'],
    ['full_time', 'Full Time'],
    ['part_time', 'Part Time'],
]

const EMPTY_FORM = {
    company_name: '',
    job_title: '',
    job_url: '',
    job_location: '',
    work_type: 'graduate_scheme',
    job_status: 'not_applied',
    application_deadline: '',
    applied_date: '',
    job_notes: '',
}

export default function NewApplicationPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditMode = Boolean(id)

    const [form, setForm] = useState(EMPTY_FORM)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(isEditMode)

    useEffect(() => {
        if (!isEditMode) return

        getApplication(id)
            .then(({ data }) => {
                setForm({
                    company_name: data.company_name || '',
                    job_title: data.job_title || '',
                    job_url: data.job_url || '',
                    job_location: data.job_location || '',
                    work_type: data.work_type || 'graduate_scheme',
                    job_status: data.job_status || 'not_applied',
                    application_deadline: data.application_deadline || '',
                    applied_date: data.applied_date || '',
                    job_notes: data.job_notes || '',
                })
            })
            .catch(() => setError('Could not load this application.'))
            .finally(() => setIsLoading(false))
    }, [id, isEditMode])

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
            if (isEditMode) {
                await updateApplication(id, payload)
                navigate(`/applications/${id}`)
            } else {
                await createApplication(payload)
                navigate('/applications')
            }
        } catch (err) {
            setError(parseAPIError(err, "Couldn't save application. Please check your input and try again."))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return <p>Loading...</p>

    return (
        <div className="form-page">
            <h1>{isEditMode ? 'Edit Application' : 'New Application'}</h1>
            <motion.form
                onSubmit={handleSubmit}
                className="application-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <div className="form-row">
                    <label>Company Name</label>
                    <input name="company_name" value={form.company_name} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <label>Job Title</label>
                    <input name="job_title" value={form.job_title} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <label>Job URL</label>
                    <input name="job_url" value={form.job_url} onChange={handleChange} />
                </div>

                <div className="form-row">
                    <label>Location</label>
                    <input name="job_location" value={form.job_location} onChange={handleChange} />
                </div>

                <div className="form-row-group">
                    <div className="form-row">
                        <label>Work Type</label>
                        <select name="work_type" value={form.work_type} onChange={handleChange}>
                            {WORK_TYPE_OPTIONS.map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <label>Status</label>
                        <select name="job_status" value={form.job_status} onChange={handleChange}>
                            {STATUS_OPTIONS.map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row-group">
                    <div className="form-row">
                        <label>Application Deadline</label>
                        <input type="date" name="application_deadline" value={form.application_deadline} onChange={handleChange} />
                    </div>

                    <div className="form-row">
                        <label>Date Applied</label>
                        <input type="date" name="applied_date" value={form.applied_date} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <label>Notes</label>
                    <textarea name="job_notes" value={form.job_notes} onChange={handleChange} rows={4} />
                </div>

                {error && <p className="error-text">{error}</p>}

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate(isEditMode ? `/applications/${id}` : '/applications')}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Application'}
                    </motion.button>
                </div>
            </motion.form>
        </div>
    )
}