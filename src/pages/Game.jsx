import React, { Component } from 'react';
import Proptypes from 'prop-types';
import logo from '../trivia.png';

class Question extends Component {
  state = {
    questions: [],
    i: 0,
  };

  componentDidMount() {
    this.getQuestions();
  }

  getQuestions = async () => {
    const token = localStorage.getItem('token');
    const numberError = 3;
    const apiquestions = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`)
      .then((response) => response.json())
      .then((data) => data);
    if (apiquestions.response_code === numberError) {
      this.errorResponse();
      return;
    }
    this.setState({ questions: apiquestions.results });
  };

  errorResponse = () => {
    const { history } = this.props;
    localStorage.removeItem('token');
    history.push('/');
  };

  shuffleQuestions = (wrong, correct) => {
    const correctAnswer = (
      <button
        type="button"
        data-testid="correct-answer"
      >
        {correct}
      </button>);
    const wrongAnswers = wrong.map((answer, index) => (
      <button
        key={ index }
        type="button"
        data-testid={ `wrong-answer-${index}` }
      >
        {answer}
      </button>));
    const newIndex = Math.floor(Math.random() * wrongAnswers.length);
    wrongAnswers.splice(newIndex, 0, correctAnswer);
    return wrongAnswers;
  };

  render() {
    const { questions, i } = this.state;
    const currentQuestion = questions[i];
    return (
      <div className="App">
        <header className="App-header">
          <img src={ logo } className="App-logo" width="150px" alt="logo" />
        </header>
        {currentQuestion ? (
          <div>
            <h1 data-testid="question-category">{currentQuestion.category}</h1>
            <h2 data-testid="question-text">{currentQuestion.question}</h2>
            <div data-testid="answer-options">
              {this.shuffleQuestions(
                currentQuestion.incorrect_answers,
                currentQuestion.correct_answer,
              )}
            </div>
          </div>
        ) : 'Loading...'}
      </div>
    );
  }
}

Question.propTypes = {
  history: Proptypes.shape({
    push: Proptypes.func.isRequired,
  }).isRequired,
};

export default (Question);
