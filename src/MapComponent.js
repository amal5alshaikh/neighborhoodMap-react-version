import React, { Component } from 'react';
import {map_style} from './map_style.js'
import scriptLoader from 'react-async-script-loader'
import './App.css'
import $ from 'jquery';


class MapComponent extends Component {


    state = {
      map : {},
      markers:[],
      infoWindows: [],
      data:[]
    }


    componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
      if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
        if (isScriptLoadSucceed) {
        //Creating the Map
        const map = new window.google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          //Giving an initial locaiton to start
          center: new window.google.maps.LatLng(43.6425701,-79.3892455),
          styles: map_style
        });
        this.setState({map:map});

        }

        else this.props.onError()

      }
    }


    componentDidMount = () => {
      this.apiCall();
    }

    apiCall() {
      let self = this;
      this.props.locations.map((location,index)=>  {
      var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

      $.getJSON(
        flickerAPI,
        {tags: location.title,format: "json"}).done(function( data ) {
          self.state.data.push(data.items[6]);

    });
  })
  }



    componentDidUpdate = () => {
        this.populateMarkers(this.props.locations);
        console.log("hll")
      }

    populateMarkers = (locations) => {
      let self = this
      let bounds = new window.google.maps.LatLngBounds();
      for ( var i = 0; i< locations.length; i++){
       var position = locations[i].location;
       var title = locations[i].title;

       var marker = new window.google.maps.Marker({
         position: position,
         title: title,
         animation: window.google.maps.Animation.DROP,
         id:i,
         map: this.state.map
       });

       marker.addListener('click', function(){
         self.toggleMarkere(this);
       });

       bounds.extend(marker.position);
          this.state.map.fitBounds(bounds)
          this.state.markers.push(marker);
     }


     console.log(this.props.triggeredPlace)
    }


    toggleMarkere = (marker) => {
      this.state.infoWindows.forEach(info => { info.close() });
      this.toggleBounce(marker);
      this.populateInfoWindow(marker);
    }

    populateInfoWindow = (marker) => {
      let  infowindow = new window.google.maps.InfoWindow();
      let self = this;
        if(marker)
        if(infowindow.marker !== marker) {
          infowindow.marker = marker;

          infowindow.setContent(`<div> ${marker.title} </div>
            <img src=${self.state.data[marker.id].media.m} />
            ` );

          infowindow.addListener('closeclick',function() {
            infowindow.close();
          });

             infowindow.open(this.state.map, marker);
        }
        this.state.infoWindows.push(infowindow);
      }



       toggleBounce = (marker) => {
        if(marker)
              if (marker.getAnimation() !== null) {
                  marker.setAnimation(null);
              } else {
                  marker.setAnimation(window.google.maps.Animation.BOUNCE);
                  setTimeout(function(){ marker.setAnimation(null); }, 3000);
              }
            }



render() {
  return (
    <div className="google-map" id="map"></div>

)
  }
}


export default scriptLoader(
  ["https://maps.googleapis.com/maps/api/js?key=AIzaSyCGJMvnSgyusBgoFBvic3e5iMmrLlC0Rpc&libraries=places&callback=initMap"])(MapComponent)
