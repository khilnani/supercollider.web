//----------------------------------------------

var log = require("./modules/logger");

log.system("Started...");

var configFile = process.argv[2];
var port = process.argv[3];

//----------------------------------------------

if(port && configFile) 
{

	var express = require("express"),
		handler = require("./modules/handler"),
		scer = require("./modules/soundclouder"),

		config = require("./" + configFile),
		app = express();
		
	log.setLogLevel( config.log_level );
		
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

	app.listen(port).on('error', function(e) {
		log.error("Listen error.");
		log.error(r);
	});
	
	log.system('Listening on port: ' + port + ' using config file: ' + configFile);
	
	/*
	server.on('connection', function(socket) {
		console.log("new Server connection.");

		socket.setTimeout(30 * 1000); 
		socket.setKeepAlive(true);
	});
	
	server.on('request', function(request, response) {
		console.log("Server request received.");
	});
	
	server.on('close', function() {
		console.log("close Server connection.");
	});
	
	server.on('clientError', function(e) {
		util.log("Server clientError.");
		util.log(util.inspect(e));
	});
	*/
	
} 
else 
{
	log.system('USAGE - node index [CONFIG FILE] [PORT]');
}

//----------------------------------------------
