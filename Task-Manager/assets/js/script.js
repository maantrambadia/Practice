const createTaskButton = document.querySelector("#create-task-button");
const cancelTaskButton = document.querySelector("#cancel-button");

const taskModule = document.querySelector(".create-task-module");
const createTaskForm = document.querySelector("#create-task-form-body");
const taskCards = document.querySelector(".task-cards");

const createTaskTitle = document.querySelector("#create-task-title");
const createTaskDescription = document.querySelector(
  "#create-task-description",
);
const createButtonModule = document.querySelector("#create-button");

const emptyMessage = document.querySelector(".empty-message");

const navThemeSwitcher = document.querySelector(".nav-theme-switcher");
const html = document.documentElement;

// Initialize from localStorage
let activeTasks = JSON.parse(localStorage.getItem("task")) || [];

let editIndex = null;

// Theme
const theme = () => {
  const currentTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", currentTheme);
  navThemeSwitcher.innerHTML =
    currentTheme === "light"
      ? `<i class="ri-sun-line"></i>`
      : `<i class="ri-moon-line"></i>`;
};

theme();

navThemeSwitcher.addEventListener("click", () => {
  const currentTheme = html.dataset.theme === "light" ? "dark" : "light";
  html.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);

  navThemeSwitcher.innerHTML =
    currentTheme === "light"
      ? `<i class="ri-sun-line"></i>`
      : `<i class="ri-moon-line"></i>`;
});

// Open modal
createTaskButton.addEventListener("click", () => {
  createTaskTitle.textContent = "Create Task";
  createTaskDescription.textContent =
    "Here you can create your task by filling up the details";
  createButtonModule.textContent = "Create";
  editIndex = null;
  createTaskForm.reset();
  taskModule.classList.add("show");
});

// Close modal
cancelTaskButton.addEventListener("click", () => {
  taskModule.classList.remove("show");
});

// Submit form
createTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskTitle = e.target[0].value.trim();
  const taskCategory = e.target[1].value.trim();

  if (!taskTitle || !taskCategory) {
    alert("Please fill all the details.");
    return;
  }

  const taskObject = {
    taskTitle,
    taskCategory,
    completed: false,
  };

  if (editIndex !== null) {
    activeTasks[editIndex] = taskObject;
    editIndex = null;
  } else {
    activeTasks.push(taskObject);
  }

  localStorage.setItem("task", JSON.stringify(activeTasks));

  createTaskForm.reset();
  taskModule.classList.remove("show");

  pushIntoUI();
});

// Render UI
const pushIntoUI = () => {
  taskCards.innerHTML = "";

  if (activeTasks.length > 0) {
    activeTasks.forEach((e, i) => {
      taskCards.innerHTML += `
      <div class="card ${e.completed ? "done" : ""}">
        <h3 style="text-decoration: ${e.completed ? "line-through" : "none"}">
          ${e.taskTitle}
        </h3>

        <div class="category-badge">
          <p>${e.taskCategory}</p>
        </div>

        <div class="buttons">
          <button type="button" onClick="toggleDone(${i})">
            ${e.completed ? "Undo" : "Done"}
          </button>

          <button type="button" onClick="editTask(${i})">
            Edit Task
          </button>

          <button type="button" onClick="deleteTask(${i})">
            Delete Task
          </button>
        </div>
      </div>`;
    });

    emptyMessage.style.display = "none";
  } else {
    emptyMessage.style.display = "flex";
  }
};

pushIntoUI();

// Toggle complete
const toggleDone = (i) => {
  activeTasks[i].completed = !activeTasks[i].completed;
  localStorage.setItem("task", JSON.stringify(activeTasks));
  pushIntoUI();
};

// Edit
const editTask = (i) => {
  const task = activeTasks[i];

  editIndex = i;

  createTaskTitle.textContent = "Edit Task";
  createTaskDescription.textContent =
    "Here you can edit your task by filling up the details";
  createButtonModule.textContent = "Update";

  createTaskForm[0].value = task.taskTitle;
  createTaskForm[1].value = task.taskCategory;

  taskModule.classList.add("show");
};

// Delete
const deleteTask = (i) => {
  activeTasks.splice(i, 1);
  localStorage.setItem("task", JSON.stringify(activeTasks));
  pushIntoUI();
};
