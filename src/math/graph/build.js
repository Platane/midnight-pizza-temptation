
import point            from 'math/point'
import buildExchange    from './build.exchanges'


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
