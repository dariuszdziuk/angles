// Configuration
const config = {
    wrists: {
        fillStyle: 'red',
        radius: 8
    },
    joints: {
        fillStyle: 'white',
        radius: 4
    },
    skeleton: {
        strokeStyle: 'white'
    }
}

/**
 * Draws a PoseNet skeleton on a Canvas object
 */
export default function drawSkeleton(ctx, poseObject, width, height, ratio, leftOffset) {
    let pose = poseObject.pose
    let skeleton = poseObject.skeleton

    ctx.clearRect(0, 0, width, height)

    // Draw joints
    for (let i = 0; i < pose.keypoints.length; i++) {
        let point = pose.keypoints[i]

        if (point.score > 0.35) {
            ctx.beginPath()

            let fillStyle = config.joints.fillStyle
            let radius = config.joints.radius

            // Different style for wrists
            if (point.part == 'rightWrist' || point.part == 'leftWrist') {
                fillStyle = config.wrists.fillStyle
                radius = config.wrists.radius
            }

            ctx.fillStyle = fillStyle
            ctx.ellipse(point.position.x + (leftOffset * ratio), point.position.y, radius, radius, Math.PI / 4, 0, 2 * Math.PI)
            ctx.fill()
        }
    }

    // Draw skeleton lines
    for (let si = 0; si < skeleton.length; si++) {
        let from = skeleton[si][0]
        let to = skeleton[si][1]

        ctx.beginPath()
        ctx.strokeStyle = config.skeleton.strokeStyle
        ctx.moveTo(from.position.x + (leftOffset * ratio), from.position.y)
        ctx.lineTo(to.position.x + (leftOffset * ratio), to.position.y)
        ctx.stroke()
    }
}