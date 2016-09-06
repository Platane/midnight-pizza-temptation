const ctx = document.getElementById('app').getContext('2d')

import point                    from 'math/point'
import {getCarrierAheadCarrier} from 'core/util/ahead'
import {getCarrierPosition}     from './projection'
import color                    from './color'

const marge = 5
const node_r = 18
const arrow_h = 4
const arrow_l = 6
const arrow_d = 5
const drawNetwork = ({ nodes, arcs }) => {

    arcs.forEach( arc => {

        const {node_a, node_b} = arc

        const n = point.sub( node_b, node_a )
        const l = point.length( n )

        ctx.save()
        ctx.fillStyle = ctx.strokeStyle = '#ccc'

        ctx.beginPath()
        ctx.moveTo( node_a.x + n.y/l*marge + n.x/l*node_r, node_a.y - n.x/l*marge + n.y/l*node_r )
        ctx.lineTo( node_b.x + n.y/l*marge - n.x/l*node_r, node_b.y - n.x/l*marge - n.y/l*node_r )
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo( node_b.x + n.y/l*marge - n.x/l*(node_r+arrow_d), node_b.y - n.x/l*marge - n.y/l*(node_r+arrow_d) )
        ctx.lineTo( node_b.x + n.y/l*(marge+arrow_h) - n.x/l*(node_r+arrow_l+arrow_d), node_b.y - n.x/l*(marge+arrow_h) - n.y/l*(node_r+arrow_l+arrow_d) )
        ctx.lineTo( node_b.x + n.y/l*(marge-arrow_h) - n.x/l*(node_r+arrow_l+arrow_d), node_b.y - n.x/l*(marge-arrow_h) - n.y/l*(node_r+arrow_l+arrow_d) )
        ctx.fill()

        ctx.restore()

    })

    nodes.forEach( u => {

        ctx.save()
        ctx.strokeStyle = '#ccc'
        ctx.beginPath()
        ctx.arc( u.x, u.y, node_r, 0, Math.PI*2 )
        ctx.stroke()
        ctx.restore()

    })

}


const drawCarriers = ( network, carriers ) =>

    carriers
        .forEach( (u, i) => {

            const x = getCarrierAheadCarrier( carriers, u )

            if ( !x )
                return

            const v = x.carrier

            const w = ( 1 - Math.min( 100, x.distance ) / 100 )

            const U = getCarrierPosition( u )
            const V = getCarrierPosition( v )

            ctx.save()
            ctx.strokeStyle = color( u )
            ctx.lineWidth = w * 5
            ctx.globalAlpha = w
            ctx.beginPath()
            ctx.moveTo( U.x, U.y )
            ctx.lineTo( V.x, V.y )
            ctx.stroke()
            ctx.restore()
        })

    ||

    carriers
        .forEach( (carrier, i) => {

            const p = getCarrierPosition( carrier )

            ctx.save()
            ctx.fillStyle = color( carrier )
            ctx.beginPath()
            ctx.arc( p.x, p.y, 6, 0, Math.PI*2 )
            ctx.fill()
            ctx.restore()
        })


module.exports = {
    drawNetwork,
    drawCarriers,
    clear: () => ctx.clearRect(0,0,9999,9999),
}
