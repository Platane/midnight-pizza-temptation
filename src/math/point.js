

const sub = ( a, b ) =>
    ({
        x   :  a.x - b.x,
        y   :  a.y - b.y,
    })

const sqrt_length = a =>
    a.x*a.x + a.y*a.y

const length = a =>
    Math.sqrt( sqrt_length( a ) )

module.exports = {

    sub,

    sqrt_length,

    length,

    // return    a * ( 1-k ) + b * k
    //   =>  k == 0   =>   x == a
    lerp : ( a, b, k ) =>
        ({
            x   :  a.x * ( 1-k ) + b.x * k,
            y   :  a.y * ( 1-k ) + b.y * k,
        }),
}
