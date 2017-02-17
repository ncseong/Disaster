var measureFunc = {
  measureLine: null,
  measurePolygon: null,
  isMeasureLineOn: false,
  isMeasurePolygonOn: false,
  PolygonLayerArray: [],
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
                    strokeOpacity: 0.7,
                    strokeColor: "#ff0000"
                },
                "Polygon": {
                    strokeWidth: 3,
                    strokeOpacity: 0.7,
                    strokeColor: "#ff0000",
                    fillColor: "#ff0000",
                    fillOpacity: 0.3
                }
            }
          })]
      })
  }),
  addMeasureControls: function() {
    measureFunc.measureLine = new SuperMap.Control.Measure(SuperMap.Handler.SmcPathMeasure, {
        id: "distance",
        persist: true,
        geodesic: true,
        handlerOptions: {
            multiLine: true,
            movePopup: true,
            persistControl: true,
            layerOptions: {
                styleMap: measureFunc.measureStyleMap
            }
        },
        type: SuperMap.Control.TYPE_TOOL
    });
    measureFunc.measureLine.events.on({
      "measure": measureFunc.handleMeasure,
      "measurepartial": measureFunc.handleMeasurements,
      "featureadded": measureFunc.handleMeasure
    });

    measureFunc.measurePolygon = new SuperMap.Control.Measure(SuperMap.Handler.SmcPolygonMeasure, {
        id: "area",
        persist: true,
        geodesic: true,
        handlerOptions: {
            multiLine: true,
            movePopup: true,
            persistControl: true,
            layerName: "BiesPolygonMeasure",
            layerOptions: {
                styleMap: measureFunc.measureStyleMap
            }
        },
        type: SuperMap.Control.TYPE_TOOL
    });
    measureFunc.measurePolygon.events.on({
      "measure": measureFunc.handleMeasure,
      "measurepartial": measureFunc.handleMeasurements,
      "featureadded": measureFunc.handleMeasure
    });

    init.map.addControl(measureFunc.measureLine);
    init.map.addControl(measureFunc.measurePolygon);

    // measureFunc.measureLine.setImmediate(alert("d"));
  },
  handleMeasure: function(event) {
    console.log(event);
    var geometry = event.geometry;
    // console.log(geometry);
  },
  handleMeasurements: function(event) {
    // console.log(event);
    var geometry = event.geometry;
    console.log(geometry);
  }
};
