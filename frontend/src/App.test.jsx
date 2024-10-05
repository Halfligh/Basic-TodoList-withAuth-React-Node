import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { checkCookieStatus } from "./services/cookie/cookieService";
import { getCookie } from "./utils/cookie";
import { decodeToken } from "./utils/decodeToken";

// Simuler les modules
jest.mock("./services/cookie/cookieService");
jest.mock("./utils/cookie");
jest.mock("./utils/decodeToken");

describe("App component", () => {
  beforeEach(() => {
    getCookie.mockReset();
    decodeToken.mockReset();
    checkCookieStatus.mockReset();

    // Ajouter un retour par défaut pour éviter les erreurs de destructuration
    checkCookieStatus.mockResolvedValue({ isAuthenticated: false });
  });

  it("should render login form when not authenticated", () => {
    render(<App />);

    expect(
      screen.getByText(/Veuillez vous connecter pour accéder à votre Todo-list./i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /connexion/i })).toBeInTheDocument();
  });

  it("should render todo list after successful login", async () => {
    // Simuler une connexion réussie
    checkCookieStatus.mockResolvedValueOnce({ isAuthenticated: true });
    decodeToken.mockReturnValue({ username: "testUser", roles: [] });

    render(<App />);

    // Simuler l'action de connexion
    const loginButton = screen.getByRole("button", { name: /connexion/i });
    fireEvent.click(loginButton);

    // Vérifier que la todo-list est affichée après la connexion
    expect(await screen.findByText(/Voici votre Todo-list./i)).toBeInTheDocument();
  });

  it("should render admin dashboard when user is admin", async () => {
    // Simuler un token avec le rôle admin
    checkCookieStatus.mockResolvedValueOnce({ isAuthenticated: true });
    // Simuler un token valide
    getCookie.mockReturnValue("validToken");
    // Simuler le retour du décodage du token pour un utilisateur admin
    decodeToken.mockReturnValue({ username: "admin", roles: ["admin"] });
    render(<App />);

    expect(
      await screen.findByText(/Bienvenue, vous êtes connecté\(e\) en tant qu'administrateur/i)
    ).toBeInTheDocument();
  });

  it("should render login form after logout", async () => {
    checkCookieStatus.mockResolvedValueOnce({ isAuthenticated: true });
    decodeToken.mockReturnValue({ username: "testUser", roles: [] });

    render(<App />);

    const loginButton = screen.getByRole("button", { name: /connexion/i });
    fireEvent.click(loginButton);

    expect(await screen.findByText(/Voici votre Todo-list./i)).toBeInTheDocument();

    const logoutButton = screen.getByRole("button", { name: /déconnexion/i });
    fireEvent.click(logoutButton);

    expect(await screen.findByRole("button", { name: /connexion/i })).toBeInTheDocument();
  });

  it("should call checkCookieStatus to verify authentication", async () => {
    checkCookieStatus.mockResolvedValueOnce({ isAuthenticated: false });

    render(<App />);

    await waitFor(() => {
      expect(checkCookieStatus).toHaveBeenCalled();
    });
  });
});
