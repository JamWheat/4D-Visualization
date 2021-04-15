const xRotationMatrix = (angle) => {
    return [
        [1, 0, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle), 0],
        [0, Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 0, 1]
    ]
}

const yRotationMatrix = (angle) => {
    return [
        [Math.cos(angle), 0, Math.sin(angle), 0],
        [0, 1, 0, 0],
        [-Math.sin(angle), 0, Math.cos(angle), 0],
        [0, 0, 0, 1]
    ]
}

const zRotationMatrix = (angle) => {
    return [
        [Math.cos(angle), -Math.sin(angle), 0, 0],
        [Math.sin(angle), Math.cos(angle), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]
}

// const xRotationMatrix = (angle) => {
//     return [
//         [1, 0, 0],
//         [0, Math.cos(angle), -Math.sin(angle)],
//         [0, Math.sin(angle), Math.cos(angle)]
//     ]
// }

// const yRotationMatrix = (angle) => {
//     return [
//         [Math.cos(angle), 0, Math.sin(angle)],
//         [0, 1, 0],
//         [-Math.sin(angle), 0, Math.cos(angle)]
//     ]
// }

// const zRotationMatrix = (angle) => {
//     return [
//         [Math.cos(angle), -Math.sin(angle), 0],
//         [Math.sin(angle), Math.cos(angle), 0],
//         [0, 0, 1]
//     ]
// }

const xyRotationMatrix = (angle) => {
    return [
        [Math.cos(angle), Math.sin(angle), 0, 0],
        [-Math.sin(angle), Math.cos(angle), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]
}

const yzRotationMatrix = (angle) => {
    return [
        [1, 0, 0, 0],
        [0, Math.cos(angle), Math.sin(angle), 0],
        [0, -Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 0, 1]
    ]
}

const xzRotationMatrix = (angle) => {
    return [
        [Math.cos(angle), 0, -Math.sin(angle), 0],
        [0, 1, 0, 0],
        [Math.sin(angle), 0, Math.cos(angle), 0],
        [0, 0, 0, 1]
    ]
}

const xwRotationMatrix = (angle) => {
    return [
        [Math.cos(angle), 0, 0, Math.sin(angle)],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [-Math.sin(angle), 0, 0, Math.cos(angle)]
    ]
}

const ywRotationMatrix = (angle) => {
    return [
        [1, 0, 0, 0],
        [0, Math.cos(angle), 0, -Math.sin(angle)],
        [0, 0, 1, 0],
        [0, Math.sin(angle), 0, Math.cos(angle)]
    ]
}

const zwRotationMatrix = (angle) => {
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, Math.cos(angle), -Math.sin(angle)],
        [0, 0, Math.sin(angle), Math.cos(angle)]
    ]
}

const xwRotationMatrixWithX = (angle) => {
    return [
        [Math.cos(angle), 0, 0, Math.sin(angle)],
        [0, Math.cos(angle), -Math.sin(angle), 0],
        [0, Math.sin(angle), Math.cos(angle), 0],
        [-Math.sin(angle), 0, 0, Math.cos(angle)]
    ]
}