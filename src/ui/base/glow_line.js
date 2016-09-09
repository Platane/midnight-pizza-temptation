module.exports = ( ctx, a, b, color, power ) => {

    ctx.strokeStyle = color
    ctx.lineCap     = 'round'
    ctx.globalCompositeOperation = 'lighten'

    for ( let i=(0|power*3)+1 ; i -- ; ){

        ctx.globalAlpha = ( 10 - i )/ 20
        ctx.lineWidth = ( i*i*0.8 + i ) * 0.3 + 1.2
        ctx.beginPath()
        ctx.moveTo( a.x, a.y )
        ctx.lineTo( b.x, b.y )
        ctx.stroke()
    }
}
