import paintPizza   from './paint'
import {create}     from 'ui/dom'

module.exports = Array.from({ length: 30 })
    .map( () => {

        const canvas        = create( null, 'canvas' )
        canvas.width        = 150
        canvas.height       = 150
        const ctx           = canvas.getContext('2d')
        ctx.save()
        ctx.scale( 1.5, 1.5 )
        paintPizza( ctx )
        ctx.restore()

        return canvas
    })
