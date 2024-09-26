import React, { useState, useEffect } from "react";
import { getAllUsersWithTasks } from "../../services/task/taskService";
import TodoList from "../TodoList/TodoList";

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
    <section className="admin-todo-lists">
      <div className="users-todo-lists">
        {usersWithTasks.map((user) => (
          <div key={user.username} className="user-todo">
            <h3>{user.username}'s Todo-list</h3>
            <TodoList tasks={user.tasks} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminDashboard;
