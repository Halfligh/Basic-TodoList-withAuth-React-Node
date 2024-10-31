import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { checkCookieStatus } from "./services/cookie/cookieService";
import { getCookie } from "./utils/cookie";
import { decodeToken } from "./utils/decodeToken";
import { getAllUsersWithTasks, createTask } from "./services/task/taskService";

jest.mock("./services/cookie/cookieService");
jest.mock("./utils/cookie");
jest.mock("./utils/decodeToken");
jest.mock("./services/task/taskService");

beforeAll(() => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));
  global.XMLHttpRequest = jest.fn(() => ({
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
  }));
});

describe("App component", () => {
  beforeEach(() => {
    getAllUsersWithTasks.mockResolvedValue({ data: [] });
    createTask.mockResolvedValue({ status: 200, message: "Task created" });
    checkCookieStatus.mockResolvedValue({ isAuthenticated: false });
    getCookie.mockReturnValue(null);
    decodeToken.mockReturnValue({});
  });

  it("should render login form when not authenticated", async () => {
    render(<App />);
    expect(
      await screen.findByText(/Veuillez vous connecter pour accéder à votre Todo-list./i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /connexion/i })).toBeInTheDocument();
  });

  it("should render todo list after successful login", async () => {
    checkCookieStatus.mockResolvedValueOnce({ isAuthenticated: true });
    decodeToken.mockReturnValue({ username: "testUser", roles: [] });
    getCookie.mockReturnValue("validToken");

    render(<App />);
    const loginButton = screen.getByRole("button", { name: /connexion/i });
    fireEvent.click(loginButton);
    expect(await screen.findByText(/Voici votre Todo-list./i)).toBeInTheDocument();
  });

  it("should render login form after logout", async () => {
    checkCookieStatus.mockResolvedValueOnce({ isAuthenticated: true });
    decodeToken.mockReturnValue({ username: "testUser", roles: [] });
    getCookie.mockReturnValue("validToken");

    render(<App />);
    const loginButton = screen.getByRole("button", { name: /connexion/i });
    fireEvent.click(loginButton);
    expect(await screen.findByText(/Voici votre Todo-list./i)).toBeInTheDocument();

    const logoutButton = screen.getByRole("button", { name: /déconnexion/i });
    fireEvent.click(logoutButton);
    expect(await screen.findByRole("button", { name: /connexion/i })).toBeInTheDocument();
  });
});
