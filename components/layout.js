// React & Rebass
import { ThemeProvider } from 'emotion-theming'

// Rebass components
import {
    Flex,
    Box
} from 'rebass'

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

/**
 * Layout component
 */
const Layout = (props) => {

    return (
        <ThemeProvider theme={theme}>
            {/* The main layout */}
            <Flex flexDirection='column' backgroundColor='#979797' variant='styles.root' onMouseMove={props.onMouseMove}>
                <Flex height='16.6%'>
                    <Box width={1/7}></Box>
                    <Box width={5/7} p={3} height={1}>
                        {props.nav}
                    </Box>
                    <Box width={1/7}></Box>
                </Flex>
                <Flex height='83.4%'>
                    <Box width={1/7}></Box>
                    <Box width={5/7} p={3}>
                        {props.videos}
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

export default Layout