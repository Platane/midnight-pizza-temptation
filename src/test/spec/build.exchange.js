

import {createExchange}                 from 'ui/exchange'
import {buildExchange}                  from 'math/graph/build'
import expect                           from 'expect'


const createNodes = length =>
    Array.from({ length })
        .map( (_,i,arr) =>
            ({
                index   : i,
                x       : i == 0 ? 0 : Math.cos( i/(arr.length-1) * Math.PI*2 ),
                y       : i == 0 ? 0 : Math.sin( i/(arr.length-1) * Math.PI*2 ),
                arcs_entering   : [],
                arcs_leaving    : [],
            })
        )

describe('build exchange', function(){

    beforeEach(function(){
        if ( typeof document == 'undefined' )
            return

        this.dom = document.getElementById('exchanges')
    })

    afterEach(function(){
        this.dom && this.exchanges.length && this.dom.appendChild( createExchange( this.exchanges ) )
    })

    afterEach(function( done ){

        if( typeof location == 'undefined' || !location.search.match(/break/) )
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

    it('with "T" intersection', function(){

        const [ O, A, B, C ] = createNodes( 4 )

        const arcs = [
            { node_a: O,  node_b: A },
            { node_a: B,  node_b: O },
            { node_a: C,  node_b: O },
        ]

        O.arcs_leaving = [ arcs[0] ]
        O.arcs_entering = [ arcs[1], arcs[2] ]

        this.exchanges = buildExchange( O )

    })

    it('with "T" intersection 2', function(){

        const [ O, A, B, C ] = createNodes( 4 )

        const arcs = [
            { node_a: O,  node_b: A },
            { node_a: B,  node_b: O },
            { node_a: C,  node_b: O },

            { node_a: O,  node_b: B },
        ]

        O.arcs_leaving = [ arcs[0], arcs[3], ]
        O.arcs_entering = [ arcs[1], arcs[2] ]

        this.exchanges = buildExchange( O )

    })

    it('go throught', function(){

        const [ O, A, B ] = createNodes( 3 )

        const arcs = [
            { node_a: A,  node_b: O },
            { node_a: O,  node_b: B },
        ]

        O.arcs_leaving  = [ arcs[1] ]
        O.arcs_entering = [ arcs[0] ]

        this.exchanges = buildExchange( O )

    })

    it('junction', function(){

        const [ O, A, B ] = createNodes( 3 )

        const arcs = [
            { node_a: A,  node_b: O },
            { node_a: O,  node_b: B },

            { node_a: B,  node_b: O },
            { node_a: O,  node_b: A },


        ]

        O.arcs_leaving  = [ arcs[1], arcs[3] ]
        O.arcs_entering = [ arcs[0], arcs[2] ]
        this.exchanges = buildExchange( O )
    })

    it('complete three', function(){

        const [ O, A, B, C ] = createNodes( 4 )

        const arcs = [
            { node_a: O,  node_b: A },
            { node_a: O,  node_b: B },
            { node_a: O,  node_b: C },

            { node_a: A,  node_b: O },
            { node_a: B,  node_b: O },
            { node_a: C,  node_b: O },
        ]

        O.arcs_leaving  = [ arcs[0], arcs[1], arcs[2] ]
        O.arcs_entering = [ arcs[3], arcs[4], arcs[5] ]
        this.exchanges = buildExchange( O )

    })
})
