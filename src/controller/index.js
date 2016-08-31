
let mouseX
let mouseY
let mouseDown

document.body.onmousemove= event => {
    mouseX = event.clientX
    mouseY = event.clientY
}
document.body.onmousedown= () => mouseDown=true
document.body.onmouseup= () => mouseDown=false

const getAcceleration = () =>
    navigator.getGamepads()[0]
        ? navigator.getGamepads()[0].buttons[0].value
        : mouseDown

const getDirection = ( o ) =>
    navigator.getGamepads()[0]
        ? {
            x : -navigator.getGamepads()[0].axes[0],
            y : -navigator.getGamepads()[0].axes[1],
        }
        : {
            x : 1,
            y : 0,
        }

module.exports = { getAcceleration, getDirection }
