/**
 * aiWorker.js
 */

// Configuration
const config = {
    minConfidence: 0.35,
    posenet: {
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 257, height: 200 },
        multiplier: 0.75,
        quantBytes: 2
    }
}

// Load posenet scripts
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs')
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet')

// Posenet model
let net = null

// Load the posenet model
posenet.load(config.posenet).then(result => {
    net = result
    console.log('[aiWorker/Debug] Posenet model loaded', net)

    // Send the message back to the app
    postMessage({
        type: 'MODEL_LOADED',
        message: 'The Posenet model has been loaded.'
    })
})

// Handle worker message
self.addEventListener('message', e => {
    // console.log('[aiWorker/Debug] Received message from the app', e)

    switch (e.data.type) {
        case 'VIDEO_FRAME':
            // Analyze the pose
            net.estimateSinglePose(e.data.imageData).then(pose => {
                // console.log('[aiWorker/Debug] Posenet pose detected', pose)

                // Create the result including the skeleton
                let result = {
                    pose: pose,
                    skeleton: posenet.getAdjacentKeyPoints(pose.keypoints, config.minConfidence)
                }

                // Send the pose back to the app
                postMessage({
                    type: 'POSE_DETECTED',
                    message: 'The Posenet pose has been detected',
                    result: result
                })
            })
            break
    }

})