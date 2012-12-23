//----------------------------------------------

var log = require('./logger'),
	fs = require('fs'),
	utils = exports;

utils.sendJsonError = function (response, err) 
{
	log.error(err);
	var r = {
		log: err,
		guid: null
	};
	response.json(r);
	
}

utils.sendError = function (response, err) 
{
	log.error(err);
	response.send(err);
}

utils.renderFile = function (response, path, replaceParams) 
{
	log.info("utils.renderFile: " + path);

    fs.readFile(__dirname + '/..' + path, 'utf8', function(err, text){
    	if(err) 
    	{
    		this.sendError(response, err);
    	}
    	else
    	{
    		for(var ea in replaceParams)
    		{
    		    log.trace("utils.renderFile: Replacing: " + ea + " with " + replaceParams[ea]);
				text = text.replace(ea, replaceParams[ea], "gi");
			}
    		
    		log.trace("utils.renderFile: \n" + text);
        	response.send(text);
        }
    });
}