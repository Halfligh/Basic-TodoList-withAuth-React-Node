import React, { useState, useEffect } from "react";
import { getUserTasks, createTask, updateTask, deleteTask } from "../../services/task/taskService";
import { getCookie } from "../../utils/cookie.js";
import { decodeToken } from "../../utils/decodeToken.js";
import "../TodoList/TodoList.css";
import adminIcon from "../../assets/images/admin-icon.png";

const TodoList = ({ title = "ToDoList", tasks: initialTasks = [], userId, onAddTask }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");

  // Récupérer l'id de l'utilisateur actuel via le token stocké dans le cookie
  useEffect(() => {
    const token = getCookie("token"); // Récupère le token dans le cookie
    if (token) {
      const decodedToken = decodeToken(token); // Décoder le token pour obtenir le userId
      setCurrentUser(decodedToken.userId); // Stocke le userId dans l'état
    }
  }, []);

  // Si initialTasks est vide et currentUser est défini, charger les tâches une seule fois.
  useEffect(() => {
    if (!initialTasks.length && currentUser) {
      loadTasks(currentUser);
    }
    // On ne met pas initialTasks dans le tableau de dépendances pour éviter les appels infinis
  }, [currentUser, initialTasks.length]);

  // Fonction pour charger les tâches depuis l'API
  const loadTasks = async (userId) => {
    try {
      const response = await getUserTasks(userId); // Passer l'ID utilisateur
      setTasks(response.data); // Stocker les tâches dans le state
    } catch (error) {
      console.error("Erreur lors du chargement des tâches", error);
    }
  };

  // Fonction pour ajouter une nouvelle tâche
  const addTask = async () => {
    if (newTask.trim()) {
      if (onAddTask && userId) {
        await onAddTask(userId, newTask, () => loadTasks(userId)); // Passer loadTasks comme callback
        setNewTask(""); // Réinitialiser le champ de nouvelle tâche
      } else {
        const taskData = {
          text: newTask,
          completed: false,
          addByAdmin: false, // L'utilisateur actuel ajoute la tâche pour lui-même
          ownerId: currentUser, // Assigner la tâche au currentUser (utilisateur actuel)
        };
        try {
          const response = await createTask(taskData); // Créer la tâche via l'API
          if (response.data && response.data._id) {
            setTasks([...tasks, response.data]); // Mise à jour de la liste des tâches
            setNewTask(""); // Réinitialiser le champ
          } else {
            console.error("Erreur : la tâche n’a pas d’ID");
          }
        } catch (error) {
          console.error("Erreur lors de la création de la tâche", error);
        }
      }
    } else {
      console.log("Le champ de la nouvelle tâche est vide.");
    }
  };

  // Fonction pour inverser le statut d'une tâche
  const toggleTaskStatus = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed }; // Inverser l'état de la tâche
      await updateTask(task._id, updatedTask); // Utilisation du service pour mettre à jour la tâche
      setTasks(tasks.map((t) => (t._id === task._id ? updatedTask : t))); // Mettre à jour l'état local
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche", error);
    }
  };

  // Fonction pour supprimer une tâche
  const removeTask = async (taskId, index) => {
    try {
      await deleteTask(taskId); // Utilisation du service pour supprimer la tâche
      setTasks(tasks.filter((task) => task._id !== taskId));
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
          <li key={task._id || index} className={task.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskStatus(task)}
            />
            {task.addByAdmin && <img src={adminIcon} alt="admin icon" className="admin-icon" />}
            <span>{task.text}</span>
            <button onClick={() => removeTask(task._id, index)} className="delete-button">
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
