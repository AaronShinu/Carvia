import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { confirmPasswordReset } from '../api/auth'
import { parseAPIError } from '../utils/parseAPIError'
import './AuthPage.css'

export default function ResetPasswordPage() {
    const { uid, token } = useParams()
    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setIsSubmitting(true)
        try {
            await confirmPasswordReset(uid, token, newPassword)
            setSuccess(true)
        } catch (err) {
            setError(parseAPIError(err, 'This reset link is invalid or has expired.'))
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
                        Set a new<br />password.
                    </h1>
                    <p className="auth-brand-subtext">
                        Choose a strong password you haven't used before.
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
                    {success ? (
                        <>
                            <h2>Password updated</h2>
                            <p className="auth-form-subtitle">
                                Your password has been reset successfully. You can now log in with your new password.
                            </p>
                            <Link to="/login" className="btn-primary btn-full" style={{ textAlign: 'center', display: 'block' }}>
                                Go to login
                            </Link>
                        </>
                    ) : (
                        <>
                            <h2>Set a new password</h2>
                            <p className="auth-form-subtitle">Enter and confirm your new password below.</p>

                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="form-row">
                                    <label>New password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        autoFocus
                                    />
                                </div>

                                <div className="form-row">
                                    <label>Confirm new password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
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
                                    {isSubmitting ? 'Updating...' : 'Update password'}
                                </motion.button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    )
}