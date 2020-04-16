// React & Rebass
import React, { useState, useRef } from 'react'

// Components
import Layout from '../components/layout'
import Nav from '../components/nav'
import Video from '../components/video'
import ProgressBar from '../components/progressBar'
import { cameras } from '../models/camera'

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

    // Element
    return (
        <Layout onMouseMove={handleMouseMove}
            nav={<Nav activeCamera={activeCamera} onActiveCameraChange={handleActiveCameraChange} />}
            
            // Videos section
            videos={
                <Box>
                    <Video
                        mousePosition={mousePosition}
                        moveToTimeSignal={moveToTimeSignal}
                        muted={false}
                        isPrimary={true}
                        isPlaying={isPlaying}
                        onClick={handleVideoClick}
                        onCurrentTimeChange={handleCurrentTimeChange}
                        activeCamera={activeCamera}
                        src='http://d2z9la3znewur2.cloudfront.net/videos/Angles+First+Mix+-+Camera+1+Full+Length+720p.mp4'
                    />
                    <Video
                        mousePosition={mousePosition}
                        moveToTimeSignal={moveToTimeSignal}
                        muted={true}
                        isPrimary={false}
                        isPlaying={isPlaying}
                        onClick={handleVideoClick}
                        activeCamera={activeCamera}
                        src='http://d2z9la3znewur2.cloudfront.net/videos/Angles+First+Mix+-+Camera+2+Full+Length+720p.mp4'
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
    )
}

export default Experience