import {create}                 from 'ui/dom'
import color                    from 'ui/color'
import pizza                    from 'ui/pizza'
import {getCarrierPosition}     from 'ui/projection'
import style                    from './style.css'


const color_flat_background = '#2e3042'


const computeCam = ( width, height, carrier ) => {
    const p    = getCarrierPosition( carrier, 3, 1.5 )
    const zoom = 2
    return {
        x       : p.x * zoom - width/2,
        y       : p.y * zoom - height/2,
        zoom,
    }
}

module.exports = ( width, height, carriers, network, backgrounds, marge, margeBezier, carrier ) => {

    const dom           = create( style.cam )
    const canvas        = create( style.canvas, 'canvas' )
    dom.style.borderColor     = color( carrier )
    dom.appendChild( canvas )

    canvas.width    = width
    canvas.height   = height

    const ctx = canvas.getContext('2d')

    const update = () => {

        const o = computeCam( width, height, carrier )

        ctx.beginPath()
        ctx.rect(0,0,width,height)
        ctx.fillStyle=color_flat_background
        ctx.fill()

        ctx.save()
        ctx.translate( -o.x, -o.y )
        ctx.scale( o.zoom, o.zoom )

        ctx.drawImage(backgrounds.night.s,0,0,backgrounds.night.s.width/2,backgrounds.night.s.height/2)
        ctx.drawImage(backgrounds.roads_precise.s,0,0,backgrounds.night.s.width/2,backgrounds.night.s.height/2)


        // draw carrier
        carriers.forEach( carrier => {

            const p = getCarrierPosition( carrier, marge, 2 )

            ctx.beginPath()
            ctx.fillStyle = color( carrier )
            ctx.arc( p.x, p.y, 2, 0, Math.PI*2 )
            ctx.fill()

        })


        ctx.restore()
    }

    return { dom, update }
}
