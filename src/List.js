import React, { Component } from 'react';
import './App.css';
import loc from './loc.svg';


class List extends Component {

  updatequery =(query) => {
    this.props.filteringLocations(query)
  }

  /*
  updatequery:
  it will be called whenver the user write a lettter,
  it will call the function on the parent to make the location filtered for the list and the mao markers.
  */


  render() {

    return (
      <div className="nav-side" role="List of Torronto Places">
      <img src={loc} className="App-logo" alt="marker" />
      <h1 tabIndex='0' role="region" aria-label="Torronto Places" className="App-title">Torronto Map </h1>
      <input type="search"
             role="search"
             aria-labelledby="Search For a Location"
             tabIndex="1"
             placeholder= "University of Torronto"
             value={this.props.query}
             onChange={(event)=> this.updatequery(event.target.value)}/>
        <ol className="list" aria-labelledby="list of locations" role="List of Torronto Places" tabIndex="1">

        {this.props.filteredLocations.map((location, index) =>
          <li
          key={index}
          data-id={index}
          className="item"
          tabIndex={index+2}
          role="place"
          area-labelledby={`View details for ${location.title}`}
          onClick={(event)=> this.props.trigger(event.currentTarget.dataset.id )}> {location.title}  </li>
        )}
        </ol>
      </div>
    );
  }
}

export default List;
