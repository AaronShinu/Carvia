import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCalendarEvent } from '../api/calendar'
import { listApplications } from '../api/applications'
import './ApplicationForm.css'
import { motion } from 'framer-motion'

const EVENT_TYPE_OPTIONS = [
    ['DEADLINE', 'Application Deadline'],
    ['INTERVIEW', 'Interview'],
    ['ASSESSMENT', 'Online Assessment'],
    ['REMINDER', 'Custom Reminder'],
    ['OTHER', 'Other'],
]

export default function NewEventPage() {
    const navigate = useNavigate()
    const [applications, setApplications] = useState([])
    const [form, setForm] = useState({
        title: '',
        event_type: 'OTHER',
        start_time: '',
        end_time: '',
        all_day: false,
        application: '',
        location: '',
        notes: '',
    })
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        listApplications()
            .then(({ data }) => setApplications(data.results || data))
            .catch(() => { })
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)
        try {
            const payload = {
                ...form,
                start_time: form.start_time ? new Date(form.start_time).toISOString() : null,
                end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
                application: form.application || null,
            }
            await createCalendarEvent(payload)
            navigate('/calendar')
        } catch (err) {
            setError('Could not create event. Check the fields and try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="form-page">
            <h1>New Event</h1>
            <motion.form
                onSubmit={handleSubmit}
                className="application-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <div className="form-row">
                    <label>Title</label>
                    <input name="title" value={form.title} onChange={handleChange} required />
                </div>

                <div className="form-row-group">
                    <div className="form-row">
                        <label>Event Type</label>
                        <select name="event_type" value={form.event_type} onChange={handleChange}>
                            {EVENT_TYPE_OPTIONS.map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <label>Linked Application (optional)</label>
                        <select name="application" value={form.application} onChange={handleChange}>
                            <option value="">None</option>
                            {applications.map((app) => (
                                <option key={app.id} value={app.id}>
                                    {app.company_name} — {app.job_title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row-group">
                    <div className="form-row">
                        <label>Start Time</label>
                        <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <label>End Time (optional)</label>
                        <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <label>Location / Link</label>
                    <input name="location" value={form.location} onChange={handleChange} />
                </div>

                <div className="form-row">
                    <label>Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} />
                </div>

                {error && <p className="error-text">{error}</p>}

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/calendar')} className="btn-secondary">
                        Cancel
                    </button>
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Event'}
                    </motion.button>    
                </div>
            </motion.form>
        </div>
    )
}