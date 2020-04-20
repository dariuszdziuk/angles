/**
 * aiWorker.js
 */

 // Load posenet scripts
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs')
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet')

// Posenet model
let net = null

// Load the posenet model
posenet.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75
}).then(result => {
    net = result
    console.log('Posenet model loaded.', net)
})

self.addEventListener('message', event => {
    console.log('Worker received:', event)
})