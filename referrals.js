const API = "http://localhost:3000";

async function loadLeaderboard() {
  const res = await fetch(`${API}/leaderboard`);
  const data = await res.json();

  const table = document.getElementById("leaderboard-body");
  table.innerHTML = "";

  data.forEach(row => {
    table.innerHTML += `
      <tr>
        <td>${row.invited_by}</td>
        <td>${row.total_referrals}</td>
      </tr>
    `;
  });
}

loadLeaderboard();