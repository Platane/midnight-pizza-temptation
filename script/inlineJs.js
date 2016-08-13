const fs = require('fs')

var index     = fs.readFileSync('./dist/index.html').toString()
var script    = fs.readFileSync('./dist/index.js').toString()

if ( !index.match( /<script.+index\.js.+<\/script>/ ) )
    throw 'loader script not found'

index = index.replace( /<script.+index\.js.+<\/script>/, '<script>'+script+'</script>')

fs.writeFileSync( './dist/index.html', index )
