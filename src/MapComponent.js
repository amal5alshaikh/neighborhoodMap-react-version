import React, { Component } from 'react';
import {map_style} from './map_style.js'
import scriptLoader from 'react-async-script-loader'
import './App.css'
import $ from 'jquery';
import fetchJsonp from 'fetch-jsonp';

class MapComponent extends Component {


    state = {
      map : {},
      markers:[],
      infoWindows: [],
      data:[],
      mapLoaded: true,
      triggeredPlace : ""
    }


    updateData = (newData) => {
        this.setState({
          data:newData,
        });
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

      if(this.props.triggeredPlace){
        this.toggleMarker(this.state.markers[this.props.triggeredPlace]);
      }
    }


    componentDidMount = () => {
      this.props.locations.map((location,index)=>{
   return fetchJsonp(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${location.title}&format=json&callback=wikiCallback`)
   .then(response => response.json()).then((responseJson) => {
     let newData = [...this.state.data,[responseJson,responseJson[2][0],responseJson[3][0]]]
     this.updateData(newData)
   }).catch(error =>
   console.error(error)
   )
 })
    }



    componentDidUpdate = () => {
      this.populateMarkers(this.props.locations);
      }

    populateMarkers = (locations) => {
      this.hideListings();

      let self = this
      let bounds = new window.google.maps.LatLngBounds();
      for ( var i = 0; i< locations.length; i++){
       var position = locations[i].location;
       var title = locations[i].title;

       var marker = new window.google.maps.Marker({
         position: position,
         title: title,
         id:i,
         map: this.state.map
       });

       marker.addListener('click', function(){
         //self.props.trigger(marker.id)
         self.toggleMarker(this);
       });

       bounds.extend(marker.position);
          this.state.map.fitBounds(bounds)
          this.state.markers.push(marker);
     }
    }


    toggleMarker = (marker) => {
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

          let getData = this.state.data.filter((single)=>marker.title === single[0][0]).map(item2=>
      {if (item2.length===0)
        return 'No Contents Have Been Found Try to Search Manual'
        else if (item2[1] !=='')
          return item2[1]
        else
          return 'No Contents Have Been Found Try to Search Manual'
      })
    let getLink = this.state.data.filter((single)=>marker.title === single[0][0]).map(item2=>
      {if (item2.length===0)
        return 'https://www.wikipedia.org'
        else if (item2[1] !=='')
          return item2[2]
        else
          return 'https://www.wikipedia.org'
      })
          infowindow.setContent(`<div> ${marker.title} </div>
            <p>${getData}</p>
    <a href=${getLink}>Click Here For More Info</a>
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


      hideListings =  () => {
          this.state.markers.forEach(function(marker) {
                marker.setVisible(false);
             });

          this.state.infoWindows.forEach(function(infoWindow) {
                   infoWindow.close();
                });
      }




render() {

  return (
    <div role="application" tabIndex="-1" className="google-map" id="map"></div>
)
  }
}


export default scriptLoader(
  ["https://maps.googleapis.com/maps/api/js?key=AIzaSyCGJMvnSgyusBgoFBvic3e5iMmrLlC0Rpc&libraries=places&callback=initMap"])(MapComponent)
