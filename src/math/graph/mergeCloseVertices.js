import point                    from 'math/point'

module.exports = ( graph, vertices, min_length = 0 ) => {

    // // find couple of vertices which are too close together

    const links = []

    const sq_min_length = min_length * min_length

    for(let a=vertices.length;a--;)
    for(let b=a;b--;)
        if( sq_min_length > point.sqrt_distance( vertices[a], vertices[b] ) )
            links.push([b,a])


    // // clusterize, determine group of vertices which are too close together

    const clusters = []

    links.forEach( ([a,b]) => {

        const linked = clusters
            .filter( indexes => indexes.indexOf( a ) >= 0 || indexes.indexOf( b ) >= 0 )

        if ( linked.length == 0 )
            clusters.push([a,b])

        else {
            // merge
            const merged = [].concat( ...linked, a,b ).filter( (x,i,arr) => arr.indexOf(x)==i )

            linked.forEach( arr => arr.length=0 )
            linked[ 0 ].push( ...merged )
        }
    })

    // // merge the vertices in clusters
    let _graph = graph.slice()
    const _vertices = vertices.slice()
    clusters
    .filter( x => x.length >= 0 )
    .forEach( indexes => {


        // push the merged point
        const g = {x:0,y:0}
        indexes.forEach( i => { g.x += vertices[i].x; g.y += vertices[i].y })
        g.x /= indexes.length
        g.y /= indexes.length


        const i = _vertices.length
        _vertices.push( g )


        // update the graph

        // set entering arcs
        _graph = _graph.map( arr =>
            arr
                .map( x =>
                    indexes.indexOf( x ) >= 0
                        ? i
                        : x
                )
                .filter( (x,i,arr) => arr.indexOf( x ) == i )
        )

        // set leaving arcs
        _graph[ i ] = [].concat( ...indexes.map( i => _graph[i] ) )
            .filter( (x,i,arr) => arr.indexOf( x ) == i )
            .filter( x => indexes.indexOf( x ) == -1 && x != i )

        // empty in cluster
        indexes.forEach( i => _graph[i] = []  )
    })


    return { graph: _graph, vertices: _vertices }
}
