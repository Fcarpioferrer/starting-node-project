let express = require('express')
let http = require('http')
let path = require('path')
let reload = require('reload')
let bodyParser = require('body-parser')
const logger = require("morgan")
let app = express();
const sass = require('node-sass-middleware');
const fs = require('fs-extra');

fs.removeSync('/public/styles');

app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));
app.use(logger("dev"))

let srcPath = __dirname + '/shared/sass';
let destPath = path.join(__dirname, '/public/styles');

app.use('/styles', sass({
    src: srcPath,
    dest: destPath,
    debug: true,
    outputStyle: 'expanded'
}));

let server = http.createServer(app)
reload(app).then(function (reloadReturned) {
    server.listen(app.get('port'), function () {
        console.log('Web server started on ' + new URL('http://localhost:' + app.get('port')))
    })
}).catch(function (err) {
    console.error('Reload could not start, could not start server/sample app', err)
})