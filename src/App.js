import React, { Component } from 'react';
import './App.css';
import List from './List.js';
import MapComponent from './MapComponent.js'
import escapeRegExp from 'escape-string-regexp';


export default class App extends Component {
state = {
  locations: [
  {title:'CN Tower', location:{ lat:43.6425701,lng:-79.3892455 }},
  {title:'Royal Ontario Museum', location:{ lat:43.6677136,lng:-79.3969658} },
  {title:'Rogers Centre', location:{lat:43.6414417,lng:-79.3915419}},
  {title:'Art Gallery of Ontario', location:{lat:43.6536105,lng:-79.394701}},
  {title:'Casa Loma', location:{lat:43.678041,lng:-79.4116326}},
  {title:'University Of Toronto', location:{lat:43.6647541,lng:-79.4034208}},
], query: '',
  triggeredPlace: ''
}

/*
  App.js  is the parent for two component, the map component and the list component.
  because of that, some common data needed to be stored in the state of the parent like:
    - query: since every word we search for, it should reflected on both the map and the list.. having it here is essential
    whenver the query value changed, the filtered locations changed and sent back to both components.

   - triggeredPlace: again this is a needed data for both components, whenver the user click on elemnt on the list..
   that should be reflected on the marker too, for that we changed the state of this value so the whole parent will be re-rendered
   sending that selected place to the map component then it will triggered the related marker.
*/

triggerAPlace = (value) => {
  this.setState({triggeredPlace : value})
}
/*
triggereAPlace: this function wil be called on the list component, when the user click on list element
it's updateing the selected place so that it will re render and trigger its marker.
*/

filteringLocations = (query) => {
  this.setState({query: query})
  }

  /*
  filteringLocations: this function will be called in the list view, whenver the user write a letter.. it will start filtering the parent component
  locations causing that to be reflected on the other components.
  */

  render() {
    let filteredLocations
    if(this.state.query){
    const match = new RegExp(escapeRegExp(this.state.query),'i')
     filteredLocations = this.state.locations.filter((location)=> match.test(location.title))
  } else {
    filteredLocations = this.state.locations
  }

  /*
  when the query re-setted, and before rendering..
  we will use that query to filter the locations and sending that to the components while rendering. 
  */


    return (
      <div className="App">
        <List locations={this.state.locations}
              filteredLocations={filteredLocations}
              query={this.state.query}
              filteringLocations={this.filteringLocations}
              trigger={this.triggerAPlace}/>
        <MapComponent locations={filteredLocations}
                      triggeredPlace={this.state.triggeredPlace}/>
      </div>
    );
  }
}
