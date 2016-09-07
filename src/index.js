require('file?name=index.html!./index.html')



// import pizza from 'ui/pizza'
// {
//     const ctx = document.getElementById('pizza').getContext('2d')
//     for(let x=15;x--;)
//     for(let y=10;y--;)
//     {
//         ctx.save()
//         ctx.translate(100*x,100*y)
//         // ctx.scale(7,7)
//         pizza( ctx )
//         ctx.restore()
//     }
// }



import generateNetwork          from 'core/generation'

const { perlin, vertices, faces, graph, network, trimed_faces, max_weight } = generateNetwork({
    width           : 700,
    height          : 700,
    perlin_size     : 350,
    n_points        : 380,
    n_sinks         : 16,
})


// const r=5
// for(let x=700;x-=r;)
// for(let y=700;y-=r;){
//
//     ctx.fillStyle = `hsla( ${ perlin( x, y ) * 2 * 280 }, 90%, 60%, 0.07 )`
//     ctx.beginPath()
//     ctx.rect( x, y, r, r )
//     ctx.fill()
// }

// trimed_faces.forEach( face => {
//
//     ctx.beginPath()
//     ctx.strokeStyle='rgba(0,0,0,0.3)'
//     ctx.lineWidth=0.2
//
//     const u = [ face[ face.length-1 ], ...face ].map( i => vertices[ i ] )
//
//     ctx.moveTo( u[0].x, u[0].y )
//     u.forEach( u => ctx.lineTo( u.x, u.y ) )
//     ctx.stroke()
// })
//
// network.endPoints.forEach( ({ node }) => {
//
//     ctx.beginPath()
//     ctx.fillStyle='#33d'
//     ctx.arc( node.x, node.y, 3, 0, Math.PI*2)
//     ctx.fill()
// })
//
// graph.forEach( ( arc, a ) =>
//     arc.forEach( b => {
//
//         ctx.beginPath()
//         ctx.strokeStyle='#33d'
//         ctx.lineWidth=0.1
//         ctx.moveTo( vertices[a].x, vertices[a].y )
//         ctx.lineTo( vertices[b].x, vertices[b].y )
//         ctx.stroke()
//     })
// )
//

import 'ui/app'
import paintMap              from 'ui/map'
// import { drawNetwork, drawCarriers, clear }         from './ui'
import { step }                                     from 'core/runner'

const { update:update_map, static_canvas, dynamic_canvas } = paintMap( 700, 700, 2, network, trimed_faces, vertices, perlin, max_weight )

static_canvas.setAttribute('style','position:absolute;width:700px;height:700px')
dynamic_canvas.setAttribute('style','position:absolute;width:700px;height:700px')

document.getElementById('map').appendChild( static_canvas )
document.getElementById('map').appendChild( dynamic_canvas )

const info = {
    maxAcc      : 0.05,         // px . frame^-2
    maxBrake    : 0.14,         // px . frame^-2
    maxVelocity : 3,            // px . frame^-1
}


const carriers = Array.from({ length: 16 })
    .map((_,i) =>
        ({
            position : {
                arc         : network.endPoints[ i % network.endPoints.length ].node.arcs_leaving[0],
                k           : 0.9,
                velocity    : 0,
            },
            decision : {
                path : [ ],    // nodes
            },
            info    : { ...info, maxVelocity: 1 + Math.random()},
            index   : i,
            game    : { score: 0 },
        })
    )

require('core/player')( carriers )

import { close }            from 'ui/close'
import createPlayerDeck     from 'ui/playerDeck'

const playerDeck = createPlayerDeck( carriers )

document.getElementById('playerDeck').appendChild( playerDeck.dom )

const loop = () => {

    step( network, carriers )

    update_map()

    // clear()
    // drawNetwork( network )
    // drawCarriers( network, carriers )

    playerDeck.update()

    // close( document.getElementById('close').getContext('2d'), 200, 200, carriers, network, carriers[0] )
    // close( document.getElementById('close2').getContext('2d'), 200, 200, carriers, network, carriers[1] )

    requestAnimationFrame( loop )
}
loop()
