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
    },
    {
        tag: 'Interview Stages',
        title: 'Never lose track of a stage again.',
        description: 'Log phone screens, assessments, and final rounds against each application, and mark them passed, failed, or pending as you go.',
        accent: '#f59e0b',
        accentLight: '#fffbeb',
    },
    {
        tag: 'Calendar',
        title: 'Your interviews, automatically synced.',
        description: 'Scheduling an interview stage instantly creates a matching calendar event — deadlines and interviews live in one place.',
        accent: '#10b981',
        accentLight: '#ecfdf5',
    },
    {
        tag: 'AI CV Feedback',
        title: 'Get your CV reviewed in seconds.',
        description: 'Upload your CV and get instant, structured feedback — strengths, improvement areas, and keyword suggestions powered by AI.',
        accent: '#ec4899',
        accentLight: '#fdf2f8',
    },
]

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
                    <div
                        className="feature-visual-card"
                        style={{ background: feature.accentLight, borderColor: feature.accent }}
                    >
                        <div className="feature-visual-dot" style={{ background: feature.accent }} />
                        <div className="feature-visual-bar" style={{ background: feature.accent, width: '70%' }} />
                        <div className="feature-visual-bar" style={{ background: feature.accent, width: '45%', opacity: 0.5 }} />
                        <div className="feature-visual-bar" style={{ background: feature.accent, width: '60%', opacity: 0.3 }} />
                    </div>
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