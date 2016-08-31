

const sub = ( a, b ) =>
    ({
        x   :  a.x - b.x,
        y   :  a.y - b.y,
    })

const scalar = a =>
    a.x*a.x + a.y*a.y

const sqrt_length = a =>
    scalar( a )

const length = a =>
    Math.sqrt( sqrt_length( a ) )

const distance = ( a, b ) =>
    length( sub( a, b ) )

const sqrt_distance = ( a, b ) =>
    sqrt_length( sub( a, b ) )

const normalize = a => {
    const l = length( a )
    return {x:a.x/l, y:a.y/l}
}



module.exports = {

    sub,

    sqrt_length,

    length,

    sqrt_distance,

    distance,

    normalize,

    // return    a * ( 1-k ) + b * k
    //   =>  k == 0   =>   x == a
    lerp : ( a, b, k ) =>
        ({
            x   :  a.x * ( 1-k ) + b.x * k,
            y   :  a.y * ( 1-k ) + b.y * k,
        }),
}
