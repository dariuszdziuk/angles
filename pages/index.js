// React & Next
import React, { useState, useRef } from 'react'
import Head from 'next/head'

// Components
import Layout from '../components/layout'
import Nav from '../components/nav'
import Video from '../components/video'
import ARLayer from '../components/arLayer'
import ProgressBar from '../components/progressBar'
import { cameras } from '../source/camera'

// Rebass components
import {
    Box
} from 'rebass'

// Main experience component
const Experience = () => {

    // Mouse coordinates
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // Active camera
    const [activeCamera, setActiveCamera] = useState(cameras.front)
    const [aiMixingDetected, setAiMixingDetected] = useState(false)

    // Should show the algorithm
    const [showAlgorithm, setShowAlgorithm] = useState(true)

    // Playback state
    const [isPlaying, setIsPlaying] = useState(false)
    const [moveToTimeSignal, setMoveToTimeSignal] = useState(0)

    // Current playback time information
    const [playbackInfo, setPlaybackInfo] = useState({
        currentTime: 0,
        duration: 100
    })

    // Capture global mouse movement
    const handleMouseMove = (e) => {
        setMousePosition({
            x: e.pageX,
            y: e.pageY
        })
    }

    // Handle video click
    const handleVideoClick = () => {
        setIsPlaying(!isPlaying)
    }

    // Handle video current time change
    const handleCurrentTimeChange = (playbackInfo) => {
        setPlaybackInfo(playbackInfo)
    }

    // Handle changing the position using progress bar
    const handlePositionChange = (newTime) => {
        setMoveToTimeSignal(newTime)
    }

    // Handle camera change
    const handleActiveCameraChange = (camera) => {
        setActiveCamera(camera)
    }

    // Handle mixing detected change in AI mode
    const handleMixingDetectedChange = (mixingDetected) => {
        setAiMixingDetected(mixingDetected)
    }

    // Handle showing or hiding the algorithm
    const handleShowAlgorithmChange = (value) => {
        setShowAlgorithm(value)
    }

    // Element
    return (
        <>
            <Head>
                <title>— // experience → 0.1 —</title>
            </Head>
            <Layout onMouseMove={handleMouseMove}
                nav={<Nav activeCamera={activeCamera} onActiveCameraChange={handleActiveCameraChange} onShowAlgorithmChange={handleShowAlgorithmChange} />}
                
                // Videos section
                videos={
                    <Box>
                        <ARLayer
                            playbackInfo={playbackInfo}
                            visible={activeCamera != cameras.both}
                            showingFrontCamera={
                                (activeCamera == cameras.front) ||
                                ((activeCamera == cameras.ai) && !aiMixingDetected)
                            }
                        />
                        <Video
                            mousePosition={mousePosition}
                            moveToTimeSignal={moveToTimeSignal}
                            isPrimary={true}
                            isPlaying={isPlaying}
                            onClick={handleVideoClick}
                            onCurrentTimeChange={handleCurrentTimeChange}
                            onMixingDetectedChange={handleMixingDetectedChange}
                            activeCamera={activeCamera}
                            aiMixingDetected={aiMixingDetected}
                            showAlgorithm={showAlgorithm}
                            src='https://dariuszdziuk.ams3.cdn.digitaloceanspaces.com/Angles%20First%20Mix%20-%20Camera%201%20Full%20Length%20720p.mp4'
                        />
                        <Video
                            mousePosition={mousePosition}
                            moveToTimeSignal={moveToTimeSignal}
                            isPlaying={isPlaying}
                            onClick={handleVideoClick}
                            activeCamera={activeCamera}
                            aiMixingDetected={aiMixingDetected}
                            showAlgorithm={showAlgorithm}
                            src='https://dariuszdziuk.ams3.cdn.digitaloceanspaces.com/Angles%20First%20Mix%20-%20Camera%202%20Full%20Length%20720p%20%E2%80%94%20Fixed.mp4'
                        />
                    </Box>
                }

                // Progress bar
                progressBar={
                    <ProgressBar
                        mousePosition={mousePosition}
                        onPositionChange={handlePositionChange}
                        playbackInfo={playbackInfo}
                    />
                }
            />
        </>
    )
}

export default Experience