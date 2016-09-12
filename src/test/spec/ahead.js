

import {getCarrierAheadCarrier}         from 'core/util/aheadDeadlockSensitive'
import {build}                          from 'math/graph/build'
import {createExchange}                 from 'ui/exchange'
import expect                           from 'expect'

describe('ahead', function(){

    beforeEach(function(){
        if ( typeof document == 'undefined' )
            return

        this.dom = document.getElementById('exchanges')
    })

    afterEach(function(){
        this.dom && this.exchanges && this.exchanges.length && this.dom.appendChild( createExchange( this.exchanges ) )
    })

    afterEach(function( done ){

        if( !this.exchanges || typeof location == 'undefined' || !location.search.match(/break/) )
            return done()

        this.timeout(99999999999)

        window.next = () => {
            delete window.next
            done()
        }
    })

    afterEach(function(){
        while(this.dom && this.dom.children.length)
            this.dom.removeChild(this.dom.children[0])
    })


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

        this.exchanges = nodes[3].exchanges

        expect( getCarrierAheadCarrier( carriers, carriers[0] ) ).toNotExist( )

        const res = getCarrierAheadCarrier( carriers, carriers[1] )
        expect( res && res.carrier ).toBe( carriers[0] )

    })


    it('carrier on next next next road', function(){

        const { arcs, nodes } = this.network = build([
            { x:0   , y:0 , links: [1]   },
            { x:20  , y:0 , links: [2]   },
            { x:40  , y:0 , links: [3]   },
            { x:60  , y:0 , links: [4]   },
            { x:80  , y:0 , links: [5]   },
            { x:100 , y:0 , links:  []   },
        ])

        const carriers = [
            {
                position    : { arc     : arcs.find( arc => arc.node_a.index == 0 ), k : 0.5 },
                decision    : { path    : [ nodes[2], nodes[3], nodes[4], nodes[5] ] },
                index       : 0,
            },
            {
                position    : { arc     : arcs.find( arc => arc.node_b.index == 5 ), k : 0.5 },
                decision    : { path    : [] },
                index       : 1,
            },
        ]

        const res = getCarrierAheadCarrier( carriers, carriers[0] )

        expect( res && res.carrier ).toBe( carriers[1] )

    })

    it('carrier on tube ( parrallel route that does not cross at the intersection )', function(){

        const { arcs, nodes } = this.network = build([
            { x:0   , y:0 , links: [1]   },
            { x:50  , y:0 , links: [2,0]   },
            { x:100 , y:0 , links: [1]   },
        ])

        const carriers = [
            {
                position    : { arc     : arcs.find( arc => arc.node_a.index == 0 ), k : 0.99 },
                decision    : { path    : [ nodes[2] ] },
                index       : 0,
            },
            {
                position    : { arc     : arcs.find( arc => arc.node_a.index == 2 ), k : 0.99 },
                decision    : { path    : [ nodes[0] ] },
                index       : 1,
            },
        ]

        this.exchanges = nodes[1].exchanges

        expect( getCarrierAheadCarrier( carriers, carriers[0] ) ).toNotExist( )
        expect( getCarrierAheadCarrier( carriers, carriers[1] ) ).toNotExist( )

    })

    it('carrier on small tube ( parrallel route that does not cross at the intersection ) ( tube is small enought for the carrier to be both entering and leaving zone )', function(){

        const { arcs, nodes } = this.network = build([
            { x:0   , y:0 , links: [1]     },
            { x:10  , y:0 , links: [2,0]   },
            { x:20  , y:0 , links: [1,3]   },
            { x:30  , y:0 , links: [2]     },
        ])

        const carriers = [
            {
                position    : { arc     : arcs.find( arc => arc.node_a.index == 1 && arc.node_b.index == 2 ), k : 0.5 },
                decision    : { path    : [ nodes[2] ] },
                index       : 0,
            },
            {
                position    : { arc     : arcs.find( arc => arc.node_a.index == 2 && arc.node_b.index == 1 ), k : 0.5 },
                decision    : { path    : [ nodes[0] ] },
                index       : 1,
            },
        ]

        this.exchanges = nodes[1].exchanges

        expect( getCarrierAheadCarrier( carriers, carriers[0] ) ).toNotExist( )
        expect( getCarrierAheadCarrier( carriers, carriers[1] ) ).toNotExist( )

    })

    it('deadlock', function(){

        const { arcs, nodes } = this.network = build([
            { x:0   , y:0 , links: [1,2,3] },
            ...Array.from({ length: 3 })
                .map( (_,i,arr) =>
                    ({
                        x : Math.sin( i/arr.length*Math.PI*2 )*20,
                        y : Math.cos( i/arr.length*Math.PI*2 )*20,
                        links: [0],
                    })
                )
        ])

        const carriers = Array.from({ length: 3 })
            .map( (_,i) =>
                ({
                    index:i,
                    position    : { arc     : arcs.find( arc => arc.node_a.index == i+1 && arc.node_b.index == 0 ), k : 0.6 },
                    decision    : { path    : [ nodes[((i+2)%3)+1] ] },
                })
            )
        this.exchanges = nodes[0].exchanges

        expect( getCarrierAheadCarrier( carriers, carriers[0] ) ).toNotExist( )
        expect( getCarrierAheadCarrier( carriers, carriers[1] ) ).toExist( )
        expect( getCarrierAheadCarrier( carriers, carriers[2] ) ).toExist( )

    })
})
