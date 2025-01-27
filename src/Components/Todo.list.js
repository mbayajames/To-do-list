import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [activity, setActivity] = useState("");
  const [status, setStatus] = useState("Not Done");
  const [selectedDate, setSelectedDate] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks from JSON Server
  useEffect(() => {
    axios
      .get("http://localhost:4000/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Add or Update a Task
  const handleAddOrUpdateTask = (e) => {
    e.preventDefault();

    if (!date || !day || !activity) {
      alert("All fields are required!");
      return;
    }

    const taskData = { date, day, activity, status };

    if (editingTask) {
      // Update Task
      axios
        .put(`http://localhost:4000/tasks/${editingTask.id}`, taskData)
        .then(() => {
          setTasks(
            tasks.map((task) =>
              task.id === editingTask.id ? { ...task, ...taskData } : task
            )
          );
          resetForm();
        })
        .catch((error) => console.error("Error updating task:", error));
    } else {
      // Add Task
      const newTask = { id: Date.now(), ...taskData };
      axios
        .post("http://localhost:4000/tasks", newTask)
        .then((response) => {
          setTasks([...tasks, response.data]);
          resetForm();
        })
        .catch((error) => console.error("Error adding task:", error));
    }
  };

  // Reset form fields and editing state
  const resetForm = () => {
    setDate("");
    setDay("");
    setActivity("");
    setStatus("Not Done");
    setEditingTask(null);
  };

  // Edit a task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setDate(task.date);
    setDay(task.day);
    setActivity(task.activity);
    setStatus(task.status);
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    axios
      .delete(`http://localhost:4000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  // Toggle task status
  const handleToggleStatus = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, status: task.status === "Done" ? "Not Done" : "Done" }
        : task
    );

    const updatedTask = updatedTasks.find((task) => task.id === id);

    axios
      .put(`http://localhost:4000/tasks/${id}`, updatedTask)
      .then(() => setTasks(updatedTasks))
      .catch((error) => console.error("Error updating status:", error));
  };

  // Filter tasks by selected date
  const filteredTasks = selectedDate
    ? tasks.filter((task) => task.date === selectedDate)
    : tasks;

  return (
    <div className="container mt-5">
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white text-center rounded-top">
          <h1>Personal Planner</h1>
        </div>
        <div className="card-body p-4">
          {/* Add/Edit Task Form */}
          <form onSubmit={handleAddOrUpdateTask} className="mb-4">
            <div className="mb-3">
              <label className="form-label fw-bold">Date</label>
              <input
                type="date"
                className="form-control rounded-pill shadow-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Day</label>
              <input
                type="text"
                className="form-control rounded-pill shadow-sm"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="e.g., Monday"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Activity</label>
              <input
                type="text"
                className="form-control rounded-pill shadow-sm"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="e.g., Morning Run"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Status</label>
              <select
                className="form-control rounded-pill shadow-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Not Done">Not Done</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-pill shadow">
              {editingTask ? "Update Task" : "Add Task"}
            </button>
          </form>

          {/* Filter by Date */}
          <div className="mb-4">
            <label className="form-label fw-bold">Filter by Date</label>
            <input
              type="date"
              className="form-control rounded-pill shadow-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Task List */}
          <h3 className="text-center mb-4">Task List</h3>
          {filteredTasks.length > 0 ? (
            <ul className="list-group">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="list-group-item d-flex justify-content-between align-items-center shadow-sm mb-2 rounded"
                >
                  <div>
                    <strong>{task.activity}</strong>
                    <br />
                    <small>
                      {task.day}, {task.date}
                    </small>
                    <br />
                    <span
                      className={`badge ${
                        task.status === "Done" ? "bg-success" : "bg-warning"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-secondary me-2 rounded-pill"
                      onClick={() => handleToggleStatus(task.id)}
                    >
                      Toggle Status
                    </button>
                    <button
                      className="btn btn-sm btn-info me-2 rounded-pill"
                      onClick={() => handleEditTask(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger rounded-pill"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-center">No tasks available for this date.</p>
          )}
        </div>
        <div className="card-footer text-center text-muted rounded-bottom">
          <small>Plan your day efficiently!</small>
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
