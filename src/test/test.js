var assert = require('assert'),
	vows = require('vows'),
	log = require("dysf.utils").logger,
	badcode = require("./testcode"),
	v = require("../modules/validator");
	
log.setLogLevel(6);

vows.describe('sc-tweeter').addBatch({
  "When using the application ": {
    "sending insecure sc code": {
      "should  error": function () {
      
      		var illegals = v.validate( testcode.bad );
      		var isOK = (illegals.length == 0);
      		assert( ! isOK );

      }
    },
    "sending good sc code": {
      "should not error": function () {
      
      		var illegals = v.validate( testcode.good );
      		var isOK = (illegals.length == 0);

      		assert( isOK );

      },
    }
  }
}).export(module);


