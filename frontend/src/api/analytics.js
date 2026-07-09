import api from './client'

export const fetchDashboardSummary = () => api.get('/analytics/dashboard/')