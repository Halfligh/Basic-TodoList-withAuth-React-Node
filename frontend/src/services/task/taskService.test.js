import axios from "axios";
import {
  getAllTasks,
  getUserTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getAllUsersWithTasks,
  API_BASE_URL,
} from "./taskService";

// Mock axios
jest.mock("axios");

describe("taskService", () => {
  test("should call getAllTasks API with correct URL", async () => {
    // Simuler une réponse API réussie
    axios.get.mockResolvedValue({ data: [{ id: 1, text: "Test task" }] });

    // Appel de la fonction
    const response = await getAllTasks();

    // Vérification de l'appel axios avec la bonne URL
    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/api/tasks`);
    expect(response.data).toEqual([{ id: 1, text: "Test task" }]);
  });

  test("should call getUserTasks API with correct URL", async () => {
    const userId = "123";

    // Simuler une réponse API réussie
    axios.get.mockResolvedValue({ data: [{ id: 1, text: "Task for user 123" }] });

    // Appel de la fonction
    const response = await getUserTasks(userId);

    // Vérification de l'appel axios avec le bon URL et userId
    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/api/tasks/user/${userId}`);
    expect(response.data).toEqual([{ id: 1, text: "Task for user 123" }]);
  });

  test("should call getTaskById API with correct URL", async () => {
    const taskId = "456";

    // Simuler une réponse API réussie
    axios.get.mockResolvedValue({ data: { id: 456, text: "Task details" } });

    // Appel de la fonction
    const response = await getTaskById(taskId);

    // Vérification de l'appel axios avec le bon URL et taskId
    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/api/tasks/${taskId}`);
    expect(response.data).toEqual({ id: 456, text: "Task details" });
  });

  test("should call createTask API with correct URL and payload", async () => {
    const taskData = { text: "New task", completed: false };

    // Simuler une réponse API réussie
    axios.post.mockResolvedValue({ data: { id: 789, ...taskData } });

    // Appel de la fonction
    const response = await createTask(taskData);

    // Vérification de l'appel axios avec les bons paramètres
    expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/api/tasks/create`, taskData);
    expect(response.data).toEqual({ id: 789, text: "New task", completed: false });
  });

  test("should call updateTask API with correct URL and payload", async () => {
    const taskId = "456";
    const updatedData = { text: "Updated task", completed: true };

    // Simuler une réponse API réussie
    axios.put.mockResolvedValue({ data: { id: 456, ...updatedData } });

    // Appel de la fonction
    const response = await updateTask(taskId, updatedData);

    // Vérification de l'appel axios avec les bons paramètres
    expect(axios.put).toHaveBeenCalledWith(`${API_BASE_URL}/api/tasks/${taskId}`, updatedData);
    expect(response.data).toEqual({ id: 456, text: "Updated task", completed: true });
  });

  test("should call deleteTask API with correct URL", async () => {
    const taskId = "456";

    // Simuler une réponse API réussie
    axios.delete.mockResolvedValue({ data: { success: true } });

    // Appel de la fonction
    const response = await deleteTask(taskId);

    // Vérification de l'appel axios avec les bons paramètres
    expect(axios.delete).toHaveBeenCalledWith(`${API_BASE_URL}/api/tasks/${taskId}`);
    expect(response.data.success).toBe(true);
  });

  test("should call getAllUsersWithTasks API with correct URL", async () => {
    // Simuler une réponse API réussie
    axios.get.mockResolvedValue({ data: [{ username: "John", tasks: [] }] });

    // Appel de la fonction
    const response = await getAllUsersWithTasks();

    // Vérification de l'appel axios avec la bonne URL
    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/api/tasks/allUsersWithTasks`);
    expect(response.data).toEqual([{ username: "John", tasks: [] }]);
  });
});
