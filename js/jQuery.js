$(document).ready(function() {
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
});
