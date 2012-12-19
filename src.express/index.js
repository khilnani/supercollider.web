var configFile = process.argv[2];
var port = process.argv[3];

if(port && configFile) 
{

	var express = require("express"),
		handler = require("./modules/handler"),
		scer = require("./modules/soundclouder"),
		config = require("./" + configFile),
		app = express();
		
	scer.init(config.sc_client_id, config.sc_client_secret, config.sc_redirect_uri);
	
	handler.setSoundClouder(scer);
	
	app.configure(function () {
		app.set("view options", {layout: false});
		app.use(express.static(__dirname + '/html'));
		app.use(express.bodyParser());
	});
	
	app.post('/process', handler.process);
	app.get('/render', handler.render);
	app.get('/sc', handler.sc);

	app.listen(port);
	
	console.log('Listening on port: ' + port + ' using config file: ' + configFile);
	
} 
else 
{
	console.log('USAGE node index [CONFIG FILE] [PORT]');
}
