const API = "http://localhost:3000";

const username = localStorage.getItem("username");
const token = localStorage.getItem("token");

async function loadTransactions() {
  const res = await fetch(`${API}/dashboard/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  const table = document.getElementById("transactions-body");
  table.innerHTML = "";

  data.transactions.forEach(tx => {
    table.innerHTML += `
      <tr>
        <td>${tx.type}</td>
        <td>${tx.amount}</td>
        <td>${tx.status}</td>
        <td>${tx.reference || "-"}</td>
        <td>${tx.date}</td>
      </tr>
    `;
  });
}

loadTransactions();