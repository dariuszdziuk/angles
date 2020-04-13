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
                <Box variant={getVariant(cameras.front)} onClick={() => {activateMode(cameras.front)}}>cam—1</Box>
                <Box variant={getVariant(cameras.top)} onClick={() => {activateMode(cameras.top)}} ml={4}>cam—2</Box>
                <Box variant={getVariant(cameras.both)} onClick={() => {activateMode(cameras.both)}} ml={4}>both</Box>
                <Box variant={getVariant(cameras.ai)} onClick={() => {activateMode(cameras.ai)}} ml={4}>AI</Box>
            </Flex>
            <Flex fontSize={3} mt={4} ml={'auto'}>
                <Box variant='styles.clickable' mr={4}>setlist</Box>
                <Box variant='styles.clickable'>about</Box>
            </Flex>
        </Flex>
    )
}

export default Nav