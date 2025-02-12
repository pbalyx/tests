///
const version ="0.3.2";
const subV = "";
// 0.1.1 : lecture gpx ou json
// 0.2.1 : essai responsive design
// 0.3.0 : objets calques 
// 0.3.1 : objets calques debuggé
// 0.3.2 : OSM import
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
		maxNativeZoom:15,
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
//https://a.tile.openstreetmap.fr/bdtopo/14/8392/5917.png en direct marche
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
		} else if (feature.id) {
			popupStr += '<b>'+feature.id+'</b>';
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

var defaultStyle = {
	color: "red",
	fillColor: "blue",
	"weight": 2,
	"opacity": 1,
	"fillOpacity": 0.5,
	"stoke": true,
	"fill":false
};

const style1 = {color: "red",	"fillColor": "Blue"};
const style2 = {"color": "darkBlue",	"fillColor": "red"};
const style3 = {"color": "Maroon",	"fillColor": "green"};
const styles = [style1, style2, style3];


var layerX = new LayerObj();////

function isPresent(_key, _value, _featuresList) {
	var _isPresent = false;
	for (var j = 0; j < _featuresList.length; j++) {
///console.log('test ', _value, _featuresList[j][_key]);
		if (_value == _featuresList[j][_key]) {
			_isPresent = true;
			break;
		}
	}
	return _isPresent;
}

function fillCircleMarkers(_layer) {
	_layer.eachLayer(function (subLayer) { 	
		if (subLayer.feature.geometry.type == "Point") {
			subLayer.setStyle({"fill":true, "weight": 2 });
		}		
	});
}
		

//objet layer
function LayerObj (_name) {
	this.name = _name;
	this.layer = L.geoJSON(this.layerJson, {
		style: defaultStyle,
		onEachFeature: layer_onEachFeatureDo,
		pointToLayer: function(feature, latlng) {
			return new L.CircleMarker(latlng, {
				radius: 5,
				weight: 2
			});
		}
	});
	
	this.layerJson = {"features":[]};
	this.setStyle = function(_style) { 
/// console.log(this.layer.options.style);		
		this.layer.setStyle(_style);
/// console.dir(this.layer);		
	}
	
	this.updateLayerX = function(_addedJson, _isNew) {
///			console.log("avant ",this.layerJson.features.length);
///			console.log("ajout ",_addedJson.features.length);
		var _identKey = "id";
		for (var i = 0; i < _addedJson.features.length; i++) {
			var _id = _addedJson.features[i][_identKey];	
			if (!isPresent(_identKey, _id, this.layerJson.features)) {
				this.layerJson.features.push(_addedJson.features[i]);
			}
		}
///		console.log("après ",this.layerJson.features.length);
		this.layer.clearLayers();
		this.layer.addData(this.layerJson.features);
		fillCircleMarkers(this.layer);
			
		//		map.removeLayer(this.layer)
		map.addLayer(this.layer)	
	}
	this.clearLayer = function () {
		this.layer.clearLayers();
		this.layerJson = {"features":[]}; 
	}
}

var calque1 = new LayerObj("Calque1");
	calque1.setStyle(style1);////don't work here, ok in test ???
var calque2 = new LayerObj("Calque2");
	calque2.setStyle(style2);
var calque3 = new LayerObj("Calque3");
	calque3.setStyle(style3);
const calques = [calque1, calque2, calque3];

// endregion

// region map

var mapCenter = [44.65, 4.251];//Jaujac
//var mapCenter = [44.622, 4.40];

var map = L.map('map', {
//	center: mapCenter,
	layers: [
		OTMLayer 
	]}).setView(mapCenter, 13); //setView to overwrite setBounds after loading

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
// add lyers in correct order for superposition
var overlaysVis = [];
var map_moving = false;

var bd_topo_visible = false;
var strava_visible = false;

map.on("movestart", function () {
	map_moving = true;
	for (var i = 0; i < calques.length; i++) {
	//console.log(i, calques[i].layer);
		map.removeLayer(calques[i].layer);
	}
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
			case 3:
			case 4: 
//				console.log(overlaysVis);
//				console.log('i', overlaysVis[i]-2, calques[overlaysVis[i]-1]);
				map.addLayer(calques[overlaysVis[i]-2].layer);
				break;
//			default:map.addLayer(calque1);
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
			default:
		}
		for (var i = 0; i < calques.length; i++) {
			if (calques[i].name == e.name) {
				overlaysVis_remove(i+2);
			}
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
		}
		for (var i = 0; i < calques.length; i++) {
			if (calques[i].name == e.name) {
				overlaysVis.push(i+2);
			}
		}

	}
});

map.on("click", function(e){
	if (osmMode == "explore") {
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

// region menu

var layerNum = 1;
var sub_layer = document.getElementById("sub_layer");
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
	updateLayerMenu();
}

function updateLayerMenu() {
	b_layer_1.innerHTML = calque1.name;
	b_layer_2.innerHTML = calque2.name;
	b_layer_3.innerHTML = calque3.name;
	switch (layerNum) {
		case 1: 
			b_layer_1.innerHTML += ' -x-';
			b_layer.innerHTML = calque1.name;
			break;
		case 2: 
			b_layer_2.innerHTML += ' -x-';
			b_layer.innerHTML = calque2.name;
			break;
		case 3: 
			b_layer_3.innerHTML += ' -x-';
			b_layer.innerHTML = calque3.name;
			break;
	}
}

//----------- file ---------------

// read file in handleFileSelect
b_osmImport.onclick =  ()=>{
	if (osmMode != "import") { osmMode = "import" } else {osmMode = "none"};
	show_hideOsm();
}

b_center_file.onclick = () => {
	var bounds = calques[layerNum - 1].layer.getBounds();
	if (bounds.isValid()) {
		map.fitBounds(bounds);
	}
}

b_close_file.onclick = () => {	
	layerControl.removeLayer(calques[layerNum - 1].layer);
	calques[layerNum - 1].clearLayer();
	overlaysVis_remove(layerNum + 1);
}

//------------ tools --------------
b_coords.onclick = ()=> {
	coordsMode = !coordsMode;
	show_hideCoords(coordsMode);
}

b_osmExplore.onclick = ()=>{
	if (osmMode != "explore") { osmMode = "explore" } else {osmMode = "none"};
//	osmExploreMode = !osmExploreMode;
	show_hideOsm();
}

//endregion

// region point courant

var curPt_latlng = L.latLng(map.getCenter());
//var curPt_latlng = L.latLng([0,0]);
var curPtDiv = document.getElementById('curPtDiv');
var curPtHeader = document.getElementById('curPtHeader');
var curPtLonLat = document.getElementById('curPtLonLat');
var curPtElev = document.getElementById('curPtElev');

var coordsMode = false;

bCloseCurPt.onclick = ()=> {
	show_hideCoords(false);
}

function show_hideCoords(vis){
	if(vis) {
		curPtDiv.style.display = "block";			
		updateCoords();
		b_coords.innerHTML = "Coordonnées -x-";
		osmMode = "none";
		show_hideOsm();
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
		fillColor: "orange",
		fillOpacity: 0.6,
		color: "black",
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

// region OSM

var osmMode = "none"; // "none", "import", "explore"

function show_hideOsm(){
///console.log(osmMode);
		if(osmMode == "none") {
			osmDiv.style.display = "none";
			importDiv.style.display = "none";
			b_osmExplore.innerHTML = "Explorer OSM";
			b_osmImport.innerHTML = "Importer OSM";
			osmMark.removeFrom(map);
			curPtMark.addTo(map);		
		} 
		else if(osmMode == "explore") {
			osmStatus.innerHTML = "";
			osmDiv.style.display = "block";
			elements_div.style.display = "block";
			b_osmExplore.innerHTML = "Explorer OSM -x-";
////			b_request.innerHTML = "Explorer";
			osmMark.addTo(map);
			curPtMark.removeFrom(map);
			close_tags();
			objectsFound_array.length = 0;
			fill_elements_table();
			
			b_osmImport.innerHTML = "Importer OSM";
			importDiv.style.display = "none";

			show_hideCoords(false);
		}
		else if (osmMode == "import") {
			osmStatus.innerHTML = "";
			osmDiv.style.display = "none";
			importDiv.style.display = "block";
///			elements_div.style.display = "none";
			b_osmExplore.innerHTML = "Explorer OSM";
			b_osmImport.innerHTML = "Importer OSM -x-";
///			b_request.innerHTML = "Importer";

			show_hideCoords(false);
		}
	}
	
// region Overpass

var baseUrl = 'https://overpass-api.de/api/interpreter';
var queryType = ""; //// type enum ?? (around, meta, import)
var queryOk = true;
var osmDiv = document.getElementById('osmDiv');
var osmHeader = document.getElementById('osmHeader');
var osmStatus = document.getElementById('osmStatus');
var importHeader = document.getElementById('importHeader');
var importStatus = document.getElementById('importStatus');

function centralQuery_around(_params) {
		var txt = "(nwr(around:";  //tout
		txt += _params._searchRadius;
		txt += ", ";
///		console.log(_params._osm_latlng);
		txt+= latlngStr(_params._osm_latlng);
		txt += ");)";
		return txt;
}

function centralQueryMeta(_params) {
		var _type = _params.type;
		var _id = _params.id;
		var metaUrl = ""; 
		metaUrl += "(" + _type;
		metaUrl += "(id:" + _id + ");); out meta;";
//  console.log("metaUrl : " + metaUrl);
		return metaUrl;
}
	
function centralQueryImport(_params) {
		var txt = "";
		switch (_params._subType) {
			case "route": 
				txt += '(relation["route"~"hiking|foot"]["network:type" = "node_network"]'; 
				break;
			case "guidepost": 
				txt += '(node["information" ="guidepost"]["hiking"="yes"]'; 
				break;
			case "network_map": 
				txt += '(node["information" ="map"]["map_type"="scheme"]'; 
				break;
			case "network_node": 
				txt += '(node["network:type" ="node_network"]'; 
				break;
			default: 
				alert(_params._subType +' non implémenté');
				queryOk = false;
		}
		txt += bounds_strNew(_params._boundsObj);
		txt += ";)";
//		console.log("centralQueryImport: ", txt);
		return txt;
}

function bounds_strNew(_bounds) {
	//Overpass requires SW, NE
	var boundsStr = "";
	boundsStr +=  '( ' 
		+ _bounds._southWest.lat.toFixed(6) + ', '
		+ _bounds._southWest.lng.toFixed(6) +', '
		+ _bounds._northEast.lat.toFixed(6) + ', '
		+ _bounds._northEast.lng.toFixed(6) + ')';
//console.log(boundsStr);
	return boundsStr;
}
	
function buildQuery(_type,  _params) {
	var queryStr = "?data=[out:json][timeout:15];"
	switch(_type) {
		case "around" :
			queryStr += centralQuery_around(_params);
			queryStr += ";out geom;";
		break;
		case "meta" :
			queryStr += centralQueryMeta(_params);
		break;
		case "import" :
			queryStr += centralQueryImport(_params);
			queryStr += ";out geom;";
		break;
	}
///    console.log("queryStr : " + queryStr);
	
	return queryStr;
}

function callOverpass(type, params) {
	queryOk = true;
	var _status;
	switch (type) {
		case "around":
			_status = osmStatus;
			break;
		case "import":
			_status = importStatus;
			break;
		case "meta":
			_status = importStatus;
			break;
	}
	var _query = buildQuery(type, params);
	if (!queryOk) {
		console.log("baseUrl: ",baseUrl);
		console.log("_query: ",_query);
		_status.innerHTML = "Erreur";
		_status.style.backgroundColor = "OrangeRed";
		
	} else {
		_status.innerHTML = "Attente";
		_status.style.backgroundColor = "OrangeRed";
		fetch(baseUrl + _query)
		.then(
			function(response) {
				if (response.status == 200) {
				// Examine the text in the response
					response.json().then(function(data) {
						display_result(type, data);
					});
					_status.innerHTML = "reponse ok";				
					_status.style.backgroundColor = "LightGreen";	 
				} else {
					console.log('Looks like there was a problem. Status Code: ' +
						response.status);
					_status.innerHTML = "time out";
			   }
			}
		)
		.catch(function(err) {
			_status.innerHTML = err;
		 });
	 }
}

function display_result(_type, _data) {
	switch(_type) {
		case "around" :
			display_resultAroundNew(_data);
		break;
		case "meta" :
			complete_tags_table(_data.elements[0]);
		break;
		case "import" :
			display_resultImport(_data);
		break;	
	}
}

// endregion

// region OSM around

///var currentOsmCenter = [4.43902, 44.63892 ]; // Mont Champ
var searchRadius = 32;
var osm_latlng = L.latLng([0,0]);

bCloseOsm.onclick = () =>{	
		osmMode = "none";
		show_hideOsm();
	}

b_request.onclick = () =>{queryAroundNew()}

b_back_to_list.onclick = close_tags;
b_call_osm.onclick = call_OSM;

osmHeader.onmouseover = dragosmDiv;
function dragosmDiv(){
	dragElement(osmHeader, osmDiv );
}
var osmMark = new L.CircleMarker(osm_latlng, {
	radius: 20,
	fillColor: "white",
	fillOpacity: 0.0,
	color: "red",
	weight: 2					
});
var osmMov = moveableMarker(map, osmMark)
	
function queryAroundNew() {
	var aroundParams = {"_searchRadius" :searchRadius, "_osm_latlng":osm_latlng};
	callOverpass("around", aroundParams);
}

function queryMetadataNew(_element) {
	callOverpass("meta", _element);
}

function display_resultAroundNew(response_data) {
		objectsFound_array = response_data.elements;
	//	console.log("objectsFound_array",objectsFound_array[0]);
		tags_div.style.display = "none";
		elements_div.style.display = "block";
		init_table(elements_table, elements_table_head);
		set_cells_event();
		fill_elements_table();
}

function setOsmSearchRadius() {
	var zoomDiff = 17.0 - map.getZoom(); // 17.5 donne 10m
	///	  var r = Math.pow(2,zoomDiff)* R_pixels * 0.95;  // R_pixels ??
	var r = Math.pow(2,zoomDiff)* osmMark._radius * 0.95;
	searchRadius = Math.round(r)
	//		console.log('Z: '+map.getZoom()+ ',  R: '+searchRadius,osmMark._radius);
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
	queryMetadataNew(currentObject);
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

// region OSM Import

var import_div = document.getElementById("import_div"); 

importHeader.onmouseover = dragImportDiv;
function dragImportDiv(){
	dragElement(importHeader, importDiv );
}

var osm_geojson = {"features":[]};

b_import.onclick = () => {
	for (const radioButton of radioButtons) {
		if (radioButton.checked) {
			subType = radioButton.value;
			break;
		}
	}
	importOsm(subType);
}

bCloseImport.onclick = () =>{	
	osmMode = "none";
	show_hideOsm();
}

const radioButtons = document.querySelectorAll('input[name="subType"]');
var subType;


function importOsm(_subType) {

	var boundsObjTmp = //Fabras
		{_southWest : { lat: 44.6399, lng: 4.2562 }, _northEast: {lat: 44.6600, lng: 4.3056 }};
	boundsObjTmp = map.getBounds();
	var importParams = {"_boundsObj" : boundsObjTmp, "_subType": _subType};
	callOverpass("import", importParams);
}

function updateCalque(layerJson) {
	var calque = calques[layerNum - 1]
	calque.updateLayerX(layerJson, true);
	calque.setStyle(styles[layerNum - 1]);
	layerControl.removeLayer(calque.layer);
	layerControl.addOverlay(calque.layer, calque.name);
	overlaysVis.push(layerNum + 1);
}

	function display_resultImport(osm_data) {
		var geojson_tmp;
		try {
			isrefFile = false;
			geojson_tmp = osmtogeojson(osm_data, {flatProperties:false});
//			geojson_tmp = osmtogeojson(osm_data, {flatProperties:true});
			
//console.dir("before ", geojson_tmp);
			geojson_tmp1 = reformatJson(geojson_tmp);
//console.dir("reformatted ", geojson_tmp1);
			
/*			var geojson_str = JSON.stringify(geojson_tmp);
			geojson_str = geojson_str.replaceAll("id", "@id");
			geojson_tmp = JSON.parse(geojson_str);*/
			updateCalque(geojson_tmp1);
		}
		catch(err) {
///			trucDiv.innerHTML += err;
			console.log( err); 
		}
	}
	
	function reformatJson(jsonIn)  {
		var jsonOut = jsonIn;
		for (var i=0; i< jsonIn.features.length; i++) {
			Object.keys(jsonIn.features[i].properties.tags).forEach(function(key){	
				jsonOut.features[i].properties[key] = jsonIn.features[i].properties.tags[key]
			});
			delete jsonOut.features[i].properties["tags"];			
		}
////	console.log(jsonOut.features[0].properties);
		return jsonOut;
	}

// endregion

// endregion

// region file

document.getElementById('file_selectX').addEventListener('change', handleFileSelect, false);
function handleFileSelect(evt) {
	const fileList = evt.target.files; // FileList object
	currentFile = fileList[0];
	read_File(currentFile);
}

function read_File(_file) {
	var reader = new FileReader(); 
	reader.readAsText(_file, "UTF-8");
	reader.onload = function (evt) {	//onload : lecture terminée ok
		input_Text = evt.target.result;
		var layerJson = toJsonObj(input_Text);
		var calque = calques[layerNum - 1]
		calque.updateLayerX(layerJson, true);
		calque.setStyle(styles[layerNum - 1]);
		layerControl.removeLayer(calque.layer);
		layerControl.addOverlay(calque.layer, calque.name);
		overlaysVis.push(layerNum + 1);

	}
}

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



// endregion

var styleNum = 0;

b_test.onclick = test;
function test() {
/*	var boundsObjTmp = //Fabras
		{_southWest : { lat: 44.6399, lng: 4.2562 }, _northEast: {lat: 44.6600, lng: 4.3056 }};
	var importParams = {"_boundsObj" : boundsObjTmp};
	*/
////	var aroundParams = {"_searchRadius" :searchRadius, "_osm_latlng":osm_latlng};
////	callOverpass("around", aroundParams);
////	callOverpass("import", importParams);
	var selectedSize = "xxx";
	const radioButtons = document.querySelectorAll('input[name="subType"]');
             for (const radioButton of radioButtons) {
                if (radioButton.checked) {
                    selectedSize = radioButton.value;
                    break;
                }
            }
alert(selectedSize);
}

// region poub


// endregion