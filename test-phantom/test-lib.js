
var page = require('webpage').create();

page.onAlert = function(msg) {
    console.log('ALERT: ' + msg);
};

page.onCallback = function(data) {
    console.log('CALLBACK: ' + JSON.stringify(data));
};

page.onConfirm = function(msg) {
    console.log('CONFIRM: ' + msg);
    return true;  // `true` === pressing the "OK" button, `false` === pressing the "Cancel" button
};

page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log('CONSOLE: ' + msg );
};

page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    console.error(msgStack.join('\n'));
};



page.injectJs('assert.js');
page.injectJs('lib.js');


page.evaluate(function() {
	var result = testLib();
	assert.equal(result, "No", "Supposed to be YES");
});



phantom.exit();



