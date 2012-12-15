var exec = require("child_process").exec;
var fs = require('fs');


var scdPath = "/tmp/";
var audioPath = "/tmp/";
var sc_startFile = "./templates/sc_start.scd";
var sc_midFile = "./templates/sc_mid.scd";	
var sc_endFile = "./templates/sc_end.scd";


function process(request, response) {

	var guid = (new Date()).getTime();

	console.log("POST /process guid=" + guid);  	

	var sc_start = "";
	var sc_mid = "";	
	var sc_end = "";
	var sc_params = "";
	var sc_txt = request.body.sccode;
	var sc_data = "";
	
	
	console.log("sccode: " + sc_txt);
	console.log("guid: " + guid);
	
	fs.readFile(sc_startFile, function (err, data) {
		if (err) 
			sendJsonError(response, err);


		console.log(data);
		sc_start = data;

		fs.readFile(sc_midFile, function (err, data) {
			if (err) 
		    	sendJsonError(response, err);
	

			console.log(data);
			sc_mid = data;
			
			fs.readFile(sc_endFile, function (err, data) {
				if (err) 
					sendJsonError(response, err);

//				console.log(data);
				sc_end = data;
				
				sc_params = "~path = \"" + getAudioPath(guid) + "\";";
				sc_params += "~length = 10;";
				
				sc_data = sc_start + sc_params + sc_mid + sc_txt + sc_end;
				
				fs.writeFile( getScd(guid) , sc_data, function(err) {
			    	if(err) 
			    	    sendJsonError(response, err);

    	    
					console.log("Saved to '" + getScd(guid) + "'");
    	    
    	    		//120x1000ms
    	    		var options = { 
  						timeout: 30000
  					 };
  						
    	    		exec("sclang " + getScd(guid), options, function (error, stdout, stderr) {
    	    		
    	    			console.log("sclang output:\n" + stdout);
    	    
    	    			if(error) 
    	    			{
    	    				sendJsonError(response, stdout);
    	    			}
    	    			else
    	    			{
    	    				var r = {
    	    					log: stdout,
    	    					guid: guid
    	    				};
    	    			    	    			
    	    				response.json(r);
    	    			}

					}); 

				});			
				
	
			});

		});

	});

}

function sendJsonError(response, err) {
	console.error(err);
	var r = {
		log: err,
		guid: null
	};
	response.json(r);
	
}


function render(request, response) {
  	
  	var guid = request.query.guid;

  	console.log("/render guid=" + guid);

  	
	response.download( getAudioPath(guid), getAudioName(guid), function (err) {
		if (err) {
			sendError(response,err);
		}
		
	});

  	
}

function getScd(guid) {
	return scdPath + guid + ".scd";
}

function getAudioName(guid) {
	return guid + ".aiff";
}

function getAudioPath(guid) {
	return audioPath + getAudioName(guid);
}


function sendError(response, err) {
	console.error(err);
	response.send(err);
}

exports.process = process;
exports.render = render;

