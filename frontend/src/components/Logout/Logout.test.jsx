import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // Pour les assertions comme "toBeInTheDocument"
import Logout from "./Logout"; // Assurez-vous que le chemin d'import est correct
const axios = require("axios");

jest.mock("axios");

describe("Logout Component", () => {
  test("should render correctly", () => {
    render(<Logout onLogout={() => {}} />);
    expect(screen.getByText(/Déconnexion/i)).toBeInTheDocument();
  });

  test("should call onLogout after successful API call", async () => {
    const mockOnLogout = jest.fn();
    axios.post.mockResolvedValueOnce({}); // Simuler la réussite de l'appel API

    render(<Logout onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByText(/Déconnexion/i));

    // Attendre que l'appel se termine et que onLogout soit appelé
    await waitFor(() => expect(mockOnLogout).toHaveBeenCalled());
  });

  test("should display an error message when the logout API call fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Erreur de déconnexion")); // Simuler une erreur API

    render(<Logout onLogout={() => {}} />);
    fireEvent.click(screen.getByText(/Déconnexion/i));

    // Vérifier qu'un message d'erreur est affiché
    expect(await screen.findByText(/Erreur lors de la déconnexion/)).toBeInTheDocument();
  });
});
