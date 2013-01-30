$(document).ready(function() {
	var count = 0;
	
	$("#resizable").resizable();
	$(".draggable").draggable();
	$(".cell").data("_children", []);
	$(".cell").droppable({
			over: function(event, ui) {
				$(this).css("background-color", "#FDD471");
					//.css("box-shadow", "inset 0 0 5px 2px #5488EB");
			}
	});
	$(".cell").droppable({
			out: function(event, ui) {
				$(this).css("background-color",  "rgb(250,235,199)");
					//.css("box-shadow", "none");
				$(ui.draggable).resizable("destroy");
			}
	});
	
	$(".cell").droppable({
			drop: function(event, ui) {
				$(ui.draggable).resizable();
				addChild($(this), $(ui.draggable));
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
			//var userInput = prompt("Event Name", "");
			var userInput = "Event " + (++count);
			$("<div class=\"draggable\">" + userInput + "</div>")
			//.resizable({ disabled: true })
			.draggable({snap: ".cell"})
			/*.bind('mousedown', function() {
      	$(this).css('box-shadow', 'none');
  		})
  		.bind('mouseup', function() {
      	$(this).css('box-shadow', '0px 0px 5px 2px rgba(101,101,101,.7)');
  		})*/
			.appendTo("#draggable_container").css("width", $(".cell").css('width'));
			
	});
	
	$("#any_event_btn").click(function() {
		//testing purposes
	});
	
	$(".cell__").click(function() {
			var userInput = "Event " + (++count);
			$("<div class=\"draggable\">" + userInput + "</div>")
			.resizable()
			.draggable({snap: ".cell"})
			.appendTo($(this)).css("width", $(".cell").css('width'));
			alert($(this).uniqueId());
	});	
	
	drawCurrentHour();
	window.setInterval(drawCurrentHour, 5*60*1000); //every 5 minutes
	
	dynamicCss();
	
}); // end ready

function dynamicCss() {
	//align vertical the days of the calendar, based on cell height
	var item = $('.headerHalfCell1');
	item.css('line-height', item.css('height'));
	
	//set width of headers based on the main calendar grid
	//each browser has different scroller size: we need to compute the width dynamically
	item = $('#calendarGrid');
	var realWidth = item[0].scrollWidth;
	var totalWidth = item.width();
	var padding = (totalWidth-realWidth) + 'px';
	$('.headerRow').css('padding-right', padding);
	//$('.headerRow').css('width', $('#calendarGrid')[0].scrollWidth + 'px');
	
	//scroll to current hour
	var container = $('#calendarGrid'), scrollTo = $('.currentHour');
	var moveTo = scrollTo.offset().top - container.offset().top + container.scrollTop() - ((container.height()-scrollTo.height())/2);
	container.scrollTop(moveTo);
	
}

function drawCurrentHour() {
	var hour = new Date();
	var min = 100*(new Date().getMinutes()/60);
	var current = $('.currentHour .currentDay')
	current.css('background-position', 'left  '+ min + "%");
	
	//TODO: percentage is not so acurate. 
	//especially for extreme values (0-10, 80-100)
	var curRow = $('.currentHour .firstCell');
	curRow.css('background-position', 'left  '+ min + "%");
}

function addChild(cell, event) {
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
}

function testArray() {
	var arr = [];
	arr.push($("#add_event_btn")[0]);
	arr.push("44");
	alert("44 not exists: " + $.inArray("44", arr));
	alert("btn exists: " + $.inArray($("#add_event_btn1")[0], arr));
}
	
