// React
import React, { useRef, useState, useEffect } from 'react'

// Components
import { cameras } from '../models/camera'
import MotionLayer from './motionLayer'

// Experience configuration
const config = {
    hover3d: {
        perspective: 512,
        sensitivityX: 2,
        sensitivityY: 4,
        pointX: 0.5,
        pointY: 0.125
    },
    animate: true,
    tracking: false,
    duration: 0.35
}

// Predefined styles
const styles = {
    shared: {
        position: 'absolute',
        boxShadow: '0px 4px 64px rgba(0, 0, 0, 0.25)',
        transition: config.animate ? 'margin '+config.duration+'s ease, width '+config.duration+'s ease' : '' // , opacity '+config.duration+'s ease' : ''
    },
    primary: {},
    secondary: {}
}

// Primary camera
styles.primary[cameras.front] = {
    opacity: 1.0,
    zIndex: 1
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
    opacity: 1.0,
    zIndex: 1
}

styles.secondary[cameras.both] = {
    width: '75%',
    marginTop: '5%',
    marginLeft: '50%'
}

styles.secondary[cameras.ai] = {
    opacity: 0.0
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
    const videoDom = useRef()

    // Playback position timer (only for primary video)
    const currentTimeTimer = useRef()

    // Listen to mouse position changes
    useEffect(() => {
        setMousePosition(props.mousePosition)
    }, [props.mousePosition])

    // Listen to new video position signal
    useEffect(() => {
        if (props.moveToTimeSignal != 0 ){
            videoDom.current.currentTime = props.moveToTimeSignal
        }
    }, [props.moveToTimeSignal])

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

            // Start the position timer if primary
            if (props.isPrimary) {
                currentTimeTimer.current = setInterval(() => {
                    props.onCurrentTimeChange({
                        currentTime: videoDom.current.currentTime,
                        duration: videoDom.current.duration
                    })
                }, 1000)
            }
        }
        else {
            videoDom.current.pause()

            // Stop the position timer if primary
            clearTimeout(currentTimeTimer.current)
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
            transform: config.tracking ? transformationParams() : ''
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

        let angleY = -(config.hover3d.pointX - (relativeX / videoRect.width))
        let angleX = (config.hover3d.pointY - (relativeY / videoRect.height))

        let style = 'translateZ(0px) perspective(' + config.hover3d.perspective + 'px) rotateY(' + (angleY * config.hover3d.sensitivityY) + 'deg) rotateX(' + (angleX * config.hover3d.sensitivityX) + 'deg)'

        return style
    }

    return (
        <>
            <video
                ref={videoDom}
                onClick={handleVideoClick}
                width='100%'
                style={getStyle()}
            >
                <source src={props.src} type='video/mp4' />
            </video>

            {/* Motion Layer if video is primary */}
            {props.isPrimary &&
                <MotionLayer
                    isActive={activeCamera == cameras.ai}
                    onRequestVideo={() => { return videoDom.current }}
                />
            }
        </>
    )
}

export default Video