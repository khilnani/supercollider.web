var guid = null;
var running = false;

$(document).bind('pageinit', function () {
	$('#sccode').css('height', '10em').css('font-size','10px').css('width','100%');
    $('#log').css('height', '10em').css('font-size','10px').css('width','100%');
    $('#scroller').css({'overflow' : 'auto', '-webkit-overflow-scrolling' : 'touch'});

	$('#scForm').on('submit', function (e) {
	
	    e.preventDefault();
	
		if(running == true) {
			var c = confirm("Execution in process. Override?");
			if( c == false ) {
				return;
			}
		}
		
		running = true;
	
		$('#log').val( "Loading ..." );
		guid = "";


    	var $this = $(this);

	    $.post($this.attr('action'), $this.serialize(), function (responseData) {
						
			running = false;
			
			$('#log').val( responseData.log );
			
			if(responseData.guid) {
				guid = responseData.guid;
			} else {
				guid = "";
			}
			
			guid = responseData.guid;
			
			$("#sctrackname").val(guid);
			
			
		});
	});
	
	$('#listen').on('click', function() {
		if(guid && guid != "")
			window.location.href = "/render?guid=" + guid;
		else
			alert('Please execute code before attempting to listen.');
	});


});




