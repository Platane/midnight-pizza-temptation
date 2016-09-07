module.exports = ( ctx, width, height, perlin, blendBorder, alpha ) => {

    const imd = ctx.getImageData(0,0,width,height)

    const data = imd.data

    const l = Math.sqrt( width * height ) * (blendBorder||0)

    for(let x=width;x--;)
    for(let y=height;y--;)
    {
        const p = 1-Math.max(0,Math.min(1,  0.5 + perlin( x, y ) * 2 ))

        const d = Math.min( x, y, width-x, height-y )

        const h = d > l
            ? 0
            : 1-d/l

        const k = ( 1-h ) * p + h * 0.5


        const u = ( y + x*width ) << 2

        data[ u+0 ] = 0|( k*255 )
        data[ u+1 ] = 0|( k*255 )
        data[ u+2 ] = 0|( k*255 )
        data[ u+3 ] = 0|alpha
    }

    ctx.putImageData(imd, 0, 0)
}
