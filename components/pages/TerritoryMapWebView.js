import React from 'react';
import { FlatList, WebView, Platform, Text, View } from 'react-native';
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import { MapView } from "expo";

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';
import NavigationService from '../common/nav-service';

import Heading from '../elements/Heading';
import Loading from '../elements/Loading';
import {Link, ButtonLink, ButtonHeader} from '../elements/Button';
import Notice from '../elements/PopupNotice';

import style, {colors} from '../styles/main';

export default class TerritoryMapWebView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: Language.translate('Territory Map'),
      headerRight: (<View />), // To center on Andriod
    }
  } 
  render() {
    const isAndroid= Platform.OS==='android';
    // const uri = isAndroid?'file:///assets/map-view-web-page.html':'./assets/map-view-web-page.html';
    const html = require('../../assets/map-view-web-page.html');
    return (
      <WebView
        // source={{uri}}
        // source={{html: ``}}
        source={html}
        geolocationEnabled={true}
        // injectJavaScript={() => alert(1)}
        // injectedJavaScript="alert(1);"
        onError={() => console.log('onError')}
        onLoadEnd={() => console.log('onLoadEnd')}
        onLoadStart={() => console.log('onLoadStart')}
        onLoad={() => console.log('onLoad')}
        // style={{marginTop: 20}}
      />
    );
  }

}

const MapFn = {
  init() {
    const apiKey = siteSettings('GOOGLE_API_KEY');
    const apiUrl = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=drawing,geometry&v=3.30&language=en'; 
    setTimeout(() => {
      UTILS.loadExternalScript(apiUrl, 'google')
      .then(Res => {
        this.GA = Res;
        this.GAIsLoaded = true
      })
    }, 5000)
  },
  GA: null, // Google Api
  map: null,
  infowindow: null,
  terrCoordinates: null,
  boundary: null,
  colors: {
    orange: '#fb8c00',
    orangeLite: '#FFE8CE',
    coolBlue: '#337ab7',
    coolBlueTrans: '#337ab74d',
    greenGo: '#88f55f',
    dullGrey: '#e7e7e7'
  },
  initializeMap: (el, mapdata, boundaries) => {            
    const centerLatlng = new this.GA.maps.LatLng(mapdata[0].lat, mapdata[0].long);
    const mapOptions = {
      zoom: 18,
      center: centerLatlng
    }
    this.map = new this.GA.maps.Map(el, mapOptions);
    
    // Add boundaries 	
    this.boundary = [];
    this.infowindow = new this.GA.maps.InfoWindow();
    let bounds = new this.GA.maps.LatLngBounds();
    let savedPoly = boundaries; 
    if(savedPoly == '[]') savedPoly = '';
    
    // Construct the polygon
    this.terrCoordinates = new this.GA.maps.Polygon({
      strokeColor: this.colors.orange,
      strokeWeight: 5,
      fillColor: this.colors.orangeLite,
      fillOpacity: 0.5,
      editable: false,
      zIndex: 1
    });
    
    // now fit the map to the newly inclusive bounds
    if(savedPoly) {
      this.boundary = JSON.parse(savedPoly);
      this.terrCoordinates.setPaths(this.boundary);      
      this.terrCoordinates.getPath().forEach(function(Latlng, number) {
        bounds.extend(Latlng);
      });
      this.map.fitBounds(bounds);
    }	
    this.terrCoordinates.setMap(this.map);
      
    // Add Markers 
    var markers = mapdata;
    var m = 0;
    for(m=0; m<markers.length; m++) {
      // console.log('markers[m]', markers[m])
      markers[m].myLatlng = new this.GA.maps.LatLng(mapdata[m].lat, mapdata[m].long);
      var markerColor = this.GA.maps.geometry.poly.containsLocation(markers[m].myLatlng, this.terrCoordinates) ? 'blue' : 'red';
      var title = markers[m].name || ''; // `${(markers[m].name ? UTILS.diacritics(markers[m].name) : '')} ${UTILS.getListingAddress(markers[m])}`;
      markers[m].marker = this.createMarker(this.map, markers[m], title, markerColor);
      bounds.extend(markers[m].myLatlng);
      const theApp = this;
      const markerData = markers[m];
      markers[m].marker.addListener('click', function(e) {
        // var title = `${(markerData.name ? UTILS.diacritics(markerData.name) : '')} ${UTILS.getListingAddress(markerData)}`;
        var content = `<div><h3>${(markerData.name ? UTILS.diacritics(markerData.name) : '')}</h3> 
          <h3>${UTILS.getListingAddress(markerData)}</h3> 
          <p style="${theApp.getLatestNoteStatusStyle(markerData)}">${theApp.getLatestNotes(markerData) || Language.translate('Add Notes')}</p></div>`;
        // console.log('content', content);
        theApp.infowindow.setContent(content);
        theApp.infowindow.setPosition(markerData.myLatlng);
        theApp.infowindow.open(theApp.map);
      }.bind(markerData));
    }

    this.map.fitBounds(bounds);
  },
  
  createMarker: (map, data, title, markerColor) => {
    return new this.GA.maps.Marker({
      position: new this.GA.maps.LatLng(data.lat, data.long),
      map: map,
      title: title,
      id: data.id,
      animation: this.GA.maps.Animation.DROP,
      icon: {
        path: this.GA.maps.SymbolPath.CIRCLE,
        fillColor: this.getLatestNoteStatusColor(data, markerColor),
        fillOpacity: .62,
        strokeColor: 'white',
        strokeWeight: 2.5,
        scale: 10
      }
    });
  },

  getLatestNotes: (data) => {
    return data.notes && data.notes[0] && (data.notes[0].note + ' - ' + data.notes[0].date);
  },

  getLatestNotesStatus: (data) => {
    const note = (data.notes && data.notes[0] && data.notes[0].note) || '';
    if (!note) return 'new';

    const noteStr = note.trim().toUpperCase();
    return notesStatus[noteStr] || 'status-all';
  },

  getLatestNoteStatusColor: (data, defaultColor) => {
    const status = this.getLatestNotesStatus(data);
    switch(status) {
      case 'absent' :
      case 'busy' :
      case 'new' :
        return this.colors.greenGo;
      default :
        return defaultColor || this.colors.dullGrey;
    }
  },

  getLatestNoteStatusStyle: (data) => {
    return 'padding: 3px 5px; background: ' + this.getLatestNoteStatusColor(data) + ';';
  }
}