import api from './client';

export const fetchDashboardAnalytics = () => api.get('/analytics/dashboard/');