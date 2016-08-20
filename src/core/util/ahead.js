
const getCarriersOnArc = ( carriers, arc ) =>
    carriers
        .filter( carrier => carrier.position.arc == arc )

// get the carriers ahead on the same arc
const on_same = ( carriers, arc, l ) =>

    getCarriersOnArc( carriers, arc )

        .map( carrier => {

            const l_ = ( 1-carrier.position.k ) * carrier.position.arc.length

            return l_ < l && { carrier, distance: l-l_ }
        })

        .filter( x => x )

// get the carriers ahead on the entering arcs
// take account of the node priority
const on_entering = ( carriers, arc, next_arc, l ) => {

    const incomingArcs = next_arc
        ? arc.node_b.exchanges
            .find( x => x.arc_a == arc && x.arc_b == next_arc )
            .pass
            .map( ex => ex.arc_a )

        // if the next arc in null, the carrier has the lowest priority ( because fuck him )
        // xxxx should take arc once only ( they can be dup here )
        : arc.node_b.exchanges
            .map( ex => ex.arc_a )
            .filter( arc_i => arc != arc_i )
            && []


    return [].concat(

        ...incomingArcs
            .map( arc =>

                // find all the carriers on this arc
                getCarriersOnArc( carriers, arc )

                    // determine if the carrier is close to the node
                    .map( carrier => {

                        const l_ = ( 1-carrier.position.k ) * carrier.position.arc.length

                        // TODO some consideration of the other carrier velocity ?

                        return l_ < 50 && { carrier, distance: l_ < l ? l - l_ : 0 }

                    })
                    .filter( x => x )
            )
    )
}

// get the carriers ahead on the leaving arcs
const on_leaving = ( carriers, node, l ) =>

    [].concat(

        ...node.arcs_leaving
            .map( arc =>

                // find all the carriers on this arc
                getCarriersOnArc( carriers, arc )

                    // determine if the carrier have crossed the node already
                    .map( carrier => {

                        const l_ = carrier.position.k * carrier.position.arc.length

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
const getCarrierAhead = ( carriers, arc, k, path, carrier, distance=0 ) => {

    if ( distance > 200 )
        return null

    // next arc to go
    const next_arc  = arc.node_b.arcs_leaving.find( x => x.node_b == path[0] )

    // distance to next node
    const l         = ( 1-k ) * arc.length

    const x = [

        // carriers on the same arc, ahead
        ...on_same( carriers, arc, l ),

        // carriers in node, which will enter the node and are in a more prior exchange
        ...on_entering( carriers, arc, next_arc, l ),

        // carriers in node, exiting
        ...on_leaving( carriers, arc.node_b, l ),
    ]

        .filter( x => x.carrier != carrier )

        // take the closest
        .reduce( (ahead, x) =>

            !ahead || ahead.distance > x.distance
                ? x
                : ahead
        ,null)

    return x

        ? { ...x, distance: x.distance+distance }

        : next_arc && getCarrierAhead( carriers, next_arc, 0, path.slice(1), carrier, distance+l )
}


const getCarrierAheadCarrier = ( carriers, carrier, distance=0 ) =>
    getCarrierAhead( carriers, carrier.position.arc, carrier.position.k, carrier.decision.path, carrier, distance )


module.exports = { getCarrierAhead, getCarrierAheadCarrier }
