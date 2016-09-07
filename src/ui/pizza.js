
const path = ( ctx, arr ) => {
    ctx.moveTo( arr[ 0 ][0], arr[ 0 ][1] )
    for( let i=arr.length; i--; )
        ctx.lineTo( arr[i][0], arr[i][1] )
}


// draw a 100x100 pizza
module.exports = ( ctx, seed, color ) => {

    const color_crust           = '#b58a1c'
    const color_base            = '#d89a46'



    ctx.globalAlpha = 1.5
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 0.5

    ctx.beginPath()
    ctx.fillStyle='#ddd'
    ctx.rect(0,0,100,100)
    ctx.fill()

    const keys = [

        // crust

        // up crust
        [2 , 20],
        [33, 5 ],
        [66, 5 ],
        [95, 20],

        // down crust
        [93, 30],
        [66, 18],
        [33, 18],
        [7 , 30],

        // cone
        [80, 45],
        [68, 70],
        [50, 98],
        [32, 70],
        [20, 45],

        // pepperony
        [34, 37],
        [57, 87],
        [67, 57],
    ]
        .map( a => a.map( x => x+ ( Math.random() - 0.5 ) * 10 ) )


    const m = [
        ...keys.slice(0,4).map( (a,i) => [ (a[0]+keys[7-i][0])/2, (a[1]+keys[7-i][1])/2 ] ),
        ...keys.slice(8,13),
    ]

    ctx.beginPath()
    ctx.fillStyle=color_crust
    path( ctx, [
        m[6],
        ...[ ...m.slice(6,9), m[0] ].map( a => [ a[0]-4, a[1] ] ),
        keys[0],
        [50,50],
    ])

    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.fillStyle=color_base
    path( ctx, m )
    ctx.fill()
    ctx.stroke()

    ctx.save()
    ctx.beginPath()
    path( ctx, m )
    ctx.clip()

    const radius = Math.random() * 5 + 10
    const r = Math.random()*220 + 310
    const color_pepperoniShadow = `hsl(${r},80%,30%)`
    const color_pepperoni       = `hsl(${r},90%,35%)`
    keys.slice(-3).forEach( ([x,y]) => {

        ctx.beginPath()
        ctx.fillStyle=color_pepperoniShadow
        ctx.arc( x-3, y, radius+0.5 , 0, Math.PI*2 )
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.fillStyle=color_pepperoni
        ctx.arc( x, y, radius , 0, Math.PI*2 )
        ctx.fill()
        ctx.stroke()

    })

    ctx.restore()

    ctx.beginPath()
    ctx.fillStyle=color_crust
    path( ctx, keys.slice(0,8) )
    ctx.fill()
    ctx.stroke()



}
