// React & Rebass
import React, { useState, useRef, useEffect } from 'react'
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
    const canvas = useRef(null)
    const ctx = useRef(null)

    // Load the neural network
    useEffect(() => {
        // Set Canvas context
        ctx.current = canvas.current.getContext('2d')
    }, [])

    // Methods
    const restartPlayback = () => {
        setCurrentTimeFirst(0)
        setCurrentTimeSecond(0)

        videoFirst.current.currentTime = 0
        videoSecond.current.currentTime = 0

        // Set the model
        console.log('Loading neural network for video', videoFirst.current)

        let poseNet = ml5.poseNet(videoFirst.current, {
            maxPoseDetections: 1
        }, () => {
            console.log('model loaded')
        })

        poseNet.on('pose', (poses) => {
            // console.log('got results', poses) 

            let pose = poses[0].pose
            let skeleton = poses[0].skeleton
            drawKeypoints(ctx.current, pose, skeleton)

            // Draw on the Canvas
            function drawKeypoints(ctx, pose, skeleton) {
                ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)

                for (let i = 0; i < pose.keypoints.length; i++) {
                    let point = pose.keypoints[i]

                    if (point.score > 0.2) {
                        ctx.beginPath()
                        ctx.fillStyle = 'white'
                        ctx.ellipse(point.position.x, point.position.y, 4, 4, Math.PI / 4, 0, 2 * Math.PI)
                        ctx.fill()
                    }
                }

                // Draw skeleton lines
                for (let si = 0; si < skeleton.length; si++) {
                    let from = skeleton[si][0]
                    let to = skeleton[si][1]

                    ctx.beginPath()
                    ctx.strokeStyle = 'white'
                    ctx.moveTo(from.position.x, from.position.y)
                    ctx.lineTo(to.position.x, to.position.y)
                    ctx.stroke()
                }
            }

        })
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
            <Box height={810} width={1440} style={{
                backgroundColor: 'pink'
            }}>
                <canvas ref={canvas} width="810" height="405" style={{
                    position: 'absolute',
                    // backgroundColor: 'blue',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    width: '720px',
                    height: '405px',
                    top: '50px',
                    left: '10px',
                    zIndex: 1
                }} />
                <Box style={{
                    visibility: cameraVisibleFirst ? 'visible' : 'hidden',
                    position: 'absolute',
                    top: '50px',
                    left: '10px'
                }}>
                    <video ref={videoFirst} autoPlay={true} width="810" height="405" style={{
                        height: useSingleCamera ? '810px' : '405px',
                        width: useSingleCamera ? '1440px' : '720px',
                    }} crossOrigin="anonymous">
                        <source src="http://d2z9la3znewur2.cloudfront.net/IMG_3751_1.mp4" type="video/mp4" />
                    </video>
                </Box>
                <Box hidden style={{
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
            </Box>
        </ThemeProvider>
    )
}

export default IndexPage