import React, { Component } from 'react';

export default class Login extends Component {
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
          >
            Play
          </button>
        </form>
      </div>
    );
  }
}
