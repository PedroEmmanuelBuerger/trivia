import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux'
import App from '../App';
import { act } from 'react-dom/test-utils';

describe('testa a pagina de feedback', () => {
    it('testa se os inputs de feedback é renderizada corretamente', async () => {
        const initialState = {
            player: {
                name: "Pedro emmanuel Buerger",
                assertions: 0,
                score: 0,
                gravatarEmail: "1676a90f5c41d1f639a00b8519104ec9",
            },
        };    
    const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
    act(() => (
        history.push('/feedback')
    ))
    const { pathname } = history.location;
    expect(pathname).toBe('/feedback');
    const name = await screen.findByText(/pedro emmanuel buerger/i)
    const feedbackImg = await screen.findByRole('img', { name: /gravatar/i });
    const feedbackText = await screen.findByRole('heading', { name: /could be better\.\.\./i })
    const feedbackScore = await screen.findByTestId('feedback-total-score');
    const feedbackAssertions = await screen.findByTestId('feedback-total-question');
    const feedbackBtn = await screen.findByRole('button', { name: /play again/i });
    const rankingBtn = await screen.findByRole('button', { name: /ranking/i });
    expect(feedbackImg).toBeInTheDocument();
    expect(feedbackText).toBeInTheDocument();
    expect(feedbackScore).toBeInTheDocument();
    expect(feedbackAssertions).toBeInTheDocument();
    expect(feedbackBtn).toBeInTheDocument();
    expect(rankingBtn).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(feedbackImg).toHaveAttribute('src', 'https://www.gravatar.com/avatar/1676a90f5c41d1f639a00b8519104ec9');
    expect(feedbackScore).toHaveTextContent('0');
    expect(feedbackAssertions).toHaveTextContent('0');
    });
    it('verifica se ao iniciar com valor de acertos mais ou igual a 3 a mensagem muda', async () => {
        const initialState = {
            player: {
                name: "Pedro emmanuel Buerger",
                assertions: 3,
                score: 100,
                gravatarEmail: "1676a90f5c41d1f639a00b8519104ec9",
            },
        };
    const { history } = renderWithRouterAndRedux(<App />, { ...initialState });
    act(() => (
        history.push('/feedback')
    ))
    const { pathname } = history.location;
    expect(pathname).toBe('/feedback');
    const feedbackText = await screen.findByRole('heading', { name: /Well Done!/i })
    expect(feedbackText).toBeInTheDocument();
    const score = await screen.findByTestId('feedback-total-score');
    expect(score).toHaveTextContent('100');
    const assertions = await screen.findByTestId('feedback-total-question');
    expect(assertions).toHaveTextContent('3');
    });
   it('verifica se ao clicar no botao de playAgain vai para a pagina de login', async () => {
        const initialState = {
            player: {
                name: "Pedro emmanuel Buerger",
                assertions: 5,
                score: 3,
                gravatarEmail: "1676a90f5c41d1f639a00b8519104ec9",
            },
        };
    const { history, store } = renderWithRouterAndRedux(<App />, { ...initialState });
    act(() => (
        history.push('/feedback')
    ))
    const playAgain = await screen.findByRole('button', { name: /play again/i });
    expect(store.getState().player).toEqual({
        name: "Pedro emmanuel Buerger",
        assertions: 5,
        score: 3,
        gravatarEmail: "1676a90f5c41d1f639a00b8519104ec9",
    });
    userEvent.click(playAgain);
    const { pathname } = history.location;
    expect(pathname).toBe('/');
    expect(store.getState().player).toEqual({
        name: "Pedro emmanuel Buerger",
        assertions: 0,
        score: 0,
        gravatarEmail: "1676a90f5c41d1f639a00b8519104ec9",
   });
   });
   it('verifica se ao clicar em ranking leva para a tela de ranking e limpa os valores do state', async () => {
        const initialState = {
            player: {
                name: "Pedro emmanuel Buerger",
                assertions: 5,
                score: 3,
                gravatarEmail: "1676a90f5c41d1f639a00b8519104ec9",
            },
        };
    const { history, store } = renderWithRouterAndRedux(<App />, { ...initialState });
    act(() => (
        history.push('/feedback')
    ))
    const rankingBtn = await screen.findByRole('button', { name: /ranking/i });
    expect(store.getState().player).toEqual({
        name: "Pedro emmanuel Buerger",
        assertions: 5,
        score: 3,
        gravatarEmail: "1676a90f5c41d1f639a00b8519104ec9",
    });
    userEvent.click(rankingBtn);
    const { pathname } = history.location;
    expect(pathname).toBe('/ranking');
    expect(store.getState().player).toEqual({
        name: "Pedro emmanuel Buerger",
        assertions: 0,
        score: 0,
        gravatarEmail: "1676a90f5c41d1f639a00b8519104ec9",
   });
   });
});

