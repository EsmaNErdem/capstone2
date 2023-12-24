import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import LoginForm from "../LoginForm"

test("renders without crashing", async () => {
    render(
        <MemoryRouter >
            <LoginForm />
        </MemoryRouter>
    ); 
});

test("it renders and matches with snaphot", () => {
    const { asFragment } = render(
        <MemoryRouter >
            <LoginForm />
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});

test("LoginForm renders correctly", () => {
    const { getByLabelText, getByText, getByTestId } = render(
        <MemoryRouter >
            <LoginForm />
        </MemoryRouter>
    );
    
    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");
    const submitButton = getByText("Submit");
  
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    
    const profileLink = getByTestId('user-signup-link');
    expect(profileLink.getAttribute('href')).toBe('/signup');
  });
  
  test("Submitting the form calls login function", async () => {
    const mockLogin = jest.fn().mockResolvedValue({ success: true }); 
    const { getByLabelText, getByText } = render(
          <MemoryRouter >
              <LoginForm login={mockLogin} />
          </MemoryRouter>
      );
    
    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");
    const submitButton = getByText("Submit");
  
    fireEvent.change(usernameInput, { target: { value: "username" } });
    fireEvent.change(passwordInput, { target: { value: 123456789 } });
    fireEvent.click(submitButton);
  
    await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: "username",
          password: "123456789"
        });
    });
  });
   
