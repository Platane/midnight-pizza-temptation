module.exports = ( ctx, a, b, color, power ) => {

    ctx.strokeStyle = color
    ctx.lineCap     = 'round'
    ctx.globalCompositeOperation = 'lighten'

    const i = power*3+1

    ctx.globalAlpha = power * 0.06
    ctx.lineWidth = ( i*i*0.8 + i ) * 0.3 + 0.7
    ctx.beginPath()
    ctx.moveTo( a.x, a.y )
    ctx.lineTo( b.x, b.y )
    ctx.stroke()

    ctx.globalAlpha = power * 1.2
    ctx.lineWidth = ( i*i*0.8 + i ) * 0.2 + 0.2
    ctx.beginPath()
    ctx.moveTo( a.x, a.y )
    ctx.lineTo( b.x, b.y )
    ctx.stroke()

    // for ( let i=(0|power*3)+1 ; i -- ; ){
    //
    //     ctx.globalAlpha = ( 10 - i )/ 20
    //     ctx.lineWidth = ( i*i*0.8 + i ) * 0.6 + 1.2
    //     ctx.beginPath()
    //     ctx.moveTo( a.x, a.y )
    //     ctx.lineTo( b.x, b.y )
    //     ctx.stroke()
    // }
}
