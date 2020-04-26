/**
 * Detects PoseNet points activity in defined bounds 
 */
class Detector {

    // Points
    #points = {}

    // Constructor
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    // Captures a point
    capturePoint(label, x, y) {
        if (!this.#points[label]) {
            this.#points[label] = {}
        }

        this.#points[label].x = x
        this.#points[label].y = y

        // Is in bounds
        this.#points[label].inBounds = (x >= this.x && x <= (this.x + this.width)) && (y >= this.y && y <= (this.y + this.height))
    }

    // How many points are in bounds
    pointsInBound() {
        let count = 0

        for (let point in this.#points) {
            // console.log(this.#points[point])
            if (this.#points[point].inBounds) {
                count += 1
            }
        }

        return count
    }
}

export default Detector 