const API_URL = "/tasks";

async function fetchTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center border p-2 rounded bg-gray-50";

    const span = document.createElement("span");
    span.textContent = task.title;

    if (task.completed) {
      span.className = "line-through text-gray-400";
    }

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "flex gap-2";

    const doneBtn = document.createElement("button");
    doneBtn.textContent = task.completed ? "Undo" : "Done";
    doneBtn.className = "bg-green-500 text-white px-2 py-1 rounded hover:bg-green-800";
    doneBtn.onclick = () => toggleTask(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "bg-red-500 text-white px-2 py-1 rounded hover:bg-red-800";
    deleteBtn.onclick = () => deleteTask(task.id);

    buttonsDiv.appendChild(doneBtn);
    buttonsDiv.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttonsDiv);
    taskList.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const title = input.value.trim();

  if (!title) {
    alert("Please enter a task");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });

  input.value = "";
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}

async function toggleTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "PATCH" });
  fetchTasks();
}

// Load tasks on page load
fetchTasks();
