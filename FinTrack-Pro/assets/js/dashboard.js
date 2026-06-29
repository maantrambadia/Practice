const logoutButton = document.querySelector("#logout-button");
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view-section");

const modal = document.getElementById("transactionModal");
const openBtn = document.getElementById("openAddModalBtn");
const cancelBtn = document.getElementById("cancelModal");

const form = document.getElementById("transactionForm");

const txType = document.getElementById("txType");
const txAmount = document.getElementById("txAmount");
const txDescription = document.getElementById("txDescription");
const txDate = document.getElementById("txDate");
const txCategory = document.getElementById("txCategory");

const tableBody = document.getElementById("transactionTableBody");

const displayBalance = document.getElementById("displayBalance");
const displayIncome = document.getElementById("displayIncome");
const displayExpense = document.getElementById("displayExpense");
const displayTransactions = document.getElementById("displayTransactions");

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

logoutButton.addEventListener("click", () => {
  logoutUser();
});

navItems.forEach((btn) => {
  btn.addEventListener("click", () => {
    navItems.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.getAttribute("data-target");

    views.forEach((view) => view.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
  form.reset();
});

cancelBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    type: txType.value,
    amount: parseFloat(txAmount.value),
    description: txDescription.value.trim(),
    date: txDate.value,
    category: txCategory.value,
  };

  if (!transaction.amount || !transaction.description || !transaction.date) {
    alert("Please fill all fields");
    return;
  }

  transactions.push(transaction);
  saveToLocal();
  render();

  modal.classList.remove("active");
  form.reset();
});

function saveToLocal() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function deleteTransaction(id) {
  transactions = transactions.filter((tx) => tx.id !== id);
  saveToLocal();
  render();
}

function getFilteredTransactions() {
  let filtered = [...transactions];

  const search = searchInput.value.toLowerCase();
  const type = typeFilter.value;

  if (search) {
    filtered = filtered.filter((tx) =>
      tx.description.toLowerCase().includes(search),
    );
  }

  if (type !== "all") {
    filtered = filtered.filter((tx) => tx.type === type);
  }

  return filtered;
}

function renderTable() {
  const filtered = getFilteredTransactions();
  tableBody.innerHTML = "";

  filtered.forEach((tx) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${tx.date}</td>
            <td>${tx.description}</td>
            <td>${tx.category}</td>
            <td>${tx.type === "income" ? "+" : "-"}$${tx.amount}</td>
            <td>
                <button onclick="deleteTransaction(${tx.id})">Delete</button>
            </td>
        `;

    tableBody.appendChild(row);
  });
}

function updateSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach((tx) => {
    if (tx.type === "income") income += tx.amount;
    else expense += tx.amount;
  });

  displayIncome.textContent = `$${income.toFixed(2)}`;
  displayExpense.textContent = `$${expense.toFixed(2)}`;
  displayBalance.textContent = `$${(income - expense).toFixed(2)}`;
  displayTransactions.textContent = transactions.length;
}

let chart;

function renderChart() {
  const ctx = document.getElementById("cashFlowChart");

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          data: [income, expense],
        },
      ],
    },
  });
}

function render() {
  renderTable();
  updateSummary();
  renderChart();
}

searchInput.addEventListener("input", renderTable);
typeFilter.addEventListener("change", renderTable);

render();

window.deleteTransaction = deleteTransaction;
