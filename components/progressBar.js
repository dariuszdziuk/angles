// React
import React, { useState, useEffect, useRef } from 'react'

// Rebass
import {
    Box
} from 'rebass'

// Configuration
const config = {
    idleStateTimeout: 1000
}

/**
 * Progress bar component
 */
const ProgressBar = (props) => {

    // Display states
    const [isIdle, setIsIdle] = useState(true)
    const [isHovered, setIsHovered] = useState(false)

    // Interaction states
    const [positionWasSetManually, setPositionWasSetManually] = useState(false)
    const [isMouseDown, setIsMouseDown] = useState(false)

    // Playback state
    const [playbackInfo, setPlaybackInfo] = useState(props.playbackInfo)

    // Idle timer
    const idleTimer = useRef(null)

    // DOM elements to refer
    const progressBarRef = useRef()

    // Listen to mouse position changes
    useEffect(() => {
        setIsIdle(false)

        // Set idle state for next 5s
        clearTimeout(idleTimer.current)
        idleTimer.current = setTimeout(() => { setIsIdle(true) }, config.idleStateTimeout)
    }, [props.mousePosition])

    // Listen to playback position changes
    useEffect(() => {
        setPositionWasSetManually(false)
        setPlaybackInfo(props.playbackInfo)
    }, [props.playbackInfo])

    // Mouse entered
    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    // Mouse left
    const handleMouseLeave = () => {
        setIsHovered(false)
        setIsMouseDown(false)
    }

    // Changes the playback position based on mouse pointer
    const changePosition = (event) => {
        // Progress bar bounds
        const rect = progressBarRef.current.getBoundingClientRect()

        // Calculate
        let x = event.clientX - rect.left
        let percent = x / rect.width
        let newCurrentTime = playbackInfo.duration * percent
        
        // Emit new position
        props.onPositionChange(newCurrentTime)
        
        // Set the new position locally so the UI feels faster
        // Also set the opactiy lower to indicate loading state
        setPositionWasSetManually(true)
        setPlaybackInfo({...playbackInfo,
            currentTime: newCurrentTime 
        })

        // Disable further handling
        event.preventDefault()
    }

    // Mouse down
    const handleMouseDown = (event) => {
        setIsMouseDown(true)
        changePosition(event)
    }

    // Mouse up
    const handleMouseUp = () => {
        setIsMouseDown(false)
    }

    // Mouse moved
    const handleMouseMove = (event) => {
        if (isMouseDown) {
            changePosition(event)
        }
    }

    // Calculate playback position
    const getPlaybackPosition = () => {
        return (playbackInfo.currentTime / playbackInfo.duration) * 100
    }

    // Element
    return (
        <Box ref={progressBarRef} width='100%' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} sx={{
            // Layout
            position: 'absolute',
            bottom: '24px',
            height: '16px',
            paddingTop: '8px',

            // Show the mouse
            cursor: 'pointer',

            // Transition
            transition: 'opacity 0.5s ease',
            opacity: isIdle && !isHovered ? '0%' : '100%'
        }
        }>
            {/* Time bar */}
            <Box width='100%' sx={{
                // Layout
                height: '2px',

                // Look
                backgroundColor: isHovered ? '#acacac' : '#9f9f9f',
                transition: 'background-color 0.5s ease'
            }}>
                {/* Played time bar */}
                <Box width={getPlaybackPosition() + '%'} sx={{
                        // Layout
                        height: '2px',

                        // Look
                        backgroundColor: isHovered ? '#272727' : '#7d7d7d',
                        transition: 'background-color 0.5s ease'
                    }} />

                {/* Position indicator */}
                <Box sx={{
                    // Layout
                    height: '16px',
                    width: '16px',
                    marginTop: '-9px',
                    marginLeft: getPlaybackPosition() + '%',

                    // Transition
                    opacity: isHovered ? (positionWasSetManually ? '50%' : '100%') : '0%',
                    transition: 'opacity 0.2s ease',

                    // Look 
                    backgroundColor: '#acacac',
                    border: '2px solid #272727',
                    borderRadius: '8px'
                }} />
            </Box>
        </Box>
    )
}

export default ProgressBar