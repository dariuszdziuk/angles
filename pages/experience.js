// React & Rebass
import React, { useState, useRef } from 'react'

// Components
import Layout from '../components/layout'
import Nav, { cameras } from '../components/nav'
import Video from '../components/video'

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

    // Element
    return (
        <Layout onMouseMove={handleMouseMove}
            nav={<Nav />}
            
            // Videos section
            videos={
                <Box>
                    <Video
                        mousePosition={mousePosition}
                        muted={false}
                        isPrimary={true}
                        isPlaying={isPlaying}
                        onClick={handleVideoClick}
                        src='http://d2z9la3znewur2.cloudfront.net/videos/Angles+First+Mix.mp4'
                    />
                    <Video
                        mousePosition={mousePosition}
                        muted={true}
                        isPrimary={false}
                        isPlaying={isPlaying}
                        onClick={handleVideoClick}
                        src='http://d2z9la3znewur2.cloudfront.net/videos/Angles+First+Mix_1.mp4'
                    />
                </Box>
            }
        />
    )
}

export default Experience