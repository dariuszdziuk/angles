// React
import { useRef, useState, useEffect } from 'react'

// Experience configuration
const config = {
    useWebWorker: true,
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
    maxPoseDetections: 1,
    minConfidence: 0.50,
    // inputResolution: { width: 200, height: 200 },
    outputStride: 16,
    multiplier: 0.5,
    imageScaleFactor: 0.3,
    // quantBytes: 2
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

    // Overlay canvas
    const canvasRef = useRef()
    const ctxRef = useRef()

    // Offscreen canvas
    const offscreenCanvasRef = useRef()
    const offscreenCtxRef = useRef()

    // AI
    const poseNetRef = useRef()

    // Debug
    const stats = useRef()

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
            // Common setup
            commonInit()

            if (config.useWebWorker) {
                enableWebWorkerAI()
            }
            else {
                enableAI()
            }
        }
        // AI was already created
        else if (isActive) {
            // Start analyzing frames
            // WARNING - Assuming PoseNet was loaded already, might not work if it wasn't yet
            // analyzeFrame()
        }
    }, [isActive])

    // Common properties setup
    const commonInit = () => {
        // Create Canvas
        ctxRef.current = canvasRef.current.getContext('2d')

        // Performance stats
        stats.current = new Stats()
        stats.current.showPanel(0)
        document.body.appendChild(stats.current.dom)
    }

    // Enables the AI module running in a WebWorker
    const enableWebWorkerAI = () => {
        // Create a Web Worker
        const aiWorker = new Worker('/aiWorker.js')
        aiWorker.postMessage('Hello, world!')

        // Setup the canvas
        offscreenCtxRef.current = offscreenCanvasRef.current.getContext('2d')

        // Sends a frame to the worker
        const sendFrameToWorker = () => {
            stats.current.begin()

            // Convert the video frame to image data
            offscreenCtxRef.current.drawImage(videoRef.current, 0, 0, videoSize.width, videoSize.height)
            let imageData = offscreenCtxRef.current.getImageData(0, 0, videoSize.width, videoSize.height)

            // Pass to the worker
            aiWorker.postMessage({
                type: 'VIDEO_FRAME',
                imageData: imageData
            })
        }

        // Listen to events from the worker
        aiWorker.onmessage = function(e) {
            // console.log('[aiLayer/Debug] Message from aiWorker', e)

            switch(e.data.type) {
                case 'MODEL_LOADED':
                    sendFrameToWorker()
                    break
                case 'POSE_DETECTED':
                    drawPose(ctxRef.current, e.data.result)
                    stats.current.end()
                    window.requestAnimationFrame(sendFrameToWorker)
                    break
            }
        }
    }

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
            // Draw the pose on the canvas
            drawPose(ctxRef.current, results[0])

            // Count FPS
            stats.current.end()

            // Schedule next frame
            if (isActive) {
                window.requestAnimationFrame(analyzeFrame)
                // setTimeout(analyzeFrame, 250)
            }
        })
    }

    // Analysises current frame
    const analyzeFrame = () => {
        stats.current.begin()
        poseNetRef.current.singlePose(videoRef.current)
    }

    // Draws a pose on a canvas
    const drawPose = (ctx, poseObject) => {
        let pose = poseObject.pose
        let skeleton = poseObject.skeleton

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

    return (
        <>
            {/* Overlay Canvas - Visible to the user */}
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
            }} />

            {/* Offscreen canvas for the WebWorker video frame capturing */}
            <canvas ref={offscreenCanvasRef} width={videoSize.width} height={videoSize.height} style={{
                visibility: 'hidden'
            }} />
        </>
    )
}

export default AILayer