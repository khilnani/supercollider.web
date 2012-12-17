//--------------------------------------------

var http = require("http"),
	qs = require('querystring'),
	fs = require('fs'),
	sc = exports;
	
var inited = false;

//--------------------------------------------

var host = "api.soundcloud.com",
	client_id = "",
	client_secret = "",
	redirect_uri = "",
	code = "",
	access_token = "";
	
//--------------------------------------------

	
sc.accesstoken = function () 
{
	return access_token;
}
	
//--------------------------------------------

sc.init = function (_client_id, _client_secret, _redirect_uri)
{
	inited = true;
	client_id = _client_id;
	client_secret = _client_secret;
	redirect_uri = _redirect_uri;
}

sc.auth = function (code, callback)
{
	if(inited == false)
	{
		console.log("SoundClouder not inited!");
		callback({'message' : "SoundClouder not inited!"});
	}
	else
	{
	
		var post_data = qs.stringify({  
			'client_id' : client_id,  
			'client_secret': client_secret,
			'grant_type': 'authorization_code',
			'redirect_uri': redirect_uri,
			'code': code
		}); 
		
		var post_options = {  
			host: host,  
			path: '/oauth2/token',  
			method: 'POST',  
			headers: {  
				'Content-Type': 'application/x-www-form-urlencoded',  
				'Content-Length': post_data.length  
			}  
		};  
		  
		var req = http.request(post_options, function(res) {  
			res.setEncoding('utf8');  
			//console.log('STATUS: ' + res.statusCode);
			//console.log('HEADERS: ' + JSON.stringify(res.headers));
		 
			var data = "";
			res.on('data', function (chunk) {
				data += chunk;
				//console.log('Chunk: ' + chunk);  
			});  
			res.on('end', function () {
				//console.log('Response: ' + data);
				var d = JSON.parse(data);
				access_token = d.access_token;
				console.log('access_token:' + access_token);
				callback();
			});
		});
		
		req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		  callback(e);
		});
		  
		// write parameters to post body  
		req.write(post_data);  
		req.end();  
	}
	
}

//--------------------------------------------


/*

https://api.soundcloud.com/me?oauth_token=1-29132-29620504-81f1b9e89cc339d&format=json&_status_code_map[302]=200


  	var options = {
  		hostname: 'google.com'
  	};
  	
  	console.log("calling: " + options.hostname);
  	
  	var req = http.get(options, function (response) {
  		console.log("http code: " + response.statusCode);
  		console.log("http code: " + JSON.stringify(response.headers));
  		
  		var data = "";
  		response.on('data', function(chunk) {
  			data += chunk;
  			console.log("chunk: " + chunk);
  		});
  		response.on('end', function() {
  			console.log("ended.");
  			console.log("--------------");
  			console.log("final data: \n" + data);
  			console.log("--------------");
  		});
	});
	
	req.on('error', function(e) {
  		console.log("http error: " + e.message);  	
  	});
  	  	
  	  	
*/



function sendJsonError(response, err) 
{
	console.error(err);
	var r = {
		log: err,
		guid: null
	};
	response.json(r);
	
}

function sendError(response, err) 
{
	console.error(err);
	response.send(err);
}


function renderFile(response, path) 
{
    fs.readFile(__dirname + '/..' + path, 'utf8', function(err, text){
    	if(err) 
    	{
    		sendError(response, err);
    	}
    	else
    	{
    		//console.log("Sending: \n" + text);
        	response.send(text);
        }
    });
}

//--------------------------------------------


