// ===============================
// Admin JS
// ===============================

// Elements
const loginForm = document.getElementById("admin-login-form");
const usernameInput = document.getElementById("admin-username");
const passwordInput = document.getElementById("admin-password");
const loginBtn = document.getElementById("admin-login-btn");

const dashboard = document.getElementById("admin-dashboard");
const logoutDiv = document.getElementById("admin-logout");
const logoutBtn = document.getElementById("logout-btn");

const totalUsersEl = document.getElementById("total-users");
const totalDepositsEl = document.getElementById("total-deposits");
const totalWithdrawalsEl = document.getElementById("total-withdrawals");
const totalCommissionsEl = document.getElementById("total-commissions");

const usersTable = document.getElementById("users-table");
const transactionsTable = document.getElementById("transactions-table");
const pendingTable = document.getElementById("pending-table");

const API_BASE = "http://localhost:3000"; // your server

// ===============================
// LOGIN
// ===============================
loginBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) return alert("Enter credentials");

  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      // Save login state (optional: token if implemented)
      loginForm.style.display = "none";
      logoutDiv.style.display = "block";
      dashboard.style.display = "block";

      loadDashboard();
      loadUsers();
      loadTransactions();
      loadPending();
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
});

// ===============================
// LOGOUT
// ===============================
logoutBtn.addEventListener("click", () => {
  loginForm.style.display = "block";
  logoutDiv.style.display = "none";
  dashboard.style.display = "none";

  // Clear tables
  usersTable.innerHTML = "";
  transactionsTable.innerHTML = "";
  pendingTable.innerHTML = "";
  totalUsersEl.textContent = "";
  totalDepositsEl.textContent = "";
  totalWithdrawalsEl.textContent = "";
  totalCommissionsEl.textContent = "";
});

// ===============================
// LOAD DASHBOARD STATS
// ===============================
async function loadDashboard() {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`);
    const stats = await res.json();

    totalUsersEl.textContent = stats.totalUsers || 0;
    totalDepositsEl.textContent = stats.totalDeposits || 0;
    totalWithdrawalsEl.textContent = stats.totalWithdrawals || 0;
    totalCommissionsEl.textContent = stats.totalCommissions || 0;
  } catch (err) {
    console.error(err);
  }
}

// ===============================
// LOAD ALL USERS
// ===============================
async function loadUsers() {
  try {
    const res = await fetch(`${API_BASE}/admin/users`);
    const users = await res.json();

    usersTable.innerHTML = "";
    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.balance}</td>
        <td>${user.referral_code}</td>
        <td>${user.invited_by || ""}</td>
      `;
      usersTable.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

// ===============================
// LOAD ALL TRANSACTIONS
// ===============================
async function loadTransactions() {
  try {
    const res = await fetch(`${API_BASE}/admin/transactions`);
    const transactions = await res.json();

    transactionsTable.innerHTML = "";
    transactions.forEach(txn => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${txn.username}</td>
        <td>${txn.type}</td>
        <td>${txn.amount}</td>
        <td>${txn.status}</td>
        <td>${txn.reference}</td>
        <td>${txn.related_user || ""}</td>
        <td>${new Date(txn.date).toLocaleString()}</td>
      `;
      transactionsTable.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

// ===============================
// LOAD PENDING WITHDRAWALS
// ===============================
async function loadPending() {
  try {
    const res = await fetch(`${API_BASE}/admin/pending-withdrawals`);
    const pending = await res.json();

    pendingTable.innerHTML = "";
    pending.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.username}</td>
        <td>${item.amount}</td>
        <td>${item.reference}</td>
        <td>${new Date(item.date).toLocaleString()}</td>
        <td>
          <button onclick="approveWithdrawal(${item.id})">Approve</button>
        </td>
      `;
      pendingTable.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

// ===============================
// APPROVE WITHDRAWAL
// ===============================
async function approveWithdrawal(id) {
  try {
    const res = await fetch(`${API_BASE}/admin/approve-withdrawal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    const data = await res.json();

    if (data.success) {
      alert("Withdrawal approved");
      loadPending();
      loadUsers();
      loadTransactions();
      loadDashboard();
    } else {
      alert("Failed to approve");
    }
  } catch (err) {
    console.error(err);
    alert("Error approving withdrawal");
  }
}