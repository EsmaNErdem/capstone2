import { render, fireEvent, waitFor } from "@testing-library/react";
import ProfileEditForm from "../ProfileEditForm";
import { UserProvider } from "../../testUtilities";
import { MemoryRouter } from "react-router-dom";
import BookClubApi from '../../api';

const updateUser = jest.fn();

const initial = {
    username: "Test1",
    firstName: "TestFirs1",
    lastName: "TestLast1",
    img: "UserImg1",
    email: "u1@email.com",
}

const mockUpdatedUser = {
    firstName: "TestFirs",
    lastName: "TestLast",
    img: "UserImg",
    email: "u@email.com",
}

jest.mock("../../api", () => ({
    __esModule: true,
    default: {
        updateUser: jest.fn(),
    },
}));

test("renders without crashing", async () => {
    BookClubApi.updateUser.mockImplementationOnce(() => (mockUpdatedUser));

    render(
        <UserProvider>
            <MemoryRouter>
                <ProfileEditForm updateUser={updateUser} closeModal={()=>{}} initialValues={initial}/>
            </MemoryRouter>
        </UserProvider>
    ); 
});

test("it renders and matches with snaphot", () => {
    BookClubApi.updateUser.mockImplementationOnce(() => (mockUpdatedUser));

    const { asFragment } = render(
        <UserProvider>
            <MemoryRouter>
                <ProfileEditForm updateUser={updateUser} closeModal={()=>{}} initialValues={initial}/>
            </MemoryRouter>
        </UserProvider>
        );

    expect(asFragment()).toMatchSnapshot();
});

test("LoginForm renders correctly", () => {
    BookClubApi.updateUser.mockImplementationOnce(() => (mockUpdatedUser));

    const { getByLabelText, getByText } = render(
        <UserProvider>
            <MemoryRouter>
                <ProfileEditForm  updateUser={updateUser} closeModal={()=>{}} initialValues={initial}/>
            </MemoryRouter>
        </UserProvider>
    );
    
    const firstNameInput = getByLabelText("First Name");
    const lastNameInput = getByLabelText("Last Name");
    const emailInput = getByLabelText("Email Address");
    const saveButton = getByText("Save Changes");
  
    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });
  
  test("Submitting the form calls login function", async () => {
    BookClubApi.updateUser.mockImplementationOnce(() => (mockUpdatedUser));

    const { getByLabelText, getByText } = render(
          <UserProvider >
            <MemoryRouter>
                  <ProfileEditForm updateUser={updateUser} closeModal={()=>{}} initialValues={initial}/>
            </MemoryRouter>
          </UserProvider>
      );
    
    const firstNameInput = getByLabelText("First Name");
    const lastNameInput = getByLabelText("Last Name");
    const emailInput = getByLabelText("Email Address");
    const saveButton = getByText("Save Changes");
  
    fireEvent.change(firstNameInput, { target: { value: "user" } });
    fireEvent.change(lastNameInput, { target: { value: "name" } });
    fireEvent.change(emailInput, { target: { value: "user@email.com" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
            expect(BookClubApi.updateUser).toHaveBeenCalledWith("Test1", 
            {
                firstName: "user",
                lastName: "name",
                email: "user@email.com",
                img: "UserImg1"
            });
        });
  });
   
