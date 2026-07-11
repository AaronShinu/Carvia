import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './LandingPage.css'
import FeatureShowcase from '../components/FeatureShowcase'
import TiltCard from '../components/TiltCard'
import FloatingShapes from '../components/FloatingShapes'
import { useEffect, useState } from 'react'
import CursorGlow from '../components/CursorGlow'
import GradientMesh from '../components/GradientMesh'
import CompanyGlobe from '../components/CompanyGlobe'

function AnimatedHeadline({ text }) {
    const words = text.split(' ')
    return (
        <h1 className="hero-headline">
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    className="headline-word"
                    initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: 'easeOut' }}
                >
                    {word}{i < words.length - 1 ? '\u00A0' : ''}
                </motion.span>
            ))}
        </h1>
    )
}

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="landing">
            <div className="hero-section-wrapper">
                <div className="hero-bg-wrapper">
                    <GradientMesh />
                </div>
                <nav className={`landing-nav ${scrolled ? 'landing-nav-scrolled' : ''}`}>
                    <div className="landing-logo">
                        <span className="landing-logo-mark">C</span>
                        <span className="landing-logo-text">Carvia</span>
                    </div>
                    <div className="landing-nav-actions">
                        <Link to="/login" className="landing-nav-link">Log in</Link>
                        <Link to="/register" className="btn-primary">Get Started</Link>
                    </div>
                </nav>

                <section className="hero">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <motion.span
                            className="hero-eyebrow"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Built for graduates, by a graduate.
                        </motion.span>

                        <AnimatedHeadline text="The journey to your careers and success." />

                        <p className="hero-subtext">
                            Stop tracking job applications across five different spreadsheets.
                            Carvia brings every application, interview, and deadline into one
                            clean, centralised dashboard.
                        </p>

                        <div className="hero-actions">
                            <Link to="/register" className="btn-primary btn-large">
                                Start tracking for free
                            </Link>
                            <Link to="/login" className="btn-secondary btn-large">
                                Log in
                            </Link>
                        </div>

                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    >
                        <div className="hero-visual-glow" />
                        <TiltCard className="hero-visual-card hero-card-1" maxTilt={14}>
                            <div className="mini-badge mini-badge-success">Offer</div>
                            <span className="mini-title">Software Engineer</span>
                            <span className="mini-subtitle">Meta</span>
                        </TiltCard>
                        <TiltCard className="hero-visual-card hero-card-2" maxTilt={14}>
                            <div className="mini-badge mini-badge-warning">Interview</div>
                            <span className="mini-title">Technology Analyst</span>
                            <span className="mini-subtitle">Goldman Sachs</span>
                        </TiltCard>
                        <TiltCard className="hero-visual-card hero-card-3" maxTilt={14}>
                            <div className="mini-badge mini-badge-info">Applied</div>
                            <span className="mini-title">Product Manager</span>
                            <span className="mini-subtitle">Stripe</span>
                        </TiltCard>
                    </motion.div>
                </section>
            </div>
            <section className="problem-section">
                <motion.div
                    className="problem-content"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <h2 className="problem-headline">
                        Job hunting shouldn't mean<br />juggling five different tools.
                    </h2>
                    <p className="problem-subtext">
                        A spreadsheet for applications. Notion for interview notes.
                        Your inbox for deadlines. Somewhere, a CV you can't find.
                        There's a better way.
                    </p>
                </motion.div>
            </section>
            <FeatureShowcase />
            <section className="globe-section">
                <motion.div
                    className="globe-content"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <h2>Wherever the opportunity is, track it.</h2>
                    <p>Applications made to companies across every major hiring hub — all in one centralised dashboard.</p>
                    <div className="globe-wrapper">
                        <CompanyGlobe />
                    </div>
                </motion.div>
            </section>
            <section className="stats-section">
                <div className="stats-grid">
                    {[
                        { value: 'Unlimited', label: 'Applications tracked' },
                        { value: '4', label: 'Core tools, one dashboard' },
                        { value: 'Auto', label: 'Calendar sync on scheduling' },
                        { value: 'AI', label: 'Powered CV feedback' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.value}
                            className="stat-block"
                            initial={{ opacity: 0, scale: 0.7, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.45, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                        >
                            <span className="stat-block-value">{stat.value}</span>
                            <span className="stat-block-label">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="final-cta">
                <motion.div
                    className="final-cta-content"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <h2>Ready to take control of your job search?</h2>
                    <p>Join Carvia and turn application chaos into a clear, trackable process.</p>
                    <Link to="/register" className="btn-primary btn-large">
                        Get started for free
                    </Link>
                </motion.div>
            </section>

            <footer className="landing-footer">
                <div className="landing-footer-content">
                    <div className="landing-footer-brand">
                        <div className="landing-logo">
                            <span className="landing-logo-mark">C</span>
                            <span className="landing-logo-text">Carvia</span>
                        </div>
                        <p className="landing-footer-tagline">
                            The way to careers and success.<br />
                            Built to help you land the job.
                        </p>
                    </div>
                    <div className="landing-footer-links">
                        <Link to="/register" className="landing-footer-link">Get Started</Link>
                        <Link to="/login" className="landing-footer-link">Log in</Link>
                    </div>
                </div>
                <div className="landing-footer-bottom">
                    © 2026 Carvia. Built as a personal project.
                </div>
            </footer>
        </div>
    )
}