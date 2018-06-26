import React, { Component } from 'react';
import './App.css';
import loc from './loc.svg';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';


class List extends Component {


  state = {
        query: '',
        filteredLocations: []
      }


  updatequery =(query) => {
    this.setState({query: query})
  }


  render() {
    if (this.state.query){
      const match = new RegExp(escapeRegExp(this.state.query),'i')
      this.state.filteredLocations = this.props.locations.filter((location)=> match.test(location.title))
    }
    else{
      this.state.filteredLocations = this.props.locations
    }
    return (
      <div className="nav-side">
      <img src={loc} className="App-logo" alt="marker" />
      <h1 className="App-title">Mishas Map </h1>
      <input type="search"
             placeholder= "University of Torronto"
             value={this.state.query}
             onChange={(event)=> this.updatequery(event.target.value)}/>
        <ol className="list">
        {this.state.filteredLocations.map((location, index) =>
          <li key={index} data-id={index} className="item" onClick={(event)=> this.props.trigger(event.currentTarget.dataset.id )}> {location.title}  </li>
        )}
        </ol>
      </div>
    );
  }
}

export default List;
