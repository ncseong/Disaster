var distanceMeasure = {
  distanceMeasure: function() {
    distanceMeasure.clearFeatures();
    init.drawLine.activate();
  },
  drawCompleted: function(drawGeometryArgs) {
    //Stop the video control
    init.drawLine.deactivate();
    var geometry = drawGeometryArgs.feature.geometry;
    var measureParam = new SuperMap.REST.MeasureParameters(geometry); /* MeasureParameters: measurement parameter class.*/
    measureParam.prjCoordSys = "EPSG:3857";
    console.log(measureParam);
    var myMeasuerService = new SuperMap.REST.MeasureService(urls.testMap, {
      measureMode: SuperMap.REST.MeasureMode.DISTANCE,
      eventListeners: {
        "processCompleted": distanceMeasure.measureCompleted,
        "processFailed": distanceMeasure.processFailed
      }
    });
    // measureParam.projection = "EPSG:3857";
    // measureParam.projection = "EPSG:3857";

    myMeasuerService.processAsync(measureParam); //processAsync pass the measure parameter to the server side.
  },
  measureCompleted: function(measureEventArgs) {
    var distance = measureEventArgs.result.distance;
    var unit = measureEventArgs.result.unit;
    console.log(distance);
    distanceMeasure.clearFeatures();
  },
  clearFeatures: function() {
    // init.lineLayer.removeAllFeatures();
  },
  processFailed: function(Args) {
    console.log(Args);
  }
};
