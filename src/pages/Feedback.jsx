import React, { Component } from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import Header from '../components/Header';
import { resetScoreAndAccumulated } from '../redux/actions/index';

class Feedback extends Component {
  state = {
    assertions: 0,
  };

  componentDidMount() {
    this.getAssertions();
  }

  getAssertions = () => {
    const number = 3;
    const { assertions } = this.props;
    if (assertions >= number) {
      this.setState({ assertions: 'Well Done!' });
    } else {
      this.setState({ assertions: 'Could be better...' });
    }
  };

  returnLogin = () => {
    const { history, dispatch } = this.props;
    dispatch(resetScoreAndAccumulated());
    history.push('/');
  };

  redirectionRanking = () => {
    const { history } = this.props;
    history.push('/ranking');
  };

  render() {
    const { assertions } = this.state;
    return (
      <div>
        <Header />
        <h1 data-testid="feedback-text">{ assertions }</h1>
        <button
          type="button"
          data-testid="btn-play-again"
          onClick={ this.returnLogin }
        >
          Play Again
        </button>

        <button
          type="button"
          data-testid="btn-ranking"
          onClick={ this.redirectionRanking }
        >
          Ranking
        </button>
      </div>
    );
  }
}

Feedback.propTypes = {
  history: Proptypes.shape({ push: Proptypes.func.isRequired }).isRequired,
  assertions: Proptypes.number.isRequired,
  dispatch: Proptypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  gravatar: state.player.gravatarEmail,
  name: state.player.name,
  score: state.player.score,
  assertions: state.player.assertions,
});

export default connect(mapStateToProps)(Feedback);
