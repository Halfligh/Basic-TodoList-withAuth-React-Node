const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { login, verifyToken, logout } = require("../controllers/authController");
const User = require("../models/User");

// Importation des bibliothèques nécessaires pour les tests
chai.use(chaiHttp); // Ajoute chai-http à chai pour permettre des requêtes HTTP dans les tests
const { expect } = chai; // Utilisation de la fonction `expect` de chai pour faire des assertions

// Début du bloc de tests pour le contrôleur d'authentification
describe("Auth Controller", () => {
  // Bloc de tests pour la méthode POST /login
  describe("POST /login", () => {
    let req, res, userStub; // Déclaration des variables pour la requête, la réponse et le stub pour User.findOne

    // Avant chaque test, on initialise les variables req, res, et userStub
    beforeEach(() => {
      // Simuler une requête avec un corps contenant un nom d'utilisateur et un mot de passe
      req = {
        body: {
          username: "testuser", // Nom d'utilisateur simulé
          password: "testpassword", // Mot de passe simulé
        },
      };

      // Simuler la réponse avec les méthodes status, json et cookie
      res = {
        status: sinon.stub().returnsThis(), // Stub pour `res.status` qui retourne `this` pour chaîner les appels
        json: sinon.stub(), // Stub pour `res.json` qui sera utilisé pour vérifier le retour JSON
        cookie: sinon.stub(), // Stub pour `res.cookie` qui sera utilisé pour vérifier si un cookie est envoyé
      };

      // Créer un stub pour la méthode User.findOne afin de simuler le comportement de la recherche d'utilisateur
      userStub = sinon.stub(User, "findOne");
    });

    // Après chaque test, on restaure les méthodes stubées pour éviter les interférences entre les tests
    afterEach(() => {
      sinon.restore(); // Restaurer tous les stubs créés par sinon pour repartir sur une base propre
    });

    it("should return 400 if user is not found", async () => {
      userStub.resolves(null);

      await login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ success: false, message: "Utilisateur non trouvé" })).to.be.true;
    });

    it("should return 400 if password does not match", async () => {
      const user = { username: "testuser", password: await bcrypt.hash("wrongpassword", 10) };
      userStub.resolves(user);
      sinon.stub(bcrypt, "compare").resolves(false);

      await login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ success: false, message: "Mot de passe incorrect" })).to.be.true;
    });

    it("should return 200 and set a cookie if login is successful", async () => {
      const user = {
        _id: "123",
        username: "testuser",
        password: await bcrypt.hash("testpassword", 10),
        roles: ["USER"],
      };
      userStub.resolves(user);
      sinon.stub(bcrypt, "compare").resolves(true);
      sinon.stub(jwt, "sign").returns("fake_jwt_token");

      await login(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ success: true, message: "Connexion réussie" })).to.be.true;
      expect(res.cookie.calledWith("token", "fake_jwt_token")).to.be.true;
    });
  });

  describe("GET /verifyToken", () => {
    let req, res;

    beforeEach(() => {
      req = { cookies: { token: "fake_jwt_token" } };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      sinon.stub(jwt, "verify").returns({ userId: "123", username: "testuser" });
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should return 200 if token is valid", async () => {
      await verifyToken(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({ success: true, decoded: { userId: "123", username: "testuser" } })
      ).to.be.true;
    });

    it("should return 401 if token is missing", async () => {
      req = { cookies: {} };

      await verifyToken(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ success: false, message: "Token manquant" })).to.be.true;
    });
  });

  describe("POST /logout", () => {
    let req, res;

    beforeEach(() => {
      req = {};
      res = {
        clearCookie: sinon.stub(),
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
    });

    it("should clear the cookie and return success message", async () => {
      await logout(req, res);

      expect(res.clearCookie.calledWith("token")).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ success: true, message: "Déconnexion réussie" })).to.be.true;
    });
  });
});
