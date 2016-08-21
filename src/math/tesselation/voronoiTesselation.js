import p                        from 'math/point'
import line                     from 'math/line'
import {circonscritCircle, delaunayTriangulation}      from './delaunayTriangulation'

const voronoiTesselation = ( points ) => {

    const triangles = delaunayTriangulation( points )
    const centers   = triangles.map( vertices => circonscritCircle( ...vertices.map( i => points[i] ) ).O )

    const faces = []

    points.forEach( (_,i) => {

        // every triangle which contains the vertice i
        const edges = triangles
            .filter( vertices => vertices.some( x => i == x ) )
            .map( vertices => vertices.filter( x => i != x ) )

        let [ a, e ] = edges.shift()
        const hull = [ e ]

        while( a != e ){

            const i = edges.findIndex( x => x[0] == e || x[1] == e )

            if ( i == -1 )
                // if the hull is not closed, ignore ( it' because the triangle is part of the global hull )
                return

            hull.push( e = edges[i][0] == e ? edges[i][1] : edges[i][0] )

            edges.splice(i,1)
        }

        faces.push( hull )
    })

    return { faces, vertices:centers }
}


module.exports = { voronoiTesselation }
