import React, { Component } from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import '../styles/ranking.css';

class Ranking extends Component {
  state = {
    allPlayers: [],
  };

  componentDidMount() {
    this.getPlayers();
  }

  returnLogin = () => {
    const { history } = this.props;
    history.push('/');
  };

  getPlayers = () => {
    const players = JSON.parse(localStorage.getItem('players'));
    const playersOk = (players === null) ? [] : players;
    this.setState(() => ({
      allPlayers: playersOk,
    }));
  };

  render() {
    const { allPlayers } = this.state;
    const allPlayersSortByScore = allPlayers.sort((a, b) => b.score - a.score);
    return (
      <div className="containerPlayer">
        <h1 data-testid="ranking-title" className="titleRanking">Ranking</h1>
        {allPlayersSortByScore.map((player, index) => (
          <div key={ index } className="divPlayer">
            <img src={ `https://www.gravatar.com/avatar/${player.picture}` } alt="gravatar" className="playerImg" />
            <p data-testid={ `player-name-${index}` } className="textR">{player.name}</p>
            <p data-testid={ `player-score-${index}` } className="scoreR">
              {player.score}
            </p>
          </div>
        ))}
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ this.returnLogin }
        >
          Play Again
        </button>
      </div>
    );
  }
}

Ranking.propTypes = {
  history: Proptypes.shape({ push: Proptypes.func.isRequired }).isRequired,
};

export default connect()(Ranking);
