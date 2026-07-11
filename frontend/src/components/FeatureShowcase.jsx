import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './FeatureShowcase.css'

const FEATURES = [
    {
        tag: 'Applications',
        title: 'Every application, one dashboard.',
        description: 'Track company, role, status, deadline and notes for every job you apply to — no more scrolling through spreadsheet columns.',
        accent: '#4f46e5',
        accentLight: '#eef2ff',
        mockup: 'applications',
    },
    {
        tag: 'Interview Stages',
        title: 'Never lose track of a stage again.',
        description: 'Log phone screens, assessments, and final rounds against each application, and mark them passed, failed, or pending as you go.',
        accent: '#f59e0b',
        accentLight: '#fffbeb',
        mockup: 'stages',
    },
    {
        tag: 'Calendar',
        title: 'Your interviews, automatically synced.',
        description: 'Scheduling an interview stage instantly creates a matching calendar event — deadlines and interviews live in one place.',
        accent: '#10b981',
        accentLight: '#ecfdf5',
        mockup: 'calendar',
    },
    {
        tag: 'AI CV Feedback',
        title: 'Get your CV reviewed in seconds.',
        description: 'Upload your CV and get instant, structured feedback — strengths, improvement areas, and keyword suggestions powered by AI.',
        accent: '#ec4899',
        accentLight: '#fdf2f8',
        mockup: 'feedback',
    },
]

function ApplicationsMockup() {
    const rows = [
        { company: 'Meta', role: 'Software Engineer', status: 'Offer', badge: 'success' },
        { company: 'Goldman Sachs', role: 'Tech Analyst', status: 'Interview', badge: 'warning' },
        { company: 'Stripe', role: 'Product Manager', status: 'Applied', badge: 'info' },
    ]
    return (
        <div className="mockup-window">
            <div className="mockup-titlebar" />
            {rows.map((r) => (
                <div key={r.company} className="mockup-table-row">
                    <span className="mockup-cell mockup-cell-strong">{r.company}</span>
                    <span className="mockup-cell mockup-cell-muted">{r.role}</span>
                    <span className={`mockup-badge mockup-badge-${r.badge}`}>{r.status}</span>
                </div>
            ))}
        </div>
    )
}

function StagesMockup() {
    const stages = [
        { name: 'Phone Screen', state: 'Passed', badge: 'success' },
        { name: 'Technical Interview', state: 'Passed', badge: 'success' },
        { name: 'Final Round', state: 'Pending', badge: 'warning' },
    ]
    return (
        <div className="mockup-window">
            <div className="mockup-titlebar" />
            {stages.map((s) => (
                <div key={s.name} className="mockup-stage-row">
                    <div className="mockup-stage-dot" />
                    <span className="mockup-cell mockup-cell-strong">{s.name}</span>
                    <span className={`mockup-badge mockup-badge-${s.badge}`}>{s.state}</span>
                </div>
            ))}
        </div>
    )
}

function CalendarMockup() {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    const highlighted = [3, 12]
    return (
        <div className="mockup-window">
            <div className="mockup-titlebar" />
            <div className="mockup-calendar-grid">
                {days.map((d, i) => <span key={i} className="mockup-calendar-head">{d}</span>)}
                {Array.from({ length: 14 }).map((_, i) => (
                    <span
                        key={i}
                        className={`mockup-calendar-cell ${highlighted.includes(i) ? 'mockup-calendar-cell-active' : ''}`}
                    >
                        {i + 1}
                    </span>
                ))}
            </div>
        </div>
    )
}

function FeedbackMockup() {
    return (
        <div className="mockup-window">
            <div className="mockup-titlebar" />
            <div className="mockup-feedback-score">
                <div className="mockup-score-ring">
                    <span>87</span>
                </div>
                <div className="mockup-feedback-list">
                    <div className="mockup-feedback-item">✓ Strong action verbs</div>
                    <div className="mockup-feedback-item">✓ Clear formatting</div>
                    <div className="mockup-feedback-item mockup-feedback-item-muted">△ Add metrics to bullet 3</div>
                </div>
            </div>
        </div>
    )
}

const MOCKUPS = {
    applications: ApplicationsMockup,
    stages: StagesMockup,
    calendar: CalendarMockup,
    feedback: FeedbackMockup,
}

function FeatureRow({ feature, index }) {
    const ref = useRef(null)
    const isEven = index % 2 === 0

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    })

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.9])
    const blur = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [8, 0, 0, 6])
    const filter = useTransform(blur, (v) => `blur(${v}px)`)

    const textX = useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        isEven ? [-60, 0, 0, -30] : [60, 0, 0, 30]
    )
    const visualX = useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        isEven ? [60, 0, 0, 30] : [-60, 0, 0, -30]
    )

    const Mockup = MOCKUPS[feature.mockup]

    return (
        <div ref={ref} className="feature-row-wrapper">
            <div
                className="feature-row-glow"
                style={{ background: `radial-gradient(circle, ${feature.accent}22 0%, transparent 70%)` }}
            />
            <motion.div
                className={`feature-row ${isEven ? '' : 'feature-row-reverse'}`}
                style={{ opacity, scale, filter }}
            >
                <motion.div className="feature-text" style={{ x: textX }}>
                    <span className="feature-number-bg" style={{ color: feature.accentLight }}>
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="feature-tag" style={{ background: feature.accentLight, color: feature.accent }}>
                        {feature.tag}
                    </span>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                </motion.div>

                <motion.div className="feature-visual" style={{ x: visualX }}>
                    <Mockup />
                </motion.div>
            </motion.div>
        </div>
    )
}

export default function FeatureShowcase() {
    return (
        <section className="feature-showcase">
            <div className="feature-showcase-header">
                <h2>Built to actually get you hired.</h2>
            </div>
            {FEATURES.map((feature, index) => (
                <FeatureRow key={feature.tag} feature={feature} index={index} />
            ))}
        </section>
    )
}