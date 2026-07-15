import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { listDocuments, uploadDocument, deleteDocument, requestCvFeedback, getCvFeedback } from '../api/documents'
import { formatDate } from '../utils/formatDate'
import './DocumentPage.css'

const DOCUMENT_TYPE_OPTIONS = [
    ['cv', 'Resume / CV'],
    ['cover_letter', 'Cover Letter'],
    ['transcript', 'Transcript'],
    ['other', 'Other'],
]

export default function DocumentsPage() {
    const [documents, setDocuments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [uploadForm, setUploadForm] = useState({ title: '', document_type: 'cv' })
    const fileInputRef = useRef(null)

    const [feedbackByDoc, setFeedbackByDoc] = useState({})
    const pollingRefs = useRef({})

    const loadDocuments = () => {
        listDocuments()
            .then(({ data }) => setDocuments(data.results || data))
            .catch(() => setError('Could not load documents.'))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        loadDocuments()
        return () => {
            Object.values(pollingRefs.current).forEach(clearInterval)
        }
    }, [])

    const handleUpload = async (e) => {
        e.preventDefault()
        const file = fileInputRef.current?.files?.[0]
        if (!file) {
            setError('Please choose a file to upload.')
            return
        }

        setError('')
        setIsUploading(true)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', uploadForm.title || file.name)
        formData.append('document_type', uploadForm.document_type)

        try {
            await uploadDocument(formData)
            setUploadForm({ title: '', document_type: 'cv' })
            if (fileInputRef.current) fileInputRef.current.value = ''
            loadDocuments()
        } catch (err) {
            setError('Could not upload document.')
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this document?')) return
        try {
            await deleteDocument(id)
            loadDocuments()
        } catch (err) {
            setError('Could not delete document.')
        }
    }

    const pollFeedback = (documentId, feedbackId) => {
        if (pollingRefs.current[documentId]) {
            clearInterval(pollingRefs.current[documentId])
        }

        const interval = setInterval(async () => {
            try {
                const { data } = await getCvFeedback(feedbackId)
                setFeedbackByDoc((prev) => ({ ...prev, [documentId]: data }))

                if (data.feedback_status === 'completed' || data.feedback_status === 'failed') {
                    clearInterval(pollingRefs.current[documentId])
                    delete pollingRefs.current[documentId]
                }
            } catch (err) {
                clearInterval(pollingRefs.current[documentId])
                delete pollingRefs.current[documentId]
            }
        }, 3000)

        pollingRefs.current[documentId] = interval
    }

    const handleRequestFeedback = async (documentId) => {
        try {
            const { data } = await requestCvFeedback(documentId)
            setFeedbackByDoc((prev) => ({ ...prev, [documentId]: data }))
            pollFeedback(documentId, data.id)
        } catch (err) {
            setError('Could not request AI feedback.')
        }
    }

    if (isLoading) return <p className="loading-text">Loading documents...</p>

    function getScoreColor(score) {
        if (score >= 80) return '#10b981'
        if (score >= 60) return '#f59e0b'
        if (score >= 40) return '#f97316'
        return '#ef4444'
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Documents</h1>
                    <p className="page-subtitle">
                        {documents.length} {documents.length === 1 ? 'document' : 'documents'} stored
                    </p>
                </div>
            </div>

            <motion.form
                onSubmit={handleUpload}
                className="upload-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <h3>Upload a document</h3>
                <div className="upload-row">
                    <div className="form-row">
                        <label>Title</label>
                        <input
                            placeholder="e.g. Tech CV v2"
                            value={uploadForm.title}
                            onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        />
                    </div>
                    <div className="form-row">
                        <label>Type</label>
                        <select
                            value={uploadForm.document_type}
                            onChange={(e) => setUploadForm({ ...uploadForm, document_type: e.target.value })}
                        >
                            {DOCUMENT_TYPE_OPTIONS.map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row">
                        <label>File</label>
                        <input type="file" ref={fileInputRef} accept=".pdf,.docx" />
                    </div>
                </div>
                {error && <p className="error-text">{error}</p>}
                <motion.button
                    type="submit"
                    className="btn-primary"
                    disabled={isUploading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </motion.button>
            </motion.form>

            {documents.length === 0 ? (
                <p className="empty-state-small">No documents uploaded yet.</p>
            ) : (
                <div className="document-list">
                    {documents.map((doc, index) => {
                        const feedback = feedbackByDoc[doc.id]
                        return (
                            <motion.div
                                key={doc.id}
                                className="document-card-wrapper"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                            >
                                <div className="document-card">
                                    <div className="document-icon">📄</div>
                                    <div className="document-info">
                                        <span className="document-title">{doc.title}</span>
                                        <span className="document-meta">
                                            {doc.document_type_display} · {formatDate(doc.updated_at)}
                                            {doc.file_size ? ` · ${Math.round(doc.file_size / 1024)} KB` : ''}
                                        </span>
                                    </div>
                                    <a href={doc.file} target="_blank" rel="noreferrer" className="btn-secondary btn-small">
                                        View
                                    </a>
                                    {doc.document_type === 'cv' && (
                                        !feedback || feedback.feedback_status === 'failed' ? (
                                            <button
                                                className="btn-primary btn-small"
                                                onClick={() => handleRequestFeedback(doc.id)}
                                            >
                                                {feedback?.feedback_status === 'failed' ? 'Retry Feedback' : 'Get AI Feedback'}
                                            </button>
                                        ) : feedback.feedback_status === 'completed' ? (
                                            <span className="feedback-score-badge">Score: {feedback.feedback_score}</span>
                                        ) : (
                                            <span className="feedback-pending-badge">
                                                {feedback.feedback_status === 'processing' ? 'Analysing...' : 'Feedback pending'}
                                            </span>
                                        )
                                    )}
                                    <button className="btn-danger btn-small" onClick={() => handleDelete(doc.id)}>
                                        Delete
                                    </button>
                                </div>

                                {feedback?.feedback_status === 'failed' && (
                                    <div className="feedback-error-panel">
                                        Feedback failed: {feedback.error_message || 'Unknown error.'}
                                    </div>
                                )}

                                {feedback?.feedback_status === 'completed' && (
                                    <motion.div
                                        className="feedback-results-panel"
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, ease: 'easeOut' }}
                                    >
                                        <div
                                            className="feedback-score-ring"
                                            style={{
                                                background: `conic-gradient(${getScoreColor(feedback.feedback_score)} ${feedback.feedback_score * 3.6}deg, var(--color-primary-light) 0deg)`,
                                            }}
                                        >
                                            <span>{feedback.feedback_score}</span>
                                            <br></br>
                                        </div>

                                        <div className="feedback-results-grid">
                                            <div className="feedback-column">
                                                <h4 className="feedback-column-title feedback-column-title-good">Strengths</h4>
                                                <ul>
                                                    {feedback.cv_strengths.map((s, i) => <li key={i}>{s}</li>)}
                                                </ul>
                                            </div>
                                            <div className="feedback-column">
                                                <h4 className="feedback-column-title feedback-column-title-warn">Improvement Areas</h4>
                                                {feedback.cv_improvements.length === 0 ? (
                                                    <p className="feedback-empty-note">No major improvements suggested.</p>
                                                ) : (
                                                    <ul>
                                                        {feedback.cv_improvements.map((s, i) => <li key={i}>{s}</li>)}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>

                                        {feedback.keyword_suggestions?.length > 0 && (
                                            <div className="feedback-keywords">
                                                <h4 className="feedback-column-title">Suggested Keywords</h4>
                                                <div className="feedback-keyword-tags">
                                                    {feedback.keyword_suggestions.map((k, i) => (
                                                        <span key={i} className="feedback-keyword-tag">{k}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}