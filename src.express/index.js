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


app.listen(8081);
console.log('Listening on port 8081');

