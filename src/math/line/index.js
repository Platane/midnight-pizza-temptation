const epsylon = 0.00001

const intersection = ( A ,vA, B, vB ) => {

    // compute k, such as
    // A + vA * k = B + vB * k

    // determinant = 0   =>   the two line are colinears
    // if they are confused, return the point A ( which is indeed on both lines )
    // if not, return false
    if ( Math.abs( vA.x * vB.y - vA.y * vB.x ) < epsylon )
        return Math.abs( vA.x * (A.y-B.y) - vA.y * (A.y-B.y) ) < epsylon && { x:A.x, y:A.y }

    let k
    if ( Math.abs(vB.x)<epsylon )
        k = ( B.x - A.x ) / vA.x

    else if ( Math.abs(vB.y)<epsylon )
        k = ( B.y - A.y ) / vA.y

    else
        k = ( ( A.x - B.x ) / vB.x  - ( A.y - B.y ) / vB.y  ) / ( vA.y / vB.y - vA.x / vB.x )

    return {
        x: A.x + vA.x * k,
        y: A.y + vA.y * k,
    }
}


module.exports = { intersection }
