var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require('fs');
var util = require('util');


var scdFile = "/tmp/upload.scd";
var audioFile = "/tmp/audio.aiff";
var sc_startFile = "./templates/sc_start.scd";
var sc_midFile = "./templates/sc_mid.scd";	
var sc_endFile = "./templates/sc_end.scd";



function start(response, postData) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/process" method="post">'+
    '<textarea name="text" rows="20" cols="60">play{a=SinOsc;b=49*(1,1.33..10.64);Splay.ar(a.ar({|i|b@i*a.ar(b@(7-i))*LFNoise1.kr(0.5.rand).exprange(1,9)}!8)).tanh/4};</textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function process(response, postData) {
  	console.log("Request handler 'process' was called.");  	


	var sc_start = "";
	var sc_mid = "";	
	var sc_end = "";
	var sc_params = "";
	var sc_txt = querystring.parse(postData).text;
	var sc_data = "";
	
	fs.readFile(sc_startFile, function (err, data) {
		if (err) throw err;

		console.log(data);
		sc_start = data;

		fs.readFile(sc_midFile, function (err, data) {
			if (err) throw err;

			console.log(data);
			sc_mid = data;
			
			fs.readFile(sc_endFile, function (err, data) {
				if (err) throw err;

//				console.log(data);
				sc_end = data;
				
				sc_params = "~path = \"" + audioFile + "\";";
				sc_params += "~length = 10;";
				
				sc_data = sc_start + sc_params + sc_mid + sc_txt + sc_end;
				
				fs.writeFile(scdFile, sc_data, function(err) {
			    	if(err) throw error;   	
    	    
					console.log("Saved to '" + scdFile + "'");
    	    
    	    		exec("sclang " + scdFile, function (error, stdout, stderr) {
    	    
    	    			if(error) throw error;
    	    			
						response.statusCode = 302;
						response.setHeader("Location", "/render");
						response.end();

					}); 

				});			
				
	
			});

		});

	});

}

function render(response, postData) {
  	console.log("Request handler 'render' was called.");
  	
	var stat = fs.statSync(audioFile);
    	    
	response.writeHead(200, {
		'Content-Type': 'audio/x-aiff',
		'Content-Length': stat.size
	});
		    
	var readStream = fs.createReadStream(audioFile);

	util.pump(readStream, response);

}


 

exports.start = start;
exports.process = process;
exports.render = render;
