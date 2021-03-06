let express = require('express')
let http = require('http')
let path = require('path')
let reload = require('reload')
let bodyParser = require('body-parser')
const logger = require("morgan")
let app = express();
const sass = require('node-sass-middleware');
const fs = require('fs-extra');
const {watch} = require('fs');
const cmd = require("child_process");
fs.removeSync('/public/_styles');

app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())

app.use("/", express.static(__dirname))
app.use(express.static(__dirname + '/public'));
app.use('/node_modules', express.static('node_modules'))
app.use(logger("dev"));

let srcPath = __dirname + '/public/sass';
let destPath = path.join(__dirname, '/public/_styles');


watch('./src/public/sass').addListener('change', (eventType, filename) => {
    cmd.exec("yarn sass:compile");
});

watch('./src').addListener('change', (eventType, filename) => {
    cmd.exec("yarn sass:compile");
});



app.use('/_styles', sass({
    src: srcPath,
    dest: destPath,
    debug: true,
    outputStyle: 'expanded'
}));


let server = http.createServer(app)
reload(app).then(function (reloadReturned) {
    server.listen(app.get('port'), function () {
        console.log('Web server started on ' + new URL('http://localhost:' + app.get('port')));
    })
}).catch(function (err) {
    console.error('Reload could not start, could not start server/sample app', err)
})