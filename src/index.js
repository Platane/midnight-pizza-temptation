require('file?name=index.html!./index.html')

import { drawNetwork, drawCarriers, clear }         from './ui'
import { step }                                     from 'core/runner'
import { build }                                    from 'math/graph/build'
import { aStar }                                    from 'math/graph'

const network = build([
    { x:50 , y:50 , links: [3]   },
    { x:750, y:50 , links: [3]   },
    { x:400, y:450, links: [0,1] },
    { x:400, y:50 , links: [2]   },
])
// const network = build([
//     { x:100,    y:100,   links:[1] },
//     { x:100,    y:400,   links:[2] },
//     { x:400,    y:400,   links:[3] },
//     { x:400,    y:100,   links:[0] },
// ])


const info = {
    maxAcc      : 0.05,         // px . frame^-2
    maxBrake    : 0.14,         // px . frame^-2
    maxVelocity : 3,            // px . frame^-1
}


const carriers = Array.from({ length: 30 })
    .map((_,i) =>
        ({
            position : {
                arc         : network.arcs[ i % network.arcs.length ],
                k           : Math.random(),
                velocity    : 0,
            },
            decision : {
                path : [ ],    // nodes
            },
            info    : { ...info, maxVelocity: 1 + Math.random()},
            index   : i,
        })
    )

const loop = () => {

    step( network, carriers )

    clear()
    drawNetwork( network )
    drawCarriers( network, carriers )

    requestAnimationFrame( loop )
}
loop()


// import genreratePointCloud from 'math/pointCloud'
//
//
// const {points, wells} = genreratePointCloud({
//     n_point : 1000,
//     width   : 500,
//     height  : 500,
//     n_well  : 10,
// })
//
// const ctx = document.getElementById('cloud').getContext('2d')
// wells.forEach( p => {
//     ctx.fillStyle = '#f2a1e0'
//     ctx.beginPath()
//     ctx.arc( p.x, p.y, 4, 0, Math.PI*2 )
//     ctx.fill()
// })
// points.forEach( p => {
//     ctx.fillStyle = '#72a180'
//     ctx.beginPath()
//     ctx.arc( p.x, p.y, 1.5, 0, Math.PI*2 )
//     ctx.fill()
// })
