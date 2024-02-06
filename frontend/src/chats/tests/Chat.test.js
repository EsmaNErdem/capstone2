import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, act,  screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chat from '../Chat';
import WS from 'jest-websocket-mock';


let ws;

beforeEach(() => {
    ws = new WS('ws://localhost:8080');
});

afterEach(() => {
    WS.clean();
});

test('renders without crashing', async () => {
  
    await act(async () => {
      render(
        <MemoryRouter>
          <UserProvider>
            <Chat />
          </UserProvider>
        </MemoryRouter>
      );
    });
    await ws.connected;


  });