const ctx = document.getElementById('app').getContext('2d')

import point    from 'math/point'

const marge = 3
const node_r = 18
const arrow_h = 4
const arrow_l = 6
const arrow_d = 5
const drawNetwork = ({ nodes, arcs }) => {

    arcs.forEach( x => {

        const n = point.sub( nodes[ x.b ], nodes[ x.a ] )
        const l = point.length( n )

        ctx.save()
        ctx.fillStyle = ctx.strokeStyle = '#ccc'

        ctx.beginPath()
        ctx.moveTo( nodes[ x.a ].x + n.y/l*marge + n.x/l*node_r, nodes[ x.a ].y - n.x/l*marge + n.y/l*node_r )
        ctx.lineTo( nodes[ x.b ].x + n.y/l*marge - n.x/l*node_r, nodes[ x.b ].y - n.x/l*marge - n.y/l*node_r )
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo( nodes[ x.b ].x + n.y/l*marge - n.x/l*(node_r+arrow_d), nodes[ x.b ].y - n.x/l*marge - n.y/l*(node_r+arrow_d) )
        ctx.lineTo( nodes[ x.b ].x + n.y/l*(marge+arrow_h) - n.x/l*(node_r+arrow_l+arrow_d), nodes[ x.b ].y - n.x/l*(marge+arrow_h) - n.y/l*(node_r+arrow_l+arrow_d) )
        ctx.lineTo( nodes[ x.b ].x + n.y/l*(marge-arrow_h) - n.x/l*(node_r+arrow_l+arrow_d), nodes[ x.b ].y - n.x/l*(marge-arrow_h) - n.y/l*(node_r+arrow_l+arrow_d) )
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
        .forEach( (carrier, i) => {
            const arc = network.arcs[ carrier.position.arc ]

            const a = network.nodes[ arc.a ]
            const b = network.nodes[ arc.b ]

            const n = point.sub( b, a )
            const l = point.length( n )

            const p = point.lerp( a, b, carrier.position.k )

            ctx.save()
            ctx.fillStyle = `hsl(${ ( i * 137 + i*i*37 ) % 360 }, 70%, 70%)`
            ctx.beginPath()
            ctx.arc( p.x + n.y/l*marge, p.y - n.x/l*marge, 4, 0, Math.PI*2 )
            ctx.fill()
            ctx.restore()
        })


module.exports = {
    drawNetwork,
    drawCarriers,
    clear: () => ctx.clearRect(0,0,9999,9999),
}
