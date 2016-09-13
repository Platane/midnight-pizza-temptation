
let k = 0
const A = 4
const l = 40

module.exports = {

    shake : () => {
        k = l
    },

    h : ( u=0 ) =>
        4 * (k/l) * (k/l) * Math.sin( k*Math.PI*0.2 + u )

    ,

    update : () =>
        k = Math.max(0,k-1)

}
