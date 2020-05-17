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
        detectMs: (60/64*1000), // Number of ms mixer position has to be detected for, to avoid accidentals
        disableMs: (60/32*1000) // How long after stopping detection camera should be active
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
        x: 825,
        y: 400,
        width: 375,
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
    const [videoSize, _setVideoSize] = useState({
        width: null,
        height: null,
        ratio: 1.0
    })

    // Ref for the videoSize to access from worker event handlers
    const videoSizeRef = useRef(videoSize)

    // In place of original setVideoSize (workaround from https://stackoverflow.com/questions/55265255/react-usestate-hook-event-handler-using-initial-state)
    const setVideoSize = (size) => {
        videoSizeRef.current = size
        _setVideoSize({
            width: size.width,
            height: size.height,
            ratio: size.ratio
        })
    }

    // Reference objects
    const videoRef = useRef()

    // Overlay canvas
    const canvasRef = useRef()
    const ctxRef = useRef()

    // Offscreen canvas
    const offscreenCanvasRef = useRef()
    const offscreenCtxRef = useRef()

    // AI
    const aiWorker = useRef()
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
            // Request access to the DOM object
            videoRef.current = props.onRequestVideo()

            // Update dimensions
            updateSize()
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

    // Mixing detected change - note: will be only triggered when changed
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
            clearTimeout(disableTimer.current)
            disableTimer.current = setTimeout(() => {
                if (props.onMixingDetectedChange) {
                    props.onMixingDetectedChange(false)
                }
            }, config.ai.disableMs)
        }

    }, [mixingDetected])

    // Handle enabling/disabling showing debug info
    useEffect(() => {
        if (props.isVisible) {
            stats.current && document.body.appendChild(stats.current.dom)
        }
        else {
            stats.current && document.body.removeChild(stats.current.dom)
        }
    }, [props.isVisible])

    // List to window resize event
    useEffect(() => {
        const handleResize = () => updateSize()

        // Listen to browser's resize event
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    },)

    // Common properties setup
    const commonInit = () => {
        // Setup the canvas for AI overlay
        ctxRef.current = canvasRef.current.getContext('2d')

        // Setup the canvas for frame capturing
        offscreenCtxRef.current = offscreenCanvasRef.current.getContext('2d')

        // Performance stats
        stats.current = new Stats()
        stats.current.showPanel(0)
    }

    // Updates the size of all elements 
    const updateSize = () => {
        // Sometimes this is called before video DOM element is ready, ignore then
        if (!videoRef.current) {
            return
        }

        // Use the Video DOM element size
        let videoRect = videoRef.current.getBoundingClientRect()
        let ratio = videoRect.width / config.sourceVideoSize.width

        setVideoSize({
            width: videoRect.width,
            height: videoRect.height,
            ratio: ratio
        })

        console.log('updating size to', videoSize)

        // Update the detector dimensions
        detector.current.x = config.mixer.x * ratio
        detector.current.y = config.mixer.y * ratio
        detector.current.width = config.mixer.width * ratio
        detector.current.height = config.mixer.height * ratio
    }

    // Sends current frame to the AI worker
    const sendFrameToWorker = () => {
        let size = videoSizeRef.current

        // FPS tick
        stats.current.begin()

        // Convert the video frame to image data
        offscreenCtxRef.current.drawImage(videoRef.current, 0, 0, size.width, size.height)
        let imageData = offscreenCtxRef.current.getImageData(
            config.crop.left * size.ratio,
            0,
            size.width - (config.crop.left + config.crop.right) * size.ratio,
            size.height
        )

        // Pass to the worker
        aiWorker.current.postMessage({
            type: 'VIDEO_FRAME',
            imageData: imageData
        })
    }

    // Handle the drawing & interpretation of a single pose
    const handleAIPose = (pose) => {
        let size = videoSizeRef.current

        // Draw algorithm elements
        drawSkeleton(ctxRef.current, pose, size.width, size.height, size.ratio, config.crop.left)
        drawDebugElements(ctxRef.current, size)
        stats.current.end()

        // Do AI stuff
        // aiDetectMixing(pose.pose, size.ratio)
    }

    // Handles a WebWorker message
    const handleWebWorkerMessage = (e) => {
        // console.log('[aiLayer/Debug] Message from aiWorker', e)
        switch(e.data.type) {
            case 'MODEL_LOADED':
                sendFrameToWorker()
                break
            case 'POSE_DETECTED':
                handleAIPose(e.data.result)

                // Request analysis of the next frame
                window.requestAnimationFrame(sendFrameToWorker)
                break
        }
    }

    // Enables the AI module running in a WebWorker
    const enableWebWorkerAI = () => {
        // Create a Web Worker
        aiWorker.current = new Worker('/aiWorker.js')
        aiWorker.current.postMessage({
            type: 'INITIALIZE'
        })

        // Listen to events from the worker
        aiWorker.current.onmessage = handleWebWorkerMessage
    }

    // Detects mixing position
    const aiDetectMixing = (pose, ratio) => {
        // Analyze wrists position
        for (let i = 0; i < pose.keypoints.length; i++) {
            let point = pose.keypoints[i]

            if (point.part == 'leftWrist' || point.part == 'rightWrist') {
                detector.current.capturePoint(point.part, point.position.x + config.crop.left * ratio, point.position.y)
            }
        }

        setMixingDetected(detector.current.pointsInBound() > 0)
    }

    // Draw algorithm debug elements on the canvas
    const drawDebugElements = (ctx, size) => {
        // Margins
        ctx.fillStyle = 'rgba(0,0,0,0.2)'
        ctx.fillRect(0, 0, config.crop.left * size.ratio, size.height)
        ctx.fillRect(size.width - config.crop.right * size.ratio, 0, config.crop.right * size.ratio, size.height)

        // Mixer bounds
        ctx.beginPath()
        ctx.strokeStyle = (detector.current.pointsInBound() > 0) ? config.mixer.strokeStyleActive : config.mixer.strokeStyle
        var mixerRect = {
            x: config.mixer.x * size.ratio,
            y: config.mixer.y * size.ratio,
            width: config.mixer.width * size.ratio,
            height: config.mixer.height * size.ratio
        }

        // Draw the mixer bounds
        ctx.fillRect(mixerRect.x, mixerRect.y, mixerRect.width, mixerRect.height)
        ctx.rect(mixerRect.x, mixerRect.y, mixerRect.width, mixerRect.height)
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
                zIndex: 2,
                visibility: (isActive && props.isVisible) ? 'visible' : 'hidden',

                // Debug
                backgroundColor: config.overlay.backgroundColor,
                opacity: config.overlay.opacity
            }} />

            {/* Offscreen canvas for the WebWorker video frame capturing */}
            <canvas ref={offscreenCanvasRef} width={videoSize.width} height={videoSize.height} style={{
                position: 'absolute',
                visibility: 'hidden'
            }} />
        </>
    )
}

export default AILayer
