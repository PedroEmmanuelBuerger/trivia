import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import sanitizeHtml from 'sanitize-html';
import Header from '../components/Header';
import { addScore } from '../redux/actions/index';
import '../styles/game.css';
import ampulheta from '../images/ampulheta.png';

const correctdefault = 'defaultCorrect';
const wrongdefault = 'defaultWrong';

class Question extends Component {
  state = {
    questions: [],
    i: 0,
    timer: 30,
    suffledQuestions: [],
    nextButton: false,
    stop: false,
  };

  componentDidMount() {
    this.getQuestions();
    this.timerCount();
  }

  timerCount = () => {
    const time = 1000;
    setInterval(() => {
      const { stop } = this.state;
      if (stop) return;
      const { timer } = this.state;
      this.setState({ timer: timer - 1 });
      this.disableButtons();
    }, time);
  };

  resetTimers = () => {
    this.setState({ timer: 30 });
    const buttons = document.querySelectorAll(`#${wrongdefault}`);
    const correctButton = document.querySelector(`#${correctdefault}`);
    correctButton.disabled = false;
    buttons.forEach((btn) => {
      btn.disabled = false;
    });
  };

  disableButtons = (par) => {
    const { timer } = this.state;
    if (timer === 0 || par) {
      this.setState({ nextButton: true, stop: true });
      const btnCorrect = document.querySelector(`#${correctdefault}`);
      const btnWrong = document.querySelectorAll(`#${wrongdefault}`);
      btnCorrect.disabled = true;
      btnWrong.forEach((btn) => {
        btn.disabled = true;
      });
    }
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
    this.disableButtons(true);
    this.activeCSS();
    this.setState({ nextButton: true });
    const { timer } = this.state;
    const { className } = e.target;
    const three = 3;
    if (className === 'correct-answer') {
      const { questions, i } = this.state;
      const currentQuestion = questions[i];
      const { difficulty } = currentQuestion;
      let difficuiltyPoints = 0;
      switch (difficulty) {
      case 'medium':
        difficuiltyPoints = 2;
        break;
      case 'hard':
        difficuiltyPoints = three;
        break;
      default:
        difficuiltyPoints = 1;
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

  nextButtonFunction = () => {
    this.setState({ stop: false });
    const number = 4;
    this.resetTimers();
    const { i } = this.state;
    if (i === number) {
      const { history } = this.props;
      history.push('/feedback');
    }
    this.setState(() => ({
      i: i + 1,
    }), () => this.getAnswers(), this.resetClass());
  };

  resetClass = () => {
    const btnCorrect = document.querySelector('#defaultCorrect');
    const btnWrong = document.querySelectorAll('#defaultWrong');
    btnCorrect.className = '';
    btnWrong.forEach((btn) => {
      btn.className = '';
    });
  };

  render() {
    const { questions, i, suffledQuestions, timer, nextButton } = this.state;
    const currentQuestion = questions[i];
    const clean = (currentQuestion) ? sanitizeHtml(currentQuestion.question) : '';
    return (
      <div>
        <Header className="HeaderFirst" />
        {currentQuestion ? (
          <div className="game">
            <h1 data-testid="question-category" className="categoryQuestion">
              {currentQuestion.category}
            </h1>
            <h2
              data-testid="question-text"
              className="questionText"
            >
              {clean}

            </h2>
            <div data-testid="answer-options" className="allAnswers">
              { suffledQuestions }
            </div>
            {timer > 0 ? (
              <div>
                <h1 className="timer">{ timer }</h1>
                <img src={ ampulheta } alt="ampulheta" className="imageAmp" />
              </div>
            )
              : <h1 className="end">Acabou o tempo!!</h1>}
            {nextButton ? (
              <button
                data-testid="btn-next"
                type="button"
                onClick={ () => this.nextButtonFunction() }
                className="nextButton"
              >
                próxima
              </button>
            ) : null}
          </div>
        ) : <p className="Loading">Loading...</p>}
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
