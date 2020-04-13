// React
import React, { useRef, useState, useEffect } from 'react'

// Components
import { cameras } from '../models/camera'

// Predefined styles
const styles = {
    shared: {
        position: 'absolute'
    },
    primary: {},
    secondary: {}
}

// Primary camera
styles.primary[cameras.front] = {
    opacity: 1.0
}

styles.primary[cameras.top] = {
    opacity: 0.0
}

styles.primary[cameras.both] = {
    width: '75%',
    marginTop: '5%',
    marginLeft: '-25%'
}

// Secondary camera
styles.secondary[cameras.front] = {
    opacity: 0.0
}

styles.secondary[cameras.top] = {
    opacity: 1.0
}

styles.secondary[cameras.both] = {
    width: '75%',
    marginTop: '5%',
    marginLeft: '50%'
}

/**
 * Video component
 */
const Video = (props) => {

    // Active camera
    const [activeCamera, setActiveCamera] = useState(props.activeCamera)

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

    // Active camera has changed
    useEffect(() => {
        setActiveCamera(props.activeCamera)
    }, [props.activeCamera])

    // Playback changed
    useEffect(() => {
        if (props.isPlaying) {
            videoDom.current.play()
        }
        else {
            videoDom.current.pause()
        }
    }, [props.isPlaying])

    // Handles video clicking
    const handleVideoClick = (e) => {
        props.onClick(e)

        // Hack: Need to play here due to Safari Audio playback restriction (can't play outside of event handler)
        videoDom.current.play()
    }

    // Returns style based on the state
    const getStyle = () => {
        let style = props.isPrimary ? styles.primary : styles.secondary

        return {...styles.shared, ...style[activeCamera], ...{
            boxshadow: '0px 4px 64px rgba(0, 0, 0, 0.25)',
            transform: transformationParams()
        }} 
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
        <video
            ref={videoDom}
            onClick={handleVideoClick}
            width='100%'
            style={getStyle()}
        >
            <source src={props.src} type='video/mp4' />
        </video>
    )
}

export default Video