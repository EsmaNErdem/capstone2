import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import { UserProvider, NonUserProvider } from "../testUtils";
import Home from "./Home"


test("renders without crashing", () => {
    render(
    <UserProvider>
        <Home />
    </UserProvider>
    );
});

test("it renders and matches with snaphot", () => {
    const { asFragment } = render(
        <UserProvider>
            <Home />
        </UserProvider>
    );
    expect(asFragment()).toMatchSnapshot();
});

test("it renders and matches with snaphot", () => {
    const { asFragment } = render(
        <MemoryRouter>
            <NonUserProvider>
                <Home />
            </NonUserProvider>
        </MemoryRouter>
        
    );
    expect(asFragment()).toMatchSnapshot();
});

test("it renders welcome message for non-user", () => {
    const { getByText } = render(
        <MemoryRouter>
            <NonUserProvider>
                <Home />
            </NonUserProvider>
        </MemoryRouter>
    );
    expect(getByText("A Wrinkle in Page: Online Book Club")).toBeInTheDocument();
    expect(getByText("Login")).toBeInTheDocument();
});

test("it renders welcome message for user", () => {
    const { getByText } = render(
        <UserProvider>
            <Home />
        </UserProvider>
    );
    expect(getByText("A Wrinkle in Page: Online Book Club")).toBeInTheDocument();
    expect(getByText("Welcome, testuser!")).toBeInTheDocument();
});
