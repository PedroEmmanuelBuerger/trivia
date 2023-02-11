import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';

class Feedback extends Component {
  render() {
    return (

      <div>
        <Header />
        <h1 data-testid="feedback-text">Feedback</h1>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  gravatar: state.player.gravatarEmail,
  name: state.player.name,
  score: state.player.score,
});

export default connect(mapStateToProps)(Feedback);
