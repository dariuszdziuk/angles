// React
import { useState, useEffect, useRef } from 'react'

// Rebass
import {
    Box
} from 'rebass'

// Source
import allTracksMetadata from '../source/metadata'

// Config
const config = {
    hoverAutoHideMs: 2000,
    hoverTransitionMs: 1000
}

// Styles
const styles = {
    shared: {
        position: 'absolute',
        width: '66.7vw', // 1920
        height: '37.6vw', // 1080
        background: 'rgba(0,0,0,0.5)',
        pointerEvents: 'none',
        zIndex: 2,
        transition: 'opacity ' + config.hoverTransitionMs + 'ms ease'
    }
}

/**
 * ARLayer showing playback metadata 
 */
const ARLayer = (props) => {

    // Playback state
    const [playbackInfo, setPlaybackInfo] = useState(props.playbackInfo)

    // Showing the overlay state
    const [isShowing, setIsShowing] = useState(false)

    // Metadata state
    const [metadata, setMetadata] = useState({
        left: { isPlaying: false },
        right: { isPlaying: false }
    })

    // Overlay DOM object
    const overlayElement = useRef()

    // Overlay auto hide timer
    const overlayAutoHideTimer = useRef(null)

    // Listen to mouse position changes
    useEffect(() => {
        const rect = overlayElement.current.getBoundingClientRect()

        const x = props.mousePosition.x
        const y = props.mousePosition.y

        const isHovering = (x >= rect.left) && (x <= rect.right) && (y >= rect.top) && (y <= rect.bottom)

        // Show the AR layer
        if (isHovering) {
            setIsShowing(true)

            // Start the auto hide timer
            clearTimeout(overlayAutoHideTimer.current)
            overlayAutoHideTimer.current = setTimeout(() => {
                setIsShowing(false)
            }, config.hoverAutoHideMs)
        }
    }, [props.mousePosition])

    // Listen to playback position changes
    useEffect(() => {
        setPlaybackInfo(props.playbackInfo)
        let seconds = props.playbackInfo.currentTime

        // Assume tracks not found
        let newMetadata = {
            left: {
                isPlaying: false
            },
            right: {
                isPlaying: false
            }
        }

        // Find currently played track in the left turntable
        for (const track of allTracksMetadata.left) {
            if (seconds >= track.start && seconds <= track.end) {
                newMetadata.left = {
                    isPlaying: true,
                    track: track.track,
                    artist: track.artist,
                    year: track.year,
                    label: track.label
                }
            }
        }

        for (const track of allTracksMetadata.right) {
            if (seconds >= track.start && seconds <= track.end) {
                newMetadata.right = {
                    isPlaying: true,
                    track: track.track,
                    artist: track.artist,
                    year: track.year,
                    label: track.label
                }
            }
        }

        setMetadata(newMetadata)

    }, [props.playbackInfo])

    // Visual component
    return (
        <Box ref={overlayElement} sx={{...styles.shared, 
            visibility: props.visible ? 'visible' : 'hidden',
            opacity: isShowing ? 1.0 : 0.0
        }}>
            {/* Debug info */}
            <Box sx={{
                background: 'pink',
                visibility: 'hidden'
            }}>
                Debug info: {playbackInfo.currentTime}
            </Box>

            {/* First callout */}
            <Callout
                left={true}
                frontCamera={props.showingFrontCamera}
                visible={metadata.left.isPlaying}
                track={metadata.left.track}
                artist={metadata.left.artist}
                year={metadata.left.year}
                label={metadata.left.label}
            />

            {/* Second callout */}
            <Callout
                left={false}
                frontCamera={props.showingFrontCamera}
                visible={metadata.right.isPlaying}
                track={metadata.right.track}
                artist={metadata.right.artist}
                year={metadata.right.year}
                label={metadata.right.label}
            />
        </Box>
    )
}

// Layout permutations
const layoutStyle = {
    leftTurntable: {
        front: {
            right: '47vw',
            top: '23vw'    
        },
        top: {
            right: '40vw',
            top: '5vw'     
        }
    },
    rightTurntable: {
        front: {
            left: '50vw',
            bottom: '17vw'    
        },
        top: {
            left: '53vw',
            bottom: '14vw'    
        }
    }
}

// Callout component
const Callout = (props) => {

    // Assemble the CSS style
    const camera = props.frontCamera ? 'front' : 'top'
    const style = props.left ? layoutStyle.leftTurntable[camera] : layoutStyle.rightTurntable[camera]

    return (
        <Box sx={{
            ...style,
            position: 'absolute',
            opacity: props.visible ? 1.0 : 0.0,
            transition: 'opacity 2s ease'
        }}>
            {/* Left callout arrow */}
            {props.left &&
            <Box sx={{
                height: '32px',
                borderBottom: '1px solid #ffffff',
                marginRight: '32px'
            }}>
                {/* Arrow */}
                <Box sx={{
                    position: 'absolute',
                    right: props.frontCamera ? '16px' : '',
                    left: !props.frontCamera ? '-16px' : '',
                    top: '-7px',
                    width: '32px',
                    height: '32px',
                    borderBottom: '1px solid #ffffff',
                    transform: props.frontCamera ? 'rotate(-45deg)' : 'rotate(45deg)'
                }} />
            </Box>
            }

            {/* Text */}
            <Box sx={{
                width: 192,
                paddingLeft: !props.frontCamera ? '32px' : '' 
            }}>
                <Box mt={3} sx={{
                    fontSize: 3,
                    fontWeight: 'bold',
                    color: '#ffffff',
                    whiteSpace: 'nowrap'
                }}>
                    {props.track}
                </Box>
                <Box sx={{
                    fontSize: 2,
                    color: '#ffffff'
                }}>
                    {props.artist}
                </Box>
                <Box mt={2} sx={{
                    fontSize: 0,
                    color: '#999999'
                }}>{props.year}</Box>
                <Box sx={{
                    fontSize: 0,
                    color: '#999999'
                }}>{props.label}</Box>
            </Box>

            {/* Right callout arrow */}
            {!props.left &&
            <Box mt={-2} sx={{
                height: '32px',
                borderBottom: '1px solid #ffffff',
                marginRight: '32px'
            }}>
                {/* Arrow */}
                <Box sx={{
                    position: 'absolute',
                    left: '-38px',
                    bottom: '-16px',
                    width: '32px',
                    height: '32px',
                    borderBottom: '1px solid #ffffff',
                    transform: 'rotate(-45deg)'
                }} />
            </Box>
            }
        </Box>
    )
}

export default ARLayer