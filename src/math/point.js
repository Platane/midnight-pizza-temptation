
module.exports = {

    // return    a * ( 1-k ) + b * k
    //   =>  k == 0   =>   x == a
    lerp : ( a, b, k ) =>
        ({
            x   :  a.x * ( 1-k ) + b.x * k,
            y   :  a.y * ( 1-k ) + b.y * k,
        })
}
