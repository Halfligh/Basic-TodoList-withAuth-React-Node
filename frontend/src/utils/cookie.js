// utils/cookie.js

// Fonction utilitaire pour récupérer la valeur d'un cookie par son nom
export const getCookie = (name) => {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] || null
  );
};
