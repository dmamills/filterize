var express = require('express');
var multipart = require('connect-multiparty');
var uuid = require('node-uuid');
var fs = require('fs');
var bodyParser = require('body-parser');
var winston = require('winston');
var moment = require('moment');



var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: function() {
                return moment().format('MM/DD/YYYY hh:mm:ss a');
            },
            formatter: function(options) {
                return '[' + options.timestamp() + '] ' + options.level.toUpperCase() + ': ' + (options.message ? options.message : '');
            }
        }) 
    ]

})


var multipartMiddleware = multipart({ uploadDir: __dirname + '/public/uploads'});
var app = express();

app.use(express.static('public'));

app.use(function(req,res,next) {
    logger.info('request for: ' + req.url);
    next();
});

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/save', function(req,res) {
    var base64Data = req.body.data.replace(/^data:image\/png;base64,/, "");
    var id = uuid.v4()
    var filename = id + '.png';

    fs.writeFile(__dirname + '/public/downloads/' + filename, base64Data, 'base64', function(err) {
        if(err) throw err;

        res.json({
           'id': id 
        });
    });
});


app.get('/download/:id', function(req,res) {
    var file = __dirname + '/public/downloads/' + req.params.id + '.png';
    res.download(file);
});

app.post('/upload', multipartMiddleware, function(req,res) {
    var photo = req.files.photo;
    console.log('got upload');
    console.log(photo);
    res.json({'result': 'okay', 'filepath': photo.path.split('/public/')[1]});
});

app.listen(8000);
console.log('glitchery server listening on 8000');
