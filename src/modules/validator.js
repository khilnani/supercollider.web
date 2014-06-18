//--------------------------------------------
var log = require("dysf.utils").logger,
  illegals = require("../config/config.illegals"),
  v = exports;

//--------------------------------------------

v.validate = function (code, guid) {
  guid = guid || (new Date()).getTime();
  log.debug("isValid(): Start. guid: " + guid + " code: " + code);

  code = code.toLowerCase();
  code = code.replace(/[^a-z0-9]/g, '');

  log.trace("isValid(): Condensed. guid: " + guid + " code: " + code);

  var usage = [];

  log.trace("illegals.list: " + illegals.list);
  illegals.list.forEach(function (val) {
    //log.trace("Val: " + val);
    if (code.indexOf(val.toLowerCase()) > -1) {
      usage.push(val);
      log.warn("isValid(): guid: " + guid + " illegal found: " + val);
    }

  });

  log.debug("isValid(): Ended. guid: " + guid + " usage: " + usage.length);

  return usage;
}

//--------------------------------------------
