const fs = require('fs')
const zip = require('jszip')()
const path = require('path')

const addFile = (name, base) => {

    base = base || name

    const stats = fs.statSync( name )

    if ( stats.isFile() )
        return void zip.file( path.relative( base, name ), fs.readFileSync( name ) )

    if ( stats.isDirectory() )
        return fs.readdirSync( name )
            .forEach( f => addFile( path.join( name, f ), base ) )
}

addFile('./dist')

zip.generateAsync({
    type:'nodebuffer',
    platform:process.platform
})

    .then( content => fs.writeFileSync('./dist/res.zip', content) )

    .then( () => {

        const size = fs.statSync('./dist/res.zip').size

        console.log( (size/1024)+' Ko')

    })
    .catch(err => {
        console.log(err)
        process.exit(1)
    })



// fs.writeFileSync( './dist/index.html', index )
