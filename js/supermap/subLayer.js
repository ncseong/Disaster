function init(){
  getLayersInfo();
}

function show(){
  $("#popupWin").css("display", "block");
}
function getLayersInfo() {
  //Get the map state parameter: url, required
  var getLayersInfoService = new SuperMap.REST.GetLayersInfoService(url);
  getLayersInfoService.events.on({ "processCompleted": getLayersInfoCompleted});
  getLayersInfoService.processAsync();
}

//The interaction with sublayer is successful, which can get the information of the sublayer
var subLayers = new Array();
function getLayersInfoCompleted(getLayersInfoEventArgs) {
  if (getLayersInfoEventArgs.result) {
    {
      if (getLayersInfoEventArgs.result.subLayers) {
        for (var j = 0; j < getLayersInfoEventArgs.result.subLayers.layers.length; j++) {
          subLayers.push(getLayersInfoEventArgs.result.subLayers.layers[j]);
        }
      }
    }
  }
  installPanel(subLayers);
}

//Assemble the operation panel, display the sublayer list and initialize the map display
function installPanel(subLayers) {
  var layersList = "";
  for (var i = 0; i < subLayers.length; i++) {
    if (eval(subLayers[i].visible) == true) {
      layersList += '<label class="checkbox" style="line-height: 28px; display: block"><input type="checkbox" class = "checkboxSel" id="layersList' + i + '" name="layersList" value="' + subLayers[i].name + '" checked=true title="Visible" />' + subLayers[i].name + '</label>';
    }
    else {
      layersList += '<label class="checkbox" style="line-height: 28px; display: block"><input type="checkbox" class = "checkboxSel" id="layersList' + i + '" name="layersList" value="' + subLayers[i].name + '" title="Visible" />' + subLayers[i].name + '</label>';
    }
  }
  showWindow(layersList);
  $(".checkbox").click(setLayerStatus);

  //The structure setting whose style is BootStrap
  $(".checkbox").hover(function () {
    $(this).addClass("label-success");
  }, function () {
    $(this).removeClass("label-success");
  });
  createTempLayer();
}

//Create a temporary layer to initialize the display of the current map
function createTempLayer() {
  //Sublayer controlling parameter(required):url, mapName and SetLayerStatusParameters
  var layerStatusParameters = new SuperMap.REST.SetLayerStatusParameters();
  layerStatusParameters = getLayerStatusList(layerStatusParameters);

  var setLayerStatusService = new SuperMap.REST.SetLayerStatusService(url);
  setLayerStatusService.events.on({ "processCompleted": createTempLayerCompleted});
  setLayerStatusService.processAsync(layerStatusParameters);
}

//Get the state information of the current map's sublayer
function getLayerStatusList(parameters) {
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
}

//The interaction with the server is successful
function createTempLayerCompleted(createTempLayerEventArgs) {
  tempLayerID = createTempLayerEventArgs.result.newResourceID;

  //Create a map control
  map = new SuperMap.Map("map", {controls: [
    new SuperMap.Control.ScaleLine(),
    new SuperMap.Control.Zoom(),
    new SuperMap.Control.Navigation({
      dragPanOptions: {
        enableKinetic: true
      }
    })]
  });

  //Create a TiledDynamicRESTLayer
  layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url, {transparent: true, cacheEnabled: false, redirect: true, layersID: tempLayerID}, {maxResolution: "auto", bufferImgCount: 0});
  layer.bufferImgCount = 0;
  layer.events.on({"layerInitialized": addLayer});
}

function addLayer() {
  var center = new SuperMap.LonLat(104.13461538461, 32.692307692308);
  map.addLayers([layer]);
  map.setCenter(center, 1);
}

//Sublayer visibility control
function setLayerStatus() {
  //Way 1: Control the sublayer by sending the controlling parameter of the sublayer (Not recommended)
  //Sublayer controlling parameter(required): url, mapName and SetLayerStatusParameters
  // var layerStatusParameters = new SuperMap.REST.SetLayerStatusParameters();
  // layerStatusParameters = getLayerStatusList(layerStatusParameters);
  // layerStatusParameters.resourceID = tempLayerID;
  // var setLayerStatusService = new SuperMap.REST.SetLayerStatusService(url);
  // setLayerStatusService.events.on({ "processCompleted": setLayerStatusCompleted});
  // setLayerStatusService.processAsync(layerStatusParameters);


  //Way2: Control the visibility of the sublayer by layersID of TiledDynamicRESTLayer (recommended)
  var layersList = document.getElementsByName("layersList");
  var str = "[0:";
  for (var i = 0; i < layersList.length; i++){
    if(eval(layersList[i].checked) == true)
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
  layer.params.layersID = str;
  layer.redraw();

}

//Interact with the server successfully, and modify the visibility of the sublayer of the temporary layer
function setLayerStatusCompleted(setLayerStatusEventArgs) {
  //Refresh and display the temporary layer
  layer.redraw();
}

function showWindow(winMessage) {
  if(document.getElementById("popupWin")) {
    $("#popupWin").css("display", "block");
  } else {
    $("<div id='popupWin'></div>").addClass("popupWindow").appendTo($("#result"));
  }
  $("#popupWin").css("display", "none");
  var str = "";
  str += '<div class="winTitle" onMouseDown="startMove(this,event)" onMouseUp="stopMove(this,event)"><span class="title_left">World Sublayer</span><span class="title_right"><a href="javascript:closeWindow()" title="Close">Close</a></span><br style="clear:right"/></div>'; //Title

  str += '<div class="winContent" style="overflow-y:auto;height:400px;">';
  str += winMessage;
  str += '</div>';
  $("#popupWin").html(str);
  document.getElementById("popupWin").style.width = "250px";
  document.getElementById("popupWin").style.height = "432px";
}
window.closeWindow = function(){
  $("#popupWin").css("display", "none");
}
window.startMove = function(o,e){
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
};
window.stopMove = function(o,e){
  document.documentElement.onmousemove = null;
}
</script>
</head>
<body onload="init()">
<div id='result' class='container'></div>
<div id="toolbar">
<input type="button" value="Sublayer Control" onclick="show()" />
</div>
<div id="map"></div>
</body>
</html>
