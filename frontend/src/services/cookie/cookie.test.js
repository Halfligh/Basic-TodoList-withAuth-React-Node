import axios from "axios";
import { getCookie } from "../../utils/cookie"; // Simuler cette fonction
import { checkCookieStatus } from "./cookie"; // La fonction que vous testez

// Simuler axios et getCookie
jest.mock("axios");
jest.mock("../../utils/cookie");

describe("cookie", () => {
  it("should return isAuthenticated: false when no token is present", async () => {
    // Simuler l'absence de cookie
    getCookie.mockReturnValue(null);

    const result = await checkCookieStatus();

    // Vérifier que l'utilisateur n'est pas authentifié
    expect(result).toEqual({ isAuthenticated: false });
    expect(getCookie).toHaveBeenCalledWith("token");
  });

  it("should return isAuthenticated: true when token is valid", async () => {
    // Simuler la présence d'un cookie
    getCookie.mockReturnValue("validToken");

    // Simuler une réponse réussie de l'API
    axios.get.mockResolvedValueOnce({ data: { success: true } });

    const result = await checkCookieStatus();

    // Vérifier que l'utilisateur est authentifié
    expect(result).toEqual({ isAuthenticated: true });
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3001/api/auth/verifyToken", {
      withCredentials: true,
    });
  });

  it("should return isAuthenticated: false when token is invalid", async () => {
    // Simuler la présence d'un cookie
    getCookie.mockReturnValue("invalidToken");

    // Simuler une réponse de l'API indiquant un échec
    axios.get.mockResolvedValueOnce({ data: { success: false } });

    const result = await checkCookieStatus();

    // Vérifier que l'utilisateur n'est pas authentifié
    expect(result).toEqual({ isAuthenticated: false });
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3001/api/auth/verifyToken", {
      withCredentials: true,
    });
  });

  it("should return isAuthenticated: false when API returns 401", async () => {
    // Simuler la présence d'un cookie
    getCookie.mockReturnValue("token");

    // Simuler une réponse de l'API avec une erreur 401
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });

    const result = await checkCookieStatus();

    // Vérifier que l'utilisateur n'est pas authentifié
    expect(result).toEqual({ isAuthenticated: false });
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3001/api/auth/verifyToken", {
      withCredentials: true,
    });
  });

  it("should handle other API errors and return isAuthenticated: false", async () => {
    // Simuler la présence d'un cookie
    getCookie.mockReturnValue("token");

    // Simuler une autre erreur de l'API
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    const result = await checkCookieStatus();

    // Vérifier que l'utilisateur n'est pas authentifié
    expect(result).toEqual({ isAuthenticated: false });
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3001/api/auth/verifyToken", {
      withCredentials: true,
    });
  });
});
