import { motion } from 'framer-motion'
import './FloatingShapes.css'

const SHAPES = [
    { size: 60, color: '#f59e0b', top: '4%', left: '40%', duration: 18, shape: 'square', depth: -30 },
    { size: 45, color: '#4f46e5', top: '78%', left: '40%', duration: 14, shape: 'circle', depth: 40 },
    { size: 55, color: '#ec4899', top: '88%', left: '46%', duration: 16, shape: 'triangle', depth: -50 },
    { size: 70, color: '#10b981', top: '8%', left: '82%', duration: 22, shape: 'circle', depth: 60 },
    { size: 50, color: '#3b82f6', top: '55%', left: '3%', duration: 20, shape: 'square', depth: 20 },
]

export default function FloatingShapes() {
    return (
        <div className="floating-shapes">
            {SHAPES.map((s, i) => (
                <motion.div
                    key={i}
                    className={`floating-shape floating-shape-${s.shape}`}
                    style={{
                        width: s.size,
                        height: s.size,
                        top: s.top,
                        left: s.left,
                        background: s.shape !== 'triangle' ? `${s.color}26` : 'transparent',
                        borderColor: `${s.color}55`,
                        transform: `translateZ(${s.depth}px)`,
                    }}
                    animate={{
                        y: [0, -24, 0],
                        rotate: [0, 12, -8, 0],
                    }}
                    transition={{
                        duration: s.duration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    {s.shape === 'triangle' && (
                        <div className="floating-shape-triangle-inner" style={{ borderBottomColor: `${s.color}30` }} />
                    )}
                </motion.div>
            ))}
        </div>
    )
}