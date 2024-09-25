import React, { useState, useEffect } from "react";
import axios from "axios";

const TodoList = ({ title = "ToDoList", username = "", isAdmin = false }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  // Charger les tâches au montage du composant
  useEffect(() => {
    if (!tasks.length) {
      loadTasks();
    }
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const response = await axios.get("/api/tasks"); // Remplacer par votre API réelle
      setTasks(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des tâches", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim()) {
      const taskText = newTask;
      const addByAdmin = isAdmin && currentUser !== username;
      const taskPayload = { text: taskText, completed: false, addByAdmin };

      try {
        const response =
          currentUser === username || !isAdmin
            ? await axios.post("/api/tasks", taskPayload) // Ajout normal
            : await axios.post(`/api/users/${username}/tasks`, taskPayload); // Pour un autre utilisateur

        if (response.data && response.data.id) {
          setTasks([...tasks, response.data]);
          console.log(`Tâche créée avec succès pour ${username}`);
          setNewTask("");
        } else {
          console.error("Erreur : la tâche n’a pas d’ID");
        }
      } catch (error) {
        console.error("Erreur lors de la création de la tâche", error);
      }
    } else {
      console.log("Le champ de la nouvelle tâche est vide.");
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      await axios.put(`/api/tasks/${task.id}`, { completed: task.completed });
      console.log(`Tâche mise à jour : ${task.text} - Complétée : ${task.completed}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche", error);
      task.completed = !task.completed; // Révertir l'état en cas d'erreur
    }
  };

  const deleteTask = async (taskId, index) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche", error);
    }
  };

  return (
    <div className="todo-container">
      <h2>{title}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <input
          type="text"
          placeholder="Ajouter une nouvelle tâche"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
          className="todo-input"
        />
        <button type="submit" className="add-button">
          Ajouter
        </button>
      </form>

      <ul className="todo-list">
        {tasks.map((task, index) => (
          <li key={index} className={task.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                task.completed = !task.completed;
                toggleTaskStatus(task);
              }}
            />
            {task.addByAdmin && (
              <img src="/assets/images/admin-icon.png" alt="admin icon" className="admin-icon" />
            )}
            <span>{task.text}</span>
            <button onClick={() => deleteTask(task.id, index)} className="delete-button">
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
