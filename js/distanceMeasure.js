var measureFunc = {
  measureLine: null,
  measurePolygon: null,
  isMeasureLineOn: false,
  isMeasurePolygonOn: false,
  PolygonLayerArray: [],
  polygonStyle: {
    strokeColor: "#ff0000",
    strokeOpacity: 0.6,
    pointerEvents: "visiblePainted",
    fillColor: "#ff0000",
    fillOpacity: 0.2,
    pointRadius:2
  },
  measureStyleMap: new SuperMap.StyleMap({
    'default': new SuperMap.Style(null, {
        rules: [new SuperMap.Rule({
            symbolizer: {
                "Point": {
                	  pointRadius: 4,
                    graphicName: "square",
                    fillColor: "#ffffff",
                    fillOpacity: 1,
                    strokeWidth: 1,
                    strokeOpacity: 1,
                    strokeColor: "#ff0000"
                },
                "Line": {
                    strokeWidth: 3,
                    strokeOpacity: 0.6,
                    strokeColor: "#ff0000"
                },
                "Polygon": {
                    strokeWidth: 3,
                    strokeOpacity: 0.6,
                    strokeColor: "#ff0000",
                    fillColor: "#ff0000",
                    fillOpacity: 0.2
                }
            }
          })]
      })
  }),
  addMeasureControls: function() {
    measureFunc.measureLine = new SuperMap.Control.Measure(SuperMap.Handler.Path, {
        persist: true,
        geodesic: true,
        handlerOptions: {
            layerOptions: {
                styleMap: measureFunc.measureStyleMap
            }
        }
    });
    measureFunc.measureLine.events.on({
      "measure": measureFunc.handleMeasure,
      "measurepartial": measureFunc.handleMeasurePartial
    });

    measureFunc.measurePolygon = new SuperMap.Control.Measure(SuperMap.Handler.Polygon, {
        persist: true,
        geodesic: true,
        handlerOptions: {
            layerOptions: {
                styleMap: measureFunc.measureStyleMap
            }
        },
        type: SuperMap.Control.TYPE_TOOL
    });
    measureFunc.measurePolygon.events.on({
      "measure": measureFunc.handleMeasure,
      "measurepartial": measureFunc.handleMeasurePartial
    });

    init.map.addControl(measureFunc.measureLine);
    init.map.addControl(measureFunc.measurePolygon);

    // measureFunc.measureLine.setImmediate(alert("d"));
  },
  handleMeasurePartial: function(event) {
    var geometry = event.geometry;
		var units = event.units;
		var order = event.order;
		var measure = event.measure;
    var measureLocaleString = measure.toLocaleString(undefined, {maximumFractionDigits: 3});

    var length = null;
    if (measureFunc.isMeasureLineOn === true) {
      length = geometry.components.length;
    } else {
      length = geometry.components[0].components.length;
    }

		//모든 vertex
		var attributes;
		var label;
		if(length > 2){
			attributes = {"txt":measureLocaleString + " " + units};
			label = measureLocaleString + " " + units;
		} else {
			attributes = {"txt":""};
		}
    var style = {
        strokeOpacity:0,
        fillOpacity: 0,
        fontSize: 20,
        fontColor: "red",
        fontWeight: "bold",
        label: label,
        labelXOffset: 50,
        labelYOffset: -5,
        labelOutlineWidth: 5,
        labelOutlineColor: "white"
    };
		feature = new SuperMap.Feature.Vector(geometry.components[length-1], attributes, style);
		init.measureLayer.addFeatures([feature]);
  },
  handleMeasure: function(event) {
    console.log(event);
    var geometry = null;
		var units = event.units;
		var order = event.order;
		var measure = event.measure;
    var measureLocaleString = measure.toLocaleString(undefined, {maximumFractionDigits: 3});
		var features = [];
		//마지막 vertex
		var attributes;
		var label;

    // 라인 or 폴리곤
    if (measureFunc.isMeasureLineOn === true) {
      geometry = event.geometry;
    } else {
      geometry = event.geometry.components[0];
      units += "²";
    }
    var length = geometry.components.length;

		if(length >= 2){
			attributes = {"txt":measureLocaleString + " " + units};
			label = measureLocaleString + " " + units;
		} else {
			attributes = {"txt":""};
		}
    var style = {
        label: label,
        labelXOffset: 50,
        labelYOffset: -5,
        fontSize: 20,
        fontColor: "red",
        fontWeight: "bold",
        strokeWidth: 3,
        strokeOpacity: 0.6,
        strokeColor: "#ff0000",
        fillColor: "#ff0000",
        fillOpacity: 0.2
    };

    if (measureFunc.isMeasureLineOn === true) {
      features[0] = new SuperMap.Feature.Vector(geometry, attributes, {strokeColor: "#ff0000"});
      features[1] = new SuperMap.Feature.Vector(geometry.components[length-1], attributes, style);
    } else {
      features[0] = new SuperMap.Feature.Vector(geometry, attributes, style);
      features[1] = new SuperMap.Feature.Vector(geometry.components[length-1], attributes, {strokeOpacity: 0});
    }

    init.measureLayer.addFeatures(features);
    console.log(features);
  }
};
