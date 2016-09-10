import aStar    from 'math/graph/aStar'

const choseNewRoute = ( network, carrier ) => {

    const currentNode = carrier.position.arc.node_b

    const endPoint = network.endPoints.find( x => x.node == currentNode )

    const availableDestinations = ( endPoint && endPoint.reachables.length && endPoint.reachables || network.endPoints ).map( x => x.node )

    const destination = availableDestinations[ Math.floor(Math.random() * availableDestinations.length) ]

    // chose a path to the destination
    return aStar( currentNode, destination, x => x.length )
        .slice(1)
}

module.exports = { choseNewRoute }
