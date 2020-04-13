// React
import React, { useRef, useState, useEffect } from 'react'

/**
 * Video component
 */
const Video = (params) => {

    // Is playing
    const [isPlaying, setIsPlaying] = useState(false)

    // Mouse coordinates
    const [mousePosition, setMousePosition] = useState(params.mousePosition)

    // Video element
    const videoDom = useRef(null)

    // Listen to mouse position changes
    useEffect(() => {
        setMousePosition(params.mousePosition)
    }, [params.mousePosition])

    // Handle video click
    const handleClick = () => {
        setIsPlaying(!isPlaying)

        if (!isPlaying) {
            videoDom.current.play()
        } else {
            videoDom.current.pause()
        }
    }

    // Return transformation params for the video
    const transformationParams = () => {
        // Initially there's no video
        if (videoDom.current == null) {
            return ''
        }

        let videoRect = videoDom.current.getBoundingClientRect()

        let relativeX = mousePosition.x - videoRect.left
        let relativeY = mousePosition.y - videoRect.top

        let angleY = -(0.5 - (relativeX / videoRect.width)) * 40
        let angleX = -(0.5 - (relativeY / videoRect.height)) * 40

        let style = 'translateZ(0px) perspective(520px) rotateY(' + (angleY * 0.1) + 'deg) rotateX(' + (angleX * 0.1) + 'deg)'

        return style
    }

    return (
        <video ref={videoDom} onClick={handleClick} width='100%' style={{
            boxShadow: '0px 4px 64px rgba(0, 0, 0, 0.25)',

            // 3d movement effect
            transform: transformationParams()
        }}>
            <source src={params.src} type='video/mp4' />
        </video>
    )
}

export default Video