import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { listDocuments, uploadDocument, deleteDocument } from '../api/documents'
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

    const loadDocuments = () => {
        listDocuments()
            .then(({ data }) => setDocuments(data.results || data))
            .catch(() => setError('Could not load documents.'))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        loadDocuments()
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

    if (isLoading) return <p className="loading-text">Loading documents...</p>

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
                            placeholder="e.g. Tech CV "
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
                        <input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx" />
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
                    {documents.map((doc, index) => (
                        <motion.div
                            key={doc.id}
                            className="document-card"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                        >
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
                            <button className="btn-danger btn-small" onClick={() => handleDelete(doc.id)}>
                                Delete
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}