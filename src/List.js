import React, { Component } from 'react';
import './App.css';
import loc from './loc.svg';

class List extends Component {

  render() {
    return (
      <div className="nav-side">
      <img src={loc} className="App-logo" alt="marker" />
      <h1 className="App-title">Mishas Map </h1>
        <ol className="list">
        {this.props.locations.map((location, index) =>
          <li key={index} data-id={index} className="item" onClick={(event)=> this.props.trigger(event.currentTarget.dataset.id )}> {location.title}  </li>
        )}
        </ol>
      </div>
    );
  }
}

export default List;
