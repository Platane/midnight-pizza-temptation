
const seed = Math.random() * 360
const color = carrier =>
    carrier.control
        ? `hsl(${ ( seed + carrier.index * 57 ) % 360 }, 76%, 65%)`
        : '#ddd'


module.exports = color
