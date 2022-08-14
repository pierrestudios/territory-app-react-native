const notesStatus = {
  NEW: "new",
  A: "absent",
  O: "busy",
  ABSAN: "absent",
  ABSENT: "absent",
};

const MapFn = {
  container: null,
  GA: null,
  map: null,
  infowindow: null,
  terrCoordinates: null,
  boundary: null,
  colors: {
    orange: "#fb8c00",
    orangeLite: "#FFE8CE",
    coolBlue: "#337ab7",
    coolBlueTrans: "#337ab74d",
    greenGo: "#88f55f",
    dullGrey: "#e7e7e7",
  },
  diacritics: function (str) {
    return str;
  },
  getListingAddress: function (list) {
    if (list.isApt) return list.building + ", " + list.address;
    if (list.apt) return list.address + " " + list.streetName + " " + list.apt;
    return list.address + " " + list.streetName;
  },
  initializeMap: function (mapdata, boundaries) {
    var centerLatlng = new MapFn.GA.maps.LatLng(
      mapdata[0].lat,
      mapdata[0].long
    );
    var mapOptions = {
      zoom: 18,
      center: centerLatlng,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControlOptions: {
        mapTypeIds: ["ROADMAP"], // Options: SATELLITE, TERRAIN, HYBRID
      },
    };
    MapFn.map = new MapFn.GA.maps.Map(MapFn.container, mapOptions);
    MapFn.boundary = [];
    MapFn.infowindow = new MapFn.GA.maps.InfoWindow();
    MapFn.terrCoordinates = new MapFn.GA.maps.Polygon({
      strokeColor: MapFn.colors.orange,
      strokeWeight: 5,
      fillColor: MapFn.colors.orangeLite,
      fillOpacity: 0.5,
      editable: false,
      zIndex: 1,
    });

    let bounds = new MapFn.GA.maps.LatLngBounds();
    let savedPoly = boundaries;
    if (savedPoly == "[]") {
      savedPoly = "";
    }

    if (savedPoly) {
      MapFn.boundary =
        typeof savedPoly === "object" ? savedPoly : JSON.parse(savedPoly);
      MapFn.terrCoordinates.setPaths(MapFn.boundary);
      MapFn.terrCoordinates.getPath().forEach(function (Latlng, number) {
        bounds.extend(Latlng);
      });
      MapFn.map.fitBounds(bounds);
    }

    MapFn.terrCoordinates.setMap(MapFn.map);
    var markers = mapdata;
    for (var m = 0; m < markers.length; m++) {
      markers[m].myLatlng = new MapFn.GA.maps.LatLng(
        mapdata[m].lat,
        mapdata[m].long
      );
      var markerColor = MapFn.GA.maps.geometry.poly.containsLocation(
        markers[m].myLatlng,
        MapFn.terrCoordinates
      )
        ? "blue"
        : "red";
      var title = markers[m].name || "";
      markers[m].marker = MapFn.createMarker(
        MapFn.map,
        markers[m],
        title,
        markerColor
      );

      // Note: Disable extending boundaries from markers
      // This is causing new addresses to cause too wide a boundary
      // bounds.extend(markers[m].myLatlng);
      var markerData = markers[m];

      markers[m].marker.addListener(
        "click",
        function (e) {
          // var title = `${(markerData.name ? UTILS.diacritics(markerData.name) : '')} ${UTILS.getListingAddress(markerData)}`;
          var content =
            "<div><h3>" +
            (this.name ? MapFn.diacritics(this.name) : "") +
            "</h3>" +
            "<h3>" +
            MapFn.getListingAddress(this) +
            "</h3>" +
            '<p style="' +
            MapFn.getLatestNoteStatusStyle(this) +
            '">' +
            MapFn.getLatestNotes(this) +
            "</p>" +
            "</div>";
          MapFn.infowindow.setContent(content);
          MapFn.infowindow.setPosition(this.myLatlng);
          MapFn.infowindow.open(MapFn.map);
        }.bind(markerData)
      );
    }

    MapFn.map.fitBounds(bounds);
  },
  createMarker: (map, data, title, markerColor) => {
    return new MapFn.GA.maps.Marker({
      position: new MapFn.GA.maps.LatLng(data.lat, data.long),
      map: map,
      title: title,
      id: data.id,
      animation: MapFn.GA.maps.Animation.DROP,
      icon: {
        path: MapFn.GA.maps.SymbolPath.CIRCLE,
        fillColor: MapFn.getLatestNoteStatusColor(data, markerColor),
        fillOpacity: 0.62,
        strokeColor: "white",
        strokeWeight: 2.5,
        scale: 10,
      },
    });
  },
  getLatestNotes: (data) => {
    return (
      data.notes &&
      data.notes[0] &&
      data.notes[0].note + " - " + data.notes[0].date
    );
  },
  getLatestNotesStatus: (data) => {
    var note = (data.notes && data.notes[0] && data.notes[0].note) || "";
    if (!note) return "new";

    var noteStr = note.trim().toUpperCase();
    return notesStatus[noteStr] || "status-all";
  },
  getLatestNoteStatusColor: (data, defaultColor) => {
    var status = MapFn.getLatestNotesStatus(data);
    switch (status) {
      case "absent":
      case "busy":
      case "new":
        return MapFn.colors.greenGo;
      default:
        return defaultColor || MapFn.colors.dullGrey;
    }
  },
  getLatestNoteStatusStyle: (data) => {
    return (
      "padding: 3px 5px; background: " +
      MapFn.getLatestNoteStatusColor(data) +
      ";"
    );
  },
};

export default MapFn;
