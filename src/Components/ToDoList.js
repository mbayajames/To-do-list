import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Correctly import the CSS

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [activity, setActivity] = useState("");
  const [status, setStatus] = useState("Not Done");
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks from db.json
  useEffect(() => {
    axios.get("http://localhost:4000/tasks").then((response) => {
      setTasks(response.data);
    });
  }, []);

  // Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (task.trim() !== "" && date.trim() !== "" && day.trim() !== "") {
      const newTask = {
        id: Date.now(),
        text: task,
        date,
        day,
        activity,
        status,
      };

      axios.post("http://localhost:4000/tasks", newTask).then(() => {
        setTasks([...tasks, newTask]);
        setTask("");
        setDate("");
        setDay("");
        setActivity("");
        setStatus("Not Done");
      });
    }
  };

  // Delete a task
  const handleDelete = (id) => {
    axios.delete(`http://localhost:4000/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  // Open editing modal
  const handleEdit = (task) => {
    setEditingTask(task);
  };

  // Save the edited task
  const handleSaveEdit = () => {
    axios
      .put(`http://localhost:4000/tasks/${editingTask.id}`, editingTask)
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === editingTask.id ? editingTask : task
          )
        );
        setEditingTask(null);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">To-Do List</h1>

      {/* Add Task Form */}
      <Form onSubmit={handleAddTask} className="mb-4">
        <Form.Group controlId="taskInput">
          <Form.Label>Task</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a new task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="dateInput" className="mt-2">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="dayInput" className="mt-2">
          <Form.Label>Day</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter day (e.g., Monday)"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="activityInput" className="mt-2">
          <Form.Label>Activity</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter activity description"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="statusInput" className="mt-2">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Not Done">Not Done</option>
            <option value="Done">Done</option>
          </Form.Control>
        </Form.Group>

        <Button type="submit" className="mt-3 w-100" variant="primary">
          Add Task
        </Button>
      </Form>

      {/* Task List */}
      <ListGroup>
        {tasks.map((task) => (
          <ListGroup.Item
            key={task.id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{task.text}</strong>
              <br />
              <small>
                {task.date} ({task.day})
              </small>
              <br />
              <small>Activity: {task.activity}</small>
              <br />
              <small>Status: {task.status}</small>
            </div>
            <div>
              <Button
                variant="warning"
                size="sm"
                className="me-2"
                onClick={() => handleEdit(task)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Edit Modal */}
      {editingTask && (
        <Modal show onHide={() => setEditingTask(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Task</Form.Label>
              <Form.Control
                type="text"
                value={editingTask.text}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, text: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editingTask.date}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, date: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Day</Form.Label>
              <Form.Control
                type="text"
                value={editingTask.day}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, day: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Activity</Form.Label>
              <Form.Control
                type="text"
                value={editingTask.activity}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, activity: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={editingTask.status}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, status: e.target.value })
                }
              >
                <option value="Not Done">Not Done</option>
                <option value="Done">Done</option>
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditingTask(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ToDoList;







