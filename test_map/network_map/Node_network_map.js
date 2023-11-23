///
const version ="V_1.5.0";
const num = 0;
// 1.4.1 : ajouté des target="_blank" pour toutes les attributions
// 1.4.2 : version ok pour portables (Responsive web design) avec aide intégrée
// 1.4.3 : modification du menu itinéraires
// 1.5.0 : 
//		- chargement des network_nodes depuis network_map => avoir les noms sans les guideposts
//		- intégration du circuit au script, seul le bouton disparaît

window.onload = (event) => {
	console.log("version : ", version);
//	document.title = network_loc + ", " + version + ",  N : " + num;
	document.title = network_name;
	help_header_span.innerHTML = network_name;
	help_network_info.innerHTML = network_info;

	doTraceRoutes();
	setZoomAndCenter();
	init_guideposts_and_maps();
	init_network_nodes();

	if (network_router) {
///		init_network_router();
		help_circuit.style.display= "block";
	};
	if (test_button) {init_tests() };
};

//region Map Tiles

//region OTM
	var OTMLayer = L.tileLayer('https://a.tile.opentopomap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy  <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> | <a href="https://www.opentopomap.org/ target="_blank"">OpenTopoMap</a> | <a href="https://www.openstreetmap.org/user/pb07/diary" target="_blank">pb07</a>'
	}); 

//region OSM/ 	
var OSMLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> | <a href="https://www.openstreetmap.org/user/pb07/diary" target="_blank">pb07</a>'
	});	

// region PlanIGN
	var PlanIGNLayer = L.tileLayer('https://wxs.ign.fr/pratique/wmts/?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng', {
		maxZoom: 19,
		attribution: ' Carte: <a href="https://geoservices.ign.fr/planign" target="_blank">Plan IGN</a> | Tracés: <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a> | <a href="https://www.openstreetmap.org/user/pb07/diary" target="_blank">pb07</a>'
	});

// region IGNPhoto
	var IGNPhoto = L.tileLayer('https://wxs.ign.fr/pratique/wmts/?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg', {
		maxZoom: 19,
		attribution: '<a href="[[https://www.geoportail.gouv.fr/depot/api/cgu/CGU_API_libre.pdf|{{https://wxs.ign.fr/static/logos/IGN/IGN.gif|32}}]]" target="_blank">IGN Image aérienne</a> | Tracés: <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a> | <a href="https://www.openstreetmap.org/user/pb07/diary" target="_blank">pb07</a></a>'
	});

//endregion
	
// region routes	

	var routesLayer = L.geoJSON([]);
	var connectionsLayer = L.geoJSON([], {style: connectionsStyle, onEachFeature: onEachFeatureDo });
	
	var routesStyle = {
		"color": "darkblue",
		"weight": 2,
		"opacity": 1
	};
	
	var connectionsStyle = {
		"color": "DodgerBlue",
		"weight": 3,
		"opacity": 0.7
	};
	
	function onEachFeatureDo(feature, layer) {
		var popupStr = '';
		if (feature.properties) { 
//			console.dir(feature.properties.id);
			if (feature.properties.name) {
				popupStr += feature.properties.name;
			} else if (feature.properties['@id']) {
				popupStr += feature.properties['@id'];			
			}
			if (feature.properties.distance) {
				popupStr += '<br /> Longueur: '+ feature.properties.distance +' km';
			}
			if (feature.properties.ascent) {
				popupStr += '<br /> Denivelé:  +'+ feature.properties.ascent +' m  -'+ feature.properties.descent+ ' m';
			}
		}
		layer.bindPopup(popupStr);
	}
	
function doTraceRoutes() {
//	var routesLayer = L.geoJSON([]);
	var routesLayerTmp = L.geoJSON(routes, {style: routesStyle, onEachFeature: onEachFeatureDo });
	routesLayerTmp.eachLayer(function(layer) {
		//	remove guidepost nodes if present in relation
		if (layer.feature.geometry.type != 'Point') {
		layer.addTo(routesLayer);
		}
	});
	routesLayerTmp = L.geoJSON([]);
	connectionsLayer.addData(connections);
}	
// endregion
	
// region guideposts and network_maps
	
var guidepostIcon = L.icon({
    iconUrl: './icons/icon_guidepost.png',
    iconSize: [12, 16],
    iconAnchor: [6, 18],
    tooltipAnchor: [0, -22]
});

var guidepostsLayer = L.geoJSON([], {   //this layer disappears when moving the map
		pointToLayer: function(feature, latlng) {
			label ="*";
			if (feature.properties.name) {
				label = String(feature.properties.name) 
			} 
				// .bindTooltip can't use straight 'feature.properties.attribute'
			return L.marker(latlng, {
				icon: guidepostIcon
			}).bindTooltip(label, {
				permanent: true,
				direction: 'center',
				className: 'guidepost_tooltip',
			//	opacity: 0.8
			}).openTooltip();
		}
	});

var guidepostsArray = [];
var guidepostsLayer_tmp = new L.GeoJSON();
	guidepostsLayer_tmp.type = "FeatureCollection";
	guidepostsLayer_tmp.features = [];

var network_mapsArray = [];
var networkMapsLayer_tmp = new L.GeoJSON();
	networkMapsLayer_tmp.type = "FeatureCollection";
	networkMapsLayer_tmp.features = [];

function init_guideposts_and_maps() {	
	guidepostsArray = guideposts.features;	
	network_mapsArray = network_maps.features;	
	update_guidepostLayer();
	update_network_mapsLayer();
//	junctionLayer.addData(guideposts);
}

function update_guidepostLayer() {
	guidepostsLayer_tmp.features = [];
	var bounds = map.getBounds();
//	console.log(map.getZoom());
	if (map.getZoom() > 12) {
		for (var i = 0; i < guidepostsArray.length; i++) {
			var pnt = L.GeoJSON.coordsToLatLng(guidepostsArray[i].geometry.coordinates);
			if (bounds.contains(pnt)) {
				guidepostsLayer_tmp.features.push(guidepostsArray[i]);
			}
		}
	}
	guidepostsLayer.clearLayers();
	guidepostsLayer.addData(guidepostsLayer_tmp.features);
//	console.log("guidepostsLayer ",guidepostsLayer);
}

function update_network_mapsLayer() {
	networkMapsLayer_tmp.features = [];
	var bounds = map.getBounds();
	if (map.getZoom() > 10) {
		for (var i = 0; i < network_mapsArray.length; i++) {
			var pnt = L.GeoJSON.coordsToLatLng(network_mapsArray[i].geometry.coordinates);
			if (bounds.contains(pnt)) {
				networkMapsLayer_tmp.features.push(network_mapsArray[i]);
			}
		}
	}
	network_mapsLayer.clearLayers();
	network_mapsLayer.addData(networkMapsLayer_tmp.features);
}

var mapIcon = L.icon({
    iconUrl: './icons/icon_map.png',
    iconSize: [10, 16],
    iconAnchor: [5, 18],
    tooltipAnchor: [0, -22]
});
		
var network_mapsLayer = L.geoJSON([], {   //this layer disappears when moving the map
	pointToLayer: function(feature, latlng) {
		label ="*";
		if (feature.properties.name) {
			label = String(feature.properties.name) 
		}
		return L.marker(latlng, {
			icon: mapIcon
		}).bindTooltip(label, {
			permanent: true,
			direction: 'center',
			className: 'map_tooltip',
		//	opacity: 0.8
		}).openTooltip();
	}

});

/* var junctionLayer = L.geoJSON([], {   //this layer remains when moving the map
	//default layer to mark junction from guideposts when moving the Map
	//replaced by network_nodes_Layer if network_router = true
	pointToLayer: function(feature, latlng) {
		return new L.CircleMarker(latlng, {
			radius: 6,
			fillColor: "lightblue",
			fillOpacity: 1,
			color: "darkblue",
			weight: 1
		});
	}
});*/

// endregion

// region network_nodes

var network_nodes_Layer = L.geoJSON([], {
	pointToLayer: function(feature, latlng) {
		return new L.CircleMarker(latlng, {
			radius: 4,
			fillColor: "lightblue",
			fillOpacity: 1,
			color: "darkblue",
			weight: 1
		});
	}
});

function init_network_nodes() {
	network_nodes_Layer.addData(network_nodes.features);
	// Register event handlers for each feature
	network_nodes_Layer.eachLayer(function(layer) {
		layer.on('click', onNetworkNodeClick);
		layer.on('mouseover', onNetworkNode_over);
		layer.on('mouseout', onNetworkNode_out);
	});
}

function onNetworkNodeClick(e) {
	var newNodeLayer = e.target;  
	var mouseEvent = e.originalEvent;
	mouseEvent.preventDefault();	
	//var lwn_ref = newNodeLayer.feature.properties.lwn_ref;
//	console.dir("newNodeLayer", newNodeLayer);
	if (isTrackMode) {
///		newNodeLayer.unbindPopup();
		next_circuit_node(newNodeLayer, false);		
	} else {
//		var popupContent = "truc";
//		newNodeLayer.bindPopup(popupContent).openPopup();	
	}
}

function onNetworkNode_over(e) {
	var tmpNodeLayer = e.target;  
	var mouseEvent = e.originalEvent;
	mouseEvent.preventDefault();	
	var popupContent = tmpNodeLayer.feature.properties.lwn_ref;
	if (!popupContent) { popupContent = tmpNodeLayer.feature.properties.lwn_name };
	if (!popupContent) { popupContent = '***' };
//	console.log(popupContent, tmpNodeLayer.feature.properties.lwn_name);
//	var popupContent = "truc";
	if (!guideposts_visible) {
		tmpNodeLayer.bindTooltip(popupContent, {direction: 'center', offset: L.point({x: 0, y: -15})}).openTooltip();
	}
//	console.log(tmpNodeLayer.feature.properties);
}

function onNetworkNode_out(e) {
	var tmpNodeLayer = e.target;  
	var mouseEvent = e.originalEvent;
	mouseEvent.preventDefault();	
//	var popupContent = tmpNodeLayer.feature.properties.name;
		tmpNodeLayer.closeTooltip();	
//	console.log(tmpNodeLayer.feature.properties);
}

// region network_nodes Styles

const normalStyle = {
  radius: 4,
  fillColor: 'lightblue',
  color: 'darkblue'
};
const bigStyle = {
  radius: 10,
  fillColor: 'lightblue',
  color: 'darkblue'
};
const selectedStyle = {
  radius: 10,
  fillColor: 'green',
  color: 'green'
};
const nextStyle = {
  radius: 10,
  fillColor: 'orange',
  color: 'red'
};

//endregion

//endregion

// region Map
function setZoomAndCenter() {
	var Zoom = parseInt(zoom);
	var LL = function(latlngStr) {
		var LLarray = latlngStr.split(',');
		return L.latLng(parseFloat(LLarray[0]),parseFloat(LLarray[1]));
	};
	var centerlatLng;	
	if (mapCenter == "auto") { 
//	    console.log("routes ",routes)
		if (routes.features.length >0 ) {
		var bounds = routesLayer.getBounds();
		centerlatLng = bounds.getCenter();
		} else { 
			centerlatLng = LL("46.6, 2.5") ;
			Zoom = 6;
		}

	} else { 
		centerlatLng = LL(mapCenter) ;
	};
	map.setView(centerlatLng, Zoom); 
//	console.log(mapCenter, '   ',centerlatLng);
}


var map = L.map('map', {
	center: [46.6, 2.5],
	zoom: 6,
	layers: [OTMLayer, guidepostsLayer, network_mapsLayer, routesLayer, connectionsLayer ]
});
L.control.scale({maxWidth: 200, imperial: false}).addTo(map);

	network_nodes_Layer.addTo(map);

//endregion

// region layersControl and actions

var baseMaps = {
    "OpenTopoMap": OTMLayer,
    "OpenStreetMap": OSMLayer,
	"PlanIGN":	PlanIGNLayer,
	"IGN Image aérienne": IGNPhoto
};

var overlayMaps = {
	"Trajets": routesLayer,
    "Panneaux": guidepostsLayer,
	"Plans": network_mapsLayer
};

// flags for visibility dependant of layerControl
// (don't add layers on moveend if their layerControl checkBox is not checked)
var routes_visible = true;
var connections_visible = true;
var guideposts_visible = true;
var maps_visible = true;

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
var map_moving =false; //is action directly from layerControl or from map_moving

map.on("movestart", function () {
	map_moving = true;
	map.removeLayer(routesLayer);
	map.removeLayer(connectionsLayer);
//	map.removeLayer(guidepostsLayer);
	guidepostsLayer.clearLayers();
//	map.removeLayer(network_mapsLayer);
	network_mapsLayer.clearLayers();
}); 

map.on("moveend", function () {
	if (routes_visible) { 
		map.addLayer(routesLayer);
		map.addLayer(connectionsLayer);
	};
	if (guideposts_visible) {
		update_guidepostLayer();
	};	 
	if (maps_visible) { 
		update_network_mapsLayer();
	};
	if (network_router) {
		map.removeLayer(circuitLayer);
		map.addLayer(circuitLayer);  //circuitLayer last added to leave it visible above routes
		map.removeLayer(network_nodes_Layer);
		map.addLayer(network_nodes_Layer);  //network_nodes_Layer above all
	}
	map_moving = false;
});

map.on("overlayremove", e => {
//		console.log(e.name);
	switch (e.name) {
		case "Trajets":
			if (!map_moving) {
				routes_visible = false;
				map.removeLayer(connectionsLayer);
				connections_visible = false;
			};
		break;
		case "Panneaux":
			if (!map_moving) {
				guideposts_visible = false;
			};
		break;
		case "Plans":
			if (!map_moving) {
				maps_visible = false;
			};
		break;
		default:
	return;
	}
});

map.on("overlayadd", e => {
//		console.log(e.name);
	switch (e.name) {
		case "Trajets":
			if (!map_moving) {
				routes_visible = true;
				map.addLayer(connectionsLayer);
				connections_visible = true;
			};
		break;
		case "Panneaux":
			if (!map_moving) {
				guideposts_visible = true;
				update_guidepostLayer();
			};
		break;
		case "Plans":
			if (!map_moving) {
				maps_visible = true;
				update_network_mapsLayer();
			};
		break;
		default:
	return;
	}
});

//endregion

// region help
var help_visible = false;
b_help.onclick = show_help;
b_close_help.onclick = show_help;
function show_help() {
	console.log('show help');
	help_visible = ! help_visible;
	if (help_visible) { help_div.style.display = "block"; }
	else { help_div.style.display = "none"; }	
}

//endregion

// region circuit
	// manual routing

var circuitLayer = L.polyline([], {color: 'red'});
circuitLayer.addTo(map);	

var circuitRoutes = [];

var info_status = document.getElementById('info_status');
var info_dist = document.getElementById('info_dist');
var info_ascent = document.getElementById('info_ascent');
var help_header_span = document.getElementById('help_header_span');
var help_network_info = document.getElementById('help_network_info');
var help_circuit = document.getElementById('help_circuit');
let isTrackMode = false;
var startNode = undefined;
var currentNode = undefined;
var nextRoutes = [];
var nextRoutesIsForward = [];
var nextNodes = [];
var circuitRoutes = [];
var circuitInfos = [];
var circuitNodes = [];
var totalDist =0;
var	denivPlus = 0;
var	denivMoins = 0;

function distance(pt1, pt2) {
	var latLng1 = L.latLng(pt1[1], pt1[0]);
	var latLng2 = L.latLng(pt2[1], pt2[0]);
	var dist = latLng2.distanceTo(latLng1);
	return dist;
}

function _dist(_circuitRoute) {
  var _totDist = 0;
  var latLng1; 
  var latLng2;
  for (var i = 1; i < _circuitRoute.length; i++) {
	var loc_dist = distance(_circuitRoute[i-1], _circuitRoute[i]);
	_totDist += loc_dist;
  }
	return _totDist / 1000;
}

function _calcTotDist() {
	totalDist =0;
	for (var j = 0; j < circuitRoutes.length; j++) {
		totalDist += _dist(circuitRoutes[j]);
	}
}

function _calcDeniv() {
	denivPlus = 0;
	denivMoins = 0;
	for (var j = 0; j < circuitRoutes.length; j++) {			
		for (var i = 1; i < circuitRoutes[j].length; i++) {
			if (circuitRoutes[j][i].length > 2) {
				var diffElev = circuitRoutes[j][i][2] - circuitRoutes[j][i-1][2];
				if (diffElev >= 0) { denivPlus += diffElev }
				else { denivMoins -= diffElev}
			}
		}				
	}
}

const ptsSmooth = 5;

function _calcDenivSmooth() {
	var elevArray = [];
	var elevArraySmooth = [];
	for (var j = 0; j < circuitRoutes.length; j++) {			
		for (var i = 0; i < circuitRoutes[j].length; i++) {
			if (circuitRoutes[j][i].length > 2) {
				elevArray.push(circuitRoutes[j][i][2]);
			}
		}
	}
	var elevTmp = 0;
	var elevCount = 0;
	var _elevSmooth = 0;
	for (var i = 0; i < elevArray.length; i++) {
		elevTmp = 0;
		elevCount = 0;
		for (var j = i - ptsSmooth; j < i + ptsSmooth; j++){
			if(j >=0 && j < elevArray.length - 1){
				elevTmp += elevArray[j];
				elevCount++;
			}
		}
		_elevSmooth = elevTmp / elevCount;
		elevArraySmooth.push(_elevSmooth);
	}
//	console.log(" elevArray ", elevArray);
//	console.log(" elevArraySmooth ", elevArraySmooth);
	denivPlus = 0;
	denivMoins = 0;
	for (var i = 1; i < elevArraySmooth.length; i++) {
		var diffElev = elevArraySmooth[i] - elevArraySmooth[i-1];
		if (diffElev >= 0) { denivPlus += diffElev }
		else { denivMoins -= diffElev}
	}
}

function updateInfo() {
	_calcTotDist();
//	_calcDeniv();
	_calcDenivSmooth();
	var distStr = totalDist.toFixed(2);
	var denivPlusStr = denivPlus.toFixed(0);
	var denivMoinsStr = denivMoins.toFixed(0);
	//info_status.innerHTML = "";
	info_dist.innerHTML = " Longueur : " + distStr  + " km,";
	info_ascent.innerHTML = "Montée : " + denivPlusStr 
						  + " m,   Descente : " + denivMoinsStr +  " m";

}

function selectNextPoint(routePoint) {
	var dist;
	network_nodes_Layer.eachLayer(function(layer) {
		var junction_Lat_Lng = layer.getLatLng();

		if(junction_Lat_Lng.equals(routePoint)) {
//	console.log(routePoint, junction_Lat_Lng);
			nextNodes.push(layer);
			layer.setStyle(nextStyle);			
		}
	});
}

function searchRoutesAndNodesFromHere() {
	nextRoutes.length = 0;
	nextRoutesIsForward.length = 0;
	nextNodes.length = 0;
	var dist;
//	console.log("currentNode", currentNode);
	currentNode_Lat_Lng = currentNode.getLatLng();
//	console.log("currentNode_Lat_Lng", currentNode_Lat_Lng);

	routesLayer.eachLayer(function(layer) {
		var coordArray = layer.feature.geometry.coordinates;
		firstPoint = L.GeoJSON.coordsToLatLng(coordArray[0] );
		lastPoint = L.GeoJSON.coordsToLatLng(coordArray[coordArray.length - 1] );
		if (currentNode_Lat_Lng.equals(firstPoint)) {
//console.log("firstPoint", firstPoint, layer.feature.properties.name);
			nextRoutes.push(layer);
			nextRoutesIsForward.push(true);
			selectNextPoint(lastPoint);
		}
		if (currentNode_Lat_Lng.equals(lastPoint)) {
//console.log("lastPoint", lastPoint, layer.feature.properties.name);
			nextRoutes.push(layer);
			nextRoutesIsForward.push(false);
			selectNextPoint(firstPoint);
		}
	});		
}

function next_circuit_node(_newNodeLayer, undo) {
	var newNodeIndex = nextNodes.indexOf(_newNodeLayer);
	if (newNodeIndex < 0 && currentNode) { 
			console.log("not valid");
	} else {
		if (!currentNode) {  //currentNode undefined (first point)
			set_largeNodes(false); 
			startNode = _newNodeLayer;// perhaps not useful
		} else if (!undo) {  // previous node exists, addroute to new point
			// clone the array instead of simple copy to leave original intact if reverted
			var routeArray = Array.from(nextRoutes[newNodeIndex].feature.geometry.coordinates);
			var routeInfo = nextRoutes[newNodeIndex].feature.properties;
			if (!nextRoutesIsForward[newNodeIndex]) {routeArray.reverse()}
			circuitRoutes.push(routeArray);
			circuitInfos.push(routeInfo);
		}
		if (!undo) {circuitNodes.push(_newNodeLayer);}			
		currentNode = _newNodeLayer;
//			var _name = _newNodeLayer.feature.properties.name;
		for (var i = 0; i < nextNodes.length; i++) { nextNodes[i].setStyle(normalStyle);}		
		_newNodeLayer.setStyle(selectedStyle);
		
		// delete old values to put new ones (necessary for undo)
		circuitLayer.setLatLngs([]);	
		for (var j = 0; j < circuitRoutes.length; j++) {			
			for (var i = 0; i < circuitRoutes[j].length; i++) {
				circuitLayer.addLatLng(L.GeoJSON.coordsToLatLng(circuitRoutes[j][i]));
			}
		}

		//search routes and nodes
		searchRoutesAndNodesFromHere();
		updateInfo();		
	}
}


function set_largeNodes(setBig) {
	if(setBig) {
		network_nodes_Layer.eachLayer (function(layer) {layer.setStyle(bigStyle);});
	} else {  
		network_nodes_Layer.eachLayer (function(layer) {layer.setStyle(normalStyle);});
	}
}

function buttons_show(_show) {
	if(_show) {
		b_undo.enable();
		b_download.enable();
		b_clear.enable();
	} else {
		b_undo.disable();
		b_download.disable();
		b_clear.disable();
	}
}

function start_circuitMode() {
	info_status.innerHTML = "Edition en cours";
	info_status.style.backgroundColor = "gold";
	set_largeNodes(true);
	network_nodes_Layer.removeFrom(map);
	network_nodes_Layer.addTo(map);
	currentNode = undefined;
	nextNodes.length = 0;
	circuitNodes.length = 0;
	circuitRoutes.length = 0;
	circuitInfos.length = 0;
	totalDist =0;
}

function toggle_circuitMode() {
	isTrackMode = !isTrackMode;
	buttons_show(isTrackMode);
	if (isTrackMode) {
		if (nextNodes.length == 0) {
			start_circuitMode();
//			console.log('démarrer circuit', );
		} else {
			for (var i = 0; i < nextNodes.length; i++) { 
				nextNodes[i].setStyle(nextStyle);
			}		
			currentNode.setStyle(selectedStyle);
//			console.log('continuer circuit', );
		}
	} else {
		set_largeNodes(false);
		if (nextNodes.length == 0) {
//			console.log('circuit vide');
			info_status.innerHTML = "";
		} else {
//			console.log('circuit en cours');
		}	
	}
}

function undoLast() {
//	console.log("undo", circuitNodes);
	if (circuitNodes.length > 1) {
		var lastNode = circuitNodes.pop();
		circuitRoutes.pop();
		circuitInfos.pop();
		next_circuit_node(circuitNodes[circuitNodes.length -1],true);	
	} else { 
//		console.log("restart");
		start_circuitMode();
	}
}

function clear_circuit() {
	currentNode = undefined;
	nextNodes.length = 0;
	set_largeNodes(true);
	circuitRoutes.length = 0;
	circuitInfos.length = 0;
	totalDist =0;
	circuitLayer.setLatLngs([]);
//	info_status.innerHTML = "";
	info_dist.innerHTML = "";
	info_ascent.innerHTML = "";
}

// endregion 

// region save circuit

function trkptNode(circuitPt){	
	var tmpStr;
	var coordStr = `lat= "${circuitPt[1]}" lon= " ${circuitPt[0]}"`;
	tmpStr = "<trkpt " + coordStr + ">";
	if (circuitPt.length > 2){
		tmpStr +=  "<ele>" + circuitPt[2].toFixed(2) + "</ele>";;
	}
	tmpStr += "</trkpt>";
    return tmpStr;  
}

function build_gpx () {
	var gpxString = ""
	gpxString += '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="Node_network_map V_2.0 ">';
	
	gpxString += "\n<trk>\n";	
//	gpxString += "<name>" + Name + "</name>\n";		
	gpxString += "<trkseg>\n";
	for(var j = 0; j < circuitRoutes.length; j++){  
		for(var i = 0; i < circuitRoutes[j].length; i++){  
			gpxString += trkptNode(circuitRoutes[j][i])+'\n';
		}
	}
	gpxString += "</trkseg>\n";
	gpxString += "</trk></gpx>";	
	return gpxString;
}

function writeFile (strToWrite, _fileName) {
	var textToSaveAsBlob = new Blob([strToWrite], {type:"text/plain"});
	var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
	var downloadLink = document.createElement("a");
	downloadLink.download = _fileName;
	downloadLink.innerHTML = "Download File";
	downloadLink.href = textToSaveAsURL;
	downloadLink.onclick = destroyClickedElement;
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
 
 //comment next line to avoid create gpx file and to see the console.log
	downloadLink.click();

	function destroyClickedElement(event){
		document.body.removeChild(event.target);
	}
}

var fileNameToSave = "circuit.gpx";

function downloadFile() {
//	console.log("download point" , trkptNode(circuitRoutes[0][0]));
	var gpxStr = build_gpx();
	writeFile(gpxStr, fileNameToSave);
	info_status.style.backgroundColor = "Aqua";
	info_status.innerHTML = "--- fichier <i>circuit.gpx</i> enregistré --- ";
//	info_dist.innerHTML = "";
//	info_ascent.innerHTML = "";
}

//endregion

// region buttons

var b_circuit = L.easyButton( '<img src="./icons/icon-circuit.png">', function(){
	toggle_circuitMode();
});

var b_undo = L.easyButton( '<img src="./icons/icon-undo.png">', function(){
	undoLast();
});

var b_download = L.easyButton( '<img src="./icons/icon-download.png">', function(){
	downloadFile();
});

var b_clear = L.easyButton( '<img src="./icons/icon-end.png">', function(){
/*	if (confirm2("Effacer le circuit en cours ?")) {
		console.log("clear");
		clear_circuit();
	}*/
	//openDialog();
		confirm_dialog.showModal();

});

var confirm_dialog = document.getElementById("confirm_dialog");
b_ok.onclick = delete_and_close;
b_cancel.onclick = closeDialog;

function openDialog() {
	confirm_dialog.show();
}

function closeDialog() {
	confirm_dialog.close();
}

function delete_and_close() {
	clear_circuit();
	confirm_dialog.close();
}

easyBar = L.easyBar([b_circuit, b_undo, b_download, b_clear]);	
easyBar.addTo(map);

b_undo.disable();
b_download.disable();
b_clear.disable();

// endregion




