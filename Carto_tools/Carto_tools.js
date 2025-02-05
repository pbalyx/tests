///
const version ="0.2.0";
const subV = "_a";
// 0.1.1 : lecture gpx ou json

window.onload = (event) => {
	b_version.innerHTML = 'V: ' + version + subV; 
	document.title = 'Carto_tools  V_' + version + subV;
	console.log("version : ", version);
	init_map();
};

function init_map() {


}

// region Map Tiles

//region OTM
	var OTMLayer = L.tileLayer('https://a.tile.opentopomap.org/{z}/{x}/{y}.png', {
		maxZoom: 17,
		attribution: '&copy  <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> | <a href="https://www.opentopomap.org/ target="_blank"">OpenTopoMap</a>'
	}); 

//region OSM/ 	
var OSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
	});	

// region PlanIGN
	var PlanIGNLayer = L.tileLayer('https://data.geopf.fr/wmts/?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng', {
		maxZoom: 19,
		attribution: ' Carte: <a href="https://geoservices.ign.fr/planign" target="_blank">Plan IGN</a> | Tracés: <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a>'
	});

// region IGNPhoto
	var IGNPhotoLayer = L.tileLayer('https://data.geopf.fr/wmts/?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg', {
		maxZoom: 19,
		attribution: '<a href="https://geoservices.ign.fr/" target="_blank">IGN Image aérienne</a> | Tracés: <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a>'
	});
	
// region RGE alti
	var RGEaltiLayer = L.tileLayer('https://data.geopf.fr/wmts?service=WMTS&format=image/png&version=1.0.0&request=GetTile&style=normal&tilematrixset=PM&tilematrix={z}&tilerow={y}&tilecol={x}&layer=IGNF_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW', {
		maxNativeZoom:17,
 		maxZoom: 19,
		attribution: '<a href="https://geoservices.ign.fr/" target="_blank">IGN RGE alti</a>'
	});

// region Stava

var url_strava1 = 'https://proxy.nakarte.me/https/heatmap-external-b.strava.com/tiles-auth/run/purple/{z}/{x}/{y}.png';

var url_strava2 = 'https://strava-heatmap.tiles.freemap.sk/run/purple/{z}/{x}/{y}.png';

var url_strava3 = 'https://heatmap-external-a.strava.com/tiles-auth/run/purple/{z}/{x}/{y}.png?Key-Pair-Id=APKAIDPUN4QMG7VUQPSA&Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTczNjc4MDc2Mn0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzM1NTU2NzYyfX19XX0_&Signature=cnbRKnURivt-1m8zfEChfy4tkMlNXm8jygO5a9FyKP40Y-TQGZzqdhPpl6sKgGMRr-59Lwjt3vMnM-9JdxXbLC1Hp~dd8IYUeOfGZBxTxbUm6Os0YyMUZBW7Z-ZG~H0zCcCRlhAL3vsc7StrRI8oCFxBbY4A~BgOWTAivLDHnYofcUr66DqTMAZyObhrewEyj1BkUyq96gNYDc7fDIPKaIf19nugtUY3k69BoJ03x0juUqjnbk~F2OVurOBulnYc2w15jGNlLqZwuhJ2v4ABmRZbJtOnE~vFLoYpwfC212eT0-zem95xyPRwk8jN00x7SaBrXmN90IBaGRvJm-Ak9w__';

	var StavaLayer = L.tileLayer(	url_strava1,{
		maxNativeZoom:15,
 		maxZoom: 19,
		minZoom: 13,
		attribution: '| <a href="https://www.strava.com/" target="_blank">Stava</a>'
	});
// endregion

// region BD Topo
////https://a.tile.openstreetmap.fr/bdtopo/14/8392/5917.png en direct marche
	var BD_TopoLayer = L.tileLayer('https://a.tile.openstreetmap.fr/bdtopo/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '| <a href="https://geoservices.ign.fr/" target="_blank">IGN BD Topo</a>'
	});

// endregion
	
// region layers


function layer_onEachFeatureDo(feature, layer) {
	var popupStr = '';
	if (feature.properties) { 
		if (feature.properties.name) {
			popupStr += '<b>'+feature.properties.name+'</b>';
		} else if (feature.properties.lwn_ref) {
			popupStr += '<b>'+feature.properties.lwn_ref+'</b>';
		}
		if (feature.properties.distance) {
			popupStr += '<br /> Longueur: '+ feature.properties.distance +' km';
		}
		if (feature.properties.ascent) {
			popupStr += '<br /> Denivelé:  +'+ feature.properties.ascent +' m  -'+ feature.properties.descent+ ' m';
		}
		if (feature.properties.ele) {
			popupStr += '<br /> '+ feature.properties.ele +' m';
		}
		if (feature.properties.note) {
			popupStr += '<br /> note: <i>'+ feature.properties.note +'</i>';
		}
		if (feature.properties.desc) {
			popupStr += '<br /> desc: '+ feature.properties.desc ;
		}
	}
	layer.bindPopup(popupStr);
}

var layerStyle1 = {
	"color": "red",
	"weight": 2,
	"opacity": 1,
	"stoke": true,
	"fill":false
};


var layer1 = L.geoJSON(layer1Json, {
		style: layerStyle1, 
		onEachFeature: layer_onEachFeatureDo,
		pointToLayer: function(feature, latlng) {
			return new L.CircleMarker(latlng, {
				radius: 5,
				fillColor: "red",
				fillOpacity: 1,
				color: "darkblue",
				weight: 2
			});
		}
	});

var layer1Json = {};

var layer2Style = {
	"color": "darkBlue",
	"weight": 2,
	"opacity": 1,
	"stoke": true,
	"fill":false
};

var layer2 = L.geoJSON(layer2Json, {
		style: layer2Style, 
		onEachFeature: layer_onEachFeatureDo,
		pointToLayer: function(feature, latlng) {
			return new L.CircleMarker(latlng, {
				radius: 5,
				fillColor: "lightblue",
				fillOpacity: 1,
				color: "darkblue",
				weight: 2
			});
		}
	});

var layer2Json = {};

var layer3Style = {
	"color": "Maroon",
	"weight": 2,
	"opacity": 1,
	"stoke": true,
	"fill":false
};

var layer3 = L.geoJSON(layer3Json, {
		style: layer3Style, 
		onEachFeature: layer_onEachFeatureDo,
		pointToLayer: function(feature, latlng) {
			return new L.CircleMarker(latlng, {
				radius: 5,
				fillColor: "lightblue",
				fillOpacity: 1,
				color: "darkblue",
				weight: 2
			});
		}
	});

var layer3Json = {};
// endregion

// region map

var map = L.map('map', {
	center: [44.622, 4.40],
	layers: [
		OTMLayer 
	]}).setView([44.622, 4.40], 13); //setView to overwrite setBounds after loading

L.control.scale({maxWidth: 200, imperial: false}).addTo(map);
var zoom_div = document.getElementById("zoom_div");
zoom_div.innerHTML = 'zoom: ' + map.getZoom();
	
var baseMaps = {
    "OpenTopoMap": OTMLayer,
    "OpenStreetMap": OSMLayer,
	"Plan IGN": PlanIGNLayer,
	"IGN Image aérienne": IGNPhotoLayer,
	"RGEalti": RGEaltiLayer
	};
var overlayMaps = {
	"BD_Topo": BD_TopoLayer,
	"Stava": StavaLayer,
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// flags for visibility dependant of layerControl
// (don't add layers on moveend if their layerControl checkBox is not checked)
var map_moving = false;
var overlaysVis = [];

var bd_topo_visible = false;
var strava_visible = false;
var layer1_visible = true;

map.on("movestart", function () {
	map_moving = true;
	map.removeLayer(layer1);
	map.removeLayer(layer2);
	map.removeLayer(StavaLayer);
	map.removeLayer(BD_TopoLayer);
}); 

map.on("moveend", function () {
	for (var i = 0; i < overlaysVis.length; i++) {
		switch(overlaysVis[i]) {
			case 0: 
				map.addLayer(BD_TopoLayer);
				break;
			case 1: 
				map.addLayer(StavaLayer);
				break;
			case 2: 
				map.addLayer(layer1);
				break;
			case 3: 
				map.addLayer(layer2);
				break;
		}
	}
	map_moving = false;
});

function overlaysVis_remove(num) {
	overlaysVis = overlaysVis.toSpliced(overlaysVis.indexOf(num),1)
}

map.on("overlayremove", e => {
	if (!map_moving) {
		switch (e.name) {
			case "BD_Topo": 
				bd_topo_visible = false;
				overlaysVis_remove(0);
			break;
			case "Stava":
				strava_visible = false;
				overlaysVis_remove(1);
			break;
			case "Calque_1":
				layer1_visible = false;
				overlaysVis_remove(2);
			break;
			case "Calque_2":
				layer2_visible = false;
				overlaysVis_remove(3);
			break;
			default:
		}
	}
});

map.on("overlayadd", e => {
	if (!map_moving) {
		switch (e.name) {
			case "BD_Topo":
				bd_topo_visible = true;
				overlaysVis.push(0);
			break;
			case "Stava":
				strava_visible = true;
				overlaysVis.push(1);
			break;
			case "Calque_1":
				layer1_visible = true;
				overlaysVis.push(2);
			break;
			case "Calque_2":
				layer1_visible = true;
				overlaysVis.push(3);
			break;
			default:
		}
	}
});

map.on("click", function(e){
	if (osmMode) {
		osm_latlng = e.latlng;
		var latLngStr = osm_latlng.lng.toFixed(5)+ ', ' + osm_latlng.lat.toFixed(5);
		osmMark.setLatLng(osm_latlng);
	} else {
		curPt_latlng = e.latlng;
		curPtMark.setLatLng(curPt_latlng);
		if (coordsMode) { updateCoords();} 
	}
});

map.on("zoomend", function(ev) {		
	setOsmSearchRadius();
	zoom_div.innerHTML = 'zoom: ' + map.getZoom();
});
	
function moveableMarker(map, marker) {

// drag circleMarker from
////https://stackoverflow.com/questions/43410600/leaflet-v1-03-make-circlemarker-draggable

  function trackCursor(evt) {
    marker.setLatLng(evt.latlng)
  }
  marker.on("mousedown", () => {
    map.dragging.disable()
    map.on("mousemove", trackCursor)
  })
  marker.on("mouseup", () => {
    map.dragging.enable()
    map.off("mousemove", trackCursor)
  })
  return marker
}
	
// endregion

// region point courant

var curPt_latlng = L.latLng(map.getCenter());
//var curPt_latlng = L.latLng([0,0]);
var curPtDiv = document.getElementById('curPtDiv');
var curPtHeader = document.getElementById('curPtHeader');
var curPtLonLat = document.getElementById('curPtLonLat');
var curPtElev = document.getElementById('curPtElev');

var coordsMode = false;

b_coords.onclick = ()=> {
	coordsMode = !coordsMode;
	show_hideCoords(coordsMode);
}
bCloseCurPt.onclick = ()=> {
	show_hideCoords(false);
}

function show_hideCoords(vis){
	if(vis) {
		curPtDiv.style.display = "block";			
		updateCoords();
		b_coords.innerHTML = "Coordonnées -x-";
		hideOsm();
	}
	else {
		curPtDiv.style.display = "none";			
		b_coords.innerHTML = "Coordonnées";
	}
	coordsMode = vis;
	
}

var curPtMark = new L.CircleMarker(curPt_latlng,
	{
		radius: 4,
		fillColor: "red",
		fillOpacity: 0.6,
		color: "blue",
		weight: 1					
	}
).addTo(map);
var curPtMov = moveableMarker(map, curPtMark)	//même marker mais déplaçable

function updateCoords(){ 
	var latLngStr = curPt_latlng.lng.toFixed(5)+ ', ' + curPt_latlng.lat.toFixed(5);
	curPtLonLat.innerHTML = latLngStr;
	getPointElev(latLngStr);
}

curPtHeader.onmouseover = dragcurPtDiv;
function dragcurPtDiv(){
	dragElement(curPtHeader, curPtDiv );
}

b_copyCoords.onclick = copyCoords;	
function copyCoords() {
	//alert("xxx");
	navigator.clipboard.writeText(curPtLonLat.innerHTML)
}
	
// region elev

// const URLbase = 'https://wxs.ign.fr/calcul/alti/rest/elevation.json?'; old url
const 
  URLbase = 'https://data.geopf.fr/altimetrie/1.0/calcul/alti/rest/elevation.json?resource=ign_rge_alti_wld&';
	
function getPointElev(_coordStr) {
var lonStr, latStr, lonPrm, latPrm, URLFull, responseStr;
var elevStr = '???';
var	ptStrs ;
	ptStrs = _coordStr.split(',');
	lonPrm = 'lon=' + ptStrs[0].trim();
	latPrm = 'lat=' + ptStrs[1].trim();
	URLFull = URLbase + lonPrm + '&' +latPrm + '&zonly=true';  
///	URLFull = URLbase + lonPrm + '&' +latPrm ;  
//		console.log(URLFull);
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', URLFull);
	httpRequest.onload = function() {
		responseStr = httpRequest.response;
// 		console.log(responseStr);
		elevStr = responseStr.substring(responseStr.indexOf("[")+1, responseStr.indexOf("]"));
		curPtElev.innerHTML = 'ele: ' + elevStr + ' m' ;
	}
	httpRequest.send();
}

// endregion
	
// endregion

// region OSM

var osmDiv = document.getElementById('osmDiv');
var osmHeader = document.getElementById('osmHeader');
var osmStatus = document.getElementById('osmStatus');
var bCloseOsm = document.getElementById('bCloseOsm');
var b_request = document.getElementById('b_request');
var baseUrl = 'https://overpass-api.de/api/interpreter';
var currentOsmCenter = [4.43902, 44.63892 ]; // Mont Champ
var searchRadius = 32;
var queryUrl;
var isGlobalQuery = true;

var osm_latlng = L.latLng([0,0]);
var osmMode = false;
b_aff_osm.onclick = do_b_aff_osm;
function do_b_aff_osm() {
	osmMode = !osmMode;
	show_hideOsm(osmMode);
}

bCloseOsm.onclick = hideOsm;
	function hideOsm(){	
		show_hideOsm(false);
	}
function show_hideOsm(vis){
		if(vis) {
			osmStatus.innerHTML = "";
			osmDiv.style.display = "block";
			b_aff_osm.innerHTML = "Explorer OSM -x-";
			osmMark.addTo(map);
			curPtMark.removeFrom(map);
			
			close_tags();
			objectsFound_array.length = 0;
			fill_elements_table();
show_hideCoords(false);
		}
		else {
			osmDiv.style.display = "none";
			b_aff_osm.innerHTML = "Explorer OSM";
			osmMark.removeFrom(map);
			curPtMark.addTo(map);
		}
		osmMode = vis;
	}
	
osmHeader.onmouseover = dragosmDiv;
function dragosmDiv(){
	dragElement(osmHeader, osmDiv );
}

var osmMark = new L.CircleMarker(osm_latlng,
{
	radius: 20,
	fillColor: "white",
	fillOpacity: 0.0,
	color: "red",
	weight: 2					
}
);

var osmMov = moveableMarker(map, osmMark)

b_request.onclick = queryAround;
b_back_to_list.onclick = close_tags;
b_call_osm.onclick = call_OSM;
	
function queryAround() {
	isGlobalQuery = true;
	queryUrl = buildOverpassApiUrl();
//	console.log(queryUrl);
 	callOverpass();	
}

function queryMetadata(_element) {
	isGlobalQuery = false;
	queryUrl = buildOverpassApiUrl_meta(_element);
	callOverpass();
}

function callOverpass() {
  query.innerHTML = "query :" + queryUrl;
  osmStatus.innerHTML = "Attente";
  osmStatus.style.backgroundColor = "OrangeRed";
   fetch(queryUrl)
	.then(
		function(response) {
			if (response.status !== 200) {
				console.log('Looks like there was a problem. Status Code: ' +
					response.status);
				osmStatus.innerHTML = "time out";
			}
			// Examine the text in the response
			response.json().then(function(data) {
				display_result(data);
				osmStatus.innerHTML = "reponse ok";
		   });
		osmStatus.style.backgroundColor = "LightGreen";	 
		}
	)
	.catch(function(err) {
		osmStatus.innerHTML = err;
	 });
}

	function setOsmSearchRadius() {
	  var zoomDiff = 17.0 - map.getZoom(); // 17.5 donne 10m
///	  var r = Math.pow(2,zoomDiff)* R_pixels * 0.95;  // R_pixels ??
	  var r = Math.pow(2,zoomDiff)* osmMark._radius * 0.95;
	  searchRadius = Math.round(r)
//		console.log('Z: '+map.getZoom()+ ',  R: '+searchRadius,osmMark._radius);
	}
		
	function buildOverpassApiUrl() {
		var query_1 = "?data=[out:json][timeout:15];	";
	//var query_2 = "( node(around:10,  44.63892, 4.43902)"; 
		var query_2 = centralQuery(searchRadius, osm_latlng);
		var query_3 = "););out geom; ";
		var resultUrl = baseUrl + query_1 + query_2 + query_3;
		return resultUrl;
	}

	function buildOverpassApiUrl_meta(_element) {
		var _type = _element.type;
		var _id = _element.id;
		var metaUrl = baseUrl; 
		metaUrl += "?data=[out:json][timeout:15]; ";
		metaUrl += "(" + _type;
		metaUrl += "(id:" + _id + ");); out meta;";
		return metaUrl;
	}

	function centralQuery(dist, pt) {
		var txt = "(nwr(around:";  //tout
//		var txt = "(rel(around:";
		txt += searchRadius;
		txt += ", ";
		txt+= latlngStr(pt);
		return txt;
	}
	
	function latlngStr(_coordDegre) {
		var coordStr =  _coordDegre.lat.toFixed(7) +', '+_coordDegre.lng.toFixed(7);
		return coordStr;
	}

var elements_div = document.getElementById("elements_div"); 
var elements_table = document.getElementById("elements_table");
var elements_table_head = document.getElementById("elements_table_head"); 
var tags_div = document.getElementById("tags_div"); 
var tags_table = document.getElementById("tags_table");
var tags_table_head = document.getElementById("tags_table_head"); 
var objectsFound_array = [];
var currentObject;

function init_table(_table, _table_head) {
	for (var i = _table.rows.length -1; i > 0; i--) {
		_table.deleteRow(-1);
	}
	switch (_table.id){
	case "elements_table" :
		elements_table_head.innerHTML = 
		`
			<th style="width:50px">type</th>
			<th style="width:100px">id</th>
			<th style="width:400px">Nom</th>	
		`;
		break;
	case "tags_table" :
		tags_table_head.innerHTML = 
		`
			<th style="width:200px">Key</th>
			<th style="width:360px">Value</th>
		`;
		break;
	}
}

function set_cells_event() { 
	elements_table.addEventListener('click', set_events);
}

function set_events(event) {
		var rows = elements_table.getElementsByTagName('tr');
		var rowsArray = Array.from(rows);
		var rowIndex = rowsArray.findIndex(row => row.contains(event.target));
		var currentRow = rowsArray[rowIndex];
		var columsArray = currentRow.querySelectorAll('td')
		var columns = Array.from(columsArray);
		var columnIndex = columns.findIndex(column => column == event.target);
		
		for (var i = elements_table.rows.length -1; i > 0; i--) {
			elements_table.rows[i].cells.item(1).style.backgroundColor = '';
		}
		
		elements_table.rows[rowIndex].cells.item(1).style.backgroundColor = 'aqua';
		
		show_tags(rowIndex - 1, columnIndex, event);
//		currentRow.style.backgroundColor = 'blue';
//	.setStyle("backgroundColor: red");
}

function show_tags(row, column,evt) {
	currentObject = objectsFound_array[row];
	//console.dir(currentObject);
	var tags = currentObject.tags; 
	elements_div.style.display = "none";
	tags_div.style.display = "block";
	init_table(tags_table);
	if (tags) {
		fill_tags_table(currentObject);
	}
	queryMetadata(currentObject);
}

function close_tags() {
	tags_div.style.display = "none";
	elements_div.style.display = "block";
}

function fill_elements_table() {
	//clear table
	var rows = elements_table.getElementsByTagName('tr');
	for (var i = elements_table.rows.length -1; i > 0; i--) {
		elements_table.deleteRow(-1);
	}
	objectsFound_array.forEach(function (item) {
	var row = elements_table.insertRow();
		addCell(row, item.type);
		addCell(row, item.id);
		if (item.tags && item.tags.name ) { 
			addCell(row, item.tags.name); }
		else { addCell(row, "");};	
	});
}

function fill_tags_table(_currentObject) {
	//clear table
	var _tags = _currentObject.tags;
	var rows = tags_table.getElementsByTagName('tr');
	for (var i = tags_table.rows.length -1; i > 0; i--) {
		tags_table.deleteRow(-1);
	}
	var _keys = Object.keys(_tags);
	var _values = Object.values(_tags);
	var row = tags_table.insertRow();
	addCell(row, 'id');
	addCell(row, _currentObject.id);
	for (var i = 0; i < _keys.length; i++) {
			var row = tags_table.insertRow();
			addCell(row, _keys[i]);
			addCell(row, _values[i]);
		}
}

function complete_tags_table(_element ) {
	var row = tags_table.insertRow();
	addCell(row, 'version');
	addCell(row, _element.version);
	row.cells.item(0).style.backgroundColor = 'azure';		
	row.cells.item(1).style.backgroundColor = 'azure';		
	var row = tags_table.insertRow();
	addCell(row, 'timestamp');
	addCell(row, _element.timestamp);
	row.cells.item(0).style.backgroundColor = 'azure';		
	row.cells.item(1).style.backgroundColor = 'azure';		
	var row = tags_table.insertRow();
	addCell(row, 'user');
	addCell(row, _element.user);
	row.cells.item(0).style.backgroundColor = 'azure';		
	row.cells.item(1).style.backgroundColor = 'azure';		
	var row = tags_table.insertRow();
	addCell(row, 'changeset');
	addCell(row, _element.changeset);
	row.cells.item(0).style.backgroundColor = 'azure';		
	row.cells.item(1).style.backgroundColor = 'azure';		

}

function addCell(tr, text) {
        var td = tr.insertCell();
        td.textContent = text;
        return td;
    }

function display_result(response_data) {
	if (isGlobalQuery) {
		objectsFound_array = response_data.elements;
	//	console.log("objectsFound_array",objectsFound_array[0]);
		tags_div.style.display = "none";
		elements_div.style.display = "block";
		init_table(elements_table, elements_table_head);
		set_cells_event();
		fill_elements_table();
	} else {
		complete_tags_table(response_data.elements[0]);

	}
}

	var	osm_tab;
	var osm_tab_name;
	
function call_OSM() {
	//https://www.openstreetmap.org/relation/
	var url = "https://www.openstreetmap.org/";
	url += currentObject.type + "/";
	url += currentObject.id;
//	console.log(url);
//	window.open(url, "_blank");
	if (!osm_tab) {
		osm_tab = window.open(url, "_blank");
		osm_tab.name = "osm";			
	}
	else {	
//		osm_tab = window.open(url, "osm");  
		window.open(url, "osm");  
	}
}


// endregion

// region info_div
var infoDiv = document.getElementById('infoDiv');
var infoHeader = document.getElementById('infoHeader');
var infoTxt = document.getElementById('infoTxt');

	var infoVisible = false;

	b_info.onclick = () => {
		infoVisible = !infoVisible;
		show_hideInfo(infoVisible);
	}
	
	bCloseInfo.onclick = (ev) => {
		show_hideInfo(false);
	}
	
	function show_hideInfo(vis){
		if(vis) {
			infoDiv.style.display = "block";
			b_info.innerHTML = "Info -x-";
		}
		else {
			infoDiv.style.display = "none";
			b_info.innerHTML = "Info";
		}
		infoVisible = vis;
	}

infoHeader.onmouseover = draginfoDiv;
function draginfoDiv(){
	dragElement(infoHeader, infoDiv );
}

function dragElement(header, elem) {
		header.onmousedown = dragMouseDown;
	  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, posTop = 0;
	 function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();

		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	  }
	 function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the elem's new position:
		posTop = elem.offsetTop - pos2;
		if (posTop < 0) { posTop = 0}  // prevent header to go beyond top
		elem.style.top = (posTop) + "px";
		elem.style.left = (elem.offsetLeft - pos1) + "px";
	  }
	 function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	  }

}


//endregion

// region menu

var layerNum = 1;
var sub_layer = document.getElementById("sub_layer");
var sub_file = document.getElementById("sub_file");

b_layer.onclick = () => {
	sub_layer.style="display:block" ;
	sub_file.style="display:none" ;
}	

b_layer_1.onclick = setLayer;
b_layer_2.onclick = setLayer;
b_layer_3.onclick = setLayer;

function setLayer(ev) {
	var b_id = ev.target.id;
	switch (b_id) {
		case "b_layer_1": layerNum = 1;
		break;
		case "b_layer_2": layerNum = 2;
		break;
		case "b_layer_3": layerNum = 3;
		break;	
	}
////	setActiveLayer();
	updateLayerMenu();
}

function updateLayerMenu() {
	b_layer_1.innerHTML = "Calque 1";
	b_layer_2.innerHTML = "Calque 2";
	b_layer_3.innerHTML = "Calque 3";
	switch (layerNum) {
		case 1: 
			b_layer_1.innerHTML += ' -x-';
			b_layer.innerHTML = "Calque 1";
			break;
		case 2: 
			b_layer_2.innerHTML += ' -x-';
			b_layer.innerHTML = "Calque 2";
			break;
		case 3: 
			b_layer_3.innerHTML += ' -x-';
			b_layer.innerHTML = "Calque 3";
			break;
	}
	sub_layer.style="display:none" 
	sub_file.style="display:block" ;
}

b_center_file.onclick = () => {
	var bounds;
	switch (layerNum) {
		case 1: 
			bounds = layer1.getBounds();
			break;
		case 2: 
			bounds = layer2.getBounds();
			break;
		case 3: 
			bounds = layer3.getBounds();
			break;
	
	}
	if (bounds) {
		map.fitBounds(bounds);
	}
}

b_close_file.onclick = () => {
	
	switch (layerNum) {
		case 1: 
			layer1.clearLayers();
			layerControl.removeLayer(layer1);
			overlaysVis_remove(2);
			break;
		case 2: 
			layer2.clearLayers();
			layerControl.removeLayer(layer2);
			overlaysVis_remove(3);
			break;
		case 3: 
			layer3.clearLayers();
			layerControl.removeLayer(layer3);
			overlaysVis_remove(4);
			break;
	}
}


//endregion

// region file

var file_num = 0;

////var sub_file_1 = document.getElementById("sub_file_1");


////var input_file_1 = document.getElementById("input_file_1");
////var input_file_2 = document.getElementById("input_file_2");
////input_file_1.onclick = () => { file_num = 1 }
////input_file_2.onclick = () => { file_num = 2 }


document.getElementById('file_select').addEventListener('change', handleFileSelect, false);
function handleFileSelect(evt) {
	const fileList = evt.target.files; // FileList object
	currentFile = fileList[0];
	read_File(currentFile);
}

//var input_Text;

function toJsonTxt(gpxText) {

	const jsonTxtStart = '{"type": "FeatureCollection","features": ['; 
//	const jsonTxtEnd = ']}}]}';
	const jsonTxtEnd = ']}';
	const featureStart = '{"type": "Feature",';
	const featureEnd = '}';
	const propStart = '"properties": {'
	const propEnd = '},'
	const geomStart = '"geometry": {"type":"LineString","coordinates": [';
	const geomEnd = ']}';

	function trkptStr(trkPtXml) {
		var strTmp = '[';
	//	strTmp += trkPtXml.attributes[1].nodeValue;
		strTmp += trkPtXml.getAttribute("lon");
		strTmp += ', ';
		strTmp += trkPtXml.getAttribute("lat");
		var eleNodes = trkPtXml.getElementsByTagName("ele");
		if (eleNodes.length > 0) {
			strTmp += ', ';
			strTmp += eleNodes[0].childNodes[0].nodeValue;
		}
		strTmp += ']';
		return strTmp;
	}
	
	function trkStr(trkXml) {
		var strTmp = featureStart;
		var xmlNameNode = trkXml.getElementsByTagName("name")
		if (xmlNameNode.length > 0) {
			var name = '"' + xmlNameNode[0].childNodes[0].nodeValue + '"';
			strTmp += propStart;
			strTmp += '"name": ' + name;
			strTmp += propEnd;
//			console.log(name);
		}
		
		///geometry
		strTmp += geomStart;
		var trkpts = Array.from(trkXml.getElementsByTagName("trkpt"));
		for (var i = 0; i < trkpts.length; i++) {
			strTmp += trkptStr(trkpts[i]) ;
			if (i < trkpts.length - 1) {strTmp += ',';}
		}
		strTmp += geomEnd;
		
		strTmp += featureEnd;
		
		return strTmp;
	}

	try {
		if (gpxText.indexOf("<rte>") > 0) {
			gpxText = gpxText.replaceAll("<rte","<trk");
			gpxText = gpxText.replaceAll("</rte","</trk");
			gpxText = gpxText.replaceAll("<rtept","<trkpt");
			gpxText = gpxText.replaceAll("</rtept","</trkpt");
		}
		
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(gpxText,"text/xml");
		jsonTxt = jsonTxtStart;
		var tracks = xmlDoc.getElementsByTagName("trk");
	//	console.log(tracks.length);
		for (var i = 0; i<tracks.length; i++) {
			jsonTxt += trkStr(tracks[i]);
				if (i < tracks.length - 1) {jsonTxt += ',';}
		}
		jsonTxt += jsonTxtEnd;
	//	console.log(gpxText);
	//	console.log(jsonTxt);
		return jsonTxt;
	}
	catch (ex) {
			alert('error toJsonTxt : \n' + ex.message);
			console.log(ex.message);
		return null;
	}
}

function toJsonObj(jsonText) {
//console.log(jsonText);
	try {
		if (jsonText.indexOf("<gpx") >= 0) {
			jsonText = toJsonTxt(jsonText);
		};
		return JSON.parse(jsonText);
	}
	catch(ex) {
		alert('Error toJsonObj: \n'+ ex.message);
 		console.log(ex.message);
		return null;
	}
}

function read_File(_file) {
	var reader = new FileReader(); 
	reader.readAsText(_file, "UTF-8");
	reader.onload = function (evt) {	//onload : lecture terminée ok
		input_Text = evt.target.result;
		var layerJson = toJsonObj(input_Text);
		if (layerJson != null) {
//			switch (file_num) {
			switch (layerNum) {
				case 1 : 
					layer1Json = layerJson;
					layer1.addData(layer1Json);
				///	infoTxt.innerHTML = _file.name; 
					map.removeLayer(layer1)
					map.addLayer(layer1)
					layerControl.removeLayer(layer1);
					layerControl.addOverlay(layer1, "Calque_1");
					overlaysVis.push(2);
				break;
				case 2 : 
					layer2Json = layerJson;
					layer2.addData(layer2Json);
				///	infoTxt.innerHTML = _file.name; 
					map.removeLayer(layer2)
					map.addLayer(layer2)
					layerControl.removeLayer(layer2);
					layerControl.addOverlay(layer2, "Calque_2");
					overlaysVis.push(3);
				break;
				case 3 : 
					layer3Json = layerJson;
					layer3.addData(layer3Json);
				///	infoTxt.innerHTML = _file.name; 
					map.removeLayer(layer3)
					map.addLayer(layer3)
					layerControl.removeLayer(layer3);
					layerControl.addOverlay(layer3, "Calque_3");
					overlaysVis.push(4);
				break;
				default : 
				alert('erreur ',  layerNum);
			
			}
		}
	}
}

//var trkpts = [];

/* ////
b_center_file_1.onclick = () => {
	map.fitBounds(layer1.getBounds());	
}

b_close_file_1.onclick = () => {
	layer1.clearLayers();
	layerControl.removeLayer(layer1);
	overlaysVis_remove(2);
}

b_center_file_2.onclick = () => {
	map.fitBounds(layer2.getBounds());	
}

b_close_file_2.onclick = () => {
	layer2.clearLayers();
	layerControl.removeLayer(layer2);
	overlaysVis_remove(3);
}
*/

// endregion

b_test.onclick = test;
function test() {
//	console.log(layer1Json.getLayers());
//alert('no test');
//	navigator.clipboard.writeText(input_Text)
//layer1.setStyle(layer2Style);
layer1.setStyle({color:"black"});


}

