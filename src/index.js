require('file?name=index.html!./index.html')


// const seed = Math.random()
const seed = 0.6440666625006068
const l = 2<<29
let r = 0|(seed * l)
console.log( seed )
Math.random = () => {
    r = 0|Math.abs( +( l + seed + r*r ).toString().slice( 2, -2 ) % l )
    return r / l
}



import generateNetwork          from 'core/generation'

const dom_map = document.getElementById('map')

const x = document.getElementById('map_').getBoundingClientRect()

const width     = 0|Math.min(Math.max( 400, Math.min( x.width, x.height ) - 40 ), 1000 )
const height    = width

const { perlin, vertices, network, faces, max_weight } = generateNetwork({
    width,
    height,
    perlin_size     : 350,
    n_points        : 180,
    n_sinks         : 5,
    min_length      : 6,
})


import paintCarrier         from 'ui/carrier'
import { step }             from 'core/runner'



const info = {
    maxAcc      : 0.05,         // px . frame^-2
    maxBrake    : 0.14,         // px . frame^-2
    maxVelocity : 3,            // px . frame^-1
}


const carriers = Array.from({ length: 26 })
    .map((_,i) =>
        ({
            position : {
                arc         : network.endPoints[ 0 ].node.arcs_entering[0],
                k           : 0.5,
                velocity    : 0,
            },
            decision : {
                path : [ ],    // nodes
            },
            info    : { ...info, maxVelocity: 0.8 + Math.random() * 0.9 },
            index   : i,
            game    : { score: -1 },
        })
    )

require('core/player')( carriers )

import createPlayerDeck     from 'ui/playerDeck'
import createCamList        from 'ui/closeCam/list'

const max_zoom = 3.5

const backgrounds = {

    night           : require('ui/background/night')( width, height, 1, faces, vertices, perlin ),

    roads_large     : require('ui/background/roads')( width, height, 1, network, max_weight, 0, 1.5 ),

    roads_precise   : require('ui/background/precise_roads')( width, height, max_zoom, network, max_weight, 0.6, 0.1 ),
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

const camList    = createCamList( carriers, network, backgrounds, 0.6, 1.5 )
document.getElementById('camlist').appendChild( camList.dom )

import {createExchange}                 from 'ui/exchange'


// network.nodes
//     .every( node => {
//         if ( node.arcs_entering.length == 0 && node.arcs_leaving.length == 0 )
//             debugger
//     })
// network.endPoints
//     .every( endPoint => {
//         if ( endPoint.reachables.length == 0 )
//             debugger
//     })


let u

const loop = () => {

    backgrounds.night.u()
    backgrounds.roads_large.u()
    backgrounds.roads_precise.u()

    step( network, carriers )

    update_carrier()

    playerDeck.update()
    camList.update()


    const k = carriers[0].position.arc.node_b.exchanges

    if ( u != k && k.length ){

        const ex = document.getElementById('exchange')

        while( ex.children[0] )
            ex.removeChild( ex.children[0] )

        ex.appendChild( createExchange( u=k ) )
    }

    requestAnimationFrame( loop )
}
loop()
