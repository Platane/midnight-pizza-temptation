
const inCrossing = ( network, carrier ) =>
    carrier.position.k * network.arcs[ carrier.position.arc ].length > 20



const getCarrierAhead = ( network, carriers, me ) => {

    let ahead

    carriers
        .filter( c =>

            c != me
            &&

            // on the same arc
            c.position.arc == me.position.arc
            &&

            // ahead
            c.position.k > me.position.k
        )
        .forEach( c =>

            !ahead || ahead.position.k > c.position.k
                ? ahead = c
                : null
        )

    return ahead
}


const computeAcceleration = ( network, carriers, me ) => {

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

module.exports = { computeAcceleration }
