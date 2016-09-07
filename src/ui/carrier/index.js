
import color                    from 'ui/color'
import {getCarrierPosition}     from 'ui/projection'


const marge = 0

module.exports = ( width, height, carriers ) => {


    //// instanciate canvas

    const canvas  = document.createElement('canvas')
    canvas.width  = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    const update = () => {
        ctx.clearRect(0,0,width,height)

        carriers.forEach( carrier => {

            const p = getCarrierPosition( carrier, marge )

            ctx.beginPath()
            ctx.fillStyle = color( carrier )
            ctx.arc( p.x, p.y, 2, 0, Math.PI*2 )
            ctx.fill()

        })
    }

    return {
        canvas,
        update
    }
}
