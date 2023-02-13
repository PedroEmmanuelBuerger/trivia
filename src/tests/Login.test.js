import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux'
import App from '../App';

describe('Teste da pagina de Login', () => {
    test('Verifica se a tela Login e renderizada corretamente com os inputs (email e name) e os botoes (play e configura', () => {
        renderWithRouterAndRedux(<App />);
    
        screen.logTestingPlaygroundURL();
        const inputEmail = screen.getByRole('textbox', { name: /email/i });
        const labelName = screen.getByText(/name/i);
        const labelEmail = screen.getByText(/email/i);
        const buttonSubmit = screen.getByRole('button', { name: /play/i });
        const buttonSettings = screen.getByRole('button', { name: /configurações/i });

        expect(inputEmail).toBeInTheDocument();
        expect(labelName).toBeInTheDocument();
        expect(labelEmail).toBeInTheDocument();
        expect(buttonSubmit).toBeInTheDocument();
        expect(buttonSettings).toBeInTheDocument();
        });
    
    test('Verifica a validacao do botao play', () => {
        renderWithRouterAndRedux(<App />);
    
        const buttonSubmit = screen.getByRole('button', { name: /play/i });
        const inputEmail = screen.getByTestId('input-gravatar-email');
        const inputName = screen.getByTestId('input-player-name');
    
        expect(buttonSubmit).toBeDisabled();
    
        userEvent.type(inputName, 'xablau');
        userEvent.type(inputEmail, 'xablau@xablau.com');
    
        expect(buttonSubmit).toBeEnabled();
    
        });

    test('Verifica se ao digitar email correto, nome e depois clicar no botao "play" e redirecionado para pagina Game', async () => {
        const { history } = renderWithRouterAndRedux(<App />);

        screen.logTestingPlaygroundURL();
        const buttonSubmit = screen.getByRole('button', { name: /play/i });
        const inputEmail = screen.getByRole('textbox', { name: /email/i })
        const inputName = screen.getByTestId('input-player-name');
        userEvent.type(inputName, 'xablau');
        expect(inputName.value).toBe('xablau');
        userEvent.type(inputEmail, 'xablau@xablau.com');
        expect(inputEmail.value).toBe('xablau@xablau.com')
        
        userEvent.click(buttonSubmit);
        await waitFor (() => ( expect(history.location.pathname).toBe('/game')));
        
    });

    test('Verifica se ao clicar no botao configurações e redirecionado para para (Settings)', () => {
        renderWithRouterAndRedux(<App />);
    
        const buttonSettings = screen.getByRole('button', { name: /configurações/i });
    
        userEvent.click(buttonSettings);
    
        const textInGame = screen.getByRole('heading', /settings/i);
    
        expect(textInGame).toBeInTheDocument();
        });
    test('verifica se ao iniciar sem token ele cria um token', async () => {
        renderWithRouterAndRedux(<App />);
        localStorage.clear();
        const token = localStorage.getItem('token');
        expect(token).toBe(null);
        const inputEmail = await screen.findByRole('textbox', { name: /email/i })
        const inputName = await screen.findByTestId('input-player-name');
        userEvent.type(inputName, 'pedro emmanuel buerger');
        userEvent.type(inputEmail, 'sombraios@hotmail.com');
        const buttonSubmit = await screen.findByRole('button', { name: /play/i });
        userEvent.click(buttonSubmit);
        await waitFor (() => ( expect(localStorage.getItem('token')).not.toBe(null)));
        });
});


