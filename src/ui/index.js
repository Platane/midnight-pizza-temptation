const ctx = document.getElementById('app').getContext('2d')

import point    from 'math/point'
import {getCarrierAheadCarrier} from 'core/util/ahead'

const bezierMarge = 12
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

const onArc = ( arc, k ) => {
    const {node_a, node_b} = arc

    const n = point.sub( node_b, node_a )
    const l = point.length( n )

    const p = point.lerp( node_a, node_b, k )

    return {
        x : p.x + n.y/l*marge,
        y : p.y - n.x/l*marge,
    }
}

const carrierOnArc = ({ position }) =>
    onArc( position.arc, position.k )

const bezier = ( A, O, B, k ) => {
    const _k = 1-k
    return {
        x : A.x * _k * _k   +   2 * k * _k * O.x   +   k * k * B.x,
        y : A.y * _k * _k   +   2 * k * _k * O.y   +   k * k * B.y,
    }
}

const color = i =>
    `hsl(${ ( i * 137 + i*i*37 ) % 360 }, 70%, 70%)`


const _cache = {}
const getCarrierPosition = carrier => {

    const distanceToEnd     = ( 1-carrier.position.k ) * carrier.position.arc.length
    const distanceToStart   = carrier.position.k * carrier.position.arc.length

    if ( distanceToEnd < bezierMarge && carrier.decision.path[ 0 ] ) {

        if ( !_cache[ carrier.index ] ) {

            const arcA = carrier.position.arc
            const arcB = carrier.position.arc.node_b.arcs_leaving.find( x => x.node_b == carrier.decision.path[0] )

            _cache[ carrier.index ] = {
                A : onArc( arcA, 1 - bezierMarge / arcA.length ),
                O : carrier.position.arc.node_b,
                B : onArc( arcB, bezierMarge / arcB.length ),
            }
        }

        const { A, O, B } = _cache[ carrier.index ]

        return bezier( A, O, B, (1-distanceToEnd/bezierMarge) *0.5 )

    } else if ( distanceToStart < bezierMarge && _cache[ carrier.index ] ) {

        const { A, O, B } = _cache[ carrier.index ]

        return bezier( A, O, B, distanceToStart/bezierMarge *0.5 + 0.5 )

    } else {

        _cache[ carrier.index ] = null

        return carrierOnArc( carrier )
    }
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
            ctx.strokeStyle = color( u.index )
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
            ctx.fillStyle = color( carrier.index )
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
