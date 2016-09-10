import point    from 'math/point'


// return the fastest path to go from a to b
// compute_w is the method which attribute the weight to the arc, by default it's its length
module.exports = ( node_start, node_end, compute_w ) => {

    compute_w = compute_w || ( x => x.length )

    const h = point.distance( node_start, node_end )
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
        e.node.arcs_leaving
            .forEach( arc => {

                if ( closeList[ arc.node_b.index ] )
                    return

                const w = e.w + compute_w( arc )

                const u = openList.find( u => u.node == arc.node_b )

                if ( u && u.w > w ) {

                    u.w = w
                    u.f = w + u.h
                    u.parent = e

                } else if ( !u ){

                    const h = point.distance( node_end, arc.node_b )
                    openList.push({
                        node    : arc.node_b,
                        w,
                        h,
                        f       : w+h,
                        parent  : e
                    })
                }

            })

        closeList[ e.node.index ] = true

        openList = openList.sort( (a,b) => a.f > b.f ? 1 : -1 )
    }

}
