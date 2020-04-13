// React
import React, { useState } from 'react'

// Components
import { cameras } from '../models/camera'

// Rebase
import {
    Flex,
    Box
} from 'rebass'

/**
 * Navigation component
 */
const Nav = (props) => {

    // Active camera mode
    const [activeCamera, setActiveCamera] = useState(props.activeCamera)

    // Return style variant for specified mode
    const getVariant = (camera) => {
        return (camera == activeCamera) ? 'styles.active' : 'styles.clickable'
    }

    // Switch camera modes
    const activateMode = (camera) => {
        setActiveCamera(camera)
        props.onActiveCameraChange(camera)
    }

    return (
        <Flex>
            <Flex fontSize={3} mt={4}>
                <Box variant={getVariant(cameras.front)} onClick={() => {activateMode(cameras.front)}}>Front</Box>
                <Box variant={getVariant(cameras.top)} onClick={() => {activateMode(cameras.top)}} ml={3}>Top</Box>
                <Box variant={getVariant(cameras.both)} onClick={() => {activateMode(cameras.both)}} ml={3}>Both</Box>
                <Box variant={getVariant(cameras.ai)} onClick={() => {activateMode(cameras.ai)}} ml={3}>AI—Detect</Box>
            </Flex>
            <Flex fontSize={3} mt={4} ml={'auto'}>
                <Box variant='styles.clickable' mr={3}>Tracklist</Box>
                <Box variant='styles.clickable'>About</Box>
            </Flex>
        </Flex>
    )
}

export default Nav