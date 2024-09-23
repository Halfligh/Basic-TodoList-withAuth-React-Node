const http = require("http");
const app = require("./app");

// Renvoit un port valide, qu'il soit fourni sous forme de numéro ou de chaîne
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

// Recherche et traite les éventuelles erreurs
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur et de l'écouteur d'événements sur le port
const server = http.createServer(app);

// Renvoyer le serveur au lieu de l'application
module.exports = server;

// Gérer les erreurs et démarrer le serveur
server.on("error", errorHandler);
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
