var urls = {
  baseMap: 'http://61.32.6.18:9090/iserver/services/vworld/rest/maps/OSM',
  testMap: 'http://61.32.6.18:9090/iserver/services/map-dev_test/rest/maps/재난연_테스트'
};
var init = {
  map: null,
  baseLayer: null,
  testLayer: null,
  initMap: function(createTempLayerEventArgs) {
    var tempLayerID = createTempLayerEventArgs.result.newResourceID;

    init.map = new SuperMap.Map("map",{
      displayProjection: 'EPSG:4326',
      projection: 'EPSG:3857',
      maxExtent: new SuperMap.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
      controls:[
      new SuperMap.Control.ScaleLine(),
      new SuperMap.Control.MousePosition(),
      new SuperMap.Control.Navigation({
          dragPanOptions: {
          enableKinetic: true
        }
      }),
      new SuperMap.Control.PanZoomBar({
        // Whether to fix the zoom level between 0 and 16. Default is false
        // panzoombar.forceFixedZoomLevel = true;
        showSlider: true, //Whether to display the slider. Default is false
        slideRatio: 0.5,
        sliderBarHeight: 150, //Set the height of the slider. Default is 120
        sliderBarWidth: 17, //Set the width of the slider. Default is 13
        showCompass: false
      })
    ]});

    // 배경지도 레이어
    init.baseLayer = new SuperMap.Layer.VWorldLayer("기본지도");
    init.baseLayer.url = ['http://xdworld.vworld.kr:8080/2d/Base/201512/${z}/${x}/${y}.png'];
    init.testLayer = new SuperMap.Layer.TiledDynamicRESTLayer("Test Map", urls.testMap,
      {
        transparent: true,
        cacheEnabled: false,
        layersID: tempLayerID,
        redirect: false
      }, {
        maxResolution:"auto",
        projection: "EPSG:3857",
        isBaseLayer: false
      }
    );

    init.testLayer.events.on({"layerInitialized": init.addLayer});
  },
  addLayer: function() {
    init.map.addLayers([init.baseLayer, init.testLayer]);
    init.map.setCenter(new SuperMap.LonLat(14229438.5611, 4400366.9779), 1);
    $("#popupWin").css("display", "block");
  }
};
