import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCard({ children, className = '', style = {}, maxTilt = 12 }) {
    const ref = useRef(null)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { stiffness: 150, damping: 20, mass: 0.5 }
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig)
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig)
    const scale = useSpring(1, springConfig)

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        mouseX.set(x)
        mouseY.set(y)
    }

    const handleMouseEnter = () => scale.set(1.03)

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
        scale.set(1)
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                ...style,
                rotateX,
                rotateY,
                scale,
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    )
}