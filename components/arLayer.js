// React
import { useState, useEffect } from 'react'

// Rebass
import {
    Box
} from 'rebass'

// Styles
const styles = {
    shared: {
        position: 'absolute',
        width: '66.7vw', // 1920
        height: '37.6vw', // 1080
        background: 'rgba(0,0,0,0.5)',
        pointerEvents: 'none',
        zIndex: 2
    }
}

/**
 * ARLayer showing playback metadata 
 */
const ARLayer = (props) => {

    // Playback state
    const [playbackInfo, setPlaybackInfo] = useState(props.playbackInfo)

    // Metadata state
    const [metadata, setMetadata] = useState({
        left: {
            isPlaying: true,
            track: 'Saxony',
            artist: 'Leon Vynehall',
            year: '2016',
            label: 'Running Back'
        },
        right: {
            isPlaying: false
        }
    })

    // Listen to playback position changes
    useEffect(() => {
        setPlaybackInfo(props.playbackInfo)
    }, [props.playbackInfo])

    // Visual component
    return (
        <Box sx={styles.shared}>
            {/* Debug info */}
            <Box sx={{
                background: 'pink'
            }}>
                Debug info: {playbackInfo.currentTime}
            </Box>

            {/* First callout */}
            <Callout
                left={true}
                track='Saxony'
                artist='Leon Vynehall'
                year='2016'
                label='Rush Hour'
            />

            {/* Second callout */}
            <Callout
                left={false}
                track='new wave project 2 (call super mix)'
                artist='Kuniyuki Takahashi'
                year='2017'
                label='Mule Musiq'
            />
        </Box>
    )
}

// Callout component
const Callout = (props) => {
    return (
        <Box sx={{
            position: 'absolute',
            right: props.left ? '47vw' : '',
            left: props.left ? '' : '50vw',
            top: props.left ? '23vw' : '',
            bottom: props.left ? '' : '17.5vw'
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
                    right: '16px',
                    top: '-7px',
                    width: '32px',
                    height: '32px',
                    borderBottom: '1px solid #ffffff',
                    transform: 'rotate(-45deg)'
                }} />
            </Box>
            }

            {/* Text */}
            <Box sx={{
                width: 192
            }}>
                <Box mt={3} sx={{
                    fontSize: 3,
                    fontWeight: 'bold',
                    color: '#ffffff'
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