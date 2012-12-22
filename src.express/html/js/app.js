
//---------------------------------------

var inited=false;
var running = false;
var scconnected = false;

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
	
//---------------------------------------


function logViewHelper()
{
    $('#log').css({'height': '6em', 'font-size':'10px', 'width':'100%'});
	$('#log').trigger('keyup');
}

function refreshLogView()
{
	window.setTimeout(window.logViewHelper, 10);
}

//---------------------------------------

function setGuid(guid)
{
	try
	{
		localStorage.setItem("guid", guid);
		console.log("setGuid: guid: " + guid);          
	}
	catch(e)
	{
		console.log("setGuid: Unable to save: " + guid);
	}
}

function setCode(code)
{
	try
	{
		localStorage.setItem("code", code);
		console.log("setCode: code: " + code);          
	}
	catch(e)
	{
		console.log("setCode: Unable to save: " + code);
	}
}

function setToken(sctoken)
{
	try
	{
		localStorage.setItem("sctoken", sctoken);
		console.log("setToken: sctoken: " + sctoken);           
	}
	catch(e)
	{
		console.log("setToken: Unable to save: " + sctoken);
	}
}


function getState()
{
	var o = {
		sctoken : localStorage.getItem("sctoken"),
		guid : localStorage.getItem("guid"),
		code : localStorage.getItem("code")
	};
	
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
	d += "\ne.oldValue: " + e.oldValue;
	d += "\ne.newValue: " + e.newValue;
	d += "\ne.url: " + e.url;
	d += "\ne.source: " + e.source;
	
	console.log("storageHandler: " + d);
	
	if(e.key == "sctoken" && e.oldValue == null && e.newValue!= null)
	{
		console.log("sctoken changed.");
		window.setTimeout(window.initSoundCloud, 100);
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

	$('#scconnectlabel').html('');
	$('#scconnect').hide();
	$('#logout').hide();

	// http://stackoverflow.com/questions/11116532/how-to-have-users-reconnect-with-soundcloud-on-each-page-reload
	if(getState().sctoken)
	{
		SC.storage().setItem('SC.accessToken', getState().sctoken);
		getSCUserName();
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


	$('#sccode').css({'height': '9em', 'font-size':'12px', 'width':'100%'});
	$('#sccode').on("change", function(event, ui) {
		setCode($('#sccode').val());
	});
	
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

    	var $this = $(this);

	    $.post($this.attr('action'), $this.serialize(), function (responseData) {
						
			running = false;
			
			$('#log').val( responseData.log + "\n\nRecorded audio duration: " + $('#duration').val() + " second(s).\n\n" );
			refreshLogView();
			
			var guid = "";
			
			if(responseData.guid) {
				guid = responseData.guid;
			} else {
				guid = "";
			}
			
			setGuid(guid);			
			
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
			client_id: '8298c1d316d40cd38954c7f44375c675',
			redirect_uri: 'http://dev.dysf.co:8080/sc',
			display: 'popup'
		});
		
		SC.connect(function() {
			scconnected = true;	    
			console.log("Connected to SoundCloud");
			//alert("Connected to SoundCloud");
			
			getSCUserName();
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
	initState();


});


