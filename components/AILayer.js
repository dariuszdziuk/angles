// React
import { useRef, useState, useEffect } from 'react'

// Postnet configuration
const configPoseNet = {
    architecture: 'MobileNetV1',
    detectionType: 'single',
    maxPostDetections: 1,
    minConfidence: 0.35,
    // inputResolution: { width: 640, height: 480 },
    outputStride: 16,
    multiplier: 0.5,
    // quantBytes: 4
}

/**
 * AI layer that detects body movement
 */
const AILayer = (props) => {

    // Active state
    const [isActive, setIsActive] = useState(props.isActive)

    // Dynamic dimensions
    const [videoSize, setVideoSize] = useState({
        width: 10,
        height: 10
    })
    
    // Reference objects
    const videoRef = useRef()
    const canvasRef = useRef()
    const poseNetRef = useRef()

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

            // Warning - Hack to make the video size work with PoseNet
            videoRef.current.width = videoRect.width
            videoRef.current.height = videoRect.height

            enableAI()
        }
    }, [props.isActive])

    // Enables the AI module
    const enableAI = () => {
        // Create Posenet
        poseNetRef.current = ml5.poseNet(() => {
            console.log('Model ready')

            // Starts analyzing frames
            analyzeFrame()
        }, configPoseNet)

        // Pose was analyzed
        poseNetRef.current.on('pose', function(results) {
            console.log('[AILayer/Debug] Pose detected', results)
        })
    }

    // Analysises current frame
    const analyzeFrame = () => {
        poseNetRef.current.singlePose(videoRef.current)
    }

    return (
        <canvas ref={canvasRef} width={videoSize.width} height={videoSize.height} style={{
            // Layout
            position: 'absolute',
            width: videoSize.width,
            height: videoSize.height,
            zIndex: 1,

            // Debug
            backgroundColor: 'pink',
            opacity: 0.5
        }}>
        </canvas>
    )
}

export default AILayer