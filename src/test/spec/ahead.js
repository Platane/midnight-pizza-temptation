

import {getCarrierAheadCarrier}         from 'core/util/ahead'
import {prepare as prepareNetwork}      from 'math/graph'
import * as sampleY                     from 'sample/y'
import expect                           from 'expect'

describe('ahead', function(){

    beforeEach(function(){

        this.network = sampleY.network

        prepareNetwork( this.network )

    })

    describe('carrier ahead on arc', function(){

        beforeEach(function(){
            this.carriers = [
                {
                    position    : { arc : 0, k : 0.2 },
                    decision    : { path : [3,2,0] },
                    index       : 0,
                },
                {
                    position    : { arc : 0, k : 0.5 },
                    decision    : { path : [3,2,0] },
                    index       : 1,
                },
            ]
        })

        it('should get the carrier ahead',function(){

            const res = getCarrierAheadCarrier( this.network, this.carriers, this.carriers[0] )

            expect( res )
                .toExist()
                .toContainKey( 'distance' )

            expect( res.carrier ).toBe( this.carriers[1] )
        })

    })

    describe('carrier ahead on next arc', function(){

        beforeEach(function(){
            this.carriers = [
                {
                    position    : { arc : 0, k : 0.86 },
                    decision    : { path : [3,2,0] },
                    index       : 0,
                },
                {
                    position    : { arc : 2, k : 0.4 },
                    decision    : { path : [2,0] },
                    index       : 1,
                },
            ]
        })

        it('should get the carrier ahead',function(){

            const res = getCarrierAheadCarrier( this.network, this.carriers, this.carriers[0] )

            expect( res )
                .toExist()
                .toContainKey( 'distance' )

            expect( res.carrier ).toBe( this.carriers[1] )
        })

    })

    describe('carrier ahead, just leaving the next node for a different path', function(){

        beforeEach(function(){
            this.carriers = [
                {
                    position    : { arc : 2, k : 0.9 },
                    decision    : { path : [2,0] },
                    index       : 0,
                },
                {
                    position    : { arc : 3, k : 0.005 },
                    decision    : { path : [1] },
                    index       : 1,
                },
            ]
        })

        it('should get the carrier ahead',function(){

            const res = getCarrierAheadCarrier( this.network, this.carriers, this.carriers[0] )

            expect( res )
                .toExist()
                .toContainKey( 'distance' )

            expect( res.carrier ).toBe( this.carriers[1] )
        })
    })

    describe('carrier on a different arc, will arrive at the same time on the node by a prior path' , function(){

        beforeEach(function(){
            this.carriers = [
                {
                    position    : { arc : 0, k : 0.92 },
                    decision    : { path : [3,2,0] },
                    index       : 0,
                },
                {
                    position    : { arc : 1, k : 0.92 },
                    decision    : { path : [3,2,0] },
                    index       : 1,
                },
            ]
        })

        it('should get the carrier ahead',function(){

            const res = getCarrierAheadCarrier( this.network, this.carriers, this.carriers[0] )

            expect( res )
                .toExist()
                .toContainKey( 'distance' )

            expect( res.carrier ).toBe( this.carriers[1] )
        })

    })

    describe('carrier on a different arc, will arrive at the same time on the node by a less prior path' , function(){

        beforeEach(function(){
            this.carriers = [
                {
                    position    : { arc : 1, k : 0.92 },
                    decision    : { path : [3,2,0] },
                    index       : 0,
                },
                {
                    position    : { arc : 0, k : 0.92 },
                    decision    : { path : [3,2,0] },
                    index       : 1,
                },
            ]
        })

        it('should get the carrier ahead',function(){

            const res = getCarrierAheadCarrier( this.network, this.carriers, this.carriers[0] )

            expect( res )
                .toNotExist()
        })

    })
})
