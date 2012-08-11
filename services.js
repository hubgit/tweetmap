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
			success: Map.addMarkers
		});
	}
};

var Map = {
	createMap: function() {
		var container = $("<div/>", { id: "map" }).css({ height: "100%" }).appendTo("body");

		map = L.map("map").setView([51.505, -0.09], 13);

		var layer = L.tileLayer("http://{s}.tile.cloudmade.com/38a09cfa58ff476fb3a902cbb760720c/997/256/{z}/{x}/{y}.png", {
		    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
		    maxZoom: 18
		});

		layer.addTo(map);

		Twitter.timeline();
	},

	addMarkers: function(data) {
		if(!data.length) return;

		var coords, marker, earliest_id;

		var bounds = new L.LatLngBounds;

		data.forEach(function(tweet) {
		    earliest_id = tweet.id_str;

		    if (!tweet.geo || !tweet.geo.coordinates) return;

		    var marker = L.marker(tweet.geo.coordinates).addTo(map);
		    marker.bindPopup(tweet.title);

		    bounds.extend(tweet.geo.coordinates);
		});

		map.fitBounds(bounds);

		//Twitter.timeline(earliest_id);
		console.log(earliest_id);
	}
};
