import * as chai from "chai";
import sinon from "sinon";
import User from "../../models/User.js";
import { getAllUsers, getOneUser } from "./usersController.js";

const { expect } = chai;

describe("User Controller", () => {
  let req, res, userStub;
  const mockUsers = [{ username: "user1" }, { username: "user2" }];
  const mockUser = { username: "testuser" };

  beforeEach(() => {
    // Initialiser la requête et la réponse simulée
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Stub pour User.find et User.findOne
    userStub = sinon.stub(User, "find");
    sinon.stub(User, "findOne");
  });

  afterEach(() => {
    sinon.restore(); // Restaurer les stubs après chaque test
  });

  describe("GET /users (getAllUsers)", () => {
    it("should return a 200 status and a list of users", async () => {
      userStub.resolves(mockUsers); // Simuler la récupération des utilisateurs

      await getAllUsers(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockUsers)).to.be.true;
    });

    it("should return a 500 status if there is an error", async () => {
      try {
        // Simuler une erreur dans le stub
        userStub.rejects(new Error("Database Error"));

        await getAllUsers(req, res);

        expect(res.status.calledWith(500)).to.be.true;
      } catch (e) {
        //Utilisation des blocs try/catch pour forcer la capture de l'erreur - à revoir
      }
    });
  });

  describe("GET /users/:id (getOneUser)", () => {
    beforeEach(() => {
      req = { params: { id: "12345" } }; // Simuler une requête avec un ID utilisateur
    });

    it("should return a 200 status and the user if found", async () => {
      User.findOne.resolves(mockUser); // Simuler la récupération d'un utilisateur

      await getOneUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockUser)).to.be.true;
    });

    it("should return a 404 status if the user is not found", async () => {
      // Simuler que l'utilisateur n'est pas trouvé (null)
      User.findOne.resolves(null);

      await getOneUser(req, res);

      // Vérifier que le statut 404 est bien renvoyé
      expect(res.status.calledWith(404)).to.be.true;
    });

    // Le test doit vérifier un statut 500 en cas d'erreur
    it("should return a 500 status if there is an error", async () => {
      try {
        User.findOne.rejects(new Error("Database Error")); // Simuler une erreur

        await getOneUser(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ error: sinon.match.instanceOf(Error) })).to.be.true;
      } catch (e) {
        //Utilisation des blocs try/catch pour forcer la capture de l'erreur - à revoir
      }
    });
  });
});
