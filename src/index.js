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


import {createPerlin}   from 'math/perlin'
import {step as sstep}  from 'math/pointCloud'
import {delaunayTriangulation}  from 'math/tesselation/delaunayTriangulation'
import {voronoiTesselation}     from 'math/tesselation/voronoiTesselation'

const perlin = createPerlin( 700, 700, 200 )

let max = -Infinity
let min =  Infinity

const ctx = document.getElementById('cloud').getContext('2d')
const r=5
for(let x=700;x-=r;)
for(let y=700;y-=r;){

    ctx.fillStyle = `hsla( ${ perlin( x, y ) * 2 * 280 }, 90%, 60%, 0.04 )`
    ctx.beginPath()
    ctx.rect( x, y, r, r )
    ctx.fill()

    max = Math.max( max, perlin( x, y ) )
    min = Math.min( min, perlin( x, y ) )
}

const points = []
while( points.length < 500 ){

    const p = {x:Math.random()*700,y:Math.random()*700}

    if ( Math.random() > perlin( p.x, p.y ) * 2 + 0.5 )
        points.push( p )
}

for( let k=2; k--;)
    sstep( points, [], 700, 700 )

points.forEach( p => {
    ctx.fillStyle = `hsla( ${ perlin( p.x, p.y ) * 2 * 280 }, 90%, 40%, 0.001 )`
    ctx.beginPath()
    ctx.arc( p.x, p.y, 3, 0, Math.PI*2 )
    ctx.fill()
})

const faces = delaunayTriangulation( points )

// faces.forEach( ([a,b,c]) => {
//     ctx.lineStyle='rgba(0,0,0,0.5)'
//     ctx.lineWidth=0.2
//     ctx.beginPath()
//     ctx.moveTo( points[a].x, points[a].y )
//     ctx.lineTo( points[b].x, points[b].y )
//     ctx.lineTo( points[c].x, points[c].y )
//     ctx.lineTo( points[a].x, points[a].y )
//     ctx.stroke()
// })

{
const { faces, vertices } = voronoiTesselation( points )


const roads = []
faces
    .forEach( face =>
        face.forEach((_,i) =>
            roads.push( [ face[i], face[(i+1)%face.length] ] )
        )
    )

roads
.filter( ([a,b],i,arr) => !arr.slice(i+1).some( ([u,v]) => (u==a && v==b) || (u==b && v==a) ) )
.filter( () => Math.random() > 0.4 )
.forEach( road => {
    ctx.lineStyle='rgba(0,0,0,0.5)'
    ctx.lineWidth=0.5
    ctx.beginPath()
    ctx.moveTo( vertices[ road[0] ].x, vertices[ road[0] ].y )
    ctx.lineTo( vertices[ road[1] ].x, vertices[ road[1] ].y )
    ctx.stroke()
})

}
