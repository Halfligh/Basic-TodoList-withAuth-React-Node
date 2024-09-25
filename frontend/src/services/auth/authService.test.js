import axios from "axios";
import { loginUser, logoutUser, verifyToken, API_BASE_URL } from "./authService";

jest.mock("axios");

test("should call loginUser API with correct URL and payload", async () => {
  const user = { username: "test", password: "password123" };

  // Simuler une réponse API réussie
  axios.post.mockResolvedValue({ data: { success: true } });

  // Appel de la fonction
  const response = await loginUser(user);

  // Vérification de l'appel axios avec les bons paramètres
  expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/api/auth/login`, user);
  expect(response.data.success).toBe(true);
});

test("should call logoutUser API with correct URL", async () => {
  const user = { username: "test" };

  // Simuler une réponse réussie
  axios.post.mockResolvedValue({ data: { success: true } });

  // Appel de la fonction
  const response = await logoutUser(user);

  // Vérification de l'appel axios avec les bons paramètres
  expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/api/auth/logout`, user);
  expect(response.data.success).toBe(true);
});

test("should call verifyToken API with correct URL and include credentials", async () => {
  // Simuler une réponse réussie
  axios.get.mockResolvedValue({ data: { success: true } });

  // Appel de la fonction
  const response = await verifyToken();

  // Vérification de l'appel axios avec les bons paramètres
  expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/api/auth/verifyToken`, {
    withCredentials: true,
  });
  expect(response.data.success).toBe(true);
});
