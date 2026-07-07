import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)
        try {
        await login(form.email, form.password)
        navigate('/')
        } catch (err) {
        setError('Invalid email or password.')
        } finally {
        setIsSubmitting(false)
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '80px auto', padding: '2rem' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Welcome back to Carvia</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
            <label>Email</label>
            <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
            </div>
            <div>
            <label>Password</label>
            <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
            </div>
            {error && <p style={{ color: '#dc2626' }}>{error}</p>}
            <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>
        </form>
        <p style={{ marginTop: '1rem' }}>
            New to Carvia? <Link to="/register">Create an account</Link>
        </p>
        </div>
    )
}