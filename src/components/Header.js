import React, { Component } from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import '../styles/header.css';

class Header extends Component {
  render() {
    const { gravatar, name, score } = this.props;
    return (
      <section className="HeaderFirst">
        <img src={ `https://www.gravatar.com/avatar/${gravatar}` } alt="Gravatar" data-testid="header-profile-picture" className="image" />
        <p data-testid="header-player-name" className="name">{ name }</p>
        <p data-testid="header-score" className="score">{ score }</p>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  gravatar: state.player.gravatarEmail,
  name: state.player.name,
  score: state.player.score,
});

Header.propTypes = {
  gravatar: Proptypes.string.isRequired,
  name: Proptypes.string.isRequired,
  score: Proptypes.number.isRequired,
};
export default connect(mapStateToProps)(Header);
