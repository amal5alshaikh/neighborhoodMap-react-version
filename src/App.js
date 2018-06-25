import React, { Component } from 'react';
import './App.css';
import List from './List.js';
import MapComponent from './MapComponent.js'

export default class App extends Component {
state = {
  locations: [
  {title:'CN Tower', location:{ lat:43.6425701,lng:-79.3892455 }},
  {title:'Royal Ontario Museum', location:{ lat:43.6677136,lng:-79.3969658} },
  {title:'Rogers Centre', location:{lat:43.6414417,lng:-79.3915419}},
  {title:'Art Gallery of Ontario', location:{lat:43.6536105,lng:-79.394701}},
  {title:'Casa Loma', location:{lat:43.678041,lng:-79.4116326}},
  {title:'University Of Toronto', location:{lat:43.6647541,lng:-79.4034208}},
  ]
}

  render() {
    return (
      <div className="App">
        <List locations={this.state.locations}/>
        <MapComponent locations={this.state.locations}/>
      </div>
    );
  }
}
