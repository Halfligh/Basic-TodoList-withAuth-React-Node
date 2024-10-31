import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoList from "./TodoList";
import { getUserTasks, createTask, updateTask, deleteTask } from "../../services/task/taskService";

// Mock the API services
jest.mock("../../services/task/taskService");

describe("TodoList Component", () => {
  const mockTasks = [
    { _id: "1", text: "Task 1", completed: false, addByAdmin: false },
    { _id: "2", text: "Task 2", completed: true, addByAdmin: true },
  ];

  beforeEach(() => {
    // Mock API calls
    getUserTasks.mockResolvedValue({ data: mockTasks });
    createTask.mockResolvedValue({
      data: { _id: "3", text: "New Task", completed: false, addByAdmin: false },
    });
    updateTask.mockResolvedValue({});
    deleteTask.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render initial tasks", async () => {
    render(<TodoList title="My Todo List" tasks={mockTasks} userId="1" />);

    // Check initial tasks are rendered
    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });
  });

  it("should add a new task", async () => {
    // Mock onAddTask to update tasks after adding a new task
    const onAddTaskMock = jest.fn(async (userId, taskText, callback) => {
      await createTask({ text: taskText, completed: false, addByAdmin: false, ownerId: userId });
      await getUserTasks.mockResolvedValueOnce({
        data: [...mockTasks, { _id: "3", text: "New Task", completed: false, addByAdmin: false }],
      });
      callback(); // Trigger the callback to refresh tasks
    });

    render(
      <TodoList title="My Todo List" tasks={mockTasks} userId="1" onAddTask={onAddTaskMock} />
    );

    const input = screen.getByPlaceholderText("Ajouter une nouvelle tâche");
    fireEvent.change(input, { target: { value: "New Task" } });

    const addButton = screen.getByText("Ajouter");
    fireEvent.click(addButton);

    // Verify that onAddTaskMock was called with the correct parameters
    await waitFor(() => {
      expect(onAddTaskMock).toHaveBeenCalledWith("1", "New Task", expect.any(Function));
    });

    // Verify that createTask was called within onAddTaskMock with correct data
    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({
        text: "New Task",
        completed: false,
        addByAdmin: false,
        ownerId: "1",
      });
    });

    // Check that the new task is displayed
    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });
  });

  it("should toggle task completion status", async () => {
    render(<TodoList title="My Todo List" tasks={mockTasks} userId="1" />);

    const taskCheckbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(taskCheckbox);

    // Verify updateTask was called with the toggled task
    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith("1", { ...mockTasks[0], completed: true });
    });
  });

  it("should delete a task", async () => {
    render(<TodoList title="My Todo List" tasks={mockTasks} userId="1" />);

    const deleteButton = screen.getAllByText("Supprimer")[0];
    fireEvent.click(deleteButton);

    // Verify deleteTask was called with the correct task ID
    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith("1");
    });

    // Verify task is removed from the document
    await waitFor(() => {
      expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    });
  });
});
