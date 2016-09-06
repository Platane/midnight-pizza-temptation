

import {delaunayTriangulation}  from 'math/tesselation/delaunayTriangulation'
import {voronoiTesselation}     from 'math/tesselation/voronoiTesselation'
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

    })

    describe('Voronoi tesselation',function(){

        it('should not crash',function(){

            const { faces, vertices } = voronoiTesselation([
                {x:0  ,y:0  },
                {x:100,y:0  },
                {x:50  ,y:40},
                {x:50  ,y:100},
            ])

            expect( faces.length ).toBe( 1 )
            expect( vertices.length ).toBe( 3 )
        })
    })
})
