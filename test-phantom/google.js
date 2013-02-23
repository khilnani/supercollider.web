var page = require('webpage').create();
page.open('http://google.com', function(status) {
    var title = page.evaluate(function() {
        return document.title;
    });
    console.log(title);
    phantom.exit();
});

