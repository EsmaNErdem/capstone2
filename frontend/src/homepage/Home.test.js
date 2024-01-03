import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import { UserProvider, NonUserProvider } from "../testUtilities";
import Home from "./Home"


test("renders without crashing", () => {
    render(
        <MemoryRouter>
            <NonUserProvider>
                <Home />
            </NonUserProvider>
        </MemoryRouter>
    );
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
    expect(getByText("Welcome to Book Chat, where book lovers unite to share their passion for reading.")).toBeInTheDocument();
    expect(getByText("Login")).toBeInTheDocument();
});

test("it renders welcome message for user", () => {
    const { getByText } = render(
        <MemoryRouter>
            <UserProvider>
                <Home />
            </UserProvider>
        </MemoryRouter>
    );
    expect(getByText("Welcome to Book Chat, where book lovers unite to share their passion for reading.")).toBeInTheDocument();
    expect(getByText("Welcome, testuser!")).toBeInTheDocument();
});
