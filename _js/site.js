$(document).ready(function() {
	$("#resizable").resizable();
	$(".draggable").draggable();
	$(".cell").droppable({
			over: function(event, ui) {
				$(this).css("background-color", "#FDD471")
					.css("box-shadow", "inset 0 0 5px 2px #5488EB");
			}
	});
	$(".cell").droppable({
			out: function(event, ui) {
				$(this).css("background-color",  "rgb(250,235,199)")
					.css("box-shadow", "none");
				$(ui.draggable).resizable( "destroy" );
			}
	});
	
	$(".cell").droppable({
			drop: function(event, ui) {
				$(ui.draggable).resizable();
			}
	});
	
	$(".cell").droppable({	
			activate: function(event, ui) {
				//nothing wet
			}
	});
	
	$(".cell").droppable({	
			deactivate: function(event, ui) {
				//nothing yet
			}
	});
	
	//currently there is a bug with draggable and :active pseudo-class in firefox
	//so I need to use mousedown, mouseup events, instead.
	$("#add_event_btn").click(function() {
			$("<div class=\"draggable\">Event 1</div>")
			//.resizable({ disabled: true })
			.draggable() //{snap: ".cell"})
			.bind('mousedown', function() {
      	$(this).css('box-shadow', 'none');
  		})
  		.bind('mouseup', function() {
      	$(this).css('box-shadow', '0px 0px 5px 2px rgba(101,101,101,.7)');
  		})
			.appendTo("#draggable_container");
	});
	
	
}); // end ready
