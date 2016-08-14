import { aStar }            from 'math/graph'

const choseNewRoute = ( network, carrier ) => {

    const currentNode = network.arcs[ carrier.position.arc ].b

    const availableDestinations = network.nodes
        .slice( 0, 2 )
        .filter( x => x.index != currentNode )

    const destination = availableDestinations[ Math.floor(Math.random() * availableDestinations.length) ].index

    // chose a path to the destination
    carrier.decision.path = aStar( network, currentNode, destination, x => x.length / x.maxSpeed )
        .slice(1)
}

module.exports = { choseNewRoute }
