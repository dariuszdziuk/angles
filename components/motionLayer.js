// React
import { useRef, useState, useEffect } from 'react'

// Rebass
import {
    Box
} from 'rebass'

/**
 * Motion layer that detects body movement
 */
const MotionLayer = (props) => {

    // Active state
    const [isActive, setIsActive] = useState(props.isActive)

    // Reference to the video element
    const videoRef = useRef()

    // Listen to active prop change
    useEffect(() => {
        setIsActive(props.isActive)
    }, [props.isActive])

    return (
        <Box backgroundColor='pink' style={{
            // Layout
            position: 'absolute',
            width: '100%',
            zIndex: 1
        }}>
            Am I active? {isActive ? 'yes' : 'no'}
        </Box>
    )
}

export default MotionLayer