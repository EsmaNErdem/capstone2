import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import SignupForm from "../SignupForm";

test("renders without crashing", async () => {
    render(
        <MemoryRouter >
            <SignupForm />
        </MemoryRouter>
    ); 
});

test("it renders and matches with snaphot", () => {
    const { asFragment } = render(
        <MemoryRouter >
            <SignupForm />
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});

test("SignUpForm renders correctly", () => {
    const { getByLabelText, getByText, getByTestId } = render(
        <MemoryRouter >
            <SignupForm />
        </MemoryRouter>
    );
    
    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");
    const emailInput = getByLabelText("Email Address");
    const submitButton = getByText("Submit");
    
    const profileLink = getByTestId('user-login-link');
    expect(profileLink.getAttribute('href')).toBe('/login');

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
  
  test("Submitting the form calls signup function", async () => {
    const mockSignUp = jest.fn().mockResolvedValue({ success: true }); 

    const { getByLabelText, getByText } = render(
          <MemoryRouter >
              <SignupForm signup={mockSignUp} />
          </MemoryRouter>
      );
    
    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");
    const emailInput = getByLabelText("Email Address");
    const submitButton = getByText("Submit");
  
    fireEvent.change(usernameInput, { target: { value: "username" } });
    fireEvent.change(passwordInput, { target: { value: 123456789 } });
    fireEvent.change(emailInput, { target: { value: "user@email.com" } });
    fireEvent.click(submitButton);
  
    await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          username: "username",
          password: "123456789",
          email: "user@email.com",
          img: ""
        });
    });
  });
   
