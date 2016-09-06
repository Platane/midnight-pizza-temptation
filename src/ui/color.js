
const color = carrier =>
    carrier.index < 2
        ? `hsl(${ ( carrier.index * 137 + carrier.index*carrier.index*37 ) % 360 }, 70%, 70%)`
        : '#ddd'


module.exports = color
