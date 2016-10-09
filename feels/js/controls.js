var selectBox = $('#feel-color-selector');
var reasonBox = $('#reason-input');
var addButton = $('.circle-plus');
var reasonText = $('#reason-text');
var homeButton = $('#home');
var selectBoxOpen = false;

var current_color = 0;
var count = $(".color-circle").length;
var padding_basis = 120;
var PADDING_HEIGHT = padding_basis + (count - 1) * (.85 * 120);
var currently_feeling = true;

openSelectBox = function() {
	if (selectBox.css('opacity') == 0)
		return;

	selectBox.stop();

	var targetPadding = PADDING_HEIGHT + "%";
	selectBox.focus();
	$('.color-circle').show();

	selectBox.animate({'padding-bottom' : targetPadding}, 300, 'easeOutQuart');
	selectBox.off('click');
}

clickColor = function() {
	if (selectBox.css('opacity') == 0)
		return;
	
	selectBox.stop();

	var targetPadding = padding_basis + "%";
	reasonBox.focus();
	$('.color-circle').hide();

	selectBox.animate(
		{'padding-bottom' : targetPadding}, 300, 'easeOutQuart',
		function() {
			selectBox.click(openSelectBox);
		}
	);
	current_color = parseInt($(this).data('value'));
	MY_PARTICLE.setColor(current_color);
}

expandReasonBox = function() {
	reasonBox.animate(
		{'height' : '50%'},
		300,
		'easeOutQuart'
		);
}

function submit() {
	if (reasonBox.val() == "") {
		reasonBox.focus();
		return;
	}

	$('.section.feel').animate(
		{'opacity': 0},
		500,
		'easeOutCubic',
		function() {
			$('.section.feel').hide();
			reasonBox.val('');
		}
	)

	hideReasonText();
	enableNavigation();
	sendFeel();
	changeReasonText(reasonBox.val());
	submitMyParticle(reasonBox.val());
	currently_feeling = false;
}

function startFeeling() {
	hideReasonText();
	addMyParticle();
	disableNavigation();
	$('.section.feel').show();
	$('.section.feel').animate( {'opacity': 1}, 1000, 'easeOutCubic', function() {
		placeMyParticle();
		scaleMyParticle();
	});

	myCamera.zoomOriginal();
	currently_feeling = true;
}

function feelAgain() {
	if (!currently_feeling) {
		startFeeling();
	}
	else {

	}
}

//--------------SELECT BOX PARTICLE FUNCTIONS ---------------------//
function getSelectBoxCenter() {
	var x = (1 + selectBox.offset().left + selectBox.width() / 2 ) / $(window).width();
	var y = (-1 + selectBox.offset().top + selectBox.width() / 2) / $(window).height();
	return { 'x': x, 'y': y}
}

function getSelectBoxTopLeft() {
	var x = (1 + selectBox.offset().left  ) / $(window).width();
	var y = (-1 + selectBox.offset().top  ) / $(window).height();
	return { 'x': x, 'y': y}
}

function placeMyParticle() {
	var center = getSelectBoxCenter();
	var center_point = get3DPoint(center.x, center.y);
	var topleft = getSelectBoxTopLeft();
	var topleft_point = get3DPoint(topleft.x, topleft.y);

	MY_PARTICLE.setPosition(center_point.x, center_point.y, 0);
}

function scaleMyParticle() {
	var r1 = 800 / window.innerHeight;
	MY_PARTICLE.setScale(r1 * 15);
}

// ------------------ REASON TEXT FUNCTIONS ---------------------//

function centerReasonText() {
	var top = window.innerHeight / 2 - (reasonText.height() / 2);
	reasonText.css('top', top + "px");
}

function changeReasonText(text) {
	reasonText.text(text);
}

function showReasonText() {
	reasonText.animate(
		{'opacity': 1},
		200,
		'easeOutQuart');
}

function hideReasonText(callback) {
	reasonText.animate(
		{'opacity': 0},
		200,
		'easeOutQuart',
		callback);
}

centerReasonText();

//------------------ INITIALIZE ----------------------//
selectBox.click(openSelectBox);
reasonBox.click(expandReasonBox);
addButton.click(submit);
homeButton.click(feelAgain)

$('.color-circle').click(clickColor);

function mouseDownProxy(e) {
	if (e.srcElement.id != "home") {
		visMouseDown(e);	
	}
}

function enableNavigation() {
	document.addEventListener( 'mousedown', mouseDownProxy, false );
	$('body').bind('mousewheel', function(e){
  		var delta = e.originalEvent.wheelDelta;
  		myCamera.scroll(delta);
  		hideReasonText();
	});
}

function disableNavigation() {
	document.removeEventListener( 'mousedown', mouseDownProxy, false );
	$('body').unbind('mousewheel');
}