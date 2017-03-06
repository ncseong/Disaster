var urls = {
  baseMap: 'http://61.32.6.18:9090/iserver/services/vworld/rest/maps/OSM',
  // baseMap: 'http://localhost:9090/iserver/services/vworld/rest/maps/OSM',
  // testMap: 'http://61.32.6.18:8090/iserver/services/map-dev_test2/rest/maps/재난연_테스트_2'
  testMap: 'http://61.32.6.18:9090/iserver/services/map-dev_test2/rest/maps/재난연_테스트_2'
};
var init = {
  map: null,
  baseLayer: null,
  testLayer: null,
  measureLayer: null,
  style: {
    strokeColor: "#304DBE",
    strokeWidth: 2,
    pointerEvents: "visiblePainted",
    fillColor: "#304DBE",
    fillOpacity: 0.8
  },
  initMap: function(createTempLayerEventArgs) {
    // var tempLayerID = createTempLayerEventArgs.result.newResourceID;
    var tempLayerID = "";

    // 거리 선 레이어
    init.measureLayer = new SuperMap.Layer.Vector("measureLayer", {
        styleMap: new SuperMap.StyleMap({'default':{
            strokeColor: "#00FF00",
            strokeOpacity: 1,
            strokeWidth: 3,
            fillColor: "#FF5500",
            fillOpacity: 0.5,
            pointRadius: 6,
            pointerEvents: "visiblePainted",
            label : "eeee",
            // label : "${txt}",
            fontColor: "blue",
            fontSize: "50px",
            fontFamily: "Courier New, monospace",
            fontWeight: "bold",
            // labelAlign: "${align}",
            // labelXOffset: "${xOffset}",
            // labelYOffset: "${yOffset}",
            labelOutlineColor: "white",
            labelOutlineOpacity: 0.2,
            labelOutlineWidth: 3
        }}),
        renderers: ["SVG"]
    });

    init.map = new SuperMap.Map("map",{
      displayProjection: 'EPSG:4326',
      // projection: 'EPSG:4326',
      // maxExtent: new SuperMap.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
      controls:[
      new SuperMap.Control.ScaleLine(),
      new SuperMap.Control.MousePosition(),
      new SuperMap.Control.ZoomBox(),
      new SuperMap.Control.DragPan(),
      new SuperMap.Control.Navigation({
          dragPanOptions: {
          enableKinetic: true
        }
      }),
      new SuperMap.Control.PanZoomBar({
        showSlider: true, //Whether to display the slider. Default is false
        slideRatio: 0.5,
        sliderBarHeight: 150, //Set the height of the slider. Default is 120
        sliderBarWidth: 17, //Set the width of the slider. Default is 13
        showCompass: false
      })
    ]});

    // 배경지도 레이어
    // init.baseLayer = new SuperMap.Layer.VWorldLayer("기본지도");
    // init.baseLayer.url = ['http://xdworld.vworld.kr:8080/2d/Base/201512/${z}/${x}/${y}.png'];
    init.baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("Base Map", urls.baseMap, {
        transparent: true,
        cacheEnabled: false,
        redirect: false
      }, {
        maxResolution:"auto",
        useCanvas: true,
        projection: "EPSG:3857",
        isBaseLayer: true
      }
    );

    // baseLayer 초기화시 testLayer 초기화 (tempLayerID 파라미터 전달)
    init.baseLayer.events.on({"layerInitialized": init.setTestLayer(tempLayerID)});
  },
  setTestLayer: function(tempLayerID) {
    init.testLayer = new SuperMap.Layer.TiledDynamicRESTLayer("Test Map", urls.testMap, {
      transparent: true,
      cacheEnabled: false,
      layersID: tempLayerID,
      redirect: true,
      overlapDisplayed: true
    }, {
      maxResolution:"auto",
      useCanvas: true,
      projection: "EPSG:3857",
      isBaseLayer: false
    });
  init.testLayer.events.on({"layerInitialized": init.addLayer});
  },
  addLayer: function() {
    init.map.addLayers([init.baseLayer, init.testLayer, init.measureLayer]);
    init.map.setCenter(new SuperMap.LonLat(14229438.5611, 4400366.9779), 7);

    // 마커 추가시
    markers.addMarker();
  }
};
