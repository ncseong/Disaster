// TOC 컨트롤러 시작
var toc = {
  subLayers: [],
  initToc: function() {
    this.getLayersInfo();
  },
  getLayersInfo: function() {
    var getLayersInfoService = new SuperMap.REST.GetLayersInfoService(urls.testMap);
    getLayersInfoService.events.on({ "processCompleted": toc.getLayersInfoCompleted});
    getLayersInfoService.processAsync();
  },
  // Sublayer 리스트를 배열에 담는다
  getLayersInfoCompleted: function(getLayersInfoEventArgs) {
    console.log(getLayersInfoEventArgs);
    if (getLayersInfoEventArgs.result) {
      {
        if (getLayersInfoEventArgs.result.subLayers) {
          for (var j = 0; j < getLayersInfoEventArgs.result.subLayers.layers.length; j++) {
            toc.subLayers.push(getLayersInfoEventArgs.result.subLayers.layers[j]);
          }
        }
      }
    }
    toc.installPanel(toc.subLayers);
  },
  installPanel: function(subLayers) {
    var layersList = "";
    for (var i = 0; i < subLayers.length; i++) {
      if (subLayers[i].visible === true) {
        layersList += '<label class="checkbox" style="line-height: 28px; display: block"><input type="checkbox" class = "checkboxSel" id="layersList' + i + '" name="layersList" value="' + subLayers[i].name + '" checked=true title="Visible" /> <img src="'+ urls.testMap + '/layers/' + subLayers[i].name.replace("#",".") +'@@재난연_테스트/legend" /> ' + subLayers[i].name + '</label>';
      }
      else {
        layersList += '<label class="checkbox" style="line-height: 28px; display: block"><input type="checkbox" class = "checkboxSel" id="layersList' + i + '" name="layersList" value="' + subLayers[i].name + '" title="Visible" /> <img src="'+ urls.testMap + '/layers/' + subLayers[i].name.replace("#",".") +'@@재난연_테스트/legend" /> ' + subLayers[i].name + '</label>';
      }
    }
    toc.showWindow(layersList);
    $(".checkbox").click(toc.setLayerStatus);

    //The structure setting whose style is BootStrap
    $(".checkbox").hover(function () {
      $(this).addClass("label-success");
    }, function () {
      $(this).removeClass("label-success");
    });
    toc.createTempLayer();
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
    str += '<div class="winTitle" onMouseDown="toc.startMove(this,event)" onMouseUp="toc.stopMove(this,event)"><span class="title_left">World Sublayer</span><span class="title_right"><a href="javascript:toc.closeWindow()" title="Close">Close</a></span><br style="clear:right"/></div>'; //Title
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
    layerStatusParameters = toc.getLayerStatusList(layerStatusParameters);

    var setLayerStatusService = new SuperMap.REST.SetLayerStatusService(urls.testMap);
    setLayerStatusService.events.on({ "processCompleted": init.initMap});
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
  }
};
