import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // Pour les assertions comme "toBeInTheDocument"
import Login from "./Login"; // Assurez-vous que le chemin d'import est correct
const axios = require("axios");

jest.mock("axios");

describe("Login Component", () => {
  test("renders correctly with initial elements", () => {
    render(<Login onLogin={() => {}} />);

    // Vérifie que le champ de texte et le bouton de connexion sont présents
    expect(screen.getByLabelText(/Identifiant/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
  });

  test("the 'username' and 'password' fields update with input.", () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/identifiant/i), { target: { value: "JohnDoe" } });
    expect(screen.getByLabelText(/identifiant/i)).toHaveValue("JohnDoe");

    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: "secretPassword" },
    });
    expect(screen.getByLabelText(/mot de passe/i)).toHaveValue("secretPassword");
  });

  test("submits correct data and calls onLogin", async () => {
    const mockOnLogin = jest.fn();
    axios.post.mockResolvedValue({ data: { success: true } }); // Simuler une réponse réussie de l'API

    render(<Login onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByLabelText(/identifiant/i), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "password" } });
    fireEvent.click(screen.getByText(/connexion/i));

    // Attendre que l'appel API se termine si la fonction est asynchrone
    await screen.findByText(/connexion/i);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3001/api/auth/login",
      { username: "admin", password: "password" },
      { withCredentials: true }
    );

    // Utiliser waitFor pour attendre que mockOnLogin soit appelé
    await waitFor(() => expect(mockOnLogin).toHaveBeenCalled());
  });

  test("displays an error in case of incorrect username or password.", async () => {
    // Simuler une réponse de l'API avec une erreur d'authentification
    axios.post.mockResolvedValue({ data: { success: false } });

    render(<Login />);

    // Simuler la saisie du mauvais identifiant et mot de passe
    fireEvent.change(screen.getByLabelText(/identifiant/i), { target: { value: "wrongUser" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "wrongPass" } });

    // Simuler l'envoi du formulaire
    fireEvent.submit(screen.getByRole("button", { name: /connexion/i }));

    expect(await screen.findByText(/identifiant ou mot de passe incorrect/i)).toBeInTheDocument();
  });

  test("displays an error message if the server is unreachable.", async () => {
    // Simuler une erreur réseau avec une promesse rejetée
    axios.post.mockRejectedValue(new Error("Erreur réseau"));

    render(<Login />);

    // Simuler la saisie des identifiants
    fireEvent.change(screen.getByLabelText(/identifiant/i), { target: { value: "JohnDoe" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "password" } });

    // Simuler l'envoi du formulaire
    fireEvent.submit(screen.getByRole("button", { name: /connexion/i }));

    // Utiliser findByText au lieu de waitFor + getByText
    expect(
      await screen.findByText(/une erreur est survenue lors de la connexion/i)
    ).toBeInTheDocument();
  });
});
