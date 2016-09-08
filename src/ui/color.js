
const color = carrier =>
    carrier.control
        ? `hsl(${ ( carrier.index * 137 + carrier.index*carrier.index*37 ) % 360 }, 76%, 65%)`
        : '#ddd'


module.exports = color


const background = '#060a32'
