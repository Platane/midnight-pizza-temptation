const http      = require('http')
const https     = require('https')
const url       = require('url')

const server = http.createServer()
server.listen( 9003 )

server.on( 'request', (request, response) => {

    console.log( url.parse( request.url ).path )

    https.get('https://app.wercker.com'+url.parse( request.url ).path, res => {

        let buffer = ''
        res.on('data', x => buffer = buffer+x )
        res.on('end', () => {
            response.writeHead(200, {'Access-Control-Allow-Origin': '*'})
            response.end( buffer )
        })

    })
})
