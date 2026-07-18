import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { requestPasswordReset } from '../api/auth'
import { parseAPIError } from '../utils/parseAPIError'
import './AuthPage.css'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)
        try {
            await requestPasswordReset(email)
            setSubmitted(true)
        } catch (err) {
            setError(parseAPIError(err, 'Could not send reset email. Please try again.'))
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
                        Forgot your<br />password?
                    </h1>
                    <p className="auth-brand-subtext">
                        No problem — we'll send you a link to set a new one.
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
                    {submitted ? (
                        <>
                            <h2>Check your email</h2>
                            <p className="auth-form-subtitle">
                                If an account exists for that email, we've sent a link to reset your password.
                            </p>
                            <Link to="/login" className="auth-switch">Back to login</Link>
                        </>
                    ) : (
                        <>
                            <h2>Reset your password</h2>
                            <p className="auth-form-subtitle">Enter your email and we'll send you a reset link.</p>

                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="form-row">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                {error && <p className="error-text">{error}</p>}

                                <motion.button
                                    type="submit"
                                    className="btn-primary btn-full"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send reset link'}
                                </motion.button>
                            </form>

                            <p className="auth-switch">
                                Remember your password? <Link to="/login">Log in</Link>
                            </p>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    )
}