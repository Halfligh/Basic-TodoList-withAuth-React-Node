import React, { useState, useEffect } from "react";
import { getAllUsersWithTasks, createTask } from "../../services/task/taskService.js";
import TodoList from "../TodoList/TodoList";
import "../AdminDashboard/AdminDashboard.css";

const AdminDashboard = ({ userRoles }) => {
  const [usersWithTasks, setUsersWithTasks] = useState([]);

  useEffect(() => {
    if (userRoles.includes("admin")) {
      // Récupérer tous les utilisateurs avec leurs tâches
      getAllUsersWithTasks()
        .then((response) => {
          setUsersWithTasks(response.data);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des utilisateurs et des tâches", error);
        });
    }
  }, [userRoles]);

  const handleAddTaskForUser = async (userId, taskText) => {
    try {
      const newTask = {
        text: taskText,
        completed: false,
        addByAdmin: true,
        ownerId: userId, // L'ID de l'utilisateur pour lequel la tâche est créée
      };
      await createTask(newTask); // Appel au service pour créer la tâche
      // Recharger les tâches après l'ajout
      const updatedUsers = await getAllUsersWithTasks();
      setUsersWithTasks(updatedUsers.data);
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une tâche pour l'utilisateur", error);
    }
  };

  return (
    <section className="admin-dashboard">
      {usersWithTasks.map((user) => (
        <div key={user.username} className="user-todo">
          <h3>Todo-list de {user.username}</h3>
          {console.log(`Passing onAddTask to TodoList for user: ${user._id}`)}
          {console.log("User object:", user)} {/* Log pour vérifier la structure de l'objet */}
          {/* Log pour vérifier */}
          <TodoList tasks={user.tasks} userId={user._id} onAddTask={handleAddTaskForUser} />
        </div>
      ))}
    </section>
  );
};

export default AdminDashboard;
