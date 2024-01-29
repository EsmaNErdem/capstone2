import { render, fireEvent, waitFor } from "@testing-library/react";
import ProfileEditForm from "../ProfileEditForm";
import { UserProvider } from "../../testUtilities";
import { MemoryRouter } from "react-router-dom";
import BookClubApi from '../../api';

const updateUser = jest.fn();

const initial = {
    username: "Test1",
    img: "UserImg1",
    email: "u1@email.com",
}

const mockUpdatedUser = {
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
    
    const emailInput = getByLabelText("Email Address");
    const saveButton = getByText("Save Changes");
  
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
    
    const emailInput = getByLabelText("Email Address");
    const saveButton = getByText("Save Changes");
  
    fireEvent.change(emailInput, { target: { value: "user@email.com" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
            expect(BookClubApi.updateUser).toHaveBeenCalledWith("Test1", 
            {
                email: "user@email.com",
                img: "UserImg1"
            });
        });
  });
   
