
var inited=false;
var running = false;
var scconnected = false;

var guid = null;
var sctoken = null;



function logViewHelper()
{
    $('#log').css({'height': '9em', 'font-size':'10px', 'width':'100%'});
	$('#log').trigger('keyup');
}

function refreshLogView()
{
	window.setTimeout(window.logViewHelper, 10);
}



$(document).bind('pageinit', function () {

	if(inited) return;
	inited = true;

	$('#sccode').css({'height': '9em', 'font-size':'10px', 'width':'100%'});
	logViewHelper();
    $('#scroller').css({'overflow' : 'auto', '-webkit-overflow-scrolling' : 'touch', 'padding': '0 0 0 0', 'margin': '0 0 0 0'});
	$('#docsiframe').css({'padding': '0 0 0 0', 'margin': '0 0 0 0', 'height': $(document).height() * 0.93 });
    
    $(window).bind('resize', function () {
	    $('#docsiframe').css('height',  $(document).height() * 0.92 );
    });
    

	$('#scForm').on('submit', function (e) {
	
    	console.log("Attempting to send SC Code");
	
	    e.preventDefault();
	
		if(running == true) {
			var c = confirm("Execution in process. Override?");
			if( c == false ) {
		    	console.log("Aborted execution override.");
				return;
			}
		}
		
		running = true;
		
    	console.log("Sending SC Code.");

	
		$('#log').val( "Loading ..." );
		refreshLogView();
		
		guid = "";


    	var $this = $(this);

	    $.post($this.attr('action'), $this.serialize(), function (responseData) {
						
			running = false;
			
			$('#log').val( responseData.log );
			refreshLogView();
			
			if(responseData.guid) {
				guid = responseData.guid;
			} else {
				guid = "";
			}
			
			guid = responseData.guid;
			
	    	console.log("SC Code execution attempt completed. guid: " + guid);			
			
		});
	});
	
	$('#listen').on('click', function() {
    	console.log("Attempting to playback. guid: " + guid);

		if(guid && guid != "")
			window.location.href = "/render?guid=" + guid;
		else
			alert('Please execute code before attempting to listen.');
	});

	$('#scconnect').on('click', function() {
	
    	console.log("Attempting to connect to SoundCloud. ");

		SC.initialize({
			client_id: '8298c1d316d40cd38954c7f44375c675',
			redirect_uri: 'http://dev.dysf.co:8080/sc',
			display: 'popup'
		});
		
		SC.connect(function() {
			SC.get('/me', function(me) { 
		    	console.log("Connected to SoundCloud");

				$('#scconnectlabel').html('Hello, ' + me.username + '!');
				scconnected = true;
			});
		});
	});
	
	
	$('#scdebug').on('click', function() {

		var d = "";
		d += "sctoken: " + sctoken + "<br/>";
		d += "guid: " + guid;
		
		$('#scdebuglabel').html(d);

    	console.log(d);

	});
	 


});


