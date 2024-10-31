import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Pour les assertions comme toBeInTheDocument
import AdminDashboard from "./AdminDashboard";

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

  // Mocks pour les fonctions passées en props
  const mockOnFetchUsersWithTasks = jest.fn();
  const mockOnAddTask = jest.fn();

  it("should display the todo lists for each user", () => {
    render(
      <AdminDashboard
        usersWithTasks={mockUsersWithTasks}
        onFetchUsersWithTasks={mockOnFetchUsersWithTasks}
        onAddTask={mockOnAddTask}
      />
    );

    // Vérifier que chaque utilisateur et sa todo-list sont affichés
    expect(screen.getByText(/Todo-list de user1/i)).toBeInTheDocument();
    expect(screen.getByText(/Todo-list de user2/i)).toBeInTheDocument();
  });

  it("should handle task addition for a user", () => {
    render(
      <AdminDashboard
        usersWithTasks={mockUsersWithTasks}
        onFetchUsersWithTasks={mockOnFetchUsersWithTasks}
        onAddTask={mockOnAddTask}
      />
    );

    // Appel de la fonction onAddTask lors de l'ajout d'une tâche
    const taskText = "Nouvelle Tâche";
    const onTaskAdded = jest.fn();
    mockOnAddTask(mockUsersWithTasks[0]._id, taskText, onTaskAdded);

    // Vérifier que onAddTask est appelée correctement
    expect(mockOnAddTask).toHaveBeenCalledWith(mockUsersWithTasks[0]._id, taskText, onTaskAdded);
  });
});
