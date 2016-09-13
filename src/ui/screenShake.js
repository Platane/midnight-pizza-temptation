
let k = 0
const A = 4
const l = 40

module.exports = {

    shake : () => {
        k = l
    },

    h : ( u=0 ) => {

        const h = 4 * (k/l) * (k/l)

        return {
            x: h * Math.sin( k*Math.PI*0.2 + u ),
            y: h * Math.cos( k*Math.PI*0.2 + u + 1 ),
        }
    },

    update : () =>
        k = Math.max(0,k-1)

}
