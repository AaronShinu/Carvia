import { createContext, useContext, useEffect, useState } from 'react'
import { fetchMe, loginUser, logoutUser } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('carvia_access_token')
        if (!token) {
            setIsLoading(false)
            return
        }
        fetchMe()
            .then(({ data }) => setUser(data))
            .catch(() => {
                localStorage.removeItem('carvia_access_token')
                localStorage.removeItem('carvia_refresh_token')
                setUser(null)
            })
            .finally(() => setIsLoading(false))
    }, [])

    const login = async (email, password) => {
        const { data } = await loginUser({ email, password })
        if (!data.access || !data.refresh) {
            throw new Error('Login response missing tokens.')
        }
        localStorage.setItem('carvia_access_token', data.access)
        localStorage.setItem('carvia_refresh_token', data.refresh)
        const { data: profile } = await fetchMe()
        setUser(profile)
        return profile
    }

    const logout = async () => {
        const refresh = localStorage.getItem('carvia_refresh_token')
        try {
            if (refresh) await logoutUser(refresh)
        } finally {
            localStorage.removeItem('carvia_access_token')
            localStorage.removeItem('carvia_refresh_token')
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}