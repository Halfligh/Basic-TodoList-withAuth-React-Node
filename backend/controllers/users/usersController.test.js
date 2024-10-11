import * as chai from "chai";
import sinon from "sinon";
import User from "../../models/User.js";
import { getAllUsers, getOneUser } from "./usersController.js";

const { expect } = chai;

describe("User Controller", () => {
  describe("GET /users (getAllUsers)", () => {
    let req, res, userStub;

    beforeEach(() => {
      req = {}; // Pas de requête spécifique nécessaire pour getAllUsers
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Stub pour User.find
      userStub = sinon.stub(User, "find");
    });

    afterEach(() => {
      sinon.restore(); // Restaurer les stubs après chaque test
    });

    it("should return a 200 status and a list of users", async () => {
      const mockUsers = [{ username: "user1" }, { username: "user2" }];
      userStub.resolves(mockUsers);

      await getAllUsers(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockUsers)).to.be.true;
    });

    it("should return a 400 status if there is an error", async () => {
      userStub.rejects(new Error("Database Error"));

      await getAllUsers(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: sinon.match.instanceOf(Error) })).to.be.true;
    });
  });

  describe("GET /users/:id (getOneUser)", () => {
    let req, res, userStub;

    beforeEach(() => {
      req = { params: { id: "12345" } }; // Simuler une requête avec un ID utilisateur
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Stub pour User.findOne
      userStub = sinon.stub(User, "findOne");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should return a 200 status and the user if found", async () => {
      const mockUser = { username: "testuser" };
      userStub.resolves(mockUser);

      await getOneUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockUser)).to.be.true;
    });

    it("should return a 500 status if there is an error", async () => {
      userStub.rejects(new Error("Database Error"));

      await getOneUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: sinon.match.instanceOf(Error) })).to.be.true;
    });
  });
});
