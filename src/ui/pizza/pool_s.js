import paintPizza   from './paint'
import {create}     from 'ui/dom'

module.exports = Array.from({ length: 30 })
    .map( () => {

        const canvas        = create( null, 'canvas' )
        canvas.width        = 40
        canvas.height       = 40
        const ctx           = canvas.getContext('2d')
        ctx.save()
        ctx.scale( 40/100, 40/100 )
        paintPizza( ctx )
        ctx.restore()

        return canvas
    })
