import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { registerUser } from '../api/auth'
import './AuthPage.css'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        email: '', username: '', first_name: '', last_name: '',
        password: '', confirm_password: '',
        university: '', course: '', graduation_year: '',
    })
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
        await registerUser(form)
        navigate('/login')
        } catch (err) {
        setError('Could not create account. Check your details and try again.')
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
                Stop juggling<br />spreadsheets.
            </h1>
            <p className="auth-brand-subtext">
                Join students already tracking every application, interview stage,
                and deadline in one clean dashboard.
            </p>
            </motion.div>
        </div>

        <div className="auth-form-panel">
            <motion.div
            className="auth-form-wrapper auth-form-wrapper-wide"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            >
            <h2>Create your account</h2>
            <p className="auth-form-subtitle">Start tracking your applications in minutes.</p>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-row-group">
                <div className="form-row">
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-row">
                    <label>Username</label>
                    <input name="username" value={form.username} onChange={handleChange} required />
                </div>
                </div>

                <div className="form-row-group">
                <div className="form-row">
                    <label>First name</label>
                    <input name="first_name" value={form.first_name} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Last name</label>
                    <input name="last_name" value={form.last_name} onChange={handleChange} />
                </div>
                </div>

                <div className="form-row-group">
                <div className="form-row">
                    <label>University</label>
                    <input name="university" value={form.university} onChange={handleChange} />
                </div>
                <div className="form-row">
                    <label>Course</label>
                    <input name="course" value={form.course} onChange={handleChange} />
                </div>
                </div>

                <div className="form-row">
                <label>Graduation year</label>
                <input type="number" name="graduation_year" value={form.graduation_year} onChange={handleChange} />
                </div>

                <div className="form-row-group">
                <div className="form-row">
                    <label>Password</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required />
                </div>
                <div className="form-row">
                    <label>Confirm password</label>
                    <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} required />
                </div>
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
                {isSubmitting ? 'Creating account...' : 'Sign up'}
                </motion.button>
            </form>

            <p className="auth-switch">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
            </motion.div>
        </div>
        </div>
    )
    }