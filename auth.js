// ===============================
// CONFIG
// ===============================
const API = "http://localhost:3000";

// ===============================
// LOGIN
// ===============================
document.getElementById("login-btn").addEventListener("click", async () => {

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    return alert("Enter username and password");
  }

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.token) {
      // ✅ SAVE LOGIN DATA
      localStorage.setItem("username", data.username);
      localStorage.setItem("token", data.token);

      alert("Login successful!");

      // redirect
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});


// ===============================
// REGISTER
// ===============================
document.getElementById("register-btn").addEventListener("click", async () => {

  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const invited_by = document.getElementById("register-invited").value;

  if (!username || !password) {
    return alert("Fill all required fields");
  }

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        invited_by
      })
    });

    const data = await res.json();

    alert("Registered! Your referral code: " + data.referral_code);

  } catch (err) {
    console.error(err);
    alert("Registration failed");
  }
});

window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const referralCode = params.get("ref");

    if (referralCode) {
        const referralInput = document.getElementById("register-invited");
        if (referralInput) {
            referralInput.value = referralCode;
            console.log("Referral code auto-filled:", referralCode);
        }
    }
});

//Registe
    document.getElementById("Signup-btn")?.addEventListener("click", () => {

        localStorage.clear();
        window.location.href = "register.html";

    });
