// React
import { useRef, useState, useEffect } from 'react'

// Experience configuration
const config = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        opacity: 1
    },
    wrists: {
        fillStyle: 'red',
        radius: 8
    },
    joints: {
        fillStyle: 'white',
        radius: 4
    },
    skeleton: {
        strokeStyle: 'white'
    }
}

// PoseNet configuration
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
    const ctxRef = useRef()
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
        }
    }, [props.isActive])

    // Listen to activity change
    useEffect(() => {
        // First time activation
        if (isActive && !poseNetRef.current) {
            enableAI()
        }
        // AI was already created
        else if (isActive) {
            // Start analyzing frames
            // WARNING - Assuming PoseNet was loaded already, might not work if it wasn't yet
            analyzeFrame()
        }
    }, [isActive])

    // Enables the AI module
    const enableAI = () => {
        // Create Canvas
        ctxRef.current = canvasRef.current.getContext('2d')

        // Create Posenet
        poseNetRef.current = ml5.poseNet(() => {
            console.log('Model ready')

            // Starts analyzing frames
            analyzeFrame()
        }, configPoseNet)

        // Pose was analyzed
        poseNetRef.current.on('pose', function(results) {
            console.log('[AILayer/Debug] Pose detected', results)

            // Draw the pose on the canvas
            drawPose(ctxRef.current, results[0])

            // Schedule next frame
            console.log(isActive)
            if (isActive) {
                window.requestAnimationFrame(analyzeFrame)
                // setTimeout(analyzeFrame, 250)
            }
        })
    }

    // Draws a pose on a canvas
    const drawPose = (ctx, poseObject) => {
        let pose = poseObject.pose
        let skeleton = poseObject.skeleton

        console.log(videoSize)
        ctx.clearRect(0, 0, videoSize.width, videoSize.height)

        // Draw joints
        for (let i = 0; i < pose.keypoints.length; i++) {
            let point = pose.keypoints[i]

            if (point.score > 0.75) {
                ctx.beginPath()
                ctx.fillStyle = config.joints.fillStyle
                ctx.ellipse(point.position.x, point.position.y, config.joints.radius, config.joints.radius, Math.PI / 4, 0, 2 * Math.PI)
                ctx.fill()
            }
        }

        // Draw skeleton lines
        for (let si = 0; si < skeleton.length; si++) {
            let from = skeleton[si][0]
            let to = skeleton[si][1]

            ctx.beginPath()
            ctx.strokeStyle = config.skeleton.strokeStyle
            ctx.moveTo(from.position.x, from.position.y)
            ctx.lineTo(to.position.x, to.position.y)
            ctx.stroke()
        }

        // Draw hands
        if (pose.leftWrist) {
            ctx.beginPath()
            ctx.fillStyle = config.wrists.fillStyle
            ctx.ellipse(pose.leftWrist.x, pose.leftWrist.y, config.wrists.radius, config.wrists.radius, Math.PI / 4, 0, 2 * Math.PI)
            ctx.fill()
        }

        if (pose.rightWrist) {
            ctx.beginPath()
            ctx.fillStyle = config.wrists.fillStyle
            ctx.ellipse(pose.rightWrist.x, pose.rightWrist.y, config.wrists.radius, config.wrists.radius, Math.PI / 4, 0, 2 * Math.PI)
            ctx.fill()
        }
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
            visibility: isActive ? 'visible' : 'hidden',

            // Debug
            backgroundColor: config.overlay.backgroundColor,
            opacity: config.overlay.opacity
        }}>
        </canvas>
    )
}

export default AILayer