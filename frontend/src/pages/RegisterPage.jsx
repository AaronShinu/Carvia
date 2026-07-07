import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'

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
        <div style={{ maxWidth: 400, margin: '80px auto', padding: '2rem' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Create your Carvia account</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div>
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} required
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div>
            <label>First name</label>
            <input name="first_name" value={form.first_name} onChange={handleChange}
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div>
            <label>Last name</label>
            <input name="last_name" value={form.last_name} onChange={handleChange}
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div>
            <label>University</label>
            <input name="university" value={form.university} onChange={handleChange}
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div>
            <label>Course</label>
            <input name="course" value={form.course} onChange={handleChange}
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div>
            <label>Graduation year</label>
            <input type="number" name="graduation_year" value={form.graduation_year} onChange={handleChange}
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div>
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div>
            <label>Confirm password</label>
            <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} required
                style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            {error && <p style={{ color: '#dc2626' }}>{error}</p>}
            <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
            </button>
        </form>
        <p style={{ marginTop: '1rem' }}>
            Already have an account? <Link to="/login">Log in</Link>
        </p>
        </div>
    )
}