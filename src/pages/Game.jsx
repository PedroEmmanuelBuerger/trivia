import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import { addScore } from '../redux/actions/index';
import logo from '../trivia.png';
import './Game.css';

class Question extends Component {
  state = {
    questions: [],
    i: 0,
    timer: 30,
    suffledQuestions: [],
  };

  componentDidMount() {
    this.getQuestions();
    this.Hourglass();
  }

  timerCount = () => {
    const time = 1000;
    setInterval(() => {
      const { timer } = this.state;
      this.setState({ timer: timer - 1 });
    }, time);
  };

  disableButtons = () => {
    const btnCorrect = document.querySelector('#defaultCorrect');
    const btnWrong = document.querySelectorAll('#defaultWrong');
    btnCorrect.disabled = true;
    btnWrong.forEach((btn) => {
      btn.disabled = true;
    });
  };

  Hourglass = () => {
    this.timerCount();
    const time = 30000;
    setTimeout(() => {
      this.disableButtons();
    }, time);
  };

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
    this.setState(() => ({
      questions: apiquestions.results,
    }), () => this.getAnswers());
  };

  getAnswers = () => {
    const { questions, i } = this.state;
    const currentQuestion = questions[i];
    const correct = currentQuestion.correct_answer;
    const incorrect = currentQuestion.incorrect_answers;
    this.shuffleQuestions(incorrect, correct);
  };

  errorResponse = () => {
    const { history } = this.props;
    localStorage.removeItem('token');
    history.push('/');
  };

  shuffleQuestions = (wrong, correct) => {
    const number = 0.5;
    const correctAnswer = (
      <button
        type="button"
        data-testid="correct-answer"
        id="defaultCorrect"
        onClick={ (e) => (this.ChoiceButton(e)) }
      >
        {correct}
      </button>);
    const wrongAnswers = wrong.map((answer, index) => (
      <button
        key={ index }
        type="button"
        data-testid={ `wrong-answer-${index}` }
        onClick={ (e) => (this.ChoiceButton(e)) }
        id="defaultWrong"
      >
        {answer}
      </button>));
    const concatAnswers = wrongAnswers.concat(correctAnswer);
    const shuffle = concatAnswers.sort(() => Math.random() - number);
    return this.setState({ suffledQuestions: shuffle });
  };

  ChoiceButton = (e) => {
    this.activeCSS();
    const { timer } = this.state;
    const { className } = e.target;
    const three = 3;
    if (className === 'correct-answer') {
      const { questions, i } = this.state;
      const currentQuestion = questions[i];
      const { difficulty } = currentQuestion;
      let difficuiltyPoints = 0;
      switch (difficulty) {
      case 'easy':
        difficuiltyPoints = 1;
        break;
      case 'medium':
        difficuiltyPoints = 2;
        break;
      case 'hard':
        difficuiltyPoints = three;
        break;
      default:
        difficuiltyPoints = 0;
      }
      const points = 10;
      const timerPoints = timer;
      const totalPoints = (points + (difficuiltyPoints * timerPoints));
      const { dispatch } = this.props;
      dispatch(addScore(totalPoints));
    }
  };

  activeCSS = () => {
    const btnCorrect = document.querySelector('#defaultCorrect');
    const btnWrong = document.querySelectorAll('#defaultWrong');
    btnCorrect.className = 'correct-answer';
    btnWrong.forEach((btn) => {
      btn.className = 'wrong-answer';
    });
  };

  render() {
    const { questions, i, suffledQuestions, timer } = this.state;
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
                { suffledQuestions }
              </div>
              {timer > 0 ? <h1>{ timer }</h1> : <h1>Acabou o tempo!!</h1>}
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
  dispatch: Proptypes.func.isRequired,
};

export default connect()(Question);
