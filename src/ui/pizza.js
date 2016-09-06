
const path = ( ctx, arr ) => {
    ctx.moveTo( arr[ arr.length-2 ], arr[ arr.length-1 ] )
    for( let i=0; i< arr.length; i+=2 )
        ctx.lineTo( arr[i], arr[i+1] )
}


// draw a 100x100 pizza
module.exports = ( ctx, seed, color ) => {

    const color_crust = '#b58a1c'
    const color_base = '#d8b646'
    const color_pepperoniShadow = '#a14f22'
    const color_pepperoni = '#c65518'

    ctx.globalAlpha = 1.5

    ctx.beginPath()
    ctx.fillStyle='#ddd'
    ctx.rect(0,0,100,100)
    ctx.fill()

    const keys = [

        // crust

        // up crust
        5 , 20,
        33, 5,
        66, 5,
        95, 20,

        // down crust
        93, 30,
        66, 18,
        33, 18,
        7 , 30,

        // cone
        80, 45,
        68, 70,
        50, 98,
        32, 70,
        20, 45,
    ]
        .map( x => x+ ( Math.random() - 0.5 ) * 7 )


    const m = [
        ...keys.slice(0,8).map( (_,i) => ( keys[i] + keys[ 6 + (4 - (0|(i/2)) ) *2 + (i%2) ] )/2 ),
        ...keys.slice(16),
    ]

    ctx.beginPath()
    ctx.fillStyle=color_crust
    path( ctx, m.map( (x,i) => i%2 ? x : x-4 ) )
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle=color_base
    path( ctx, m )
    ctx.fill()

    ctx.save()
    ctx.beginPath()
    path( ctx, m )
    ctx.clip()

    const pp = [
        34, 37,
        57, 87,
        67, 57,
    ]
        .map( x => x+ ( Math.random() - 0.5 ) * 10 )


    for(let i=3; i--;){
        const x = pp[i*2]
        const y = pp[i*2+1]
        ctx.beginPath()
        ctx.fillStyle=color_pepperoniShadow
        ctx.arc( x-2, y, 14 , 0, Math.PI*2 )
        ctx.fill()
        ctx.beginPath()
        ctx.fillStyle=color_pepperoni
        ctx.arc( x, y, 14 , 0, Math.PI*2 )
        ctx.fill()
    }

    ctx.restore()

    ctx.beginPath()
    ctx.fillStyle=color_crust
    path( ctx, keys.slice(0,16) )
    ctx.fill()



}
