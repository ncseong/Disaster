var urls = {
  baseMap: 'http://61.32.6.18:9090/iserver/services/vworld/rest/maps/OSM',
  testMap: 'http://61.32.6.18:9090/iserver/services/map-dev_test/rest/maps/재난연_테스트'
};
var init = {
  map: null,
  baseLayer: null,
  testLayer: null,
  subLayers: [],
  initMap: function() {
    this.getLayersInfo();
  },
  getLayersInfo: function() {
    var getLayersInfoService = new SuperMap.REST.GetLayersInfoService(urls.testMap);
    getLayersInfoService.events.on({ "processCompleted": init.getLayersInfoCompleted});
    getLayersInfoService.processAsync();
  },
  getLayersInfoCompleted: function(getLayersInfoEventArgs) {
    if (getLayersInfoEventArgs.result) {
      {
        if (getLayersInfoEventArgs.result.subLayers) {
          for (var j = 0; j < getLayersInfoEventArgs.result.subLayers.layers.length; j++) {
            init.subLayers.push(getLayersInfoEventArgs.result.subLayers.layers[j]);
          }
        }
      }
    }
    init.installPanel(init.subLayers);
  },
  installPanel: function(subLayers) {
    var layersList = "";
    for (var i = 0; i < subLayers.length; i++) {
      if (subLayers[i].visible === true) {
        layersList += '<label class="checkbox" style="line-height: 28px; display: block"><input type="checkbox" class = "checkboxSel" id="layersList' + i + '" name="layersList" value="' + subLayers[i].name + '" checked=true title="Visible" />' + subLayers[i].name + '</label>';
      }
      else {
        layersList += '<label class="checkbox" style="line-height: 28px; display: block"><input type="checkbox" class = "checkboxSel" id="layersList' + i + '" name="layersList" value="' + subLayers[i].name + '" title="Visible" />' + subLayers[i].name + '</label>';
      }
    }
    init.showWindow(layersList);
    $(".checkbox").click(init.setLayerStatus);

    //The structure setting whose style is BootStrap
    $(".checkbox").hover(function () {
      $(this).addClass("label-success");
    }, function () {
      $(this).removeClass("label-success");
    });
    init.createTempLayer();
  },
  setLayerStatus: function() {
    var layersList = document.getElementsByName("layersList");
    var str = "[0:";
    for (var i = 0; i < layersList.length; i++){
      if(layersList[i].checked === true)
      {
        if(i<layersList.length)
        {
          str += i.toString();
        }
        if(i<layersList.length-1)
        {
          str += ",";
        }
      }
    }
    str += "]";
    //When all the layers are invisible
    if(str.length<5)
    {
      str = "[]";
    }
    init.testLayer.params.layersID = str;
    init.testLayer.redraw();
  },
  showWindow: function(winMessage) {
    if(document.getElementById("popupWin")) {
      $("#popupWin").css("display", "block");
    } else {
      $("<div id='popupWin'></div>").addClass("popupWindow").appendTo($("#result"));
    }
    $("#popupWin").css("display", "none");
    var str = "";
    str += '<div class="winTitle" onMouseDown="init.startMove(this,event)" onMouseUp="init.stopMove(this,event)"><span class="title_left">World Sublayer</span><span class="title_right"><a href="javascript:init.closeWindow()" title="Close">Close</a></span><br style="clear:right"/></div>'; //Title
    str += '<div class="winContent" style="overflow-y:auto;height:400px;">';
    str += winMessage;
    str += '</div>';
    $("#popupWin").html(str);
    document.getElementById("popupWin").style.width = "250px";
    document.getElementById("popupWin").style.height = "432px";
  },
  startMove: function(o, e) {
    var wb;
    if(SuperMap.Browser.name === "msie" && e.button === 1) wb = true;
    else if(e.button === 0) wb = true;
    if(wb){
      var x_pos = parseInt(e.clientX-o.parentNode.offsetLeft);
      var y_pos = parseInt(e.clientY-o.parentNode.offsetTop);
      if(y_pos<= o.offsetHeight){
        document.documentElement.onmousemove = function(mEvent){
          var eEvent = (SuperMap.Browser.name === "msie")?event:mEvent;
          o.parentNode.style.left = eEvent.clientX-x_pos+"px";
          o.parentNode.style.top = eEvent.clientY-y_pos+"px";
        };
      }
    }
  },
  stopMove: function(o, e) {
    document.documentElement.onmousemove = null;
  },
  closeWindow: function() {
    $('#popupWin').css('display','none');
  },
  createTempLayer: function() {
    //Sublayer controlling parameter(required):url, mapName and SetLayerStatusParameters
    var layerStatusParameters = new SuperMap.REST.SetLayerStatusParameters();
    layerStatusParameters = init.getLayerStatusList(layerStatusParameters);

    var setLayerStatusService = new SuperMap.REST.SetLayerStatusService(urls.testMap);
    setLayerStatusService.events.on({ "processCompleted": init.createTempLayerCompleted});
    setLayerStatusService.processAsync(layerStatusParameters);
  },
  getLayerStatusList: function(parameters) {
    var layersList = document.getElementsByName("layersList");
    for (var i = 0; i < layersList.length; i++) {
      var layerStatus = new SuperMap.REST.LayerStatus();
      layerStatus.layerName = layersList[i].value;
      layerStatus.isVisible = eval(layersList[i].checked);
      parameters.layerStatusList.push(layerStatus);
    }
    //Set the time that resources are saved at the client, unit is minute, and default is 10
    parameters.holdTime = 30;
    return parameters;
  },
  createTempLayerCompleted: function(createTempLayerEventArgs) {
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
