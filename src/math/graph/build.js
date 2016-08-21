
import point from 'math/point'

const angle = ( o, a ) =>
    Math.atan2( a.y-o.y, a.x-o.x )


const buildExchange = node => {

    const angles = [

        ...node.arcs_entering.map( arc =>
            ({ angle: angle( node, arc.node_a ), arc, entering : true })
        )

        ,
        ...node.arcs_leaving.map( arc =>
            ({ angle: angle( node, arc.node_b ), arc, entering : false })
        )
        ,
    ]
        .sort( (a,b) => a.angle < b.angle ? 1 : -1 )

    const exchanges = []

    node.arcs_entering.forEach( arc_a =>
    node.arcs_leaving.forEach( arc_b => {

        if ( arc_a.node_a != arc_b.node_b )
            exchanges.push({ arc_a, arc_b, block:[], pass:[], index:exchanges.length })

    })
    )

    exchanges.forEach( exchange => {

        const { arc_a, arc_b } = exchange

        let i = angles.findIndex( x => x.arc == arc_a )


        const conflicting_exits = [ arc_b ]

        // go throught all the arc between arc_a and arc_b counter clock wise
        for( ; angles[i%angles.length].arc != arc_b; i++ ) {

            const { angle, arc, entering } = angles[i%angles.length]

            if ( !entering )
                conflicting_exits.push( arc )

        }

        // go throught all the arc between arc_b and arc_a counter clock wise
        for( ; angles[i%angles.length].arc != arc_a; i++ ) {

            const { angle, arc, entering } = angles[i%angles.length]

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


// assuming vertices have the form
// { x, y, links:[]}
const build = vertices => {

    const nodes = []
    const arcs  = []

    // build the nodes
    vertices.forEach( ({x,y}, index) => nodes.push({ index, x, y, arcs_entering:[], arcs_leaving:[], exchanges:[] }) )

    // build the arcs
    vertices.forEach( ({links}, a ) =>
        links.forEach( b => {

            const node_a    = nodes[a]
            const node_b    = nodes[b]
            const arc       = { node_a, node_b, index:arcs.length, length: point.distance( node_a, node_b ) }

            node_a.arcs_leaving.push( arc )
            node_b.arcs_entering.push( arc )

            arcs.push( arc )

        })
    )

    // build the exchanges
    nodes.forEach( node =>
        node.exchanges = buildExchange( node )
    )

    return { nodes, arcs }
}

module.exports = { buildExchange, build }
