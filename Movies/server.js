var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');

var routes = require('./routes/index');

var port = 8000;

var app = express();

//view engine
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'index', layoutsDir: __dirname + '/views'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//set Static folder
app.use(express.static(path.join(__dirname,'views')));

// body Parser Middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/', routes);

app.listen(port, function(){
  console.log('Server started on port: '+port);
});

module.exports = app;
