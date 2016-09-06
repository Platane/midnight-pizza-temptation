
const angle = ( o, a ) =>
    Math.atan2( a.y-o.y, a.x-o.x )


const buildExchange = node => {

    const angles = [

        ...node.arcs_entering.map( arc =>
            ({ angle: angle( node, arc.node_a ) - 0.001, arc, entering : true, node:arc.node_a })
        )

        ,
        ...node.arcs_leaving.map( arc =>
            ({ angle: angle( node, arc.node_b ) + 0.001, arc, entering : false, node:arc.node_b })
        )
        ,
    ]
        .sort( (a,b) => a.angle > b.angle ? 1 : -1 )

    const exchanges = []

    // all combinaison possible
    node.arcs_entering.forEach( arc_a =>
    node.arcs_leaving.forEach( arc_b => {

        if ( arc_a.node_a != arc_b.node_b )
            exchanges.push({ arc_a, arc_b, block:[], pass:[], index:exchanges.length, node_a:arc_a.node_a, node_b:arc_b.node_b })

    })
    )

    exchanges.forEach( exchange => {

        const { arc_a, arc_b } = exchange

        let i = angles.findIndex( x => x.arc == arc_a )


        const conflicting_exits = [ arc_b ]

        // go throught all the arc between arc_a and arc_b counter clock wise
        for( ; angles[i%angles.length].arc != arc_b; i++ ) {

            const { arc, entering } = angles[i%angles.length]

            if ( !entering )
                conflicting_exits.push( arc )

        }

        // go throught all the arc between arc_b and arc_a counter clock wise
        for( ; angles[i%angles.length].arc != arc_a; i++ ) {

            const { arc, entering } = angles[i%angles.length]

            if ( !entering )
                continue

            const arc_a = arc

            conflicting_exits.forEach( arc_b => {

                const prior = exchanges.find( x => x.arc_a == arc_a && x.arc_b == arc_b )

                if ( !prior )
                    return

                prior.block.push( exchange )

                exchange.pass.push( prior )
            })
        }

    })

    return exchanges
}

module.exports = buildExchange
