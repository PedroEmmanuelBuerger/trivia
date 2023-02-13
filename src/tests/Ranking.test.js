import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux'
import App from '../App';
import { act } from 'react-dom/test-utils';

const initialState = {
    player: {
        name: "Pedro emmanuel Buerger",
        assertions: 3,
        score: 100,
        gravatarEmail: "1676a90f5c41d1f639a00b8519104ec9",
    },
    }
describe('teste a pagina do ranking', () => {
  it('verifica se os inputs de ranking são renderizados corretamente', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    act(() => (
      history.push('/ranking')
    ))
    const { pathname } = history.location;
    expect(pathname).toBe('/ranking');
    const rankingTitle = await screen.findByRole('heading', { name: /ranking/i });
    const rankingBtn = await screen.findByRole('button', { name: /play again/i });
    expect(rankingTitle).toBeInTheDocument();
    expect(rankingBtn).toBeInTheDocument();
  });
  it('veriica se ao entrar com um estado inicial ele renderiza na tela', async () => {
    const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
    act(() => (
      history.push('/feedback')
    ))
    const rakingBtn = await screen.findByRole('button', { name: /ranking/i });
    userEvent.click(rakingBtn);
    const { pathname } = history.location;
    expect(pathname).toBe('/ranking');
    const rankingTitle = await screen.findByRole('heading', { name: /ranking/i });
    const rankingBtn = await screen.findByRole('button', { name: /play again/i });
    const rankingName = await screen.findByText(/pedro emmanuel buerger/i);
    const rankingScore = await screen.findByText(/100/i);
    expect(rankingTitle).toBeInTheDocument();
    expect(rankingBtn).toBeInTheDocument();
    expect(rankingName).toBeInTheDocument();
    expect(rankingScore).toBeInTheDocument();
  });
  it('verifica o funcionamento do botão de jogar novamente', async () => {
    const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
    act(() => (
      history.push('/ranking')
    ))
    const rankingBtn = await screen.findByRole('button', { name: /play again/i });
    userEvent.click(rankingBtn);
    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });
  it('verifica se ao iniciar com players no local Storage faz a renderização correta', async () => {
    const players = [
      {
        name: "Joao da silva",
        score: 68,
        picture: "1676a90f5c41d1f639a00b8519104ec9",
      },
      {
        name: "Pedro emmanuel Buerger",
        score: 100,
        picture: "1676a90f5c41d1f639a00b8519104ec9",
      },
    ];
    localStorage.setItem('players', JSON.stringify(players));
    const { history } = renderWithRouterAndRedux(<App />);
    act(() => (
        history.push('/ranking')
    ))
    const { pathname } = history.location;
    expect(pathname).toBe('/ranking');
    const rankingTitle = await screen.findByRole('heading', { name: /ranking/i });
    const rankingBtn = await screen.findByRole('button', { name: /play again/i });
    const rankingName = await screen.findByText(/pedro emmanuel buerger/i);
    const rankingScore = await screen.findByText(/100/i);
    expect(rankingTitle).toBeInTheDocument();
    expect(rankingBtn).toBeInTheDocument();
    expect(rankingName).toBeInTheDocument();
    expect(rankingScore).toBeInTheDocument();
    const rakingName2 = await screen.findByText(/joao da silva/i);
    const rakingScore2 = await screen.findByText(/68/i);
    expect(rakingName2).toBeInTheDocument();
    expect(rakingScore2).toBeInTheDocument();
    });
  it('verifica se o maior ranking vem primeiro', () => {
    const players = [
      {
        name: "Joao da silva",
        score: 68,
        picture: "1676a90f5c41d1f639a00b8519104ec9",
      },
      {
        name: "Pedro emmanuel Buerger",
        score: 100,
        picture: "1676a90f5c41d1f639a00b8519104ec9",
      },
    ];
    localStorage.setItem('players', JSON.stringify(players));
    const { history } = renderWithRouterAndRedux(<App />);
    act(() => (
        history.push('/ranking')
    ))
   const playerScore0 = screen.getByTestId('player-score-0');
    const playerScore1 = screen.getByTestId('player-score-1');
    expect(playerScore0).toHaveTextContent('100');
    expect(playerScore1).toHaveTextContent('68');
  });
});