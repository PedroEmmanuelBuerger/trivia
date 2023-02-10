import React, { Component } from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';

class Header extends Component {
  render() {
    const { gravatar, name, score } = this.props;
    return (
      <section>
        <p data-testid="header-player-name">{ name }</p>
        <img src={ `https://www.gravatar.com/avatar/${gravatar}` } alt="Gravatar" data-testid="header-profile-picture" />
        <p data-testid="header-score">{ score }</p>
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
