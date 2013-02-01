var count = 0;

var startDragX = 0;
var startDragY = 0;

var cellWidth = $('.halfCell').outerWidth();
var cellHeight = $('.halfCell').outerHeight();

var toleranceX = cellWidth - 5;
var toleranceY = cellHeight - 10;

var eventDiv = 
		"<div class='event'>\
			<div class='hourInfo'>\
				<span id='shour'></span>:<span id='smin'></span> - \
				<span id='ehour'></span>:<span id='emin'></span>\
			</div>\
			<div class='eventInfo'>Really long Event Name with other info\
			</div>\
			<div class='handle'>=</div>\
		</div>"


$(document).ready(function() {
	
	$(".cell").data("_children", []);
	
	$(".halfCell").droppable({
			_drop: function(event, ui) {
				$(ui.draggable).resizable();
				addChild($(this), $(ui.draggable));
			},
			drop: function(ev, ui) {
				var xpos = $(ui.draggable).position().left+10;
				var ypos = $(ui.draggable).position().top+10;
				var theCell = $.nearest({x: xpos, y: ypos}, '.halfCell');
				//theCell.css('background-color', "#123");
        var dropped = ui.draggable;
        //var droppedOn = $(this);
        $(dropped).detach().appendTo(theCell).css({"top": 0, "left":0, "position": "relative"});
        setEventTimeLabel($(dropped), false);
      }
	});
	
	
	$("#add_event_btn").click(function() {
		//testing purposes			
	});
	
	$("#any_event_btn").click(function() {
		//testing purposes
	});
	
	$(".halfCell").click(function() {
		//hide any event details popup
		$('#eventDescriptor').hide();
		var cellHeight = $(this).outerHeight();
		var cellWidth = $(this).outerWidth();
		
		var userInput = "event_" + (++count);
		//var eventElem = $("<div class='event'><div class='text'>" + userInput + "</div><div class='handle'>=</div></div>")
		var eventElem = $(eventDiv)
		.attr('id', userInput)
		.resizable({
			handles: "s",
			grid: cellHeight,
			maxWidth: cellWidth-6,
			minWidth: cellWidth-6,
			minHeight: cellHeight-8,
			resize: function(event, ui) {
				setEventTimeLabel($(ui.element), true);
			}
		})
		//.draggable({snap: ".halfCell"})
		.appendTo($(this))
		.width(cellWidth-6)
		.height(cellHeight*2-8)
		.draggable({
			scroll: true,
			refreshPositions: false,
			snap: ".halfCell",
			containment: "#calendarGrid", 
			grid: [cellWidth-1, cellHeight-1],
			_drag: function(event, ui) {
				var xpos = $(ui.helper).position().left+10;
				var ypos = $(ui.helper).position().top+10;
				var theCell = $.nearest({x: xpos, y: ypos}, '.halfCell');
        $(ui.helper).detach().appendTo(theCell);
				setEventTimeLabel($(ui.helper), false);
			},
			start: function(event, ui) {
				startDragX = $(this).position().left;
				startDragY = $(this).position().top;
				//console.log("X start: " + startDragX);
				//console.log("Y start: " + startDragY);
			},
			drag: function(event, ui) {
				var currentX = $(this).position().left;
				var currentY = $(this).position().top;
				
				//no need to watch the day changes while dragging an event
				//if (Math.abs(currentX - startDragX) > toleranceX) {
				//	var xMove = Math.round((currentX - startDragX) / cellWidth);
				//	if (xMove != 0) {
				//		console.log("X movement: " + xMove);
				//		startDragX = currentX;
				//		shiftEventTimeLabel($(this), xMove);
				//	}
					//console.log("cell movement: "  + $('.halfCell').width());
					//changeTime
					//$(this).
				//}
				
				
				if (Math.abs(currentY - startDragY) > toleranceY) {
					var yMove = Math.round((currentY - startDragY) / cellHeight);
					if (yMove != 0) {
						//console.log("Y movement: " + yMove);
						startDragY = currentY;
						shiftEventTimeLabel($(this), yMove);
					}
				}
			},
			stop: function(event, ui) {
				var ev = $(ui.helper);
				ev.css("top", ev.parent().css("top"));
				ev.css("left", ev.parent().css("left"));
			},
		})
		.click(function(event) {
			event.stopPropagation();
			var el = $('#eventDescriptor');
			var left = event.pageX - el.outerWidth()/2;
			var top = event.pageY - el.outerHeight() - 20;
			el.css({
				"display": "block",
				"top": top + "px",
				"left": left + "px"
			});
			var arr = $('#eventDescriptor .eArrow');
			arr.css("left", (el.width())/2 + (arr.width()+2) + "px");
			arr.css("bottom", (-(arr.width())/2-1) + "px");
			//populate it
			el.children('#eventIDHolder').attr('eventID', $(this).attr('id'));
			console.log("test: " + el.children('#eventIDHolder').attr('eventID'));
		});	
		
		$('#eventDescriptor .ecloseBtn').click(function() {
			$('#eventDescriptor').css("display", "none"); 
		});
		
		$('#eventDescriptor .deleteEvent').click(function() {
			var eventId = $(this).parents('#eventDescriptor').children('#eventIDHolder').attr('eventID');
			console.log("Delete event: " + eventId);
			$("#" + eventId).remove();
			$('#eventDescriptor').hide();
			
		});
		
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
	var startHour = parseInt(eventElement.parent().parent().siblings(':first').children('.hour').text());
	var endHour = parseInt(destParent.parent().siblings(':first').children('.hour').text());
	
	var startMin = "00";
	if (eventElement.parent().hasClass('down')) {
		startMin = "30";
	}
	eventElement.find(".hourInfo #shour").html(startHour);
	eventElement.find(".hourInfo #smin").html(startMin);

	var endMin = "30";
	if (destParent.hasClass('down')) { 
		//plus an hour
		endHour += 1;
		endMin = "00";
	}
	eventElement.find(".hourInfo #ehour").html(endHour);
	eventElement.find(".hourInfo #emin").html(endMin);
	console.log("End: " + endHour + ":" + endMin);
}

function shiftEventTimeLabel(eventElement, noOfHalfHours){
	var sH = eventElement.find(".hourInfo #shour");
	var sM = eventElement.find(".hourInfo #smin");
	var eH = eventElement.find(".hourInfo #ehour");
	var eM = eventElement.find(".hourInfo #emin");
	
	var sRem = 0;
	var eRem = 0;
	
	if ((noOfHalfHours % 2) != 0) {
		//change minutes
		if (sM.html() == "30") {
			sM.html("00");
			if (noOfHalfHours>0) { sRem = 1 }
		} else {
			sM.html("30");
			if (noOfHalfHours<0) { sRem = -1 }
		}
		if (eM.html() == "30") {
			eM.html("00");
			if (noOfHalfHours>0) { eRem = 1 }
		} else {
			eM.html("30");
			if (noOfHalfHours<0) { eRem = -1 }
		}
	} 
	
	var sHour = parseInt(sH.html());
	var eHour = parseInt(eH.html());
	
	var shiftHours = (noOfHalfHours > 0) ? Math.floor(noOfHalfHours/2) : Math.ceil(noOfHalfHours/2)
	
	var newSHour = Math.abs(sRem+sHour+shiftHours) % 12;
	if (newSHour == 0) { newSHour = 12; }
	var newEHour = Math.abs(eRem+eHour+shiftHours) % 12;
	if (newEHour == 0) { newEHour = 12; }
	sH.html(newSHour);
	eH.html(newEHour);
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
	
