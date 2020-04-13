// React
import React, { useRef, useState, useEffect } from 'react'

/**
 * Video component
 */
const Video = (props) => {

    // // Is playing
    // const [isPlaying, setIsPlaying] = useState(props.isPlaying)

    // Mouse coordinates
    const [mousePosition, setMousePosition] = useState(props.mousePosition)

    // Video element
    const videoDom = useRef(null)

    // Listen to mouse position changes
    useEffect(() => {
        setMousePosition(props.mousePosition)
    }, [props.mousePosition])

    // Video element is loaded
    useEffect(() => {
        videoDom.current.muted = props.muted
    }, [videoDom])

    // Playback changed
    useEffect(() => {
        if (props.isPlaying) {
            videoDom.current.play()
        }
        else {
            videoDom.current.pause()
        }
    }, [props.isPlaying])

    // // Handle video click
    // const handleClick = () => {
    //     setIsPlaying(!isPlaying)

    //     if (!isPlaying) {
    //         videoDom.current.play()
    //     } else {
    //         videoDom.current.pause()
    //     }
    // }

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
        <video ref={videoDom} onClick={props.onClick} width='100%' style={{
            boxShadow: '0px 4px 64px rgba(0, 0, 0, 0.25)',
            transform: transformationParams()
        }}>
            <source src={props.src} type='video/mp4' />
        </video>
    )
}

export default Video