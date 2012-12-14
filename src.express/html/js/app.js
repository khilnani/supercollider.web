var guid = null;

$(document).bind('pageinit', function () {
	$('#sccode').css('height', '7em').css('font-size','10px');
    $('#log').css('height', '7em').css('font-size','10px');  

	$('#scForm').on('submit', function (e) {

    	var $this = $(this);

    	e.preventDefault();

	    $.post($this.attr('action'), $this.serialize(), function (responseData) {
			
			guid = responseData.guid;
			
			$('#log').val( responseData.log );
			
			$("#sctrackname").val(guid);
			
			window.location.href = "/render?guid=" + guid;
		});
	});


});




