//----------------------------------------------
// SC-tweeter

var log = require("dysf.utils").logger;

log.system("Starting " + __filename);

var configFile = process.argv[2];
var port = process.argv[3];

//----------------------------------------------

if(port && configFile) 
{
	var express = require('express'),
		http = require('http'),
		scer = require("soundclouder"),
		handler = require("./modules/handler"),
		config = require("./config/" + configFile),
		app = express();
		
	log.setLogLevel( config.log_level );
		
	scer.init(config.sc_client_id, config.sc_client_secret, config.sc_redirect_uri);
	
	handler.setSoundClouder(scer);
	
	app.configure(function () {
		if( config.username ) {
			app.use(
			express.basicAuth( config.username , config.password  )
			)
		} else {
			log.system("Skipping basic auth.");
		}
		app.set("view options", {layout: false});
		app.use(express.static(__dirname + '/html'));
		app.use(express.bodyParser());
	});
	
	app.post('/process',handler.process);
	app.get('/render', handler.render);
	app.get('/sc', handler.sc);
	
	var server = http.createServer(app);
	
	server.listen(port);
	
	server.on('listening', function () {
		log.system('Server listening on port: ' + port + ' using config file: ' + configFile);
	});

	server.on('error', function(e) {
		log.error("Server error.");
		log.error(e);
	});
		
	server.on('connection', function(socket) {
		log.event("New socket connection from: " + socket.remoteAddress);
		
		socket.on('error', function(e) {
			log.error("Socket error: " + this.remoteAddress);
			log.error(e);
		});
		
		socket.on('close', function (hadError) {
			log.event("Socket closed. Had error? " + hadError);
		});
		
	});
	
	server.on('request', function(request, response) {
		log.info("Server request received: " + request.url );
	});
	
	server.on('close', function() {
		log.system("Server stopped.");
	});
	
	server.on('clientError', function(e) {
		log.error("Server clientError.");
		log.error(e);
	});
		
} 
else 
{
	log.system('USAGE - node index [CONFIG FILE] [PORT]');
}

//----------------------------------------------
