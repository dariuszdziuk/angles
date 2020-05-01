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
        body: 'neue-haas-grotesk-text, sans-serif'
        // body: 'Helvetica'
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
                borderBottom: '1px solid #666'
            }
        },
        active: {
            cursor: 'default',
            borderBottom: '1px solid black'
        },
        clickableSmall: {
            cursor: 'pointer',
            fontSize: 1,
            lineHeight: 1.6,
            bottom: 0,
            color: '#444',
            ':hover': {
                color: '#000'
            }
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
                    <Box width={1/6}></Box>
                    <Box width={4/6} pt={2} height={1}>
                        {props.nav}
                    </Box>
                    <Box width={1/6}></Box>
                </Flex>
                <Flex height='83.4%'>
                    <Box width={1/6}></Box>
                    <Box width={4/6} style={{position: 'relative'}}>
                        {props.videos}
                        {props.progressBar}
                    </Box>
                    <Box width={1/6}></Box>
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