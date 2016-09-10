

import mergeCloseVertices       from 'math/graph/mergeCloseVertices'
import expect   from 'expect'

describe('merge close vertices', function(){


    it('should merge two close vertices',function(){

        const vertices = [
            {x:0,y:0},
            {x:2,y:2},
        ]
        const graph = [
            [1],
            [0],
        ]

        const x = mergeCloseVertices( graph, vertices, 10 )

        expect( x.vertices[ 2 ] ).toContain({ x:1, y:1 })
        expect( x.graph.every( arr => arr.length == 0) ).toBe( true )
    })

    it('should keep graph consistent',function(){

        const vertices = [
            {x:0,y:0},
            {x:0,y:0},
            {x:100,y:0},
            {x:200,y:0},
            {x:300,y:0},
        ]
        const graph = [
            [1,4],
            [0],

            [1],
            [0,1],

            [],
        ]

        const x = mergeCloseVertices( graph, vertices, 10 )

        expect( x.vertices[ 5 ] ).toContain({ x:0, y:0 })
        expect( x.graph ).toEqual([
            [],
            [],

            [5],
            [5],

            [],

            [4],
        ])
    })
})
