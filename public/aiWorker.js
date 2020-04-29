/**
 * aiWorker.js
 */

// Configuration
const config = {
    minConfidence: 0.35,
    resFactor: 0.4,
    posenet: {
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.5,
        quantBytes: 2
    }
}

// Load posenet scripts
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs')
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet')

// Posenet model
let net = null

// Handle worker message
self.addEventListener('message', e => {
    // console.log('[aiWorker/Debug] Received message from the app', e)

    switch (e.data.type) {
        case 'INITIALIZE':
            // Load the posenet model
            posenet.load({...config.posenet,
                inputResolution: { 
                    width: e.data.config.width * config.resFactor,
                    height: e.data.config.height * config.resFactor
                },
            }).then(result => {
                net = result
                console.log('[aiWorker/Debug] Posenet model loaded', net)

                // Send the message back to the app
                postMessage({
                    type: 'MODEL_LOADED',
                    message: 'The Posenet model has been loaded.'
                })
            })
            break

        case 'VIDEO_FRAME':
            // Analyze the pose
            net.estimateSinglePose(e.data.imageData).then(pose => {
            // net.estimateMultiplePoses(e.data.imageData, {
            //     maxDetections: 1,
            //     scoreThreshold: config.minConfidence
            // }).then(poses => {
                // console.log('[aiWorker/Debug] Posenet pose detected', poses)

                // Sometimes the result is empty
                // if (!poses || poses.length == 0) {
                    // return
                // }

                // let pose = poses[0]

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