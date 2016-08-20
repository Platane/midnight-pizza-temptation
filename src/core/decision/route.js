import { aStar }            from 'math/graph'

const choseNewRoute = ( network, carrier ) => {

    const currentNode = carrier.position.arc.node_b

    const availableDestinations = network.nodes
        .slice( 0, 2 )
        .filter( x => x != currentNode )

    const destination = availableDestinations[ Math.floor(Math.random() * availableDestinations.length) ]

    // chose a path to the destination
    carrier.decision.path = aStar( currentNode, destination, x => x.length )
        .slice(1)
}

module.exports = { choseNewRoute }
