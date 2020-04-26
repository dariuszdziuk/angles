// React
import { useRef, useState, useEffect } from 'react'

// Utils
import Detector from '../source/detector'
import drawSkeleton from '../source/skeleton'

// Experience configuration
const config = {
    sourceVideoSize: {
        width: 1920,
        height: 1080
    },
    ai: {
        detectMs: 250, // Number of ms mixer position has to be detected for, to avoid accidentals
        disableMs: 1000 // How long after stopping detection camera should be active
    },
    crop: {
        left: 200,
        right: 250
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        opacity: 1
    },
    mixer: {
        x: 800,
        y: 400,
        width: 300,
        height: 400,
        strokeStyle: 'white',
        strokeStyleActive: 'red'
    }
}

/**
 * AI layer that detects body movement
 */
const AILayer = (props) => {

    // Active state
    const [isActive, setIsActive] = useState(props.isActive)

    // Mixer pose detected
    const [mixingDetected, setMixingDetected] = useState(false)

    // Dynamic dimensions
    const [videoSize, setVideoSize] = useState({
        width: 10,
        height: 10,
        ratio: 1.0
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
    const detector = useRef(new Detector())
    const detectTimer = useRef()
    const disableTimer = useRef()

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
                height: videoRect.height,
                ratio: videoRect.width / config.sourceVideoSize.width
            })

            // Warning - Hack to make the video size work with PoseNet
            // videoRef.current.width = videoRect.width
            // videoRef.current.height = videoRect.height
        }
    }, [props.isActive])

    // Listen to activity change
    useEffect(() => {
        // First time activation
        if (isActive) {
            // Common setup
            commonInit()
            enableWebWorkerAI()

            // TODO - don't init it already was created
        }
        // AI was already created
        else if (isActive) {
            // Start analyzing frames
            // WARNING - Assuming PoseNet was loaded already, might not work if it wasn't yet
            // analyzeFrame()
        }
    }, [isActive])

    // Mixing detected change - note: will be only triggered on change
    useEffect(() => {
        console.log('[AiLayer] Mixing detected change', mixingDetected)

        if (mixingDetected) {
            detectTimer.current = setTimeout(() => {
                // Long enough in the mixing zone - send info to parent
                if (props.onMixingDetectedChange) {
                    props.onMixingDetectedChange(true)
                }

                // Also deactive disable timer if happens to be active
                clearTimeout(disableTimer.current)
            }, config.ai.detectMs)
        }
        else {
            // Cancel detection timer
            clearTimeout(detectTimer.current)

            // Activate disable timer
            disableTimer.current = setTimeout(() => {
                if (props.onMixingDetectedChange) {
                    props.onMixingDetectedChange(false)
                }
            }, config.ai.disableMs)
        }

    }, [mixingDetected])

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

        // Configure the Detector
        detector.current.x = config.mixer.x * videoSize.ratio
        detector.current.y = config.mixer.y * videoSize.ratio
        detector.current.width = config.mixer.width * videoSize.ratio
        detector.current.height = config.mixer.height * videoSize.ratio

        // Sends a frame to the worker
        const sendFrameToWorker = () => {
            stats.current.begin()

            // Convert the video frame to image data
            offscreenCtxRef.current.drawImage(videoRef.current, 0, 0, videoSize.width, videoSize.height)

            let imageData = offscreenCtxRef.current.getImageData(
                config.crop.left * videoSize.ratio,
                0,
                videoSize.width - (config.crop.left + config.crop.right) * videoSize.ratio,
                videoSize.height
            )

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
                    drawSkeleton(ctxRef.current, e.data.result, videoSize.width, videoSize.height, videoSize.ratio, config.crop.left)
                    drawDebugElements(ctxRef.current)
                    stats.current.end()

                    // Do AI stuff
                    aiDetectMixing(e.data.result.pose)

                    // Next frame
                    window.requestAnimationFrame(sendFrameToWorker)
                    break
            }
        }
    }

    // Detects mixing position
    const aiDetectMixing = (pose) => {
        // Analyze wrists position
        for (let i = 0; i < pose.keypoints.length; i++) {
            let point = pose.keypoints[i]

            if (point.part == 'leftWrist' || point.part == 'rightWrist') {
                detector.current.capturePoint(point.part, point.position.x + config.crop.left * videoSize.ratio, point.position.y)
            }
        }

        setMixingDetected(detector.current.pointsInBound() > 0)
    }

    // Draw debug elements on the canvas
    const drawDebugElements = (ctx) => {
        // Margins
        ctx.fillStyle = 'rgba(255,0,0,0.2)'
        ctx.fillRect(0, 0, config.crop.left * videoSize.ratio, videoSize.height)
        ctx.fillRect(videoSize.width - config.crop.right * videoSize.ratio, 0, config.crop.right * videoSize.ratio, videoSize.height)

        // Mixer bounds
        ctx.beginPath()
        ctx.strokeStyle = (detector.current.pointsInBound() > 0) ? config.mixer.strokeStyleActive : config.mixer.strokeStyle
        ctx.rect(config.mixer.x * videoSize.ratio, config.mixer.y * videoSize.ratio, config.mixer.width * videoSize.ratio, config.mixer.height * videoSize.ratio)
        ctx.stroke()
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