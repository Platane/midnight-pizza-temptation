import point                                    from 'math/point'


const bezierMarge = 12
const marge = 5
const node_r = 18
const arrow_h = 4
const arrow_l = 6
const arrow_d = 5

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

const color = i =>
    `hsl(${ ( i * 137 + i*i*37 ) % 360 }, 70%, 70%)`

const carrierOnArc = ({ position }) =>
    onArc( position.arc, position.k )

const close = ( ctx, width, height, carriers, network, carrier ) => {

    ctx.clearRect(0,0,width,height)
    ctx.save()


    const p = carrierOnArc( carrier )

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

    carriers.forEach( carrier => {

        const p = getCarrierPosition( carrier )

        ctx.save()
        ctx.fillStyle = color( carrier.index )
        ctx.beginPath()
        ctx.arc( p.x, p.y, 6, 0, Math.PI*2 )
        ctx.fill()
        ctx.restore()

    })

    ctx.restore()
}

module.exports = { close }
