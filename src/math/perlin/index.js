import point from 'math/point'

const p = ( gradient, ox, oy, cx, cy ) =>
    ( ox-cx ) * gradient.x + ( oy-cy ) * gradient.y

const fade = t =>
    // 6t^5 - 15t^4 + 10t^3
    t * t * t * (t * (t * 6 - 15) + 10)

const lerp = ( a, b, k ) =>
    a * ( 1-k ) + b* k

const createPerlin = ( width, height, r ) => {

    const w = Math.ceil(width/r) + 2
    const h = Math.ceil(height/r) + 2

    const grid = Array.from({ length: w*h })
        .map(() => point.normalize({x: Math.random(), y:Math.random()}) )


    return ( x, y ) => {

        //   A -----  B
        //   |  x     |
        //   |        |
        //   C -----  D

        const X = 0|(x/r)
        const Y = 0|(y/r)

        x = x/r-X
        y = y/r-Y

        return lerp(

            lerp(
                // A
                p( grid[ (X+1) * w + (Y+1) ],  x,  y,  0, 0 )
                ,

                // C
                p( grid[ (X+1) * w + (Y+2) ],  x,  y,  0, 1 )
                ,

                fade( y )
            ),

            lerp(
                // B
                p( grid[ (X+2) * w + (Y+1) ],  x,  y,  1,  0 )
                ,

                // D
                p( grid[ (X+2) * w + (Y+2) ],  x,  y,  1,  1 )
                ,

                fade( y )
            ),

            fade( x )
        )
    }
}


module.exports = { createPerlin }
