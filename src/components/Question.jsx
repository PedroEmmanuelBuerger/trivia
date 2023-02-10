import React, { Component } from 'react';
import logo from '../trivia.png';

export default class Question extends Component {
  state = {
    questions: [],
    error: false,
    index: 0,
  };

  componentDidMount() {
    this.getQuestions();
  }

  getQuestions = () => {
    const token = localStorage.getItem('token');
    const api = `opentdb.com/api.php?amount=5&token=${token}`;
    const response = fetch(api)
      .then((response) => response.json())
      .then((data) => this.setState({ questions: data.results }));
    console.log(response);
  };

  render() {
    const { questions, index } = this.state;
    return (
      <div className="App">
       <header className="App-header">
          <img src={ logo } className="App-logo" width="150px" alt="logo" />
        </header> *
      </div>
    );
  }
}
