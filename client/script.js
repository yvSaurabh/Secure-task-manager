const baseURL = "";

async function register() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const res = await fetch(`${baseURL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  alert(data.message);
}

async function login() {
  const email = document.getElementById("logEmail").value;
  const password = document.getElementById("logPassword").value;

  const res = await fetch(`${baseURL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    window.location.href = "dashboard.html";
  } else {
    alert(data.message);
  }
}

async function createTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  const res = await fetch(`${baseURL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, description })
  });

  const data = await res.json();
  alert(data.message);
  loadTasks();
}

async function loadTasks() {

  const list = document.getElementById("taskList");

  // If taskList element does not exist, stop function
  if (!list) return;

  const res = await fetch(`${baseURL}/api/tasks`, {
    credentials: "include"
  });

  // If unauthorized, stop silently
  if (!res.ok) {
    console.log("Unauthorized or not logged in");
    return;
  }

  const data = await res.json();
  list.innerHTML = "";

  data.tasks.forEach(task => {
    const li = document.createElement("li");

    li.classList.add("task");

    li.innerHTML = `
      <strong>${task.title}</strong><br>
      ${task.description}<br>
      <span style="color:${task.status === 'completed' ? 'green' : 'red'}">
        ${task.status}
      </span><br><br>
      ${task.status !== "completed"
        ? `<button class="success" onclick="updateTask('${task._id}')">Mark Completed</button>`
        : `<span style="color:green;">✔ Completed</span>`
      }
      <button class="danger" onclick="deleteTask('${task._id}')">Delete</button>
      <hr>
    `;

    list.appendChild(li);
  });
}

async function deleteTask(id) {
  await fetch(`${baseURL}/api/tasks/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  loadTasks();
}

async function updateTask(id) {
  const res = await fetch(`${baseURL}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status: "completed" })
  });

  const data = await res.json();
  console.log(data.message);

  loadTasks();  // Re-fetch fresh data
}
// clear input 
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");

if (titleInput) titleInput.value = "";
if (descInput) descInput.value = "";
loadTasks();
async function logout() {
  await fetch(`${baseURL}/api/auth/logout`, {
    method: "POST",
    credentials: "include"
  });
  window.location.href = "index.html";
}