import api from './client';

export const registerUser = (data) => api.post('/auth/register/', data);
export const loginUser = (data) => api.post('/auth/login/', data);
export const fetchMe = () => api.get('/auth/me/');
export const updateMe = (data) => api.patch('/auth/me/', data);
export const logoutUser = () => api.post('/auth/logout/', { refresh: localStorage.getItem('carvia_refresh_token') });