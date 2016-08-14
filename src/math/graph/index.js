import point    from 'math/point'

// precompute stuff
const prepare = network => {

    network.nodes.forEach( (n,index) => {

        n.leaving   = []
        n.entering  = []

        n.index = index
    })

    network.arcs.forEach( (x,index) => {

        x.index = index
        x.length = point.distance( network.nodes[ x.a ], network.nodes[ x.b ] )

        network.nodes[ x.a ].leaving.push( x )
        network.nodes[ x.b ].entering.push( x )
    })

}




// return the fastest path to go from a to b
// compute_w is the method which attribute the weight to the arc, by default it's its length
const aStar = ( network, node_start, node_end, compute_w ) => {

    compute_w = compute_w || ( x => x.length )

    const h = point.distance( network.nodes[ node_start ], network.nodes[ node_end ] )
    let openList  = [{
        node    : node_start,
        w       : 0,
        f       : h,
        h,
    }]
    const closeList = {}

    while( openList.length ){

        const e = openList.shift()

        if ( e.node == node_end ) {
            // end

            let u = e
            const path = [ u.node ]
            while( u.parent ){
                u = u.parent
                path.unshift( u.node )
            }

            return path
        }

        // propage
        network.nodes[ e.node ].leaving
            .forEach( arc => {

                if ( closeList[ arc.b ] )
                    return

                const w = e.w + compute_w( arc )

                const u = openList.find( u => u.node == arc.b )

                if ( u && u.w > w ) {

                    u.w = w
                    u.f = w + u.h
                    u.parent = e

                } else if ( !u ){

                    const h = point.distance( network.nodes[ node_end ], network.nodes[ arc.b ] )
                    openList.push({
                        node    : arc.b,
                        w,
                        h,
                        f       : w+h,
                        parent  : e
                    })
                }

            })

        closeList[ e.node ] = true

        openList = openList.sort( (a,b) => a.f < b.f ? 1 : -1 )
    }

}

module.exports = { prepare, aStar }
