// React
import React, { useState } from 'react'

// Rebase
import {
    Flex,
    Box
} from 'rebass'

export const cameras = {
    front: 'front',
    top: 'top',
    both: 'both',
    ai: 'ai'
}

/**
 * Navigation component
 */
const Nav = () => {

    // Active camera mode
    const [activeCameraMode, setActiveCameraMode] = useState(cameras.front)

    // Return style variant for specified mode
    const getVariant = (cameraMode) => {
        return (cameraMode == activeCameraMode) ? 'styles.active' : 'styles.clickable'
    }

    // Active a camera mode
    const activateMode = (cameraMode) => {
        setActiveCameraMode(cameraMode)
    }

    return (
        <Flex width={5/7} p={3} height={1}>
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