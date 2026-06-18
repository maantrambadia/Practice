const createTaskButton = document.querySelector("#create-task-button");
const cancelTaskButton = document.querySelector("#cancel-button");

const taskModule = document.querySelector(".create-task-module");
const createTaskForm = document.querySelector("#create-task-form-body");
const taskCards = document.querySelector(".task-cards");
const deleteTaskButton = document.querySelector("#delete-task-button");

const createTaskTitle = document.querySelector("#create-task-title");
const createTaskDescription = document.querySelector(
  "#create-task-description",
);
const createButtonModule = document.querySelector("#create-button");

const emptyMessage = document.querySelector(".empty-message");

const navThemeSwitcher = document.querySelector(".nav-theme-switcher");
const html = document.documentElement;

const activeTasks = [];

let editIndex = null;

const theme = () => {
  const currentTheme = localStorage.getItem("theme") || "light";
  if (currentTheme === "light") {
    html.setAttribute("data-theme", "light");
    navThemeSwitcher.innerHTML = `<i class="ri-sun-line"></i>`;
  } else {
    html.setAttribute("data-theme", "dark");
    navThemeSwitcher.innerHTML = `<i class="ri-moon-line"></i>`;
  }
};

theme();

navThemeSwitcher.addEventListener("click", () => {
  const currentTheme = html.dataset.theme;
  if (currentTheme === "light") {
    html.setAttribute("data-theme", "dark");
    navThemeSwitcher.innerHTML = `<i class="ri-moon-line"></i>`;
    const currentThemeLocalStorage = localStorage.setItem("theme", "dark");
  } else {
    html.setAttribute("data-theme", "light");
    navThemeSwitcher.innerHTML = `<i class="ri-sun-line"></i>`;
    const currentThemeLocalStorage = localStorage.setItem("theme", "light");
  }
});

createTaskButton.addEventListener("click", () => {
  createTaskTitle.textContent = "Create Task";
  createTaskDescription.textContent =
    "Here you can create your task by filling up the details";
  createButtonModule.textContent = "Create";
  taskModule.classList.add("show");
});

cancelTaskButton.addEventListener("click", () => {
  taskModule.classList.remove("show");
});

createTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskTitle = e.target[0].value;
  const taskCategory = e.target[1].value;

  if (taskTitle.trim() === "" || taskCategory.trim() === "") {
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
    localStorage.setItem("task", JSON.stringify(activeTasks));
    editIndex = null;
  } else {
    activeTasks.push(taskObject);
    localStorage.setItem("task", JSON.stringify(activeTasks));
  }

  createTaskForm.reset();
  taskModule.classList.remove("show");

  pushIntoUI();
});

const pushIntoUI = () => {
  taskCards.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("task")) || [];

  if (tasks.length > 0) {
    tasks.forEach((e, i) => {
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

const toggleDone = (i) => {
  activeTasks[i].completed = !activeTasks[i].completed;
  localStorage.setItem("task", JSON.stringify(activeTasks));
  pushIntoUI();
};

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

const deleteTask = (i) => {
  activeTasks.splice(i, 1);
  localStorage.setItem("task", JSON.stringify(activeTasks));
  pushIntoUI();
};
