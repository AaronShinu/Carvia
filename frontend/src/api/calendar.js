import api from './client'

export const listCalendarEvents = (params) => api.get('/calendar/calendar_events/', { params })
export const getCalendarEvent = (id) => api.get(`/calendar/calendar_events/${id}/`)
export const createCalendarEvent = (data) => api.post('/calendar/calendar_events/', data)
export const updateCalendarEvent = (id, data) => api.patch(`/calendar/calendar_events/${id}/`, data)
export const deleteCalendarEvent = (id) => api.delete(`/calendar/calendar_events/${id}/`)