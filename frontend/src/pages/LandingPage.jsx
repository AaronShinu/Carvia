import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './LandingPage.css'
import FeatureShowcase from '../components/FeatureShowcase'
import TiltCard from '../components/TiltCard'
import FloatingShapes from '../components/FloatingShapes'

export default function LandingPage() {
    return (
        <div className="landing">
            <nav className="landing-nav">
                <div className="landing-logo">Carvia</div>
                <div className="landing-nav-actions">
                    <Link to="/login" className="landing-nav-link">Log in</Link>
                    <Link to="/register" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            <section className="hero">
                <FloatingShapes />
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

                    <h1 className="hero-headline">
                        The way to<br />careers and success.
                    </h1>

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
        </div>
    )
}