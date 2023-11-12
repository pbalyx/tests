function init_tests() {

	console.log("extra.js ok");
	// region tests

	var b_test = L.easyButton( '<span>tests</span>', function(){
//		alert('test');
	test_num();
	//	test_screen();
	//	test_elev();
	//	test_dist();
	//  test_bounds();
	//test_json();
//	console.log(routes);
//	doTraceRoutes();
	});
	 b_test.addTo(map);
	 
function test_num() {
	info_status.innerHTML = network_loc + ", " + version + ",  N : " + num;;
}
function test_screen() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	info_status.innerHTML = "width: " + w + " height:" + h;

}

	function test_elev() {
		console.log("test");
	//	console.dir("nextNodes ", nextNodes[0]);
	//	console.dir("nextNodes ", nextNodes[0].getLatLng());
		var count2 = 0;
		var count3 = 0;
		var routesFeatures = routes.features;
		routesLayer.eachLayer(function(layer) {
			elevOk = true;
			arrayCoords = layer.feature.geometry.coordinates;
			iMax = arrayCoords.length;
	//		iMax = 1;
			for (var i = 0; i < iMax; i++) {
				if (arrayCoords[i].length == 2) { elevOk = false }
			}
			if(elevOk) {
				count3++; 
			} else {
				layer.setStyle({color: "red"});
				var x = routesFeatures.indexOf(layer.feature);
				//console.log(routes.features);
	//			console.log(x);
	//			console.log("index ", x, "name ",layer.feature.properties.name);
				count2++;
			};
		});
		console.log("routes sans elev ", count2);
		console.log("routes avec elev ", count3);
		info_status.innerHTML = `routes sans elev : ${count2},  routes avec elev : ${count3}`;
	}

	function test_bounds() {
//		var bounds = L.latLngBounds(map.getBounds());
		var bounds = map.getBounds();
		console.log(bounds);
		var guidepostsArray = guideposts.features;
//		console.log(guidepostsArray[1]);//boulogne
		var pt = guidepostsArray[1].geometry.coordinates;
//		var pos = L.latLng(pt[1],pt[0]);
		var pos = L.GeoJSON.coordsToLatLng(pt);
//		console.log(guidepostsArray[1].geometry.coordinates, pos);//boulogne
		var isHere = bounds.contains(pos);
//		console.log(isHere);
		var nbPts = 0;
		for (var i = 0; i < guidepostsArray.length; i++) {
			var pnt = L.GeoJSON.coordsToLatLng(guidepostsArray[i].geometry.coordinates);
			if (bounds.contains(pnt)) {nbPts++}
		}
		console.log("nbPts ", nbPts);
	}

	function test_json() {
		var js = new L.GeoJSON();
		js.type = "FeatureCollection";
		js.features = [];
		var bounds = map.getBounds();
		var guidepostsArray = guideposts.features;
		var nbPts = 0;
//		console.log(js);
//		console.log(guideposts);
		for (var i = 0; i < guidepostsArray.length; i++) {
			var pnt = L.GeoJSON.coordsToLatLng(guidepostsArray[i].geometry.coordinates);
			if (bounds.contains(pnt)) {
				js.features.push(guidepostsArray[i]);
			}
		}
	guidepostsLayer.clearLayers();
	guidepostsLayer.addData(js);
		console.log(guidepostsLayer);
	guidepostsLayer.eachLayer(function(layer){nbPts++});
		console.log(nbPts);
	}

/*
function test_dist() {
var _dist = distance(circuitRoutes[0][0],circuitRoutes[0][1]);
//console.log(circuitRoutes[0]);
var _totalDist = total_dist(circuitRoutes[0]);
//console.log("total_dist ", total_dist(circuitRoutes[0]));
info_status.innerHTML = "longueur calculée : "+ _totalDist.toFixed(2) + " km";
}

function total_dist(_circuitRoute) {
  var _totalDist = 0;
  var latLng1; 
  var latLng2;
  for (var i = 1; i < _circuitRoute.length; i++) {
	var loc_dist = distance(_circuitRoute[i-1], _circuitRoute[i]);
	_totalDist += loc_dist;
  }
	return _totalDist / 1000;
}

function distance(pt1, pt2) {
	var latLng1 = L.latLng(pt1[1], pt1[0]);
	var latLng2 = L.latLng(pt2[1], pt2[0]);
	var dist = latLng2.distanceTo(latLng1);
	return dist;
}
*/

}

