import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, act,  screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chat from '../Chat';
import WS from 'jest-websocket-mock';

let server;

// beforeEach(async () => {
//   server = new WS('ws://localhost:3001/chat/TestReceiver,testuser');
//   await server.connected;
  
// });

// afterEach(() => {
//   server.clean();
// });

test('renders without crashing', async () => {
  // console.log(server)
  // await act(async () => {
  //   render(
  //     <MemoryRouter>
  //         <UserProvider>
  //           <Chat isOpen={true} receiver="TestReceiver" setWebsocket={jest.fn()}/>
  //         </UserProvider>
  //       </MemoryRouter>
  //     );
  //   });
});


// test('it renders and matches with snapshot', async () => {  
//     await act(async () => {
//       ({ asFragment } = render(
//         <MemoryRouter>
//           <UserProvider>
//             <Chat />
//           </UserProvider>
//         </MemoryRouter>
//       ));
//     });
    
//     await ws.connected;

  
//     expect(asFragment()).toMatchSnapshot();
// });