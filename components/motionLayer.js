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

    // Dynamic dimensions
    const [videoSize, setVideoSize] = useState({
        width: 10,
        height: 10
    })
    
    // Reference to DOM objects
    const videoRef = useRef()
    const canvasRef = useRef()

    // Listen to active prop change
    useEffect(() => {
        setIsActive(props.isActive)

        // Activate for first time
        if (!videoRef.current && props.isActive) {
            videoRef.current = props.onRequestVideo()

            // Update dimensions
            let videoRect = videoRef.current.getBoundingClientRect()
            setVideoSize({
                width: videoRect.width,
                height: videoRect.height
            })
        }
    }, [props.isActive])

    return (
        <canvas ref={canvasRef} width={videoSize.width} height={videoSize.height} style={{
            // Layout
            position: 'absolute',
            width: videoSize.width,
            height: videoSize.height,
            zIndex: 1,

            // Debug
            backgroundColor: 'pink'
        }}>
        </canvas>
    )
}

export default MotionLayer