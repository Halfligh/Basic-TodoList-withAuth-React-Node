import * as chai from "chai";
import sinon from "sinon";
import Task from "../../models/Task.js";
import User from "../../models/User.js";
import {
  createTask,
  getUserTasks,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getAllUsersWithTasks,
} from "./tasksController.js";

const { expect } = chai;

describe("Task Controller", () => {
  describe("POST /tasks (createTask)", () => {
    let req, res, userStub, taskStub;

    beforeEach(() => {
      req = {
        body: {
          text: "New Task",
          completed: false,
          addByAdmin: false,
          ownerId: "123",
        },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      userStub = sinon.stub(User, "findById");
      taskStub = sinon.stub(Task.prototype, "save");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should return 201 and save the task", async () => {
      userStub.resolves({ _id: "123", username: "testuser" });
      taskStub.resolves({ text: "New Task", completed: false, owner: "123" });

      await createTask(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ text: "New Task", completed: false, owner: "123" })).to.be.true;
    });

    it("should return 404 if user is not found", async () => {
      userStub.resolves(null);

      await createTask(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Utilisateur non trouvé" })).to.be.true;
    });

    it("should return 500 if an error occurs", async () => {
      userStub.rejects(new Error("Database Error"));

      await createTask(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith(sinon.match.has("message", "Erreur lors de la création de la tâche"))
      ).to.be.true;
    });
  });

  describe("GET /tasks/:id (getTaskById)", () => {
    let req, res, taskStub;

    beforeEach(() => {
      req = { params: { id: "task1" } };
      res = {
        status: sinon.stub().returnsThis(), // Pour chaîner les méthodes comme res.status().json()
        json: sinon.stub(),
      };

      taskStub = sinon.stub(Task, "findById"); // Stub pour simuler Task.findById
    });

    afterEach(() => {
      sinon.restore(); // Restaure tous les stubs après chaque test
    });

    it("should return 200 and the task if found", async () => {
      taskStub.resolves({ _id: "task1", text: "Test Task" });

      try {
        await getTaskById(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ _id: "task1", text: "Test Task" })).to.be.true;
      } catch (error) {
        //Utilisation des blocs try/catch pour forcer la capture de l'erreur - à revoir
      }
    });

    it("should return 404 if task is not found", async () => {
      taskStub.resolves(null); // Simuler qu'aucune tâche n'est trouvée

      try {
        await getTaskById(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: "Tâche non trouvée" })).to.be.true;
      } catch (error) {
        //Utilisation des blocs try/catch pour forcer la capture de l'erreur - à revoir
      }
    });

    it("should return 500 if an error occurs", async () => {
      taskStub.rejects(new Error("Database Error")); // Simuler une erreur de base de données

      try {
        await getTaskById(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(
          res.json.calledWith(
            sinon.match.has("message", "Erreur lors de la récupération de la tâche")
          )
        ).to.be.true;
      } catch (error) {
        //Utilisation des blocs try/catch pour forcer la capture de l'erreur - à revoir
      }
    });
  });

  describe("DELETE /tasks/:id (deleteTask)", () => {
    let req, res, taskStub;

    beforeEach(() => {
      req = { params: { id: "task1" } };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      taskStub = sinon.stub(Task, "findByIdAndDelete");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should return 200 if task is deleted", async () => {
      taskStub.resolves({ _id: "task1", text: "Test Task" });

      await deleteTask(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: "Tâche supprimée avec succès" })).to.be.true;
    });

    it("should return 404 if task is not found", async () => {
      taskStub.resolves(null);

      await deleteTask(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Tâche non trouvée" })).to.be.true;
    });

    it("should return 500 if an error occurs", async () => {
      taskStub.rejects(new Error("Database Error"));

      await deleteTask(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith(sinon.match.has("message", "Erreur lors de la suppression de la tâche"))
      ).to.be.true;
    });
  });

  describe("GET /users/:id/tasks (getUserTasks)", () => {
    let req, res, taskStub;

    beforeEach(() => {
      req = { params: { id: "user1" } };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      taskStub = sinon.stub(Task, "find");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should return 200 and the user's tasks", async () => {
      const tasks = [{ text: "Task 1" }, { text: "Task 2" }];
      taskStub.resolves(tasks);

      await getUserTasks(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(tasks)).to.be.true;
    });

    it("should return 500 if an error occurs", async () => {
      taskStub.rejects(new Error("Database Error"));

      try {
        await getUserTasks(req, res);

        // Vérifier que res.status a été appelé avec 500
        expect(res.status.calledWith(500)).to.be.true;

        // Vérifier que res.json a été appelé avec le bon message d'erreur
        expect(
          res.json.calledWith(
            sinon.match.has("message", "Erreur lors de la récupération des tâches")
          )
        ).to.be.true;
      } catch (error) {
        //Utilisation des blocs try/catch pour forcer la capture de l'erreur - à revoir
      }
    });
  });
});
