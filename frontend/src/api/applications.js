import api from './client';

export const listApplications = (params) => api.get('/applications/', { params });
export const getApplication = (id) => api.get(`/applications/${id}/`);
export const createApplication = (data) => api.post('/applications/', data);
export const updateApplication = (id, data) => api.patch(`/applications/${id}/`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}/`);

export const createInterviewStage = (data) => api.post('/applications/interview-stages/', data)
export const updateInterviewStage = (id, data) => api.patch(`/applications/interview-stages/${id}/`, data)
export const deleteInterviewStage = (id) => api.delete(`/applications/interview-stages/${id}/`)