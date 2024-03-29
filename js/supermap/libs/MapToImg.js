(function(){
    var PrintMap = {};
    var LAYER_COUNT = 0;
    var LAYER_LENGTH = 0;
    window.MapToImg = PrintMap;

    PrintMap.excute = function(){
      map = init.map;
      console.log(map);
        var canvas = document.createElement("canvas");
        var broz = SuperMap.Browser.name;
        // if(!canvas.getContext||(broz=='msie'&&!canvas.msToBlob)){
        //     alert("Your browser version is too low, please upgrade.");
        //     return;
        // }
        LAYER_COUNT = 0;

        var layers = map.layers.concat([]);

        //layers order. Put the markers to the top
        var layers1 = [];
        for(var i=0;i<layers.length;i++){
            if(layers[i].CLASS_NAME == "SuperMap.Layer.Markers"){
                var templayer = layers.splice(i,1);
                layers1.push(templayer[0]);
            }
        }
        layers = layers.concat(layers1);

        LAYER_LENGTH = layers.length;
        var imgUrls = [];
        for(var i=0;i<layers.length;i++){
            var layer = layers[i];
            if(layer.CLASS_NAME == "SuperMap.Layer.TiledDynamicRESTLayer"){
                if(layer.useCanvas==false){
                    draw(getImgLayerData(layer,map),i,imgUrls);
                }
                else{
                    draw(getCanvasLayerData(layer),i,imgUrls);
                }
            }
            else if(layer.CLASS_NAME == "SuperMap.Layer.Markers"){
                draw(getImgLayerData(layer,map),i,imgUrls);
            }
            else if(layer.CLASS_NAME == "SuperMap.Layer.Vector"){
                getVectorLayerData(layer,map,function(imgUrls,i){
                    return function(img){
                        draw(img,i,imgUrls);
                    }
                }(imgUrls,i))
            }
        }
    }

    function draw(img,i,imgUrls){
        imgUrls[i] = img;
        LAYER_COUNT++;

        if(LAYER_COUNT>=LAYER_LENGTH){
            var canvas = document.createElement("canvas");
            var size = init.map.getSize();
            canvas.height = size.h;
            canvas.width = size.w;
            var ctx = canvas.getContext("2d");

            canvas.style.position = "relative";
            canvas.style.border = "1px solid #4c4c4c";

            //document.body.appendChild(canvas);

            var panel = document.createElement("div");

            panel.style.position = "absolute";
            panel.style.left = "0px";
            panel.style.top = "0px";
            panel.style.height = "100%";
            panel.style.width = "100%";
           // panel.style.background = "#e6e8eb";
            panel.style.background = "#ffffff";
            document.body.appendChild(panel);


            var buttonPanel = document.createElement("div");
            buttonPanel.style.position = "relative";
            panel.appendChild(buttonPanel);
            panel.appendChild(canvas);

            window.setTimeout(function(){
                for(var i=0;i<imgUrls.length;i++){
                    ctx.drawImage(imgUrls[i],0,0);
                }

                if(canvas.msToBlob){
                    var button = document.createElement("input");
                    buttonPanel.appendChild(button);
                    button.type = "button";
                    button.value = "Save";

                    button.onclick = function(){
                        window.navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
                    }
                }
                else{
                    var aa = document.createElement("a");
                    buttonPanel.appendChild(aa);
                    aa.target = "_blank";
                    aa.download="map.png";
                    aa.href=canvas.toDataURL();

                    var button = document.createElement("input");
                    aa.appendChild(button);
                    button.type = "button";
                    button.value = "Save";
                }

                var button = document.createElement("input");
                buttonPanel.appendChild(button);
                button.type = "button";
                button.value = "Close";
                button.onclick = function(){
                    document.body.removeChild(panel);
                }
            },30);
        }
    }
    //Capture image layer
    function getImgLayerData(layer,map){
        var div = layer.div;
        var pdiv = div.parentNode;
        var offsetX =  parseInt(pdiv.style.left.replace(/px/,""));
        var offsetY =  parseInt(pdiv.style.top.replace(/px/,""));

        var canvas = document.createElement("canvas");
        var size = map.getSize();
        canvas.height = size.h;
        canvas.width = size.w;
        var ctx = canvas.getContext("2d");

        canvas.style.position = "absolute";
        canvas.style.left = "5px";
        canvas.style.top = "600px";
        canvas.style.border = "1px solid #f00";

        //document.body.appendChild(canvas);

        var divs = div.getElementsByTagName("div");
        for(var i=0;i<divs.length;i++){
            var div1 = divs[i];
            if(div1.style.display!="none"){
                var left = parseInt(div1.style.left.replace(/px/,""));
                var top = parseInt(div1.style.top.replace(/px/,""));
                var img = div1.getElementsByTagName("img")[0];
                var imgWidth = img.style.width;
                var imgHeight = img.style.height;
                var imgW = null,imgH = null;
                if(imgWidth!=null||imgWidth!=""){
                    imgW = parseInt(imgWidth.replace(/px/,""));
                }
                if(imgHeight!=null||imgHeight!=""){
                    imgH = parseInt(imgHeight.replace(/px/,""));
                }
                if(imgW!=null&&imgH!=null){
                    ctx.drawImage(img,left+offsetX,top+offsetY,imgW,imgH);
                }
                else{
                    ctx.drawImage(img,left+offsetX,top+offsetY);
                }
            }
        }

        var img = new Image();
        img.crossOrigin = "*";
        // console.log(canvas.toDataURL("image/png"));
        // img.src = canvas.toDataURL("image/png");
        console.log(canvas);

        console.log(img);
        return img;
    }
    //Capture canvas layer
    function getCanvasLayerData(layer){
        var div = layer.div;
        var canvas0 = div.getElementsByTagName("canvas")[0];
        var img = new Image();
        img.crossOrigin = "*";
        img.src = canvas0.toDataURL("image/png");

        return img;
    }
    //Capture vector layer
    function getVectorLayerData(layer,map,callback){
        var printLayer = new SuperMap.Layer.Vector("PRINT_LAYER",{visibility:true,renderers:["Canvas"]});
        var features1 = [];
        var features = layer.features;
        for(var j=0;j<features.length;j++){
            var feature = features[j];

            var feature1 = new SuperMap.Feature.Vector();
            if (feature.geometry) {
              feature1.geometry = feature.geometry.clone();
            }
            feature1.style = feature.style;

            features1.push(feature1);
        }
        if(layer.style){
            printLayer.style = layer.style;
        }

        printLayer.setOpacity(0);
        printLayer.addFeatures(features1);
        map.addLayer(printLayer);


        window.setTimeout(function(printLayer,map,callback){
            return function(){
                var div = printLayer.div;
                var canvas1 = div.getElementsByTagName("canvas")[0];
                var cxt1 = canvas1.getContext("2d");

                map.removeLayer(printLayer);
                printLayer.destroy();

                var img = new Image();
                img.crossOrigin = "*";
                img.src = canvas1.toDataURL("image/png");

                callback(img);
            };
        }(printLayer,map,callback),30);
    }
})();
