const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const PORT = 3000;
//middleware to parse json object
app.use(express.json());
app.use(express.static("public"));


// Path to tasks.json
const FILE_PATH = path.join(__dirname, "tasks.json");

// Helper function to read tasks
function readTasks() {
  const data = fs.readFileSync(FILE_PATH, "utf8");
  return JSON.parse(data);
}

// Helper function to write tasks
function writeTasks(tasks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

//List all tasks
app.get("/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

//Add a new task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Task title is required" });
  }

  const tasks = readTasks();

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    completed: false // ✅ ADD THIS
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});


app.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  let tasks = readTasks();
  const updatedTasks = tasks.filter(task => task.id !== taskId);

  if (tasks.length === updatedTasks.length) {
    return res.status(404).json({ error: "Task not found" });
  }

  writeTasks(updatedTasks);
  res.json({ message: "Task deleted successfully" });
});

// Toggle task completion
app.patch("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const tasks = readTasks();

  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  task.completed = !task.completed;
  writeTasks(tasks);

  res.json(task);
});


app.listen(PORT,()=>{
    console.log(`Server Started on http://localhost:${PORT}`);
})

