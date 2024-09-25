import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // Pour les assertions comme "toBeInTheDocument"
import Logout from "./Logout"; // Assurez-vous que le chemin d'import est correct
const axios = require("axios");

jest.mock("axios");

describe("Login Component", () => {
  test("should render correctly", () => {
    render(<Logout onLogout={() => {}} />);
    expect(screen.getByText(/Déconnexion/i)).toBeInTheDocument();
  });

  test("should calls onLogout after successful API call", async () => {
    const mockOnLogout = jest.fn();
    axios.post = jest.fn().mockResolvedValueOnce({}); // Simuler la réussite de l'appel API

    render(<Logout onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByText(/Déconnexion/i));

    // Attendre que l'appel se termine et que onLogout soit appelé
    await waitFor(() => expect(mockOnLogout).toHaveBeenCalled());
  });

  test("should logs an error when the logout API call fails", async () => {
    console.error = jest.fn(); // Mock de la console pour capturer les erreurs
    axios.post = jest.fn().mockRejectedValueOnce(new Error("Erreur de déconnexion")); // Simuler une erreur API

    render(<Logout onLogout={() => {}} />);
    fireEvent.click(screen.getByText(/Déconnexion/i));

    // Attendre que l'appel échoue et vérifier que l'erreur est loggée
    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith("Erreur lors de la déconnexion", expect.any(Error))
    );
  });
});
