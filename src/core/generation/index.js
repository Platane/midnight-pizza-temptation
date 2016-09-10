import {createPerlin}           from 'math/perlin'
import {voronoiTesselation}     from 'math/tesselation/voronoiTesselation'
import aStar                    from 'math/graph/aStar'
import {build}                  from 'math/graph/build'
import point                    from 'math/point'
import mergeCloseVertices       from 'math/graph/mergeCloseVertices'
import generatePointCloud       from './pointCloud'

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

const excludeOutOfMap = ( width, height, faces, vertices ) => {
    const out = {}
    vertices.forEach( (p,i) => {
        if ( p.x < 0 || p.x > width || p.y < 0 || p.y > height )
            out[i] = true
    })
    faces = faces.filter( face => !face.some( x => out[ x ] ) )

    return {
        faces,
        out,
    }
}


module.exports = (options={}) => {

    const {
        width,
        height,
        perlin_size,
        n_points,
        n_sinks,
        min_length,
    } = options

    // generate perlin noise
    const perlin = createPerlin( width, height, perlin_size )

    const points = generatePointCloud( perlin, width, height, n_points )

    // generate voronoi tesselation
    let { faces, vertices } = voronoiTesselation( points )

    // round vertices point
    vertices.forEach( u => {
        u.x = Math.round( u.x * 100 ) / 100
        u.y = Math.round( u.y * 100 ) / 100
    })

    // exclude vertices out of the map
    const x = excludeOutOfMap( width, height, faces, vertices )
    faces = x.faces


    // generate the graph from the voronoi graph,
    let completeGraph = graphFromVoronoi( faces, vertices.length )

    // merge the vertices that are too close
    let u = mergeCloseVertices( completeGraph, vertices, min_length )
    completeGraph = u.graph
    vertices = u.vertices

    // pick N sinks
    const sinks = Array.from({ length: n_sinks })
        .map( () => Math.floor( Math.random() * vertices.length ) )
        .filter( i => !x.out[i] && completeGraph[i].length > 0 )


    // format the graph to be used with aStar
    const graph = completeGraph
        .map( ( arcs_leaving, index ) => ({ index, arcs_leaving }) )

    graph.forEach( node =>
        node.arcs_leaving = node.arcs_leaving.map( i => ({ node_a: node, node_b : graph[i] })  )
    )





    const lightGraph = Array.from( vertices ).map( () => [] )
    const w = () => 1

    for( let a=sinks.length; a--; )
    for( let b=sinks.length; b--; )
    {
        const path = aStar( graph[ sinks[a] ], graph[ sinks[b] ], w )

        path && path.forEach( (a,i,arr) => {

            const b = arr[i-1]

            if ( !b )
                return

            lightGraph[ a.index ].push( b.index )
        })
    }

    // build the network
    let _network = lightGraph
        .map( (_,i) => ({ ...vertices[ i ], live:false }) )

    lightGraph.forEach( (arc,i) => {

        const links = arc
            .filter( (k,i,arr) => arc.indexOf(k) == i )

        links.forEach( k => _network[k].live = true )

        const weight={}
        arc.forEach( k => weight[k] = (0|weight[k]) + 1 )


        _network[ i ].weight = links.map( k => weight[k] )

        _network[ i ].links = links.map( j => _network[ j ] )

        _network[ i ].live = _network[ i ].live || links.length>0

    })

    // trim node with no links
    _network = _network
        .filter( ({ live }) => live )

    // attribute index
    _network.forEach( (x,i) => x.index = i )

    // build links
    _network.forEach( (x,i) => x.links = x.links.map( n => n.index ) )

    // build network
    const network = build( _network )


    // build end points from sinks
    const endPoints = sinks
        .map( i => {
            const {x,y} = vertices[ i ]

            const node = network.nodes.find( n => n.x == x && n.y == y )

            return node ? { node } : null
        })
        .filter( x => x )

    const max_distance = width*height/2
    const min_distance = width*height/9
    endPoints.forEach( e =>
        e.reachables = endPoints.filter( x => {
            const d = point.sqrt_distance( x.node, e.node )
            return min_distance < d && d < max_distance
        })
    )


    network.endPoints = endPoints

    // attribute value to each arc
    network.nodes.forEach( x =>

        x.arcs_leaving.forEach( (arc,i) => arc.weight = _network[ x.index ].weight[ i ] )

    )

    return {
        max_weight : network.arcs.reduce( (max,x) => Math.max( max, x.weight ), 0 ),
        perlin,
        faces,
        vertices,
        graph        : lightGraph,
        network,
        endPoints,
    }
}
