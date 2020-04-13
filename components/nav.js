// React
import React, { useState } from 'react'

// Rebase
import {
    Flex,
    Box
} from 'rebass'

/**
 * Navigation component
 */
const Nav = () => {
    return (
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
    )
}

export default Nav