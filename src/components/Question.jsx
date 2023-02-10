import React, { Component } from 'react';

export default class Question extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    
  }

  render() {
    return (
      <div>
        <h1>Hello!</h1>
      </div>
    );
  }
}
