$(document).ready(function() {
	var count = 0;
	
	$("#resizable").resizable();
	//$(".draggable").draggable();
	//{
	//	drag: function(event, ui) {
	//		}
	//});
	$(".cell").data("_children", []);
	$(".cell").droppable({
			_over: function(event, ui) {
				//$(this).css("background-color", "#FDD471");
				alert("test");
				$(ui.draggable).css("background-color", "#3a1232");
			}
	});
	$(".cell").droppable({
			_out: function(event, ui) {
				$(this).css("background-color",  "rgb(250,235,199)");
					//.css("box-shadow", "none");
				$(ui.draggable).resizable("destroy");
			}
	});
	
	$(".cell").droppable({
			_drop: function(event, ui) {
				$(ui.draggable).resizable();
				addChild($(this), $(ui.draggable));
			}
	});
	
	$(".cell").droppable({	
			_activate: function(event, ui) {
				//nothing wet
			}
	});
	
	$(".cell").droppable({	
			_deactivate: function(event, ui) {
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
	
	$(".halfCell").click(function() {
		var cellHeight = $(this).outerHeight();
		var cellWidth = $(this).outerWidth();
		
		var userInput = "Event " + (++count);
		var eventElem = $("<div class='event'><span class='text'>" + userInput + "</span></div>")
		.resizable({
			grid: cellHeight,
			maxWidth: cellWidth-6,
			minWidth: cellWidth-6,
			minHeight: cellHeight-8,
			resize: function(event, ui) {
				setEventTimeLabel($(ui.element), true);
			}
		})
		.draggable({snap: ".halfCell"})
		.appendTo($(this))
		.width(cellWidth-6)
		.height(cellHeight*2-8)
		.draggable({containment: "#calendarGrid", grid: [cellWidth-2, cellHeight-2] });	
		setEventTimeLabel(eventElem, false);
	});	
	
	dynamicCss();

	drawCurrentDay();
	window.setInterval(drawCurrentDay, 5*60*1000); //every 5 minutes
	
	
}); // end ready

/* eventElement: the new event div
 * updateHeight: if true update element height
 * it computes the starting and ending time of the event
 * and depicts it on the eventElement
 */
function setEventTimeLabel(eventElement, updateHeight) {
	var xpos = eventElement.position().left + eventElement.width()/2;
	var ypos = eventElement.position().top + eventElement.height();
	var theCell = $.nearest({x: xpos, y: ypos}, '.halfCell');
	var newYpos = theCell.position().top + theCell.height() - 8;		
	if (updateHeight) {
		eventElement.height(newYpos - eventElement.position().top);
	}
	
	updateEventTimeLabel(eventElement, theCell);
}

/* eventElement: the new event div
 * destParent: the element that is under the eventElement end
 * it computes the starting and ending time of the event
 * and prints it
 */
function updateEventTimeLabel(eventElement, destParent) {
	var startTime = parseInt(eventElement.parent().parent().siblings(':first').children('.hour').text());
	var endTime = parseInt(destParent.parent().siblings(':first').children('.hour').text());
	if (eventElement.parent().hasClass('up')) {
		startTime += ":00";
	} else {
		startTime += ":30";
	}

	if (destParent.hasClass('up')) { 
		endTime += ":30";
	} else {
		//plus an hour
		endTime += 1;
		endTime += ":00";
	}
	//set time h:mm - h:mm
	eventElement.children(".text").html(startTime + " - " + endTime);
}

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
	
	//scroll to current hour
	var container = $('#calendarGrid'), scrollTo = $('.currentHour');
	var moveTo = scrollTo.offset().top - container.offset().top + container.scrollTop() - ((container.height()-scrollTo.height())/2);
	container.scrollTop(moveTo);	
}

function drawCurrentDay() {
	var date = new Date();
	//day
	var day = date.getDay();
	$('#theCalendar .currentDay').removeClass('currentDay');
	$('.headerRow').children('.headerCell').eq(day+1).addClass('currentDay');
	$('#calendarGrid .row').each(function() {
		$(this).children('.cell').eq(day+1).addClass('currentDay');
	});

	//hour
	var hour = date.getHours();
	$('#calendarGrid .currentHour').removeClass('currentHour');
	$('#calendarGrid').children('.row').eq(hour).addClass('currentHour');

	//min
	var mins = 100*(date.getMinutes()/60);
	var current = $('.currentHour .currentDay')
	current.css('background-position', 'left  '+ mins + "%");
	
	//TODO: percentage is not so accurate. 
	//especially for extreme values (0-10, 80-100)
	var curRow = $('.currentHour .firstCell');
	curRow.css('background-position', 'left  '+ mins + "%");
	
	
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
	
