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
            <Box sx={{
                position: 'absolute',
                right: '47vw',
                top: '23vw',
            }}>
                {/* Callout arrow */}
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

                {/* Text */}
                <Box sx={{
                    width: 256
                }}>
                    <Box mt={3} sx={{
                        fontSize: 3,
                        fontWeight: 'bold',
                        color: '#ffffff'
                    }}>
                        Saxony
                    </Box>
                    <Box sx={{
                        fontSize: 2,
                        color: '#ffffff'
                    }}>
                        Leon Vynehall SUPER LONG TITLE
                    </Box>
                    <Box mt={2} sx={{
                        fontSize: 0,
                        color: '#999999'
                    }}>April 6, 2016</Box>
                    <Box sx={{
                        fontSize: 0,
                        color: '#999999'
                    }}>Running Back</Box>
                </Box>
            </Box>

            {/* Second callout */}
            <Box></Box>
        </Box>
    )
}

export default ARLayer