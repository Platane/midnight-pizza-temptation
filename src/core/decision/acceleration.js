


// return the list on carrier on this arc
const getCarriersOnArc = ( network, carriers, arc ) =>
    carriers
        .filter( x => x.position.arc == arc )

const intersectionLimit = 50

// if the carrier is in a node, return this node
const carrierInNode = ( network, carrier ) => {

    const arc = network.arcs[ carrier.position.arc ]

    if( carrier.position.k * arc.length < intersectionLimit )
        return arc.a

    if( (1-carrier.position.k) * arc.length < intersectionLimit )
        return arc.b

    return null
}

// return all the carriers that are in the intersection ( = inside the intersectionLimit radius )
// whether they are leaving or entering
const getCarriersInNode = ( network, carriers, node ) =>

    carriers
        .filter( carrier => carrierInNode( network, carrier ) == node  )


const getCarrierAhead = ( network, carriers, me ) =>

    getCarriersOnArc( network, carriers, me.position.arc )
        .filter( carrier =>
            // not the same as me, and ahead
            carrier != me && carrier.position.k > me.position.k
        )
        .reduce( (ahead, carrier) =>

            !ahead || ahead.position.k > carrier.position.k
                ? carrier
                : ahead
        ,null)


const computeAccelerationAroundNode = ( network, carriers, me, node ) => {

    return 0
}

const computeAccelerationOnArc = ( network, carriers, me ) => {

    const carrierAhead = getCarrierAhead( network, carriers, me )

    const distanceAhead = !carrierAhead
        ? Infinity
        : ( carrierAhead.position.k - me.position.k ) * network.arcs[ me.position.arc ].length

    if ( distanceAhead > 50 )
        return me.info.maxAcc

    else if ( distanceAhead < 25 )
        return -me.info.maxBrake

    else
        return 0
}

const computeAcceleration = ( network, carriers, me ) => {

    const node = carrierInNode( network, me )

    return node === null || getCarrierAhead( network, carriers, me )
        ? computeAccelerationOnArc( network, carriers, me )
        : computeAccelerationAroundNode( network, carriers, me, node )
}

module.exports = { computeAcceleration }
