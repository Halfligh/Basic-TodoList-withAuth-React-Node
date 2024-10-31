import React from "react";
import TodoList from "../TodoList/TodoList";
import "../AdminDashboard/AdminDashboard.css";

const AdminDashboard = ({ usersWithTasks, onFetchUsersWithTasks, onAddTask }) => {
  return (
    <section className="admin-dashboard">
      {usersWithTasks.map((user) => (
        <div key={user.username} className="user-todo">
          <h3>Todo-list de {user.username}</h3>
          <TodoList
            tasks={user.tasks}
            userId={user._id}
            onAddTask={(taskText, onTaskAdded) => onAddTask(user._id, taskText, onTaskAdded)}
          />
        </div>
      ))}
    </section>
  );
};

export default AdminDashboard;
