let express = require('express')
let http = require('http')
let path = require('path')
let reload = require('reload')
let bodyParser = require('body-parser')
let app = express();

let publicDir = path.join(__dirname, 'public')
app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(publicDir, 'index.html'))
})

let server = http.createServer(app)
reload(app).then(function (reloadReturned) {
    server.listen(app.get('port'), function () {
        console.log('Web server started on ' + new URL('http://localhost:' + app.get('port')))
    })
}).catch(function (err) {
    console.error('Reload could not start, could not start server/sample app', err)
})