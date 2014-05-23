$(document).ready(function(){
	// get the geolocation
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			// get weather info
			var forcastUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?apppid=8d2a2e4ff198866fd54aa337ba073e99&units=imperial&cnt=5&mode=json&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
			var url = "http://api.openweathermap.org/data/2.5/weather?apppid=8d2a2e4ff198866fd54aa337ba073e99&units=imperial&mode=json&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
			var dayString = ['Sun', 'Mon', 'Tues' ,'Weds' ,'Thurs' ,'Fri', 'Sat'];
			$.getJSON(forcastUrl, function(data){
				console.log(data);
				// skip the first one
				for(var i = 1; i < data.list.length; i++){
					$li = $('<li>');
					$('<div class="weatherLogo">' + getWeatherIcon(data.list[i].weather[0].id) + '</div>').appendTo($li);
					$tempDetails = $('<div class="tempDetails">');
					$('<p class="weatherDate">' + dayString[(new Date(data.list[i].dt*1000)).getDay()] + '</p>').appendTo($tempDetails);
					$('<h2>' + Math.floor(data.list[i].temp.day) + '&#8457</h2>').appendTo($tempDetails);
					$('<p><i class="wi-up"></i>&nbsp;' + Math.floor(data.list[i].temp.max) + '&#8457&nbsp;&nbsp;<i class="wi-down"></i>&nbsp;' + Math.floor(data.list[i].temp.min) + '&#8457</p>').appendTo($tempDetails);
					$tempDetails.appendTo($li);
					$weatherDetails = $('<div class="weatherDetails">');
					$('<p><i class="wi-sprinkles"></i>' + data.list[i].humidity + '%&nbsp;&nbsp;&nbsp;<i class="wi-strong-wind"></i>' + data.list[i].speed + 'mph</p>').appendTo($weatherDetails);
					$weatherDetails.appendTo($li);
					$li.appendTo('ul#broadcastList');
				}
				// get realtime data
				$.getJSON(url, function(data){
					console.log(data);
					$("a#weather").html(getWeatherIcon(data.weather[0].id) + '&nbsp;&nbsp;' + Math.floor(data.main.temp) + "&#x2109");
					$li = $('<li>');
					$('<div class="weatherLogo">' + getWeatherIcon(data.weather[0].id) + '</div>').appendTo($li);
					$tempDetails = $('<div class="tempDetails">');
					$('<p class="weatherDate">Today</p>').appendTo($tempDetails);
					$('<h2>' + Math.floor(data.main.temp) + '&#8457</h2>').appendTo($tempDetails);
					$tempDetails.appendTo($li);
					$weatherDetails = $('<div class="weatherDetails">');
					$('<p><i class="wi-sprinkles"></i>' + data.main.humidity + '%&nbsp;&nbsp;&nbsp;<i class="wi-strong-wind"></i>' + data.wind.speed + 'mph</p>').appendTo($weatherDetails);
					$weatherDetails.appendTo($li);
					$li.prependTo('ul#broadcastList');
				
				});
				//beautify weatherInfoWrapper scroll bar 
				$('div#weatherInfoWrapper').mCustomScrollbar({
					axis:"x",
					autoHideScrollbar: true
				});
			});
		}, function(){
			console.log('Unable to get your location info');
		});
	}else{
		console.log("Your browser doesn't geolocation");
	}
	
	function getWeatherIcon(code){
		var firstBit = (code + ' ').charAt(0);
		switch(firstBit){
			case '2': 
				return '<i class="wi-thunderstorm"></i>';
			case '3': 
				return '<i class="wi-showers"></i>';
			case '5': 
				return '<i class="wi-rain"></i>';
			case '6': 
				return '<i class="wi-snow"></i>';
			case '7': 
				return '<i class="wi-fog"></i>';
			case '8': 
				if(code === 800)
					return '<i class="wi-day-sunny"></i>';
				else if(code === 801)
						return '<i class="wi-day-cloudy"></i>';
					 else
						return '<i class="wi-cloudy"></i>';
		}
	}
	
	
	
	//show and hide weatherInfoWrapper
	$weatherInfo = $("div#weatherInfoWrapper");
	$weatherButton = $('a#weather');
	
	function weatherInfoHandler(){
		if($(this).hasClass('opened')){
			// hide
			$weatherInfo.animate({
				'top': '-200px',
				'opacity': '0'
			}, 500, function(){
			});
			$(this).removeClass('opened');
			
		}else{
			// show
			$('div#mCSB_1_container').css('left', '0px');
			$('div#mCSB_1_dragger_horizontal').css('left', '0px')
			$weatherInfo.animate({
				'top': '50px',
				'opacity': '0.9'
			}, 500 , function(){
				
			});
			$(this).addClass('opened');
		}
	}

	//$weatherButton.bind("touchstart", weatherClickHandler);
	$weatherButton.on("click", weatherInfoHandler);
	
	//show and hide sideMenu
	var $button = $('button#menuButton');
	var $sideMenu = $('div#sideMenu');
	
	$button.click(menuButtonHandler);
	
	function menuButtonHandler(){
		console.log($(this).data('open'));
		if($(this).data('open') === 'undefined'){
			$sideMenu.css('right', -$sideMenu.width() - 30 + 'px');
			$(this).data('open', 'closed');
		}
		if($(this).data('open') === 'opened'){
			$sideMenu.animate({
				right: -$sideMenu.width() - 30 + 'px'
			}, 400, function(){
				$button.data('open', 'closed');
			});
		}else{
			$sideMenu.animate({
				right: '0px'
			}, 400, function(){
				$button.data('open', 'opened');
			});	
		}
	}
	
	//
	$(window).resize(function(){
		var width = $(this).width();
		if(width > 768){
			$sideMenu.css('right', '0px');
		}else{
			$sideMenu.css('right', '-500px');
		}
	});
	
	// beautify switch buttons
	var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
	elems.forEach(function(html) {
	  var switchery = new Switchery(html);
	});
});

