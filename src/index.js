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

const dom_map = document.getElementById('map')

const x = document.getElementById('map_').getBoundingClientRect()

const width     = Math.min(Math.max( 400, Math.min( x.width, x.height ) - 40 ), 1000 )
const height    = width

const { perlin, vertices, faces, graph, network, trimed_faces, max_weight } = generateNetwork({
    width,
    height,
    perlin_size     : 350,
    n_points        : 380,
    n_sinks         : 16,
})


import 'ui/app'
import paintMap             from 'ui/map'
import paintCarrier         from 'ui/carrier'
import { step }             from 'core/runner'



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

import createPlayerDeck     from 'ui/playerDeck'


const { update:update_map, static_canvas, dynamic_canvas }  = paintMap( width, height, 2, network, trimed_faces, vertices, perlin, max_weight )
const { update: update_carrier, canvas:carrier_canvas }     = paintCarrier( width, height, carriers )

static_canvas.setAttribute('style',`position:absolute;width:${ width }px;height:${ height }px`)
dynamic_canvas.setAttribute('style',`position:absolute;width:${ width }px;height:${ height }px`)
carrier_canvas.setAttribute('style',`position:relative;`)

dom_map.appendChild( static_canvas )
dom_map.appendChild( dynamic_canvas )
dom_map.appendChild( carrier_canvas )



const playerDeck = createPlayerDeck( carriers )

document.getElementById('playerDeck').appendChild( playerDeck.dom )

const loop = () => {

    step( network, carriers )

    update_map()
    update_carrier()

    // clear()
    // drawNetwork( network )
    // drawCarriers( network, carriers )

    playerDeck.update()

    // close( document.getElementById('close').getContext('2d'), 200, 200, carriers, network, carriers[0] )
    // close( document.getElementById('close2').getContext('2d'), 200, 200, carriers, network, carriers[1] )

    requestAnimationFrame( loop )
}
loop()
