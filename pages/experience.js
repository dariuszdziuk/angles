// React & Rebass
import React, { useState, useRef } from 'react'

// Components
import Layout from '../components/layout'
import Nav, { cameras } from '../components/nav'
import Video from '../components/video'

// Main experience component
const Experience = () => {

    // Mouse coordinates
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // Active camera
    const [activeCamera, setActiveCamera] = useState(cameras.front)

    // References to video objects
    const videoFront = useRef(null)

    // Capture global mouse movement
    const handleMouseMove = (e) => {
        setMousePosition({
            x: e.pageX,
            y: e.pageY
        })
    }

    // React component
    return (
        <Layout onMouseMove={handleMouseMove}
            nav={<Nav />}
            videos={<Video mousePosition={mousePosition} src='http://d2z9la3znewur2.cloudfront.net/videos/Angles+First+Mix.mp4' />}
        />
    )
}

export default Experience