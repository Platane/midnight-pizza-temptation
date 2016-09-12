import point                from 'math/point'
import bezier               from 'math/bezier'
import {exchangeCurve}      from 'ui/exchange-projection'


const onArc = ( arc, k, marge=0 ) => {
    const {node_a, node_b} = arc

    const n = point.sub( node_b, node_a )
    const l = point.length( n )

    const p = point.lerp( node_a, node_b, k )

    return {
        x : p.x - n.y/l*marge,
        y : p.y + n.x/l*marge,
    }
}

const carrierOnArc = ({ position }, marge) =>
    onArc( position.arc, position.k, marge )

const _cache = {}
const getCarrierPosition = ( carrier, marge, bezierMarge ) => {

    const distanceToEnd     = ( 1-carrier.position.k ) * carrier.position.arc.length
    const distanceToStart   = carrier.position.k * carrier.position.arc.length

    _cache[ bezierMarge ] = _cache[ bezierMarge ] || {}

    if ( distanceToEnd < bezierMarge && carrier.decision.path[ 0 ] ) {


        if ( !_cache[ bezierMarge ][ carrier.index ] ) {

            const arcA = carrier.position.arc
            const arcB = carrier.position.arc.node_b.arcs_leaving.find( x => x.node_b == carrier.decision.path[0] )

            _cache[ bezierMarge ][ carrier.index ] = exchangeCurve( marge, bezierMarge, arcA.node_a, arcA.node_b, arcB.node_b  )
        }

        const { A, C, B } = _cache[ bezierMarge ][ carrier.index ]

        return bezier( A, C, B, (1-distanceToEnd/bezierMarge) *0.5 )

    } else if ( distanceToStart < bezierMarge && _cache[ bezierMarge ][ carrier.index ] ) {

        const { A, C, B } = _cache[ bezierMarge ][ carrier.index ]

        return bezier( A, C, B, distanceToStart/bezierMarge *0.5 + 0.5 )

    } else {

        _cache[ bezierMarge ][ carrier.index ] = null

        return carrierOnArc( carrier, marge )
    }
}


module.exports = { getCarrierPosition, carrierOnArc }
