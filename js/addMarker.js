var markers = {
  markerLayer: null,
  addMarker: function() {
    markers.markerLayer = new SuperMap.Layer.Markers("markerLayer");
    markers.addData();
  },
  addData: function() {
    var size = new SuperMap.Size(28,33);
    var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
    var icon = new SuperMap.Icon('images/here3.png', size, offset);
    marker =new SuperMap.Marker(new SuperMap.LonLat(14409438.5611, 4400366.9779),icon) ;
    markers.markerLayer.addMarker(marker);
    init.map.addLayer(markers.markerLayer);
  }
};
