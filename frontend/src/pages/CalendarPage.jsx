import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCalendarEvents, deleteCalendarEvent } from '../api/calendar'
import { formatDateTime } from '../utils/formatDate'
import './CalendarPage.css'
import { motion } from 'framer-motion'

export default function CalendarPage() {
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const loadEvents = () => {
        listCalendarEvents()
            .then(({ data }) => {
                const list = data.results || data
                setEvents([...list].sort((a, b) => new Date(a.start_time) - new Date(b.start_time)))
            })
            .catch(() => setError('Could not load calendar events.'))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        loadEvents()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return
        try {
            await deleteCalendarEvent(id)
            loadEvents()
        } catch (err) {
            setError('Could not delete event.')
        }
    }

    if (isLoading) return <p className="loading-text">Loading calendar...</p>
    if (error) return <p className="error-text">{error}</p>

    const now = new Date()
    const upcoming = events.filter((e) => new Date(e.start_time) >= now)
    const past = events.filter((e) => new Date(e.start_time) < now)

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Calendar</h1>
                    <p className="page-subtitle">
                        {upcoming.length} upcoming {upcoming.length === 1 ? 'event' : 'events'}
                    </p>
                </div>
                <Link to="/calendar/new" className="btn-primary">
                    New Event
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="empty-state">
                    <p>No events scheduled yet.</p>
                    <Link to="/calendar/new" className="btn-primary">Add your first event</Link>
                </div>
            ) : (
                <>
                    <div className="event-section">
                        <h2 className="event-section-title">Upcoming</h2>
                        {upcoming.length === 0 ? (
                            <p className="empty-state-small">No upcoming events.</p>
                        ) : (
                            <div className="event-list">
                                {upcoming.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        className="event-card"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                                    >
                                        <div className={`event-type-marker event-type-${event.event_type.toLowerCase()}`} />
                                        <div className="event-info">
                                            <span className="event-title">{event.title}</span>
                                            <span className="event-time">{formatDateTime(event.start_time)}</span>
                                            {event.location && <span className="event-location">{event.location}</span>}
                                        </div>
                                        <span className={`event-type-badge event-type-${event.event_type.toLowerCase()}`}>
                                            {event.event_type_display}
                                        </span>
                                        <button className="btn-danger btn-small" onClick={() => handleDelete(event.id)}>
                                            Delete
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {past.length > 0 && (
                        <div className="event-section">
                            <h2 className="event-section-title">Past</h2>
                            <div className="event-list">
                                {past.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        className="event-card event-card-past"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                                    >
                                        <div className={`event-type-marker event-type-${event.event_type}`} />
                                        <div className="event-info">
                                            <span className="event-title">{event.title}</span>
                                            <span className="event-time">{formatDateTime(event.start_time)}</span>
                                        </div>
                                        <span className={`event-type-badge event-type-${event.event_type}`}>
                                            {event.event_type_display}
                                        </span>
                                        <button className="btn-danger btn-small" onClick={() => handleDelete(event.id)}>
                                            Delete
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}