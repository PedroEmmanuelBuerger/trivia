import React, { Component } from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import Proptypes from 'prop-types';
import { saveInfoUser } from '../redux/actions/index';

class Login extends Component {
  state = {
    name: '',
    email: '',
    buttonValidation: true,
  };

  componentDidMount() {
    this.getToken();
  }

  getToken = () => {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(token) : '';
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState(() => ({
      [name]: value,
    }), this.validateButton);
  };

  validateButton = () => {
    const { name, email } = this.state;
    const nameValidation = name.length > 0;
    const regexEmail = /^([\w+-]+\.)*[\w+-]+@([\w+-]+\.)*[\w+-]+\.[a-zA-Z]{2,4}$/;
    const emailValidation = regexEmail.test(email);
    if (nameValidation && emailValidation) {
      this.setState({ buttonValidation: false });
    } else {
      this.setState({ buttonValidation: true });
    }
  };

  buttonPlay = async () => {
    const { name, email } = this.state;
    const { history, dispatch } = this.props;
    const emailGravatar = md5(email).toString();
    const userObject = { name, emailGravatar };
    dispatch(saveInfoUser(userObject));
    const localStorageToken = localStorage.getItem('token');
    const token = await fetch('https://opentdb.com/api_token.php?command=request')
      .then((response) => response.json())
      .then((tokens) => tokens);
    if (localStorageToken) {
      history.push('/game');
      return;
    } localStorage.setItem('token', (token.token));
    history.push('/game');
  };

  render() {
    const { buttonValidation } = this.state;
    const { history } = this.props;
    return (
      <div>
        <form
          onSubmit={ (e) => {
            e.preventDefault();
            this.buttonPlay();
          } }
        >
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="nae"
            onChange={ this.handleChange }
            data-testid="input-player-name"
          />
          <label
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            data-testid="input-gravatar-email"
            onChange={ this.handleChange }
          />
          <button
            type="submit"
            data-testid="btn-play"
            disabled={ buttonValidation }
          >
            Play
          </button>
        </form>
        <button
          type="button"
          onClick={ () => history.push('/settings') }
          data-testid="btn-settings"
        >
          configurações
        </button>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: Proptypes.func.isRequired,
  history: Proptypes.shape({ push: Proptypes.func.isRequired }).isRequired,
};

export default connect()(Login);
