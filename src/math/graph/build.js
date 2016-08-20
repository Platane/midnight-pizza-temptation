
import point from 'math/point'

const angle = ( o, a ) =>
    Math.atan( (a.y-o.y)/(a.x-o.x) )

const buildExchange = node => {
    // const angles = [
    //     ...node.arcs_leaving.map( arc =>
    //         ({
    //             arc:
    //         })
    //     )
    // ]

    const exchanges = []

    node.arcs_entering.forEach( arc_a =>
    node.arcs_leaving.forEach( arc_b =>

            exchanges.push({ arc_a, arc_b, block:[], pass:[], index:exchanges.length })

    )
    )

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
