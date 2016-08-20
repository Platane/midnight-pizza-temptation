
const intersectionLimit = 50


// if the carrier is in the DMZ of the node he is leaving, return this node
const carrierLeavingNode = ( network, carrier ) => {

    const arc = network.arcs[ carrier.position.arc ]

    if( (1-carrier.position.k) * arc.length < intersectionLimit )
        return network.nodes[ arc.b ]
}

// if the carrier is in the DMZ of the node he is entering, return this node
const carrierEnteringNode = ( network, carrier ) => {

    const arc = network.arcs[ carrier.position.arc ]

    if( carrier.position.k * arc.length < intersectionLimit )
        return network.nodes[ arc.a ]
}

// if the carrier is in a node, return this node
const carrierInNode = ( network, carrier ) =>
    carrierLeavingNode( network, carrier ) && carrierEnteringNode( network, carrier )


module.exports = { carrierEnteringNode, carrierLeavingNode, carrierInNode  }
