var express = require('express');
var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' });
var fortune = require('./lib/fortune.js');

var app = express();


// set up app dependencies
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

// set up app middlewares
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/about', function(req, res) {
    var randomFortune = fortune.getFortune();
    res.render('about', {
	'fortune': randomFortune,
	'pageTestScript': '/qa/tests-about.js'
    });
});

app.get('/header', function(req, res) {
    res.set('Content-Type','text/plain');
    var s = '';
    for (var prop in req.headers) {
	if (req.headers.hasOwnProperty(prop)) {
	    s += prop + ':' + req.header[prop] + '\n';
	}
    }
    res.send(s);
});

app.get('/tours/hood-river', function(req, res) {
    res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res) {
    res.render('tours/request-group-rate');
});

// custom 404 page
app.use(function(req, res){
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
		 app.get('port') + '; press Ctrl-C to terminate.' );
});
