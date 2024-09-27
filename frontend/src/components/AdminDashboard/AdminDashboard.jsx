import React, { useState, useEffect } from "react";
import { getAllUsersWithTasks } from "../../services/task/taskService.js";
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

  return (
    <section className="admin-dashboard">
      {usersWithTasks.map((user) => (
        <div key={user.username} className="user-todo">
          <h3>Todo-list de {user.username}</h3>
          <TodoList tasks={user.tasks} />
        </div>
      ))}
    </section>
  );
};

export default AdminDashboard;
