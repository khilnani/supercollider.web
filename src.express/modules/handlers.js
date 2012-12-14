var exec = require("child_process").exec;
var fs = require('fs');


var scdFile = "/tmp/";
var audioFile = "/tmp/";
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
		if (err) throw console.error(err);

		console.log(data);
		sc_start = data;

		fs.readFile(sc_midFile, function (err, data) {
			if (err) throw console.error(err);

			console.log(data);
			sc_mid = data;
			
			fs.readFile(sc_endFile, function (err, data) {
				if (err) throw console.error(err);

//				console.log(data);
				sc_end = data;
				
				sc_params = "~path = \"" + audioFile + guid + ".aiff\";";
				sc_params += "~length = 10;";
				
				sc_data = sc_start + sc_params + sc_mid + sc_txt + sc_end;
				
				fs.writeFile(scdFile + guid + ".scd", sc_data, function(err) {
			    	if(err) throw console.error(err);   	
    	    
					console.log("Saved to '" + scdFile + guid + ".scd'");
    	    
    	    		//TODO need a timeout in case the process hangs
    	    		exec("sclang " + scdFile + guid + ".scd", function (error, stdout, stderr) {
    	    
    	    			if(error) throw error;
    	    			
    	    			var r = {
    	    				log: stdout,
    	    				guid: guid
    	    			};
    	    			    	    			
    	    			response.json(r);

					}); 

				});			
				
	
			});

		});

	});

}


function render(request, response) {
  	
  	var guid = request.query.guid;

  	console.log("/render guid=" + guid);

  	
	response.download(audioFile + guid + ".aiff", guid + ".aiff", function (err) {
		if (err) throw console.error(err);			
	});

  	
}


exports.process = process;
exports.render = render;

