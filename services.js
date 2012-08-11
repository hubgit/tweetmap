var map;

var Twitter = {
	timeline: function(earliest_id) {
		var screen_name = window.location.hash.replace(/^#/, "");
		if (!screen_name) return;

		if (typeof earliest_id === "object") {
			earliest_id = null;
		}

		return $.ajax({
			url: "//api.twitter.com/1/statuses/user_timeline.json",
			data: {
				screen_name: screen_name,
				count: 200,
				trim_user: true,
				include_rts: false,
				include_entities: false,
				max_id: earliest_id
			},
			dataType: "jsonp",
			success: Google.addMarkers
		});
	}
};

var Google = {
	loadMapsAPI: function() {
		var node = $("link[rel='service.google-maps']");

		$.ajax({
			url: "//maps.googleapis.com/maps/api/js",
			data: {
				key: "AIzaSyB9YJ7Mpo6QHAKvID1Tv5QVx4JyLpTW0IQ",
				sensor: false,
			},
			dataType: "jsonp",
			jsonpCallback: "Google.createMap"
			//success: Google.createMap, // multiple script loads mean the random function name is gone
		});
	},

	createMap: function() {
		var container = $("<div/>").css({ height: "100%" }).appendTo("body");

		var options = {
			zoom: 8,
			center: new google.maps.LatLng(29.95599, -90.07051),
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    };

		map = new google.maps.Map(container.get(0), options);

		Twitter.timeline();
	},

	addMarkers: function(data) {
		if(!data.length) return;

		var coords, marker, earliest_id;

		var bounds = new google.maps.LatLngBounds;

		data.forEach(function(tweet) {
			earliest_id = tweet.id_str;

			if (!tweet.geo || !tweet.geo.coordinates) return;

			var point = new google.maps.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]);

			marker = new google.maps.Marker({
		    	map: map,
		    	position: point,
		    	title: tweet.title,
		  		animation: google.maps.Animation.DROP
		    });

		    bounds.extend(point);
		});

		map.fitBounds(bounds);

		//Twitter.timeline(earliest_id);
		console.log(earliest_id);
	}
};
