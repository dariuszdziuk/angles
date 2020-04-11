// React & Rebass
import React from 'react'
import { ThemeProvider } from 'emotion-theming'

// Rebass components
import {
    Flex,
    Box,
    Text
} from 'rebass'

// Use font: font-family: neue-haas-grotesk-text, sans-serif;

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
    return (
        <ThemeProvider theme={theme}>
            {/* The main layout */}
            <Flex flexDirection='column' backgroundColor='#979797' variant='styles.root'>
                <Flex height='16.6%'>
                    <Box width={1/7}></Box>
                    <Flex width={5/7} p={3} height={1}>
                        <Flex fontSize={3} mt={4}>
                            <Box variant='styles.active'>Front</Box>
                            <Box variant='styles.clickable' ml={3}>Top</Box>
                            <Box variant='styles.clickable' ml={3}>Both</Box>
                            <Box variant='styles.clickable' ml={3}>AI—Detect</Box>
                        </Flex>
                        <Flex fontSize={3} mt={4} ml={'auto'}>
                            <Box variant='styles.clickable' mr={3}>Tracklist</Box>
                            <Box variant='styles.clickable'>About</Box>
                        </Flex>
                    </Flex>
                    <Box width={1/7}></Box>
                </Flex>
                <Flex height='83.4%'>
                    <Box width={1/7}></Box>
                    <Box width={5/7} p={3}>
                        <video width='100%' autoPlay={false} style={{
                            boxShadow: '0px 4px 64px rgba(0, 0, 0, 0.25)'
                        }}>
                            <source src='http://d2z9la3znewur2.cloudfront.net/videos/Angles+First+Mix.mp4' type='video/mp4' />
                        </video>
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