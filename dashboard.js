const API = "http://localhost:3000";

const username = localStorage.getItem("username");
const token = localStorage.getItem("token");

if (!username || !token) {
  window.location.href = "index.html";
}

async function loadDashboard() {
  try {
    const res = await fetch(`${API}/dashboard/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    // ✅ SAFE DOM ACCESS
    const balanceEl = document.getElementById("balance");
    const refCodeEl = document.getElementById("referral-code");
    const refLinkEl = document.getElementById("referral-link");

    if (balanceEl) balanceEl.innerText = data.user.balance;
    if (refCodeEl) refCodeEl.innerText = data.user.referral_code;

    if (refLinkEl) {
      refLinkEl.value =
        window.location.origin +
        "/index.html?ref=" +
        data.user.referral_code;
    }

  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

loadDashboard();

// COPY FUNCTION (fix error)
function copyReferral() {
  const input = document.getElementById("referral-link");
  if (!input) return;

  input.select();
  document.execCommand("copy");
  alert("Copied!");
}