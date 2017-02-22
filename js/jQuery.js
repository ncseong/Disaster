$(document).ready(function() {



  // 마우스 우클릭 방지
  document.addEventListener("contextmenu", function(e){
      e.preventDefault();
  }, false);

  // 넓이 조정
  $('#top-bar').find('ul').css('width',$('#btn_tool').outerWidth());
  // 크롬에서만 먹힘
  // $('#top-bar').find('ul').find('img').css('padding',$('#btn_tool').css('padding'));
  $('#top-bar').find('ul').find('img').css('padding-left',$('#btn_tool').css('padding-left'));
  $('#top-bar').find('img').css('width', $('#btn_tool').width());
  $('#top-bar').find('ul').hide();

  $('#map').css('height',$('#wrapper').height()-40);

  $(window).resize(function(){
    $('#map').css('height',$('#wrapper').height()-40);
  });

  // 마우스오버시 이미지 변경
  $('#top-bar').find('img').hover(function() {
    $(this).attr("src",$(this).attr("src").replace(/off\.gif$/, 'on.gif'));
  }, function() {
    $(this).attr("src",$(this).attr("src").replace(/on\.gif$/, 'off.gif'));
  });

  // 정보표시 클릭시 TOC 토글
  $('#info').click(function() {
    $("#popupWin").toggle();
  });


  // 도구 클릭시 하위메뉴를 보여줌
  $('#btn_tool').click(function() {
    $('#top-bar').find('ul').toggle();
  });

  $('.measureTools').click(function() {
    init.measureLayer.removeAllFeatures();
  });

  // 거리측정 기능
  $('#distanceMeasure').click(function() {
    if (measureFunc.isMeasurePolygonOn === true) {
      measureFunc.measurePolygon.deactivate();
      measureFunc.isMeasurePolygonOn = false;
      $('#areaMeasure').attr("src",$('#areaMeasure').attr("src").replace(/on\.gif$/, 'off.gif'));
    }
    if (measureFunc.isMeasureLineOn === false) {
      measureFunc.addMeasureControls();
      measureFunc.measureLine.activate();
      measureFunc.isMeasureLineOn = true;
      $(this).attr("src",$(this).attr("src").replace(/off\.gif$/, 'on.gif'));
    } else {
      init.measureLayer.removeAllFeatures();
      measureFunc.measureLine.deactivate();
      $(this).attr("src",$(this).attr("src").replace(/on\.gif$/, 'off.gif'));
    }
  });

  $('#areaMeasure').click(function() {
    if (measureFunc.isMeasureLineOn === true) {
      measureFunc.measureLine.deactivate();
      measureFunc.isMeasureLineOn = false;
      $('#distanceMeasure').attr("src",$('#distanceMeasure').attr("src").replace(/on\.gif$/, 'off.gif'));
    }
    if (measureFunc.isMeasurePolygonOn === false) {
      measureFunc.addMeasureControls();
      measureFunc.measurePolygon.activate();
      measureFunc.isMeasurePolygonOn = true;
      $(this).attr("src",$(this).attr("src").replace(/off\.gif$/, 'on.gif'));
    } else {
      measureFunc.measurePolygon.deactivate();
      measureFunc.isMeasurePolygonOn = false;
      $(this).attr("src",$(this).attr("src").replace(/on\.gif$/, 'off.gif'));
    }
  });

  $('#printMap').click(function() {
    printMap.createPrintMap('map');
  });
});
