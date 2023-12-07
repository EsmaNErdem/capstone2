import { render } from '@testing-library/react';
import App from './App';

jest.mock('./api');

test('renders without crashing', () => {
  render(<App />);
});

test("it renders and matches with snaphot", () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
});