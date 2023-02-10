import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Header from '../components/Header';
import logo from '../trivia.png';

class Question extends Component {
  state = {
    questions: [],
    i: 0,
    disabled: false,
  };

  componentDidMount() {
    this.getQuestions();
    this.Hourglass();
  }

  Hourglass = () => {
    const time = 30000;
    const { disabled } = this.state;
    setTimeout(() => {
      this.setState({ disabled: !disabled });
    }, time);
  };

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
    const number = 0.5;
    const { disabled } = this.state;
    const correctAnswer = (
      <button
        type="button"
        data-testid="correct-answer"
        disabled={ disabled }
      >
        {correct}
      </button>);
    const wrongAnswers = wrong.map((answer, index) => (
      <button
        key={ index }
        type="button"
        data-testid={ `wrong-answer-${index}` }
        disabled={ disabled }
      >
        {answer}
      </button>));
    const concatAnswers = wrongAnswers.concat(correctAnswer);
    const shuffle = concatAnswers.sort(() => Math.random() - number);
    return shuffle;
  };

  render() {
    const { questions, i } = this.state;
    const currentQuestion = questions[i];
    return (
      <div>
        <Header />
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
