import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import './AuthPage.css'
import { parseAPIError } from '../utils/parseAPIError'

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
            navigate('/app')
        } catch (err) {
            setError(parseAPIError(err, "Couldn't log in. Please check your credentials and try again."))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-brand-panel">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="auth-brand-logo">Carvia</div>
                    <h1 className="auth-brand-headline">
                        Your way to careers<br />and success.
                    </h1>
                    <p className="auth-brand-subtext">
                        Track every application, interview, and deadline in one place —
                        built for students who are done with spreadsheets.
                    </p>
                </motion.div>
            </div>

            <div className="auth-form-panel">
                <motion.div
                    className="auth-form-wrapper"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
                >
                    <h2>Welcome back</h2>
                    <p className="auth-form-subtitle">Log in to continue tracking your applications.</p>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-row">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-row">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
                        </div>

                        {error && (
                            <motion.p
                                className="error-text"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            type="submit"
                            className="btn-primary btn-full"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSubmitting ? 'Logging in...' : 'Log in'}
                        </motion.button>
                    </form>

                    <p className="auth-switch">
                        New to Carvia? <Link to="/register">Create an account</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}