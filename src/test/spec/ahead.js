

import {getCarrierAheadCarrier}         from 'core/util/ahead'
import {build}                          from 'math/graph/build'
import expect                           from 'expect'

describe('ahead', function(){

    beforeEach(function(){

        this.network = build([
            { x:50 , y:50 , links: [3]   },
            { x:750, y:50 , links: [3]   },
            { x:400, y:450, links: [0,1] },
            { x:400, y:50 , links: [2]   },
        ])

    })

    it('with carrier ahead on same arc', function(){

        const { arcs, nodes } = this.network

        const carriers = [
            {
                position    : { arc     : arcs[0], k : 0.2 },
                decision    : { path    : [] },
                index       : 0,
            },
            {
                position    : { arc     : arcs[0], k : 0.5 },
                decision    : { path    : [] },
                index       : 1,
            },
        ]

        const res = getCarrierAheadCarrier( carriers, carriers[0] )

        expect( res && res.carrier ).toBe( carriers[1] )
    })


    it('with carrier ahead on next arc', function(){

        const { arcs, nodes } = this.network

        const carriers = [
            {
                position    : { arc     : arcs.find( arc => arc.node_b.index == 0 ), k : 0.8 },
                decision    : { path    : [ nodes[3] ] },
                index       : 0,
            },
            {
                position    : { arc     : arcs.find( arc => arc.node_a.index == 0 ), k : 0.5 },
                decision    : { path    : [ ] },
                index       : 1,
            },
        ]

        const res = getCarrierAheadCarrier( carriers, carriers[0] )

        expect( res && res.carrier ).toBe( carriers[1] )
    })


    it('with carrier ahead inside the intersection, leaving not on the next arc', function(){

        const { arcs, nodes } = this.network

        const carriers = [
            {
                position    : { arc     : arcs.find( arc => arc.node_a.index == 3 ), k : 0.6 },
                decision    : { path    : [ nodes[0] ] },
                index       : 0,
            },
            {
                position    : { arc     : arcs.find( arc => arc.node_b.index == 1 ), k : 0.01 },
                decision    : { path    : [ nodes[3] ] },
                index       : 1,
            },
        ]

        const res = getCarrierAheadCarrier( carriers, carriers[0] )

        expect( res && res.carrier ).toBe( carriers[1] )
    })

    it('with carrier ahead inside the intersection, entering from a prior road', function(){

        const { arcs, nodes } = this.network

        const e0 = nodes[ 3 ].exchanges.find( x => x.arc_a.node_a.index == 0 )
        const e1 = nodes[ 3 ].exchanges.find( x => x.arc_a.node_a.index == 1 )

        e0.pass     = [ e1 ]
        e1.block    = [ e0 ]

        const carriers = [
            {
                position    : { arc     : arcs.find( arc => arc.node_a.index == 0 ), k : 0.95 },
                decision    : { path    : [ nodes[2] ] },
                index       : 0,
            },
            {
                position    : { arc     : arcs.find( arc => arc.node_a.index == 1 ), k : 0.95 },
                decision    : { path    : [ nodes[2] ] },
                index       : 1,
            },
        ]

        const res = getCarrierAheadCarrier( carriers, carriers[0] )

        expect( res && res.carrier ).toBe( carriers[1] )
    })
})
