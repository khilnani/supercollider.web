//----------------------------------------------

var logger = exports,
	util = require('util');


// 0, 1, 2, 3, 4, 5
var log_types = ["error", "warn", "event", "info", "debug", "trace"];
var log_labels = ["[ERROR] ", "[WARN]  ", "[EVENT] ", "[INFO]  ", "[DEBUG] ", "[TRACE] "];
var log_level = 3;	// info and higher


//----------------------------------------------

function log(level, message) 
{ 
//	util.log("log: " + level + " : " + message);		
	var index = log_types.indexOf(level);
	if (index <= log_level ) 
	{
 		if (typeof message !== 'string') 
		{
 			message = JSON.stringify(message);
		}
		
		if(index == 0) message = "*** " + message;
		      	
      	util.log(log_labels[index] + ': '+ message);
    }
}

//----------------------------------------------//----------------------------------------------


logger.setLogLevel = function (level)
{
	if(level >= 0 &&  level < log_types.length)
	{
		log_level = level;
		this.system("logger.setLogLevel: " + log_types[log_level].toUpperCase() );
	}
	else
	{
		this.system("logger.setLogLevel: Invalid level: " + level + ". Using: " + log_types[log_level].toUpperCase());
	}
}

//----------------------------------------------

logger.system = function( message ) 
{
	util.log("[SYSTEM]: " + message );
}

logger.event = function( message ) 
{
	log("event", message);
}

logger.error = function( message ) 
{
	log("error", message);
}

logger.warn = function( message ) 
{
	log("warn", message);
}


logger.info = function( message ) 
{
	log("info", message);
}


logger.debug = function( message ) 
{
	log("debug", message);
}

logger.trace = function( message ) 
{
	log("trace", message);
}

//----------------------------------------------
