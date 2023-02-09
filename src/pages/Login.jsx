import React, { Component } from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import saveInfoUser from '../redux/actions/index';

class Login extends Component {
  state = {
    name: '',
    email: '',
    buttonValidation: true,
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

  buttonPlay = () => {
    const { name, email } = this.state;
    const { history, dispatch } = this.props;
    const emailGravatar = md5(email).toString();
    const userObject = { name, emailGravatar };
    dispatch(saveInfoUser(userObject));
  };

  render() {
    const { buttonValidation } = this.state;
    return (
      <div>
        <form>
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
            type="button"
            data-testid="btn-play"
            disabled={ buttonValidation }
            onClick={ this.buttonPlay }
          >
            Play
          </button>
        </form>
      </div>
    );
  }
}

export default connect()(Login);
