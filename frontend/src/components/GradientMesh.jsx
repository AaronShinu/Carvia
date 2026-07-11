import { motion } from 'framer-motion'
import './GradientMesh.css'

export default function GradientMesh() {
    return (
        <div className="gradient-mesh">
            <motion.div
                className="mesh-blob mesh-blob-1"
                animate={{
                    x: [0, 140, -80, 0],
                    y: [0, -100, 60, 0],
                    scale: [1, 1.3, 0.85, 1],
                }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="mesh-blob mesh-blob-2"
                animate={{
                    x: [0, -120, 100, 0],
                    y: [0, 110, -70, 0],
                    scale: [1, 0.8, 1.25, 1],
                }}
                transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="mesh-blob mesh-blob-3"
                animate={{
                    x: [0, 100, -140, 0],
                    y: [0, -80, 90, 0],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="mesh-blob mesh-blob-4"
                animate={{
                    x: [0, -90, 120, 0],
                    y: [0, 90, -60, 0],
                    scale: [1, 1.15, 0.9, 1],
                }}
                transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="mesh-overlay" />
        </div>
    )
}