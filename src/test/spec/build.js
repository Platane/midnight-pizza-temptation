

import {build}  from 'math/graph/build'
import expect   from 'expect'

describe('build', function(){

    it('should output valid graph',function(){

        const source = [
            { x:0,      y:0,   links:[1]},
            { x:100,    y:0,   links:[2]},
            { x:100,    y:100, links:[3]},
            { x:0,      y:100, links:[0]},
        ]

        const network = build( source )

        network.nodes.forEach( node => {
            expect( node )
                .toContainKeys([ 'index', 'x', 'y', 'arcs_entering', 'arcs_leaving', 'exchanges' ])

            node.arcs_leaving.forEach( arc => {

                expect( arc.node_a == node ).toBe( true )

                expect( arc.node_b.arcs_entering.some( a => a == arc ) ).toBe( true )

                expect( network.arcs.some( a => a == arc ) ).toBe( true )
            })

            node.arcs_entering.forEach( arc => {

                expect( arc.node_b == node ).toBe( true )

                expect( arc.node_a.arcs_leaving.some( a => a == arc ) ).toBe( true )

                expect( network.arcs.some( a => a == arc ) ).toBe( true )
            })
        })

        network.arcs.forEach( arc => {
            expect( arc )
                .toContainKeys([ 'index', 'length' ])
        })

    })
})
