//--------------------------------------------

var http = require("http"),
	exec = require("child_process").exec,
	fs = require('fs'),
	utils = require("./utils"),
	log = require("./logger"),
	handler = exports;

//--------------------------------------------

var scer = null;
var scdPath = "/tmp/";
var audioPath = "/tmp/";
var sc_startFile = "./templates/sc_start.scd";
var sc_midFile = "./templates/sc_mid.scd";	
var sc_endFile = "./templates/sc_end.scd";

//--------------------------------------------


	
//--------------------------------------------

handler.setSoundClouder = function (_scer)
{
	log.debug("handler.setSoundClouder");
	scer = _scer;
}


//--------------------------------------------


handler.process = function (request, response) 
{

	var guid = (new Date()).getTime();

	log.info("POST /process guid=" + guid);  	

	var sc_start = "";
	var sc_mid = "";	
	var sc_end = "";
	var sc_params = "";
	var sc_txt = request.body.sccode;
	var duration = request.body.duration;
	var sc_data = "";
	var sclang_startup_time = 10;
	var sclang_timeout = 10;	

	if(typeof(duration) == "undefined" || duration == "NaN" || duration == "-1" || duration == "0")
	{
		duration = 1;
	
	}
	
	var duration_seconds = parseInt(duration) + sclang_startup_time;

//	request.connection.setTimeout( duration_seconds ); 
	request.connection.setKeepAlive(true);

	request.connection.on('error', function (e)
	{
		log.error('Socket error.');
		log.error(e);
	});

	request.connection.on('close', function ()
	{
		log.error('Socket closed.');
	});

	var sclang_timeout = duration_seconds * 1000;

	log.info("sccode: " + sc_txt);
	log.info("duration: " + duration);
	log.info("sclang_timeout: " + sclang_timeout);
	log.info("guid: " + guid);
	
	fs.readFile(sc_startFile, function (err, data) {
		if (err) 
			utils.sendJsonError(response, err);

		sc_start = data;

		fs.readFile(sc_midFile, function (err, data) {
			if (err) 
		    		utils.sendJsonError(response, err);
	
			sc_mid = data;
			
			fs.readFile(sc_endFile, function (err, data) {
				if (err) 
					utils.sendJsonError(response, err);

				sc_end = data;
				
				sc_params = "~path = \"" + getAudioPath(guid) + "\";\n";
				sc_params += "~length = " + duration + ";";
				
				sc_data = sc_start + sc_params + sc_mid + sc_txt + sc_end;
				
				log.trace("Attempting to save: \n" + sc_data);
				
				fs.writeFile( getScd(guid) , sc_data, function(err) {
			    	
					if(err) 
					{
			    				util.error("Error saving to '" + getScd(guid) + "'");    		
			    	    		utils.sendJsonError(response, err);
			    	}
    	    
						log.info("Saved to '" + getScd(guid) + "'");
    	    
    	    				var options = { 
  						timeout: sclang_timeout
  					 };
					
					log.info("Executing sclang " + getScd(guid) + " with timeout: " + sclang_timeout);
  						
    	    				exec("sclang " + getScd(guid), options, function (error, stdout, stderr) {
    	    		
    	    					log.info("sclang stdout:\n" + stdout);
 
    	    					if(error) 
    	    					{
    	    						log.error("sclang stderr:\n" + stderr);
    	    						utils.sendJsonError(response, stdout);

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

//--------------------------------------------

handler.render = function (request, response) 
{	
  	var guid = request.query.guid;

  	log.info("/render guid=" + guid);
  	
	response.download( getAudioPath(guid), getAudioName(guid), function (err) {
		if (err) {
			utils.sendError(response,err);
		}
	});
}

//--------------------------------------------

handler.sc = function (request, response) 
{

  	var sccode = request.query.code;

  	log.info("/sc sccode=" + sccode);
  	
  	scer.auth(sccode, function (e) {
  		var replaceParams = {'%access_token%': scer.accesstoken() };
		log.info('/sc access_token=' + scer.accesstoken());
  		utils.renderFile(response, '/html/sc.html', replaceParams);
  	});
  	
}

//--------------------------------------------

function getScd(guid) 
{
	return scdPath + guid + ".scd";
}

function getAudioName(guid) 
{
	return guid + ".aiff";
}

function getAudioPath(guid) 
{
	return audioPath + getAudioName(guid);
}

//--------------------------------------------


