import api from './client'

export const listDocuments = (params) => api.get('/documents/', { params })
export const deleteDocument = (id) => api.delete(`/documents/${id}/`)

export const uploadDocument = (formData) =>
    api.post('/documents/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

export const requestCvFeedback = (documentId) =>
    api.post(`/documents/${documentId}/request-cv-feedback/`)

export const listCvFeedback = () => api.get('/documents/feedback-cv/')

export const getCvFeedback = (feedbackId) => api.get(`/documents/feedback-cv/${feedbackId}/`)