import {createPerlin}   from 'math/perlin'
import {step as sstep}  from 'math/pointCloud'
import {delaunayTriangulation}  from 'math/tesselation/delaunayTriangulation'
import {voronoiTesselation}     from 'math/tesselation/voronoiTesselation'
import {aStar}                  from 'math/graph'


const pointPerlinRepartition = ( perlin, width, height, n  ) => {

    const points = []
    while( points.length < n ){

        const p = {x:Math.random()*width,y:Math.random()*height}

        if ( Math.random() > perlin( p.x, p.y ) * 2 + 0.5 )
            points.push( p )
    }

    return points
}

const graphFromVoronoi = ( faces, n ) => {

    const graph = Array.from({ length: n }).map( () => [] )

    faces
        .forEach( face =>
            face.forEach((a,i,arr) => {

                const b = arr[ (i+1)%arr.length ]

                graph[ a ].push( b )

                graph[ b ].push( a )

            })
        )

    return graph.map( arc => arc.filter( (x,i,arr) => arr.indexOf( x ) == i ) )
}



module.exports = (options={}) => {

    const {
        width,
        height,
        perlin_size,
        n_points,
        n_sinks,
    } = options

    // generate perlin noise
    const perlin = createPerlin( width, height, perlin_size )

    // generate N point with perlin noise repartition
    const points = pointPerlinRepartition( perlin, width, height, n_points )

    // physic step, to seprate the points
    for( let k=2; k--;)
        sstep( points, [], width, height )

    // generate voronoi tesselation
    const { faces, vertices } = voronoiTesselation( points )

    // pick N sinks
    const sinks = Array.from({ length: n_sinks })
        .map( () => Math.floor( Math.random() * vertices.length ) )

    // generate the graph from the voronoi graph,
    // and format it as such as it can be used in aStar
    const graph = graphFromVoronoi( faces, vertices.length )
        .map( ( arcs_leaving, index ) => ({ index, arcs_leaving }) )

    graph.forEach( node =>
        node.arcs_leaving = node.arcs_leaving.map( i => ({ node_a: node, node_b : graph[i] })  )
    )





    const lightGraph = Array.from( vertices ).map( () => [] )
    const w = () => 1

    for( let a=sinks.length; a--; )
    for( let b=a; b--; )
    {
        const path = aStar( graph[ sinks[a] ], graph[ sinks[b] ], w )

        path.forEach( (a,i,arr) => {

            const b = arr[i-1]

            if ( !b )
                return

            lightGraph[ a.index ].push( b.index )
        })

    }

    return {
        sinks,
        perlin,
        faces,
        vertices,
        graph : lightGraph,
    }
}
