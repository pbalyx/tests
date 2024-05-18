

var OTMLayer = L.tileLayer('https://a.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy  <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> | <a href="https://www.opentopomap.org/ target="_blank"">OpenTopoMap</a> | <a href="https://www.openstreetmap.org/user/pb07/diary" target="_blank">pb07</a>'
}); 

var map = L.map('map', {
	center: [44.50, 4.48], //4.48010, 44.49742
	zoom: 15,
	layers: [OTMLayer ]
});

var OSM_routesStyle = {
	"color": "red",
	"weight": 2,
	"opacity": 1
};
var OSM_routesLayer;


var status_span = document.getElementById('status_span');
var query = document.getElementById('query');
var base_url = 'https://overpass-api.de/api/interpreter?data= ';

b_query.onclick = callOverpass;

function callOverpass() {
//	query_url += "[out:json][timeout:15]; (nwr(id:9517109214);); out meta;";
//	query_url += "[out:json][timeout:15]; (way(id:456273703);); out meta;";
	var query_url = base_url +  query.value;
	status_span.innerHTML = "";
   fetch(query_url)
	.then(
		function(response) {
			if (response.status !== 200) {
				var status_text = 'There was a problem. Status Code: ' + response.status;
				console.log(status_text);
				status_span.innerHTML = status_text;
			} else {
			response.json().then(function(data) {
				status_span.innerHTML = "ok";
				display_result(data);
			
		   });
		   }
		}
	)
	.catch(function(err) {
		console.log(err);
	 });
}

var geojsonObj = {};

function display_result(osm_data) {
	console.log(osm_data);
	geojsonObj = osmtogeojson(osm_data, {flatProperties:true});
//	geojsonObj = osmtogeojson(osm_data, {flatProperties:false});
	OSM_routesLayer = L.geoJSON(geojsonObj, {style: OSM_routesStyle, onEachFeature: onEachFeatureDo });
	OSM_routesLayer.addTo(map);
}

function onEachFeatureDo(feature, layer) {
	var popupStr = '';
	if (feature.properties) { 
//		console.dir(feature);
		if (feature.properties.name) {
			popupStr += feature.properties.name;
		} else if (feature.id) {
			popupStr += 'id: ' + feature.id;			
		}
		if (feature.properties.distance) {
			popupStr += "<br> Longueur " + feature.properties.distance + " km";
		
		}

	}
	layer.bindPopup(popupStr);
}

