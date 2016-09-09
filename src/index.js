require('file?name=index.html!./index.html')



import pizza from 'ui/pizza'
{
    const ctx = document.getElementById('pizza').getContext('2d')
    for(let x=15;x--;)
    for(let y=10;y--;)
    {
        ctx.save()
        ctx.translate(100*x,100*y)
        // ctx.scale(7,7)
        pizza( ctx )
        ctx.restore()
    }
}



import generateNetwork          from 'core/generation'

const dom_map = document.getElementById('map')

const x = document.getElementById('map_').getBoundingClientRect()

const width     = Math.min(Math.max( 400, Math.min( x.width, x.height ) - 40 ), 1000 )
const height    = width

const { perlin, vertices, faces, graph, network, trimed_faces, max_weight } = generateNetwork({
    width,
    height,
    perlin_size     : 350,
    n_points        : 80,
    n_sinks         : 6,
})


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
            game    : { score: -1 },
        })
    )

require('core/player')( carriers )

import createPlayerDeck     from 'ui/playerDeck'
import createCamList        from 'ui/closeCam/list'

const backgrounds = {

    night           : require('ui/background/night')( width, height, 2, trimed_faces, vertices, perlin ),

    roads_large     : require('ui/background/roads')( width, height, 1, network, max_weight, 0, 2 ),

    roads_precise   : require('ui/background/roads')( width, height, 2, network, max_weight, 2, 3 ),
}

const { update: update_carrier, canvas:carrier_canvas }     = paintCarrier( width, height, carriers )

backgrounds.night.s.setAttribute('style',`position:absolute;width:${ width }px;height:${ height }px`)
backgrounds.night.d.setAttribute('style',`position:absolute;width:${ width }px;height:${ height }px`)
backgrounds.roads_large.s.setAttribute('style',`position:absolute;width:${ width }px;height:${ height }px`)
backgrounds.roads_large.d.setAttribute('style',`position:absolute;width:${ width }px;height:${ height }px`)
carrier_canvas.setAttribute('style',`position:relative;width:${ width }px;height:${ height }px`)

while( dom_map.children[0] )
    dom_map.removeChild( dom_map.children[0] )

dom_map.appendChild( backgrounds.night.s )
dom_map.appendChild( backgrounds.night.d )
dom_map.appendChild( backgrounds.roads_large.s )
dom_map.appendChild( backgrounds.roads_large.d )
dom_map.appendChild( carrier_canvas )




const playerDeck = createPlayerDeck( carriers )
document.getElementById('playerDeck').appendChild( playerDeck.dom )

const camList    = createCamList( carriers, network, backgrounds, 2, 3 )
document.getElementById('camlist').appendChild( camList.dom )

const loop = () => {

    backgrounds.night.u()
    backgrounds.roads_large.u()
    backgrounds.roads_precise.u()

    step( network, carriers )

    update_carrier()

    playerDeck.update()
    camList.update()

    requestAnimationFrame( loop )
}
loop()
