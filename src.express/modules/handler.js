//--------------------------------------------

var http = require("http"),
	exec = require("child_process").exec,
	fs = require('fs'),
	util = require('util'),
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
	scer = _scer;
}


//--------------------------------------------


handler.process = function (request, response) 
{

	var guid = (new Date()).getTime();

	util.log("POST /process guid=" + guid);  	

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
		util.log('Socket error.');
		util.log(e);
	});

	request.connection.on('close', function ()
	{
		util.log('Socket closed.');
	});

	var sclang_timeout = duration_seconds * 1000;

	util.log("sccode: " + sc_txt);
	util.log("duration: " + duration);
	util.log("sclang_timeout: " + sclang_timeout);
	util.log("guid: " + guid);
	
	fs.readFile(sc_startFile, function (err, data) {
		if (err) 
			sendJsonError(response, err);


		//util.log(data);
		sc_start = data;

		fs.readFile(sc_midFile, function (err, data) {
			if (err) 
		    		sendJsonError(response, err);
	

			//util.log(data);
			sc_mid = data;
			
			fs.readFile(sc_endFile, function (err, data) {
				if (err) 
					sendJsonError(response, err);

//				util.log(data);
				sc_end = data;
				
				sc_params = "~path = \"" + getAudioPath(guid) + "\";\n";
				sc_params += "~length = " + duration + ";";
				
				sc_data = sc_start + sc_params + sc_mid + sc_txt + sc_end;
				
				//util.log("Attempting to save: \n" + sc_data);
				
				fs.writeFile( getScd(guid) , sc_data, function(err) {
			    	
					if(err) 
					{
			    				util.error("Error saving to '" + getScd(guid) + "'");    		
			    	    		sendJsonError(response, err);
			    	}
    	    
						util.log("Saved to '" + getScd(guid) + "'");
    	    
    	    				var options = { 
  						timeout: sclang_timeout
  					 };
					
					util.log("Executing sclang " + getScd(guid) + " with timeout: " + sclang_timeout);
  						
    	    				exec("sclang " + getScd(guid), options, function (error, stdout, stderr) {
    	    		
    	    					util.log("sclang stdout:\n" + stdout);
 
    	    					if(error) 
    	    					{
    	    						util.error("sclang stderr:\n" + stderr);
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

//--------------------------------------------

handler.render = function (request, response) 
{	
  	var guid = request.query.guid;

  	util.log("/render guid=" + guid);
  	
	response.download( getAudioPath(guid), getAudioName(guid), function (err) {
		if (err) {
			sendError(response,err);
		}
	});
}

//--------------------------------------------

handler.sc = function (request, response) 
{

  	var sccode = request.query.code;

  	util.log("/sc sccode=" + sccode);
  	
  	scer.auth(sccode, function (e) {
  		var replaceParams = {'%access_token%': scer.accesstoken() };
		util.log('/sc access_token=' + scer.accesstoken());
  		renderFile(response, '/html/sc.html', replaceParams);
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

function sendJsonError(response, err) 
{
	util.log(err);
	var r = {
		log: err,
		guid: null
	};
	response.json(r);
	
}

function sendError(response, err) 
{
	util.log(err);
	response.send(err);
}


function renderFile(response, path, replaceParams) 
{
    fs.readFile(__dirname + '/..' + path, 'utf8', function(err, text){
    	if(err) 
    	{
    		sendError(response, err);
    	}
    	else
    	{
    		for(var ea in replaceParams)
    		{
    		    util.log("renderFile: replacing: " + ea + " with " + replaceParams[ea]);
				text = text.replace(ea, replaceParams[ea], "gi");
			}
    		
    		//util.log("renderFile: \n" + text);
        	response.send(text);
        }
    });
}


//--------------------------------------------


