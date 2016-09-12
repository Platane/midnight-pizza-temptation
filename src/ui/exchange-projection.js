
import point                    from 'math/point'
import {intersection}           from 'math/line'

const exchangeCurve         = ( marge, margeBezier, node_A, node_O, node_B ) => {

    const OA = point.sub( node_A, node_O )
    const OB = point.sub( node_B, node_O )

    const lOA = point.length(OA)
    const lOB = point.length(OB)

    const A   = {
        x : node_O.x + OA.x / lOA * margeBezier + OA.y / lOA * marge,
        y : node_O.y + OA.y / lOA * margeBezier - OA.x / lOA * marge,
    }
    const B   = {
        x : node_O.x + OB.x / lOB * margeBezier - OB.y / lOB * marge,
        y : node_O.y + OB.y / lOB * margeBezier + OB.x / lOB * marge,
    }

    const C = intersection( A, OA, B, OB )

    return { A, C, B }
}

module.exports = { exchangeCurve }
