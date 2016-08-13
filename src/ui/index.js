const ctx = document.getElementById('app').getContext('2d')

import {lerp}   from '../math/point'

const drawNetwork = ({ nodes, arcs }) => {

    arcs.forEach( x => {

        console.log( x )

        ctx.save()
        ctx.strokeStyle = '#aaa'
        ctx.beginPath()
        ctx.moveTo( nodes[ x.a ].x, nodes[ x.a ].y )
        ctx.lineTo( nodes[ x.b ].x, nodes[ x.b ].y )
        ctx.stroke()
        ctx.restore()

    })

    nodes.forEach( u => {

        ctx.save()
        ctx.strokeStyle = '#888'
        ctx.beginPath()
        ctx.arc( u.x, u.y, 4, 0, Math.PI*2 )
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

            const p = lerp( a, b, carrier.position.k )

            ctx.save()
            ctx.strokeStyle = `hsl(${ (i * 137) % 260 }, 50%, 50%)`
            ctx.beginPath()
            ctx.arc( p.x, p.y, 5, 0, Math.PI*2 )
            ctx.stroke()
            ctx.restore()
        })


module.exports = {
    drawNetwork,
    drawCarriers,
    clear: () => ctx.clearRect(0,0,9999,9999)
}
