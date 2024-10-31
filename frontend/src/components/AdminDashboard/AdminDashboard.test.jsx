import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminDashboard from "./AdminDashboard";
import { getAllUsersWithTasks, createTask, getUserTasks } from "../../services/task/taskService";

// Mock the API services
jest.mock("../../services/task/taskService");

describe("AdminDashboard Component", () => {
  const mockUsersWithTasks = [
    {
      username: "user1",
      _id: "1",
      tasks: [{ text: "Tâche 1", completed: false }],
    },
    {
      username: "user2",
      _id: "2",
      tasks: [{ text: "Tâche 2", completed: false }],
    },
  ];

  beforeEach(() => {
    // Mock the initial fetch of all users with tasks
    getAllUsersWithTasks.mockResolvedValue({ data: mockUsersWithTasks });

    // Mock the initial fetch for each individual user's tasks in TodoList
    getUserTasks.mockResolvedValue({ data: mockUsersWithTasks[0].tasks });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display the todo lists for each user", async () => {
    render(<AdminDashboard userRoles={["admin"]} />);

    await waitFor(() => {
      expect(screen.getByText(/Todo-list de user1/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Todo-list de user2/i)).toBeInTheDocument();
    });
  });

  it("should handle task addition for a specific user", async () => {
    render(<AdminDashboard userRoles={["admin"]} />);

    const taskText = "Nouvelle Tâche";
    createTask.mockResolvedValue({
      data: { text: taskText, completed: false, addByAdmin: true, ownerId: "1" },
    });

    // Mock getAllUsersWithTasks to return updated tasks after addition
    getAllUsersWithTasks.mockResolvedValueOnce({
      data: [
        {
          username: "user1",
          _id: "1",
          tasks: [
            { text: "Tâche 1", completed: false },
            { text: taskText, completed: false },
          ],
        },
        {
          username: "user2",
          _id: "2",
          tasks: [{ text: "Tâche 2", completed: false }],
        },
      ],
    });

    // Mock getUserTasks to return the updated tasks for the specific user
    getUserTasks.mockResolvedValueOnce({
      data: [
        { text: "Tâche 1", completed: false },
        { text: taskText, completed: false },
      ],
    });

    // Select the user1 container by data-testid
    const user1Container = await screen.findByTestId("user-1-todo");

    // Use within to limit the scope to user1's todo list section
    const input = within(user1Container).getByPlaceholderText("Ajouter une nouvelle tâche");
    fireEvent.change(input, { target: { value: taskText } });
    const addButton = within(user1Container).getByText("Ajouter");
    fireEvent.click(addButton);

    // Verify createTask call
    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({
        text: taskText,
        completed: false,
        addByAdmin: true,
        ownerId: "1",
      });
    });

    // Verify that getAllUsersWithTasks was re-fetched and the new task is displayed
    await waitFor(() => {
      expect(screen.getByText(taskText)).toBeInTheDocument();
    });
  });
});
