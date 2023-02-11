import React, { Component } from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import Header from '../components/Header';

class Feedback extends Component {
  returnLogin = () => {
    const { history } = this.props;
    history.push('/');
  };

  render() {
    return (

      <div>
        <Header />
        <h1 data-testid="feedback-text">Feedback</h1>
        <button
          type="button"
          data-testid="btn-play-again"
          onClick={ this.returnLogin }
        >
          Play Again
        </button>
      </div>
    );
  }
}

Feedback.propTypes = {
  history: Proptypes.shape({ push: Proptypes.func.isRequired }).isRequired,
};

const mapStateToProps = (state) => ({
  gravatar: state.player.gravatarEmail,
  name: state.player.name,
  score: state.player.score,
});

export default connect(mapStateToProps)(Feedback);
