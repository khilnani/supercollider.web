var logger = exports,
	util = require('util');


logger.debugLevel = 'warn';

logger.log = function(level, message) 
{
	var levels = ['error', 'warn', 'info'];
 
	if (levels.indexOf(level) >= levels.indexOf(logger.debugLevel) ) 
	{
 		if (typeof message !== 'string') 
		{
 			message = JSON.stringify(message);
		};
      		util.log(level+': '+message);
    	}
}
