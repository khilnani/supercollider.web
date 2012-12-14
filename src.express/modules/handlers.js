var exec = require("child_process").exec;
var fs = require('fs');


var scdFile = "/tmp/upload.scd";
var audioFile = "/tmp/audio.aiff";
var sc_startFile = "./templates/sc_start.scd";
var sc_midFile = "./templates/sc_mid.scd";	
var sc_endFile = "./templates/sc_end.scd";


function process(request, response) {
	console.log("POST /process");  	

	var sc_start = "";
	var sc_mid = "";	
	var sc_end = "";
	var sc_params = "";
	var sc_txt = request.body.sccode;
	var sc_data = "";
	
	console.log("sccode: " + sc_txt);
	
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
				
				sc_params = "~path = \"" + audioFile + "\";";
				sc_params += "~length = 10;";
				
				sc_data = sc_start + sc_params + sc_mid + sc_txt + sc_end;
				
				fs.writeFile(scdFile, sc_data, function(err) {
			    	if(err) throw console.error(err);   	
    	    
					console.log("Saved to '" + scdFile + "'");
    	    
    	    		//TODO need a timeout in case the process hangs
    	    		exec("sclang " + scdFile, function (error, stdout, stderr) {
    	    
    	    			if(error) throw error;
    	    			
						console.log("redirecting...");
    	    			
    	    			response.redirect('/render');

					}); 

				});			
				
	
			});

		});

	});

}

function render(request, response) {
  	console.log("/render");
  	
	response.download(audioFile, "audio.aiff", function (err) {
		if (err) throw console.error(err);			
	});

  	
}


exports.process = process;
exports.render = render;

