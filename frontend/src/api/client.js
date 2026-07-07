import axios from 'axios';

const api = axios.create({
    baseURL: '/api', 
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('carvia_access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}) 

let isRefreshing = false
let pendingRequests = []

const processQueue = (error, token = null) => {
    pendingRequests.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error)
        } else {
            resolve(token)
        }
    })
    pendingRequests = []
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingRequests.push({ resolve, reject })
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                return api(originalRequest)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        const refreshToken = localStorage.getItem('carvia_refresh_token')

        try {
            const { data } = await axios.post('/api/auth/login/refresh/', { refresh: refreshToken, })
            localStorage.setItem('carvia_access_token', data.access)
            processQueue(null, data.access)
            originalRequest.headers.Authorization = `Bearer ${data.access}`
            return api(originalRequest)
        } catch (refreshError) {
            processQueue(refreshError, null)
            localStorage.removeItem('carvia_access_token')
            localStorage.removeItem('carvia_refresh_token')
            window.location.href = '/login'
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    }
    return Promise.reject(error)
})

export default api