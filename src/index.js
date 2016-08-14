require('file?name=index.html!./index.html')

import { drawNetwork, drawCarriers, clear }         from './ui'
import { prepare as prepareNetwork, aStar }         from 'math/graph'


const n= 5
const network = {
    nodes    : [
        ...Array.from({ length: n }, (_,i) => ({ x: Math.cos( i/n * 6.28 ) * 200 + 250, y: Math.sin( i/n * 6.28 ) * 200 + 250 })),
        { x: 250, y: 250 },
        { x: 450, y: 350 },
    ],
    arcs     : [
        ...Array.from({ length: n }, (_,i) => ({ a: n, b:i }) ),
        ...Array.from({ length: n }, (_,i) => ({ b: n, a:i }) ).filter( x => x.a != 2 ),
        { a: 1, b: n+1 },
        { a: n+1, b: 0 },
        { a: 2, b: 3 },
    ],
}


prepareNetwork( network )

const carriers = Array.from({ length: 10 })
    .map((_,i) =>
        ({
            position : {
                arc : i % network.arcs.length,
                k   : Math.random()
            },
            path : [],
        })
    )

aStar( network, 1, 2 )


const loop = () => {

    carriers
        .forEach( carrier => {

            // move
            carrier.position.k += 2 / network.arcs[ carrier.position.arc ].length

            // decision making
            if ( carrier.position.k >=1 ) {

                const currentNode = network.arcs[ carrier.position.arc ].b

                if ( carrier.path.length == 0 ){

                    // pick a new destination
                    const destination = network.nodes
                        .filter( x => x.index != currentNode )
                        [ Math.floor(Math.random() * (network.nodes.length-1)) ]
                        .index

                    // chose a path to the destination
                    carrier.path = aStar( network, currentNode, destination )
                        .slice(1)
                }

                const next = carrier.path.shift()
                carrier.position.arc    = network.nodes[ currentNode ].leaving
                    .find( arc => arc.b == next )
                    .index
                carrier.position.k      = 0
            }
        })

    clear()
    drawNetwork( network )
    drawCarriers( network, carriers )

    requestAnimationFrame( loop )
}
loop()
