import p            from 'math/point'
import line         from 'math/line'

// return the center and the radius of the circonscrit circle of the triangle
const circonscritCircle = ( A, B, C ) => {

    // center of cisconscrit circle
    // = intersection of the three medians
    const O = line.intersection(
        {
            x: (A.x + B.x )/2,
            y: (A.y + B.y )/2,
        },
        {
            x: (A.y - B.y ),
            y: -(A.x - B.x ),
        },
        {
            x: (C.x + B.x )/2,
            y: (C.y + B.y )/2,
        },
        {
            x: (C.y - B.y ),
            y: -(C.x - B.x ),
        }
    )

    return {
        O,
        sqrt_radius : p.sqrt_distance( A, O ),
    }
}

// a triangle that contains all the points
// may not be the smallest triangle
const computeBoundingTriangle = points => {

    // compute the bounding box
    let maxX = -Infinity
    let maxY = -Infinity
    let minX =  Infinity
    let minY =  Infinity

    points.forEach( ({x, y}) => {

        maxX = Math.max( maxX, x )
        maxY = Math.max( maxY, y )
        minX = Math.min( minX, x )
        minY = Math.min( minY, y )

    })

    // enlarge a bit
    maxX += 10
    maxY += 10
    minX -= 10
    minY -= 10

    // compute this triangle ( which indeed contains the bounding box )
    //
    //   B
    //   |\
    //   |   \
    //   |_ _ _ \
    //   |       | \
    //   |       |    \
    //   |_ _ _ _| _ _ _ \
    //   A                 C

    return [
        { x: minX                   , y: minY                   },
        { x: minX                   , y: maxY + (maxY - minY)   },
        { x: maxX + (maxX - minX)   , y: minX                   },
    ]
}


const delaunayTriangulation = points => {


    // determine a triangle which contains all the points as starting triangle
    // then add points one by one

    const boundingTriangle = computeBoundingTriangle( points )
    const triangles = [{
        vertices    : Array.from({length:3}, (_,i) => points.length + i ),
        circle      : circonscritCircle( ...boundingTriangle ),
    }]

    points.push( ...boundingTriangle )

    // iterate throught the points
    // add them one by one to the structure
    points
        .slice( 0, -3 )
        .forEach( (P,i_p) => {

        // takes all the triangles for which P is in the circonscrit circle,
        // remove them from the mesh,
        // fill the "hole" obtenaid with triangles formed by the edge of the hole + P



        // grab all the triangles for which the circonscrit circle contains P
        // remove them from the list of triangles
        // build the convex hull
        // -> add each edges of each triangles,
        //    every edge which is in the list twice is not part of the hull
        const edges = []
        for( let i=triangles.length; i--; ) {

            const {vertices, circle} = triangles[i]

            if ( p.sqrt_distance( circle.O, P ) <= circle.sqrt_radius ) {

                // remove the triangle from the list
                triangles.splice(i,1)

                vertices.forEach( (_, i_a, arr) => {

                    const i_b = ( i_a+1 ) % 3

                    const a = Math.min( arr[i_a], arr[i_b] )
                    const b = Math.max( arr[i_a], arr[i_b] )

                    const i = edges.findIndex( x => x[0] == a && x[1] == b )

                    if ( i == -1 )
                        // if the edge is not already a part of the hull, add it
                        edges.push([a,b])

                    else
                        // if the same edge is added twice, remove it
                        edges.splice(i,1)
                })
            }
        }

        // form the new triangles
        edges.forEach( edge => {

            const vertices = [ ...edge, i_p ]

            triangles.push({
                vertices,
                circle   : circonscritCircle( ...vertices.map( i => points[ i ] ) ),
            })

        })

    })


    // remove the initial triangle
    points.splice( -3, 3 )

    // remove the triangles formed with the initial triangle
    return triangles
        .filter( x => x.vertices.every( i => i < points.length ) )
        .map( x => x.vertices )
}


module.exports = { delaunayTriangulation }
