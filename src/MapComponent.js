import React, { Component } from 'react';
import {map_style} from './map_style.js'
import scriptLoader from 'react-async-script-loader'
import './App.css'
import fetchJsonp from 'fetch-jsonp';

class MapComponent extends Component {


    state = {
      map : {},
      markers:[],
      infoWindows: [],
      data:[],
      mapLoaded: true
    }

/*
these state data are required for maintaining the map data.
map, markers, and infowindows is fot the map construction.
data, it will store the data we receive from the api related to the places.
maploaded is a boolean value to check if the map is loaded correctly or not.
*/

    updateData = (newData) => {
        this.setState({
          data:newData,
        });
      }
/*
after the api call, we need to re-set the data to the data been recieved and re-render the component accordingly.
*/
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

        else {
          console.log("Error:Cann't Load Google Map!");
          this.setState({mapLoaded: false})
        }

      }


    }

    /*
    componentWillReceiveProps:
    it will make sure that the map script is loaded correctly, if not.. it will be handeled.
    */


    componentDidMount = () => {
      this.props.locations.map((location,index)=>{
   return fetchJsonp(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${location.title}&format=json&callback=wikiCallback`)
   .then(response => response.json()).then((responseJson) => {
     let newData = [...this.state.data,[responseJson,responseJson[2][0],responseJson[3][0]]]
     this.updateData(newData)
   }).catch(error =>
   console.error("error loading the api ")
   )
 })
    }
/*
componentDidMount: is the right place for calling an API.
if the call is succeded the data will be set on the state, if not an error message shows up on the console.
*/


    componentDidUpdate = () => {
      this.populateMarkers(this.props.locations);
      if(this.props.triggeredPlace){
        this.toggleMarker(this.state.markers[this.props.triggeredPlace]);
      }
      }

      /*
      componentDidUpdate:
      it will be called whenver the component is updated, it will re-populate the markeres in case we did filter the markers
      and if is there any place is selected, again it will toggle that place marker.
      */

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
         animation: window.google.maps.Animation.DROP,
         id:i,
         map: this.state.map
       });

       marker.addListener('click', function(){
         self.toggleMarker(this);
       });

       bounds.extend(marker.position);
          this.state.map.fitBounds(bounds)
          this.state.markers.push(marker);
     }
    }

/*
populateMarkers:
first it will hide every marker and re-populate the neede ones, in case there was filtering.
it will create the marker with everything it need and add it to the map + extending the map bound to cover all the markers.
*/

    toggleMarker = (marker) => {
      this.state.infoWindows.forEach(info => { info.close() });
      this.toggleBounce(marker);
      this.populateInfoWindow(marker);
    }

    /*
    toggleMarker:
    first of all, it will close any opened info window,
    then toggle and populate that marker on the map.
    */


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

/*
populateInfoWindow:
creates an infoWindow, add a marker then get the related data from the api and add it to the content of the window.
for each window, if it was clicked with closeclick event, it will be closed.
finally, add that infowindw to the state's array of infos.
*/

       toggleBounce = (marker) => {
        if(marker)
              if (marker.getAnimation() !== null) {
                  marker.setAnimation(null);
              } else {
                  marker.setAnimation(window.google.maps.Animation.BOUNCE);
                  setTimeout(function(){ marker.setAnimation(null); }, 3000);
              }
            }
/*
toggleBounce:
this for adding animation to the marker, it will bounce whenver it clicked.
*/

      hideListings =  () => {
          this.state.markers.forEach(function(marker) {
                marker.setVisible(false);
             });

          this.state.infoWindows.forEach(function(infoWindow) {
                   infoWindow.close();
                });
      }

/*
hidingListings:
it will go through every marker and info window and hide it /close it.
*/


render() {

  return (
    this.state.mapLoaded ? (<div role="application" tabIndex="-1" className="google-map" id="map"></div>) :
    ( <div role="application" tabIndex="-1" className="google-map"> Error, check your internet connection </div>)
)
  }
}


export default scriptLoader(
  ["https://maps.googleapis.com/maps/api/js?key=AIzaSyCGJMvnSgyusBgoFBvic3e5iMmrLlC0Rpc&libraries=places&callback=initMap"])(MapComponent)
