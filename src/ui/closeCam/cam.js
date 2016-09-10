import point                    from 'math/point'
import {create}                 from 'ui/dom'
import color                    from 'ui/color'
import pizza                    from 'ui/pizza'
import {getCarrierPosition}     from 'ui/projection'
import style                    from './style.mcss'


const color_flat_background = '#2e3042'


module.exports = ( width, height, carriers, network, backgrounds, marge, margeBezier, carrier ) => {

    const dom           = create( style.cam )
    const canvas        = create( style.canvas, 'canvas' )
    dom.style.borderColor     = color( carrier )
    dom.appendChild( canvas )

    canvas.width    = width
    canvas.height   = height

    const ctx = canvas.getContext('2d')

    const kinetics = {}
    const computeCam = ( width, height, carrier ) => {

        const p = getCarrierPosition( carrier, 3, 1.5 )

        const v = Math.min( 0.9, carrier.position.velocity ) / 0.9
        const n = point.normalize( point.sub( carrier.position.arc.node_b, carrier.position.arc.node_a ) )

        p.x += n.x * 70 * ( v*2 + 1 ) /3
        p.y += n.y * 70 * ( v*2 + 1 ) /3

        const z = 5 - v * 2

        const o = {
            x       : p.x * z - width/2,
            y       : p.y * z - height/2,
            z,
        }

        const k = kinetics[ carrier.index ] || o

        const w = 0.03
        const u = {
            x : (1-w) * k.x  +  w * o.x,
            y : (1-w) * k.y  +  w * o.y,
            z : (1-w) * k.z  +  w * o.z,
        }

        return kinetics[ carrier.index ] = u
    }


    const update = () => {

        const o = computeCam( width, height, carrier )

        ctx.beginPath()
        ctx.rect(0,0,width,height)
        ctx.fillStyle=color_flat_background
        ctx.fill()

        ctx.save()
        ctx.translate( -o.x, -o.y )
        ctx.scale( o.z, o.z )

        ctx.drawImage(backgrounds.night.s,0,0,backgrounds.night.s.width/backgrounds.night.r,backgrounds.night.s.height/backgrounds.night.r)
        ctx.drawImage(backgrounds.roads_precise.s,0,0,backgrounds.roads_precise.s.width/backgrounds.roads_precise.r,backgrounds.roads_precise.s.height/backgrounds.roads_precise.r)


        // draw carrier
        carriers.forEach( carrier => {

            const p = getCarrierPosition( carrier, marge, margeBezier )

            ctx.beginPath()
            ctx.fillStyle = color( carrier )
            ctx.arc( p.x, p.y, 0.8, 0, Math.PI*2 )
            ctx.fill()

        })


        ctx.restore()
    }

    return { dom, update }
}
