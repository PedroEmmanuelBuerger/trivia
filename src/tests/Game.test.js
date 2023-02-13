import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux'
import { questions, errorResponse } from './helpers/QuestionsApi';
import App from '../App';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

describe('testa a tela de game', () => {
  const initialState = {
    player: {
        name: 'Pedro Emmanuel Buerger',
        assertions: 0,
        score: 0,
        gravatarEmail: '1676a90f5c41d1f639a00b8519104ec9',
    },
    };
  it('testa se a tela de game é renderizada', async () => {
    global.fetch = jest.fn(async () => ({
        json: async () => questions,
      }));
      const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
      act(() => {
        history.push('/game');
      });
    const logo = screen.getByAltText('logo');
    const userName = await screen.findByTestId('header-player-name');
    const gravatar = await screen.findByTestId('header-profile-picture');
    const score = await screen.findByTestId('header-score');
    const category = await screen.findByTestId('question-category');
    const wrongAnswer1 = await screen.findByTestId('wrong-answer-0');
    const wrongAnswer2 = await screen.findByTestId('wrong-answer-1');
    const wrongAnswer3 = await screen.findByTestId('wrong-answer-2');
    const correctAnswer = await screen.findByTestId('correct-answer');
    const timer = screen.getByRole('heading', { name: /30/i });
    expect(userName).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
    expect(gravatar).toBeInTheDocument();
    expect(gravatar).toHaveAttribute('src', 'https://www.gravatar.com/avatar/1676a90f5c41d1f639a00b8519104ec9');
    expect(score).toBeInTheDocument();
    expect(score).toHaveTextContent('0');
    expect(category).toBeInTheDocument();
    expect(category).toHaveTextContent('Entertainment: Film');
    expect(wrongAnswer1).toBeInTheDocument();
    expect(wrongAnswer1).toHaveTextContent('Francis Ford Coppola');
    expect(wrongAnswer2).toBeInTheDocument();
    expect(wrongAnswer2).toHaveTextContent('Stanley Kubrick');
    expect(wrongAnswer3).toBeInTheDocument();
    expect(wrongAnswer3).toHaveTextContent('Michael Cimino');
    expect(correctAnswer).toBeInTheDocument();
    expect(correctAnswer).toHaveTextContent('Oliver Stone');
    expect(timer).toBeInTheDocument();
    });
  it('verifica se ao passar um estado inicial diferentes ele muda os valores na tela', () => {
    const initialState = {
      player: {
          name: 'marli elise',
          assertions: 2,
          score: 10,
          gravatarEmail: '705dac6ab75b42303b64b16faeae6e76',
      },
      };
    global.fetch = jest.fn(async () => ({
        json: async () => questions,
      }));
      const { history, store } = renderWithRouterAndRedux(<App />, { ...initialState });
      act(() => {
        history.push('/game');
      });
    const userName = screen.getByTestId('header-player-name');
    const gravatar = screen.getByTestId('header-profile-picture');
    const score = screen.getByTestId('header-score');
    expect(userName).toBeInTheDocument();
    expect(userName).toHaveTextContent('marli elise');
    expect(gravatar).toBeInTheDocument();
    expect(gravatar).toHaveAttribute('src', 'https://www.gravatar.com/avatar/705dac6ab75b42303b64b16faeae6e76');
    expect(score).toBeInTheDocument();
    expect(score).toHaveTextContent('10');
    expect(store.getState().player.assertions).toBe(2);
  });
  it('verifica se o timer tem 30 segundos de espera e se ao acabar o tempo os botões desabilita', async () => {
    global.fetch = jest.fn(async () => ({
        json: async () => questions,
      }));
      const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
      act(() => {
        history.push('/game');
      });
    const wrongAnswer1 = await screen.findByTestId('wrong-answer-0');
    const wrongAnswer2 = await screen.findByTestId('wrong-answer-1');
    const wrongAnswer3 = await screen.findByTestId('wrong-answer-2');
    const correctAnswer = await screen.findByTestId('correct-answer');
    expect(wrongAnswer1).toBeInTheDocument();
    expect(wrongAnswer2).toBeInTheDocument();
    expect(wrongAnswer3).toBeInTheDocument();
    expect(correctAnswer).toBeInTheDocument();
    expect(wrongAnswer1).not.toBeDisabled();
    expect(wrongAnswer2).not.toBeDisabled();
    expect(wrongAnswer3).not.toBeDisabled();
    expect(correctAnswer).not.toBeDisabled();
    const timer = screen.getByRole('heading', { name: /30/i });
    expect(timer).toBeInTheDocument();
    setTimeout(() => {
      expect(timer).toHaveTextContent('0');
    }, 32000);
    setTimeout(() => {
      expect(wrongAnswer1).toBeDisabled();
      expect(wrongAnswer2).toBeDisabled();
      expect(wrongAnswer3).toBeDisabled();
      expect(correctAnswer).toBeDisabled();
      const endtime = screen.getByRole('heading', { name: /acabou o tempo!!/i })
      expect(endtime).toBeInTheDocument();
    }, 32000);
  });
  it('verifica se o botão de next aparece ao clicar em uma resposta', async () => {
    global.fetch = jest.fn(async () => ({
        json: async () => questions,
      }));
      const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
      act(() => {
        history.push('/game');
      });
    const wrongAnswer1 = await screen.findByTestId('wrong-answer-0');
    userEvent.click(wrongAnswer1);
    const next = await screen.findByRole('button', { name: /próxima/i });
    expect(next).toBeInTheDocument();
  });
  it('verifica se todas as perguntas são renderizadas novamente e se o timer reseta ao clicar em next', async () => {
    global.fetch = jest.fn(async () => ({
        json: async () => questions,
      }));
      const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
      act(() => {
        history.push('/game');
      });
    const wrongAnswer1 = await screen.findByTestId('wrong-answer-0');
    const wrongAnswer2 = await screen.findByTestId('wrong-answer-1');
    const wrongAnswer3 = await screen.findByTestId('wrong-answer-2');
    const correctAnswer = await screen.findByTestId('correct-answer');
    expect(wrongAnswer1).toBeInTheDocument();
    expect(wrongAnswer2).toBeInTheDocument();
    expect(wrongAnswer3).toBeInTheDocument();
    expect(correctAnswer).toBeInTheDocument();
    expect(wrongAnswer1).toEqual(screen.getByText('Francis Ford Coppola'));
    expect(wrongAnswer2).toEqual(screen.getByText('Stanley Kubrick'));
    expect(wrongAnswer3).toEqual(screen.getByText('Michael Cimino'));
    expect(correctAnswer).toEqual(screen.getByText('Oliver Stone'));
    setInterval(() => {
      const timer = screen.getByRole('heading', { name: /30/i });
      expect(timer).toBeInTheDocument();
      expect(timer).toHaveTextContent('0');
    }, 30000);
    setInterval(async() => {
      const next = await screen.findByRole('button', { name: /próxima/i });
      expect(next).toBeInTheDocument();
      userEvent.click(next);
      const newwrongAnswer1 = await screen.findByTestId('wrong-answer-0');
      const newwrongAnswer2 = await screen.findByTestId('wrong-answer-1');
      const newwrongAnswer3 = await screen.findByTestId('wrong-answer-2');
      const newcorrectAnswer = await screen.findByTestId('correct-answer');
      expect(newwrongAnswer1).toBeInTheDocument();
      expect(newwrongAnswer2).toBeInTheDocument();
      expect(newwrongAnswer3).toBeInTheDocument();
      expect(newcorrectAnswer).toBeInTheDocument();
      expect(newwrongAnswer1).toEqual(screen.getByText('George Lucas'));
      expect(newwrongAnswer2).toEqual(screen.getByText('Steven Spielberg'));
      expect(newwrongAnswer3).toEqual(screen.getByText('James Cameron'));
      expect(newcorrectAnswer).toEqual(screen.getByText('Quentin Tarantino'));
    }, 32000);
  }); 
  it('verifica se a cada segundo o timer muda', async () => {
    global.fetch = jest.fn(async () => ({
        json: async () => questions,
      }));
      const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
      act(() => {
        history.push('/game');
      });
    const timer = await screen.findByRole('heading', { name: /30/i });
    expect(timer).toBeInTheDocument();
    expect(timer).toHaveTextContent('30');
    setInterval(() => {
      expect(timer).toHaveTextContent('29');
    }, 1000);
    setInterval(() => {
      expect(timer).toHaveTextContent('28');
    }, 2000);
    setInterval(() => {
      expect(timer).toHaveTextContent('20');
    }, 10000);
    setInterval(() => {
      expect(timer).toHaveTextContent('10');
    }, 20000);
  });
  it('verifica se ao iniciar com o token vencido ele redireciona para a pagina do login', async () => {
    localStorage.clear();
    global.fetch = jest.fn(async () => ({
      json: async () => errorResponse,
    }));
    const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
    act(() => {
      history.push('/game');
    });
    await waitFor(() => {
      expect(history.location.pathname).toBe('/');
      });
  });
  it('verifica se ao acertar uma questão o contador de score na tela sobre', async () => {
    global.fetch = jest.fn(async () => ({
        json: async () => questions,
      }));
      const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
      act(() => {
        history.push('/game');
      });
    const score = await screen.findByTestId('header-score');
    expect(score).toBeInTheDocument();
    expect(score).toHaveTextContent('0');
    const correctAnswer = await screen.findByTestId('correct-answer');
    userEvent.click(correctAnswer);
    expect(score).toHaveTextContent('40');
  });
  it('verifica se ao errar uma questão o contador de score na tela sobre', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => questions,
    }));
    const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
    act(() => {
      history.push('/game');
    });
  const score = await screen.findByTestId('header-score');
  expect(score).toBeInTheDocument();
  expect(score).toHaveTextContent('0');
  const wrongAnswer1 = await screen.findByTestId('wrong-answer-0');
  userEvent.click(wrongAnswer1);
  expect(score).toHaveTextContent('0');
  });
  it('verifica se ao todo existem 5 perguntas', async () => {
    global.fetch = jest.fn(async () => ({
        json: async () => questions,
      }));
      const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
      act(() => {
        history.push('/game');
      });
    const correctAnswer1 = await screen.findByRole('button', { name: /oliver stone/i });
    userEvent.click(correctAnswer1);
    const nextbutton1 = await screen.findByRole('button', { name: /próxima/i });
    userEvent.click(nextbutton1);
    const correctAnswer2 = await screen.findByRole('button', { name: /Birmingham/i });
    expect(correctAnswer2).toBeInTheDocument();
    const nextbutton2 = await screen.findByRole('button', { name: /próxima/i });
    userEvent.click(nextbutton2);
    const correctAnswer3 = await screen.findByRole('button', { name: /Trees/i });
    expect(correctAnswer3).toBeInTheDocument();
    const nextbutton3 = await screen.findByRole('button', { name: /próxima/i });
    userEvent.click(nextbutton3);
    const correctAnswer4 = await screen.findByText('Five dollars is worth how many nickles?');
    expect(correctAnswer4).toBeInTheDocument();
    const nextbutton4 = await screen.findByRole('button', { name: /próxima/i });
    userEvent.click(nextbutton4);
    const correctAnswer5 = await screen.findByRole('button', { name: /Urea/i });
    expect(correctAnswer5).toBeInTheDocument();
    const nextbutton5 = await screen.findByRole('button', { name: /próxima/i });
    userEvent.click(nextbutton5);
    expect(nextbutton1).not.toBeInTheDocument();
    expect(nextbutton2).not.toBeInTheDocument();
    expect(nextbutton3).not.toBeInTheDocument();
    expect(nextbutton4).not.toBeInTheDocument();
    expect(nextbutton5).not.toBeInTheDocument();
    const playAgain = await screen.findByRole('button', { name: /play again/i })
    expect(playAgain).toBeInTheDocument();
    const raking = await screen.findByRole('button', { name: /ranking/i })
    expect(raking).toBeInTheDocument();
  });
  it('verifica a somataria dos pontos de todas as dificuldades de perguntas', async () => {
    global.fetch = jest.fn(async () => ({
        json: async () => questions,
      }));
      const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
      act(() => {
        history.push('/game');
      });
    const score = await screen.findByTestId('header-score');
    expect(score).toBeInTheDocument();
    expect(score).toHaveTextContent('0');
    const correctAnswer1 = await screen.findByRole('button', { name: /oliver stone/i });
    userEvent.click(correctAnswer1);
    expect(score).toHaveTextContent('40');
    const nextbutton1 = await screen.findByRole('button', { name: /próxima/i });
    userEvent.click(nextbutton1);
    const correctAnswer2 = await screen.findByRole('button', { name: /Birmingham/i });
    expect(correctAnswer2).toBeInTheDocument();
    userEvent.click(correctAnswer2);
    expect(score).toHaveTextContent('110');
    const nextbutton2 = await screen.findByRole('button', { name: /próxima/i });
    userEvent.click(nextbutton2);
    const correctAnswer3 = await screen.findByRole('button', { name: /Trees/i });
    expect(correctAnswer3).toBeInTheDocument();
    userEvent.click(correctAnswer3);
    expect(score).toHaveTextContent('210');
  });
});
