

import {delaunayTriangulation}  from 'math/tesselation/delaunayTriangulation'
import expect   from 'expect'

describe('tesselation', function(){

    describe('Delaunay triangulation',function(){

        it('should handle basic 3 points case',function(){

            const triangles = delaunayTriangulation([
                {x:0,y:0},
                {x:100,y:0},
                {x:100,y:100},
            ])

            expect( triangles.length ).toBe( 1 )

            expect( triangles[0] )
                .toContain( 0 )
                .toContain( 1 )
                .toContain( 2 )

        })

        xit('should handle the case where a point is on an edge', function(){})
    })
})
