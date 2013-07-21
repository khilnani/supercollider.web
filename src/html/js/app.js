//---------------------------------------

var inited=false;
var running = false;
var scconnected = false;
var logIntervalId = -1;
var timerSeconds = 0;

var scConfig = {};
scConfig.client_id = undefined;
scConfig.redirect_uri = undefined;

//---------------------------------------


function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
		return decodeURIComponent(pair[1]);
		}
	}
	console.log('Query variable %s not found', variable);
}

function convertSecondsToMins(sec)
{
	var mins = 0;
	var secs = 0;

	if(sec)
	{
		min = Math.floor(sec / 60);
		secs = sec % 60;

		return {m: min, s: secs};
	}

	return {m: 0, s:sec};
	
}
	
//---------------------------------------


function logViewHelper()
{
	$('#log').css({'height': '6em', 'font-size':'10px', 'width':'100%'});
	$('#log').trigger('keyup');
}

function refreshLogView( msg )
{
	if(msg)
	{
                $('#log').val( msg );
	}
	window.setTimeout(window.logViewHelper, 10);
}


function clearLogTimer()
{
	console.log("Clear Log Timer called.");
	window.clearInterval(logIntervalId);
}

function startLogTimer()
{
	console.log("Start Log Timer.");
	timerSeconds = 0;
	logIntervalId = window.setInterval( window.logTimer , 1000);
}

function getLogTimerMsg ()
{
        console.log("getLogTimerMsg: " + timerSeconds);
        var msg = "Loading... Elapsed: " + convertSecondsToMins(timerSeconds).m + " min(s) " + convertSecondsToMins(timerSeconds).s + " second(s)" ;
        return msg;
}

function logTimer () 
{
        timerSeconds ++;
	console.log("Called log Timer .. " + timerSeconds); 
	var msg = getLogTimerMsg();
	refreshLogView( msg );
}


//---------------------------------------

function setLocalStorageItem(key, value)
{
	try
	{
		if(value == null || value == "null")
		{
			localStorage.removeItem(key);
			console.log("localStorage.removeItem: " + key);
		}
		else
		{
			localStorage.setItem(key, value);
			console.log("localStorage.setItem: " + key + ": " + value);			
		}
	}
	catch(e)
	{
		console.log("localStorage.setItem: Unable to save: " + key + " : " +  value);
	}
}

//---------------------------------------

function setGuid(guid)
{
	setLocalStorageItem("guid", guid);
}

function setCode(code)
{
	setLocalStorageItem("code", code);
}

function setToken(sctoken)
{
	setLocalStorageItem("sctoken", sctoken);
}


function getState()
{
	var o = {
		sctoken : localStorage.getItem("sctoken"),
		guid : localStorage.getItem("guid"),
		code : localStorage.getItem("code")
	};
	
	o.sctoken = (o.sctoken == null || o.sctoken == "null") ? undefined : o.sctoken;
	o.guid = (o.guid == null || o.guid == "null") ? undefined : o.guid;
	o.code = (o.code == null || o.code == "null") ? undefined : o.code;
	
	var d = "";
		d += "sctoken: " + o.sctoken + "<br/>";
		d += "guid: " + o.guid + "<br/>";
		d += "code: " + o.code;
	
	console.log("getState: " + d);
	
	return o;
}

function refreshCode()
{
	if(getState().code)
	{
		$('#sccode').val(getState().code);
	}
}

function storageHandler(e)
{
	var d = "";
	d += "e.key: " + e.key;
	d += "\ne.oldValue: " + e.oldValue + "(" + typeof(e.oldValue) + ")";
	d += "\ne.newValue: " + e.newValue + "(" + typeof(e.newValue) + ")";
	d += "\ne.url: " + e.url;
	d += "\ne.source: " + e.source;
	
	console.log("storageHandler: " + d);
	
	if(e.key == "sctoken" && (e.oldValue == null || e.oldValue =='null') && e.newValue != null)
	{
		console.log("User just logged into SoundCloud. sctoken changed.");
		//window.setTimeout(window.initState, 100);
		initState();
	}
	
	refreshCode();
	
	showDebugInfo();

}

function showDebugInfo()
{
	var o = getState();
	
	var d = "";
		d += "sctoken: " + o.sctoken + "<br/>";
		d += "guid: " + o.guid + "<br/>"
		d += "code: " + o.code;
		
		$('#scdebuglabel').html(d);

}

//---------------------------------------

function getSCUserName()
{
	SC.get('/me', function(me) { 
		//alert( JSON.stringify(me) );
		if(me == null ||  me.errors)
		{
			scDisconnected();	
		}
		else
		{
			scConnected(me);
		}
	});
}

function scDisconnected()
{
        scconnected = false;
        $('#scconnectlabel').html('');
        $('#scconnect').show();
	$('#logout').hide();

        setToken(null);
        SC.storage().removeItem('SC.accessToken');
}

function scConnected(me)
{
        scconnected = true;
        $('#scconnectlabel').html('Hello, ' + me.username + '!');
	$('#scconnect').hide();
	$('#logout').show();
}

function initState()
{
	console.log("initState()");
	$('#scconnectlabel').html('');
	$('#scconnect').hide();
	$('#logout').hide();

	// http://stackoverflow.com/questions/11116532/how-to-have-users-reconnect-with-soundcloud-on-each-page-reload
	if(getState().sctoken)
	{
		console.log("initState(): getting SC Username");
		SC.storage().setItem('SC.accessToken', getState().sctoken);
		getSCUserName();
	} else {
		scDisconnected();
	}
		
	refreshCode();
}

function logout()
{
	console.log("Logging out.");

	scDisconnected();
}

//---------------------------------------

$(document).bind('pageinit', function () {

	if(inited) return;
	inited = true;
	
	window.addEventListener('storage', storageHandler, false);	
	
	$.ajaxSetup({
    	type: 'POST',
    	headers: { "cache-control": "no-cache" }
	});



	$('#sccode').css({'height': '9em', 'font-size':'12px', 'width':'100%'});
	$('#sccode').on("change", function(event, ui) {
		setCode($('#sccode').val());
	});
	
	refreshLogView();
   
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
		
    		console.log("Sending SC Code via jqXHR.");


		startLogTimer();

    		var $this = $(this);

	    	var jqXHR = $.post($this.attr('action'), $this.serialize() );
						
		jqXHR.done( function( data ) {
                        console.log("jqXHR.done.");

                        if(data.log)
                        {
                                console.log("Log Recieved: \n" + data.log);
                                refreshLogView( data.log + "\n\nRecorded audio duration: " + $('#duration').val() + " second(s).\n\n" );
                        }
                        else
                        {       console("Log not Recieved." );
                                refreshLogView();
                        }

                        var guid = "";

                        if(data.guid) {
                                guid = data.guid;
                        } else {
                                guid = "";
                        }

                        setGuid(guid);

		});

		jqXHR.fail( function( data ) {
                        console.log("jqXHR.fail: " + data);

        		var msg = getLogTimerMsg();
			msg += "\nUnknown AJAX/execution error.";
        		refreshLogView( msg );

		});

		jqXHR.always( function( data ) {
			console.log("jqXHR.always: " + data);
			
			clearLogTimer();
			running = false;

                        console.log("SC Code execution attempt completed.");
		});

	});
	
	$('#listen').on('click', function() {
	
		var guid = getState().guid;
    		console.log("Attempting to playback. guid: " + guid);

		if(guid && guid != "")
			window.location.href = "/render?guid=" + guid;
		else
			alert('Please execute code before attempting to listen.');
	});

	$('#scconnect').on('click', function() {
	
    		console.log("Attempting to connect to SoundCloud. ");

		SC.initialize({
			client_id: scConfig.client_id,
			redirect_uri: scConfig.redirect_uri,
			display: 'popup'
		});
		
		SC.connect(function() {
			scconnected = true;	    
			console.log("Connected to SoundCloud");
			//alert("Connected to SoundCloud");
		});
	});


	$('#logout').on('click', function () {
		logout();
	});
	
	$('#scdebug').on('click', function() {

		showDebugInfo();
		getSCUserName();

	});
	
	// Kickoff state restore, testing the SoundCloud connection etc.
	var jqxhr = $.getJSON( "/scconfig", function(data) {
  		console.log( "/scconfig SUCCESS": + data.client_id + ", " + data.redirect_uri);
  		
		scConfig.client_id = data.client_id;
		scConfig.redirect_uri = data.redirect_uri;

  		
  		initState();
	})
	.fail(function() { 
		console.log( "/scconfig" ERROR: + data );	
	});
	


});


