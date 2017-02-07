$(document).ready(function() {
  $('#tool').hide();

  // 마우스오버시 이미지 변경
  $('#area').hover(function() {
    $(this).children("img").attr("src","images/area_on.gif");
  }, function() {
    $(this).children("img").attr("src","images/area_off.gif");
  });
  $('#info').hover(function() {
    $(this).children("img").attr("src","images/info_on.gif");
  }, function() {
    $(this).children("img").attr("src","images/info_off.gif");
  });
  $('#btn_tool').hover(function() {
    $(this).children("img").attr("src","images/btn_tool_on.gif");
  }, function() {
    $(this).children("img").attr("src","images/btn_tool_off.gif");
  });

  // 정보표시 클릭시 TOC 토글
  $('#info').click(function() {
    $("#popupWin").toggle();
  });

  // 도구 클릭시 하위메뉴를 보여줌
  $('#btn_tool').click(function() {
    $('#tool').toggle();
  });
});
