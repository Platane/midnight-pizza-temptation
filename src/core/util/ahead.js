
const getCarriersOnArc = ( network, carriers, arc_n ) =>
    carriers
        .filter( carrier => carrier.position.arc == arc_n )

// get the carriers ahead on the same arc
const on_same = ( network, carriers, arc_n, l ) =>

    getCarriersOnArc( network, carriers, arc_n )

        .map( carrier => {

            const l_ = ( 1-carrier.position.k ) * network.arcs[ arc_n ].length

            return l_ < l && { carrier, distance: l-l_ }
        })

        .filter( x => x )

// get the carriers ahead on the entering arcs
// take account of the node priority
const on_entering = ( network, carriers, arc, next_node, next_arc, l ) => {

    const incomingArcs = next_arc
        ? next_node.exchanges
            .find( x => x.arc_a == arc.index && x.arc_b == next_arc.index )
            .pass
            .map( i => next_node.exchanges[i].arc_a )

        // if the next arc in null, the carrier has the lowest priority ( because fuck him )
        : next_node.exchanges
            .map( x => x.arc_a  )


    return [].concat(

        ...incomingArcs
            .map( arc_n =>

                // find all the carriers on this arc
                getCarriersOnArc( network, carriers, arc_n )

                    // determine if the carrier is close to the node
                    .map( carrier => {

                        const l_ = ( 1-carrier.position.k ) * network.arcs[ arc_n ].length

                        // TODO some consideration of the other carrier velocity ?

                        return l_ < 50 && { carrier, distance: l_ < l ? l - l_ : 0 }

                    })
                    .filter( x => x )
            )
    )
}

// get the carriers ahead on the leaving arcs
const on_leaving = ( network, carriers, arc, next_node, next_arc, l ) =>

    [].concat(

        ...next_node.leaving
            .map( arc =>

                // find all the carriers on this arc
                getCarriersOnArc( network, carriers, arc.index )

                    // determine if the carrier have crossed the node already
                    .map( carrier => {

                        const l_ = ( carrier.position.k ) * network.arcs[ arc.index ].length

                        // TODO some consideration of the other carrier velocity ?

                        return l_ < 10 && { carrier, distance: l + l_ }

                    })
                    .filter( x => x )
            )
    )


/**
 *
 * find the next carrier on the wished path, considering intersection
 *   -> for intersection :
 *             - consider the ones that are not completely off the intersection even if they not in the path
 *             - consider the ones that are entering the intersection, only if they have the priority in the intersection
 */
const getCarrierAhead = ( network, carriers, arc_n, k, path, distance=0 ) => {

    if ( distance > 200 )
        return null

    // current arc
    const arc       = network.arcs[ arc_n ]

    // next arc to go
    const next_arc  = network.arcs.find( x => x.a == path[0] && x.b == path[1] )

    const next_node = network.nodes[ path[0] ]

    // distance to next node
    const l         = ( 1-k ) * arc.length

    const x = [

        // carriers on the same arc, ahead
        ...on_same( network, carriers, arc_n, l ),

        // carriers in node, which will enter the node and are in a more prior exchange
        ...on_entering( network, carriers, arc, next_node, next_arc, l ),

        // carriers in node, exiting
        ...on_leaving( network, carriers, arc, next_node, next_arc, l ),
    ]

        // take the closest
        .reduce( (ahead, x) =>

            !ahead || ahead.distance > x.distance
                ? x
                : ahead
        ,null)

    return x

        ? { ...x, distance: x.distance+distance }

        : next_arc && getCarrierAhead( network, carriers, next_arc.index, 0, path.slice(1), distance+l )
}


const getCarrierAheadCarrier = ( network, carriers, carrier, distance=0 ) =>
    getCarrierAhead( network, carriers, carrier.position.arc, carrier.position.k, carrier.decision.path, distance )


module.exports = { getCarrierAhead, getCarrierAheadCarrier }
