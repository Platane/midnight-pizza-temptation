const ctx = document.getElementById('app').getContext('2d')

import point    from '../math/point'

const marge = 4
const drawNetwork = ({ nodes, arcs }) => {

    arcs.forEach( x => {

        const n = point.sub( nodes[ x.b ], nodes[ x.a ] )
        const l = point.length( n )

        ctx.save()
        ctx.strokeStyle = '#aaa'
        ctx.beginPath()
        ctx.moveTo( nodes[ x.a ].x + n.y/l*marge, nodes[ x.a ].y - n.x/l*marge )
        ctx.lineTo( nodes[ x.b ].x + n.y/l*marge, nodes[ x.b ].y - n.x/l*marge )
        ctx.stroke()
        ctx.restore()

    })

    nodes.forEach( u => {

        ctx.save()
        ctx.strokeStyle = '#888'
        ctx.beginPath()
        ctx.arc( u.x, u.y, 6, 0, Math.PI*2 )
        ctx.stroke()
        ctx.restore()

    })

}

const drawCarriers = ( network, carriers ) =>
    carriers
        .forEach( (carrier, i) => {
            const arc = network.arcs[ carrier.position.arc ]

            const a = network.nodes[ arc.a ]
            const b = network.nodes[ arc.b ]

            const n = point.sub( b, a )
            const l = point.length( n )

            const p = point.lerp( a, b, carrier.position.k )

            ctx.save()
            ctx.strokeStyle = `hsl(${ (i * 137) % 260 }, 50%, 50%)`
            ctx.beginPath()
            ctx.arc( p.x + n.y/l*marge, p.y - n.x/l*marge, 4, 0, Math.PI*2 )
            ctx.stroke()
            ctx.restore()
        })


module.exports = {
    drawNetwork,
    drawCarriers,
    clear: () => ctx.clearRect(0,0,9999,9999),
}
