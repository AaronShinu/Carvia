import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import './CursorGlow.css'

export default function CursorGlow() {
    const ref = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 60, damping: 20 })
    const springY = useSpring(y, { stiffness: 60, damping: 20 })

    const handleMouseMove = (e) => {
        const rect = ref.current.parentElement.getBoundingClientRect()
        x.set(e.clientX - rect.left)
        y.set(e.clientY - rect.top)
    }

    return (
        <div
            ref={ref}
            className="cursor-glow-layer"
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="cursor-glow"
                style={{ left: springX, top: springY }}
            />
        </div>
    )
}