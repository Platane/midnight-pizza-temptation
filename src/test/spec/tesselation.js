

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

        it('should resolve basic case',function(){

            const { faces, vertices } = voronoiTesselation([
                {x:0  ,y:0  },
                {x:100,y:0  },
                {x:50  ,y:40},
                {x:50  ,y:100},
            ])

            expect( faces.length ).toBe( 1 )
            expect( vertices.length ).toBe( 3 )
        })

        it('should not crash with empty',function(){

            voronoiTesselation([])

        })

        it('should not crash with one point',function(){

            voronoiTesselation([{x:0, y:0}])

        })

        it('should not crash with this case',function(){

            voronoiTesselation([
                {x:654.99, y:298.38},
                {x:697.49, y:105.4},
                {x:591.1, y:690.4},
                {x:582.72, y:680.72},
                {x:598.47, y:406.09},
                {x:599.34, y:380.54},
                {x:311.79, y:261.41},
                {x:328.49, y:347.35},
                {x:685.6, y:690.31},
                {x:669.15, y:221.7},
                {x:338.45, y:547.69},
                {x:482.08, y:296.64},
                {x:417.35, y:180.99},
                {x:228.02, y:409.72},
                {x:621, y:421.8},
                {x:422.9, y:624.79},
                {x:475.88, y:283.65},
                {x:144.42, y:161.9},
                {x:173.44, y:310.5},
                {x:352.2, y:276.16}
            ])

        })
    })
})
