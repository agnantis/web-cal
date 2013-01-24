$(document).ready(function() {
	
	$("#resizable").resizable();
	$(".draggable").draggable();
	$(".cell").data("_children", []);
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
				addChild($(this), $(ui.draggable));
				alert("Post: " + $(this).data("_children").length);
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
			//request the name of the event
			var userInput = prompt("Event Name", "");
			$("<div class=\"draggable\">" + userInput + "</div>")
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

function addChild(cell, event) {
	alert("Start: " + cell.data("_children").length);
	var ch = cell.data("_children");
	//alert($.inArray(event, ch));
	if ($.inArray(event, ch) > -1)	 {
		alert("Exists!");
		return;
	}
	
	ch.push(event);
	
	var ch_no = ch.length;
	var offset = cell.offset();
	var max_width = cell.width() - 4;
	var child_width = (max_width/ch_no - (ch_no-1));
	var ind = 0;
	for (var i = 0; i < ch_no; i++) {
		//alert(ch[i]);
		ch[i].offset({ top: offset.top+2, left: ((offset.left+2) + i*child_width)})
		ch[i].css("width", child_width + "px");		
	}
	
	cell.data("_children", ch);
	alert("End: " + cell.data("_children").length);
}

function testArray() {
	var arr = [];
	arr.push($("#add_event_btn")[0]);
	arr.push("44");
	alert("44 not exists: " + $.inArray("44", arr));
	alert("btn exists: " + $.inArray($("#add_event_btn1")[0], arr));
}
	
