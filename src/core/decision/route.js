import { aStar }            from 'math/graph'

const choseNewRoute = ( network, carrier ) => {

    const currentNode = network.arcs[ carrier.position.arc ].b

    const destination = network.nodes
        .filter( x => x.index != currentNode )
        [ Math.floor(Math.random() * (network.nodes.length-1)) ]
        .index

    // chose a path to the destination
    carrier.decision.path = aStar( network, currentNode, destination, x => x.length / x.maxSpeed )
        .slice(1)
}

module.exports = { choseNewRoute }
