import point                                    from 'math/point'
import {getCarrierPosition, carrierOnArc}       from './projection'
import color                                    from './color'


const marge = 5
const node_r = 18

const close = ( ctx, width, height, carriers, network, carrier ) => {

    ctx.clearRect(0,0,width,height)
    ctx.save()


    const p = carrierOnArc( carrier )
    const o = { x:p.x - width / 2, y:p.y - height / 2 }

    ctx.translate( -(p.x - width / 2), -( p.y - height / 2 ) )




    network.arcs.forEach( ({node_a, node_b}) => {

        const n = point.sub( node_b, node_a )
        const l = point.length( n )

        ctx.save()
        ctx.fillStyle = ctx.strokeStyle = '#ccc'

        ctx.beginPath()
        ctx.moveTo( node_a.x + n.y/l*marge + n.x/l*node_r, node_a.y - n.x/l*marge + n.y/l*node_r )
        ctx.lineTo( node_b.x + n.y/l*marge - n.x/l*node_r, node_b.y - n.x/l*marge - n.y/l*node_r )
        ctx.stroke()

        ctx.restore()
    })


    // const nexts = [ carrier.position.arc.node_b, ...carrier.decision.path ]
    //
    // ctx.save()
    // ctx.beginPath()
    // ctx.strokeStyle = '#56587e'
    // ctx.lineWidth = 4
    // ctx.moveTo( p.x, p.y )
    // nexts.forEach( p => ctx.lineTo( p.x, p.y ) )
    // ctx.stroke()
    // ctx.restore()

    carriers.forEach( carrier => {

        const p = getCarrierPosition( carrier )

        if ( p.x < o.x-10 || p.y < o.y-10 || p.x > o.x+width+10 || p.y > o.y+height+10 )
            return

        ctx.save()
        ctx.fillStyle = color( carrier )
        ctx.beginPath()
        ctx.arc( p.x, p.y, 6, 0, Math.PI*2 )
        ctx.fill()
        ctx.restore()


    })


    ctx.restore()
}

module.exports = { close }
