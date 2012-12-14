var express = require("express");
var handlers = require("./modules/handlers");
var app = express();

app.configure(function () {
	app.set("view options", {layout: false});
	app.use(express.static(__dirname + '/html'));
	app.use(express.bodyParser());
});

app.post('/process', handlers.process);
app.get('/render', handlers.render);

var port = process.argv[2];

if(port) {
	app.listen(port);
	console.log('Listening on port: ' + port);
} else {
	console.log('USAGE node index PORT');
}