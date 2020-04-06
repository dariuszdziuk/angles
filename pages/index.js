// React & Rebass
import React, { useState, useRef } from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'

// Rebass
import {
    Text,
    Flex,
    Box,
    Button
} from 'rebass'

// Default page
const IndexPage = () => {

    // State
    const [currentTimeFirst, setCurrentTimeFirst] = useState(0)
    const [currentTimeSecond, setCurrentTimeSecond] = useState(0)
    const [cameraVisibleFirst, setCameraVisibleFirst] = useState(true)
    const [cameraVisibleSecond, setCameraVisibleSecond] = useState(true)
    const [useSingleCamera, setUseSingleCamera] = useState(false)

    // Refs
    const videoFirst = useRef(null)
    const videoSecond = useRef(null)

    // Methods
    const restartPlayback = () => {
        setCurrentTimeFirst(0)
        setCurrentTimeSecond(0)

        videoFirst.current.currentTime = 0
        videoSecond.current.currentTime = 0
    }

    const switchToOneCamera = () => {
        if (useSingleCamera) {
            setCameraVisibleFirst(!cameraVisibleFirst)
            setCameraVisibleSecond(!cameraVisibleSecond)    
        }
        else {
            setUseSingleCamera(true)
            setCameraVisibleSecond(false)
        }
    }

    const switchToTwoCameras = () => {
        setUseSingleCamera(false)
        setCameraVisibleFirst(true)
        setCameraVisibleSecond(true)
    }

    const syncVideos = () => {
        videoFirst.current.currentTime = videoSecond.current.currentTime
    }

    return (
        <ThemeProvider theme={theme}>
            <Box mb={2}>
                <Button mr={2} onClick={restartPlayback}>Restart</Button>
                <Button mr={2} onClick={switchToOneCamera}>One Camera / Switch</Button>
                <Button mr={2} onClick={switchToTwoCameras}>Two Cameras</Button>
                <Button mr={2} onClick={syncVideos}>Sync videos</Button>
            </Box>
            <Flex height={810} width={1440} style={{
                backgroundColor: 'pink'
            }}>
                <Box style={{
                    visibility: cameraVisibleFirst ? 'visible' : 'hidden'
                }}>
                    <video ref={videoFirst} autoPlay={true} style={{
                        height: useSingleCamera ? '810px' : '405px',
                        width: useSingleCamera ? '1440px' : '720px'
                    }}>
                        <source src="http://d2z9la3znewur2.cloudfront.net/IMG_3751_1.mp4" type="video/mp4" />
                    </video>
                </Box>
                <Box style={{
                    visibility: cameraVisibleSecond ? 'visible' : 'hidden',
                    marginLeft: useSingleCamera ? '-1440px' : '0'
                }}>
                    <video ref={videoSecond} autoPlay={true} muted={true} style={{
                        height: useSingleCamera ? '810px' : '405px',
                        width: useSingleCamera ? '1440px' : '720px'
                    }}>
                        <source src="http://d2z9la3znewur2.cloudfront.net/IMG_3751.mp4" type="video/mp4" />
                    </video>
                </Box>
            </Flex>
        </ThemeProvider>
    )
}

export default IndexPage