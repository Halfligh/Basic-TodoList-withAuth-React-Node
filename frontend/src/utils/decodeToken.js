export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1]; // On récupère la partie payload du JWT
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload); // Retourne le payload décodé sous forme d'objet
  } catch (error) {
    console.error("Erreur lors du décodage du token", error);
    return null;
  }
};
