import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const addTask = () => {
    if (task.trim() !== "") {
      const newTask = {
        id: Date.now(),
        text: task,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };
      setTasks([...tasks, newTask]);
      setTask("");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">To-Do List</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter your task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addTask}>
          Add Task
        </button>
      </div>

      <ul className="list-group">
        {tasks.length === 0 && (
          <li className="list-group-item text-center">No tasks added yet!</li>
        )}
        {tasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{task.text}</strong>
              <br />
              <small className="text-muted">
                Added on {task.date} at {task.time}
              </small>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
