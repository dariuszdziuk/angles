// React & Rebass
import React, { useState, useRef } from 'react'
import { ThemeProvider } from 'emotion-theming'

// Rebass components
import {
    Flex,
    Box,
    Text
} from 'rebass'

// Components
import Nav from '../components/nav'
import Video from '../components/video'

// Custom theme
const theme = {
    fonts: {
        body: 'neue-haas-grotesk-display, sans-serif'
        // body: 'system-ui'
    },
    fontSizes: [
        12, 14, 16, 20, 24
    ],
    styles: {
        root: {
            fontFamily: 'body',
            fontWeight: 'body',
            lineHeight: 'body',
        },
        clickable: {
            cursor: 'pointer',
            ':hover': {
                textDecoration: 'underline'
            }
        },
        active: {
            cursor: 'default',
            fontWeight: '600',
            textDecoration: 'underline'
        }
    }
}

// Main experience component
const Experience = () => {

    // Mouse coordinates
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // References to video objects
    const videoFront = useRef(null)

    // Capture global mouse movement
    const onMouseMove = (e) => {
        setMousePosition({
            x: e.pageX,
            y: e.pageY
        })
    }

    // React component
    return (
        <ThemeProvider theme={theme}>
            {/* The main layout */}
            <Flex flexDirection='column' backgroundColor='#979797' variant='styles.root' onMouseMove={onMouseMove}>
                <Flex height='16.6%'>
                    <Box width={1/7}></Box>
                    <Nav width={5/7} p={3} height={1} />
                    <Box width={1/7}></Box>
                </Flex>
                <Flex height='83.4%'>
                    <Box width={1/7}></Box>
                    <Box width={5/7} p={3}>
                        <Video mousePosition={mousePosition} src='http://d2z9la3znewur2.cloudfront.net/videos/Angles+First+Mix.mp4' />
                    </Box>
                    <Box width={1/7}></Box>
                </Flex>
            </Flex>

            {/* Make the page full screen */}
            <style global jsx>{`
                html,
                body,
                body > div:first-child,
                div#__next,
                div#__next > div,
                div#__next > div {
                    height: 100%;
                    margin: 0px;
                    padding: 0px;
                }

                body {
                    overflow: hidden
                }
            `}</style>
        </ThemeProvider>
    )
}

export default Experience