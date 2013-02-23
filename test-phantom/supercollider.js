var page = require('webpage').create();

page.settings.userName = "";
page.settings.password = "";
page.settings.userAgent = "Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206";

page.onAlert = function(msg) {
    console.log('ALERT: ' + msg);
};

page.onCallback = function(data) {
    console.log('CALLBACK: ' + JSON.stringify(data)); 
};

page.onClosing = function(closingPage) {
    console.log('The page is closing! URL: ' + closingPage.url);
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

page.onNavigationRequested = function(url, type, willNavigate, main) {
    console.log('Trying to navigate to: ' + url);
    console.log('Caused by: ' + type);
    console.log('Will actually navigate: ' + willNavigate);
    console.log('Sent from main frame: ' + main);
}

page.open('http://dev.dysf.co:8080', function(status) {

	console.log('Connection status: ' + status);
	
	if(status !== 'success') {
		console.log('Unable to load the address!');
	} else {	

		var title = page.evaluate(function() {
			return document.title;
		});

		console.log(title);

		var sccode = page.evaluate(function() {
			return $('#sccode').val();
		});

		console.log(sccode);

//		page.evaluate(function() {
//			$('#execute').click();
//		});

		var interval = setInterval(function() {
			var loaded = page.evaluate(function() {
				return sucess;
			});
 
                        var log = page.evaluate(function() {
                                return $('#log').val();
                        });

			console.log('log: ' + log);

			if(loaded)
			{
				clearInterval(interval);
			}
		}, 1000);

		console.log('interval: ' + interval);
	}

	phantom.exit();
});

