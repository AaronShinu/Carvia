import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { listApplications } from '../api/applications'
import { formatDate } from '../utils/formatDate'
import './ApplicationsPage.css'

const STATUS_OPTIONS = [
    ['', 'All statuses'],
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
    ['', 'All types'],
    ['graduate_scheme', 'Graduate Scheme'],
    ['internship', 'Internship'],
    ['full_time', 'Full Time'],
    ['part_time', 'Part Time'],
]

const SORT_OPTIONS = [
    ['-updated_at', 'Recently updated'],
    ['-applied_date', 'Date applied (newest)'],
    ['applied_date', 'Date applied (oldest)'],
    ['application_deadline', 'Deadline (soonest)'],
    ['-application_deadline', 'Deadline (latest)'],
]

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [error, setError] = useState('')
    const [nextPageUrl, setNextPageUrl] = useState(null)
    const [totalCount, setTotalCount] = useState(0)

    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [workTypeFilter, setWorkTypeFilter] = useState('')
    const [ordering, setOrdering] = useState('-updated_at')

    const observerTarget = useRef(null)

    // Debounce search input -> actual search value used in API calls
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput)
        }, 400)
        return () => clearTimeout(timeout)
    }, [searchInput])

    const buildParams = useCallback(() => {
        const params = { ordering }
        if (search) params.search = search
        if (statusFilter) params.job_status = statusFilter
        if (workTypeFilter) params.work_type = workTypeFilter
        return params
    }, [search, statusFilter, workTypeFilter, ordering])

    // Initial load + reload whenever filters/search/sort change
    useEffect(() => {
        setIsLoading(true)
        setError('')
        listApplications(buildParams())
            .then(({ data }) => {
                setApplications(data.results || data)
                setNextPageUrl(data.next || null)
                setTotalCount(data.count ?? (data.results || data).length)
            })
            .catch(() => setError('Could not load applications.'))
            .finally(() => setIsLoading(false))
    }, [buildParams])

    const loadMore = useCallback(() => {
        if (!nextPageUrl || isLoadingMore) return
        setIsLoadingMore(true)

        const url = new URL(nextPageUrl)
        const page = url.searchParams.get('page')
        const params = { ...buildParams(), page }

        listApplications(params)
            .then(({ data }) => {
                setApplications((prev) => [...prev, ...(data.results || [])])
                setNextPageUrl(data.next || null)
            })
            .catch(() => setError('Could not load more applications.'))
            .finally(() => setIsLoadingMore(false))
    }, [nextPageUrl, isLoadingMore, buildParams])

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const target = observerTarget.current
        if (!target) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore()
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(target)
        return () => observer.disconnect()
    }, [loadMore])

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Applications</h1>
                    <p className="page-subtitle">
                        {totalCount} {totalCount === 1 ? 'application' : 'applications'} tracked
                    </p>
                </div>
                <Link to="/applications/new" className="btn-primary">
                    New Application
                </Link>
            </div>

            <div className="filters-bar">
                <input
                    type="text"
                    placeholder="Search company or role..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="filter-search-input"
                />

                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                    {STATUS_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                <select value={workTypeFilter} onChange={(e) => setWorkTypeFilter(e.target.value)} className="filter-select">
                    {WORK_TYPE_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                <select value={ordering} onChange={(e) => setOrdering(e.target.value)} className="filter-select">
                    {SORT_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <p className="loading-text">Loading applications...</p>
            ) : error ? (
                <p className="error-text">{error}</p>
            ) : applications.length === 0 ? (
                <div className="empty-state">
                    <p>No applications match your filters.</p>
                </div>
            ) : (
                <>
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
                                        transition={{ duration: 0.3, delay: Math.min(index, 15) * 0.03, ease: 'easeOut' }}
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

                    <div ref={observerTarget} className="scroll-sentinel">
                        {isLoadingMore && <p className="loading-text">Loading more...</p>}
                        {!nextPageUrl && applications.length > 0 && (
                            <p className="end-of-list-text">You've reached the end.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}