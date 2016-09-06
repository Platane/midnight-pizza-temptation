import point    from 'math/point'
import bezier   from 'math/bezier'

const bezierMarge = 12
const marge = 5

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


module.exports = { getCarrierPosition, carrierOnArc }
