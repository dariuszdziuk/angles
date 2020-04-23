// React
import { useRef, useState, useEffect } from 'react'

// Experience configuration
const config = {
    crop: {
        left: 150,
        right: 150
    },
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
            enableWebWorkerAI()
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
        aiWorker.postMessage({
            type: 'INITIALIZE',
            config: {
                width: videoSize.width - config.crop.left - config.crop.right,
                height: videoSize.height
            }
        })

        // Setup the canvas
        offscreenCtxRef.current = offscreenCanvasRef.current.getContext('2d')

        // Sends a frame to the worker
        const sendFrameToWorker = () => {
            stats.current.begin()

            // Convert the video frame to image data
            offscreenCtxRef.current.drawImage(videoRef.current, 0, 0, videoSize.width, videoSize.height)
            let imageData = offscreenCtxRef.current.getImageData(config.crop.left, 0, videoSize.width - config.crop.left - config.crop.right, videoSize.height)

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
                    drawDebugElements(ctxRef.current)
                    stats.current.end()

                    // Next frame
                    window.requestAnimationFrame(sendFrameToWorker)
                    break
            }
        }
    }

    // Draw debug elements on the canvas
    const drawDebugElements = (ctx) => {
        ctx.fillStyle = 'rgba(255,0,0,0.2)'
        ctx.fillRect(0, 0, config.crop.left, videoSize.height)
        ctx.fillRect(videoSize.width - config.crop.right, 0, config.crop.right, videoSize.height)
    }

    // Draws a pose on a canvas
    const drawPose = (ctx, poseObject) => {
        // console.log(poseObject)
        let pose = poseObject.pose
        let skeleton = poseObject.skeleton

        ctx.clearRect(0, 0, videoSize.width, videoSize.height)

        // Draw joints
        for (let i = 0; i < pose.keypoints.length; i++) {
            let point = pose.keypoints[i]

            if (point.score > 0.35) {
                ctx.beginPath()

                let fillStyle = config.joints.fillStyle
                let radius = config.joints.radius

                // Different style for wrists
                if (point.part == 'rightWrist' || point.part == 'leftWrist') {
                    fillStyle = config.wrists.fillStyle
                    radius = config.wrists.radius
                }

                ctx.fillStyle = fillStyle
                ctx.ellipse(point.position.x + config.crop.left, point.position.y, radius, radius, Math.PI / 4, 0, 2 * Math.PI)
                ctx.fill()
            }
        }

        // Draw skeleton lines
        for (let si = 0; si < skeleton.length; si++) {
            let from = skeleton[si][0]
            let to = skeleton[si][1]

            ctx.beginPath()
            ctx.strokeStyle = config.skeleton.strokeStyle
            ctx.moveTo(from.position.x + config.crop.left, from.position.y)
            ctx.lineTo(to.position.x + config.crop.left, to.position.y)
            ctx.stroke()
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