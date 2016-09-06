const bezier = ( A, O, B, k ) => {
    const _k = 1-k
    return {
        x : A.x * _k * _k   +   2 * k * _k * O.x   +   k * k * B.x,
        y : A.y * _k * _k   +   2 * k * _k * O.y   +   k * k * B.y,
    }
}

module.exports = bezier
