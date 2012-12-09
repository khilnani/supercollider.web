var server = require("./modules/server");
var router = require("./modules/router");
var handlers = require("./modules/handlers");

var handle = {}
handle["/"] = handlers.start;
handle["/process"] = handlers.process;
handle["/render"] = handlers.render;

server.start(router.route, handle);