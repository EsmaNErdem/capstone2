import { MemoryRouter } from 'react-router-dom';
import { render, act, waitFor, fireEvent } from "@testing-library/react";
import NavBar from './NavBar';
import { UserProvider, CurrUserProvider, NonUserProvider } from "../testUtilities";

test("renders without crashing", () => {
    render(
    <MemoryRouter >
        <UserProvider>
          <NavBar />
        </UserProvider>
    </MemoryRouter>
    );
});

test("it renders and matches with snaphot while loggedin user", () => {
    const { asFragment } = render(
        <MemoryRouter >
            <UserProvider>
                <NavBar />
            </UserProvider>
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});

test("it renders and matches with snaphot while no user loggedin", () => {
    const { asFragment } = render(
        <MemoryRouter >
            <NonUserProvider>
                <NavBar />
            </NonUserProvider>
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});

test("Renders protected links while loggedin user", async () => {
    const { getByText, getByTestId } = render(
        <MemoryRouter >
            <CurrUserProvider>
                <NavBar />
            </CurrUserProvider>
        </MemoryRouter>
    );
    // "
    expect(getByText("Reviews")).toBeInTheDocument();
    expect(getByText("Books")).toBeInTheDocument();
    
    const profile = getByTestId('PersonIcon');
    await act(async () => {
        fireEvent.click(profile); 
    });
    await waitFor(() => {
        expect(getByText("Profile")).toBeInTheDocument();
        expect(getByText("Log out testuser")).toBeInTheDocument();
    }); 
});

test("Renders protected links while no loggedin user", () => {
    const { getByText } = render(
        <MemoryRouter >
            <NonUserProvider>
                <NavBar />
            </NonUserProvider>
        </MemoryRouter>
    );
    
    expect(getByText("Login")).toBeInTheDocument();
    expect(getByText("Sign Up")).toBeInTheDocument();
    expect(getByText("Book Chat")).toBeInTheDocument();
});