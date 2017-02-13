$(document).ready(function() {
  $('#tool').hide();

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
    $('#tool').toggle();
  });
});
