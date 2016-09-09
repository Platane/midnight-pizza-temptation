
const color = carrier =>
    carrier.control
        ? `hsl(${ ( carrier.index * 57 ) % 360 }, 76%, 65%)`
        : '#ddd'


module.exports = color


const background = '#060a32'
