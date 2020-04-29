// React
import React, { useState, useEffect } from 'react'

// Components
import { cameras } from '../source/camera'

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
    const [showAlgorithm, setShowAlgorithm] = useState(false)

    // Return style variant for specified mode
    const getVariant = (camera) => {
        return (camera == activeCamera) ? 'styles.active' : 'styles.clickable'
    }

    // Switch camera modes
    const activateMode = (camera) => {
        setActiveCamera(camera)
        props.onActiveCameraChange(camera)
    }

    // Handle changing the algorithm visualisation
    useEffect(() => {
        props.onShowAlgorithmChange(showAlgorithm)
    }, [showAlgorithm])

    return (
        <Flex>
            <Flex fontSize={2} mt={4}>
                <Box variant={getVariant(cameras.front)} onClick={() => {activateMode(cameras.front)}}>cam—1</Box>
                <Box variant={getVariant(cameras.top)} onClick={() => {activateMode(cameras.top)}} ml={4}>cam—2</Box>
                <Box variant={getVariant(cameras.both)} onClick={() => {activateMode(cameras.both)}} ml={4}>both</Box>
                <Box variant={getVariant(cameras.ai)} onClick={() => {activateMode(cameras.ai)}} ml={4}>AI</Box>
                <Box variant='styles.clickableSmall' onClick={() => {setShowAlgorithm(!showAlgorithm)}} ml={2} style={{
                    visibility: (activeCamera == cameras.ai) ? 'visible' : 'hidden'
                }}> —  show algorithm [{showAlgorithm ? 'on' : 'off'}]</Box>
            </Flex>
            <Flex fontSize={2} mt={4} ml={'auto'}>
                <Box variant='styles.clickable' mr={4}>setlist</Box>
                <Box variant='styles.clickable'>about</Box>
            </Flex>
        </Flex>
    )
}

export default Nav