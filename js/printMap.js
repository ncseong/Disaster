var printMap = {
  createPrintMap: function(id) {
    var broz = SuperMap.Browser.name;
		if(broz == 'msie' && parseInt(SuperMap.Browser.version) < 9){
        alert("IE 9 버전 이상에서만 실행 가능합니다.");
			return;
		}
		var printWindow = window.open("");
		var strInnerHTML = document.getElementById(id).innerHTML;

		var strHeader = "<!DOCTYPE html><html><head><META HTTP-EQUIV='pragma' CONTENT='no-cache'><META HTTP-EQUIV='Cache-Control' CONTENT='no-cache, must-revalidate'><META HTTP-EQUIV='expires' CONTENT='Wed, 26 Feb 1997 08:21:57 GMT'><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' /><meta name='apple-mobile-web-app-capable' content='yes' /><title>Map Print</title>";
    var strCSS = "<link href='./css/print-style.css' rel='stylesheet'><link href='./css/sm-doc.css' rel='stylesheet' /><link href='./css/style.css' rel='stylesheet' />";
    var strScript = "<script src='./js/jquery-1.7.1.js'><\/script><script type = 'text/javascript'>" + "\n" + "function printDiv(){$('.newuiPrint').css({'display':'none'});window.print();$('.newuiPrint').css({'display':'block'});}<\/script>";
		var strBody = "</head><body><div class='print-header'><div id='"+id+"' >" + strInnerHTML + "</div><div id='superft'><div class='printClose'>" + "<span class='newuiPrint' onclick = 'printDiv()'></span></div></div></div></body></html>";
    var strHTML = strHeader + strCSS + strScript + strBody;

		printWindow.document.write(strHTML);
		printWindow.document.close();

    function onloadHTML(){
  			var strDOM = printWindow.document.getElementById(id).children[0].children;
  			for(var i = 0, length = strDOM.length; i < length ; i++){
  				var idStr = strDOM[i].id;
  				if(idStr.indexOf("SuperMap.Control.ScaleLine") == -1 && idStr.indexOf("SuperMap.Map") == -1){
  					strCss = strDOM[i].style.cssText;
  					strCss = strCss + "display: none;";
  					strDOM[i].style.cssText = strCss;
  				}
  			}

  			var canvasPrint = printWindow.document.getElementsByTagName("canvas");
  			var canvasMap = document.getElementsByTagName("canvas");
  			for(var i = 0,length = canvasPrint.length;i< length;i++){
  				printMap.pasteCanvas(canvasMap[i],canvasPrint[i]);
  			}
  		}
  		if (broz == 'firefox') {
  			printWindow.onload = onloadHTML;
  		} else if (broz == 'safari'||broz == 'chrome'||broz == 'msie') {
  			window.setTimeout(onloadHTML,50);
  		}
    },
    pasteCanvas: function(sCanvas/*source*/,dCanvas/*destination*/) {
			var w=sCanvas.width,
					h=sCanvas.height;
			dCanvas.width=w;
			dCanvas.height=h;
			var viewerImageSrc=sCanvas.toDataURL("image/png");
			var viewerImage=new Image();
			viewerImage.src=viewerImageSrc;
			var dContext=dCanvas.getContext("2d");
			dContext.drawImage(viewerImage,0,0,w,h);
		}
};
