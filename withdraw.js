const API = "http://localhost:3000";

async function withdraw() {
  const amount = document.getElementById("withdraw-amount").value;

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token || !username) {
    alert("Please login first");
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch(`${API}/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // ✅ REQUIRED
      },
      body: JSON.stringify({
        username,
        amount
      })
    });
    
    const data = await res.json(); // ✅ AFTER fetch

    alert(data.message);

  } catch (err) {
    console.error("Withdraw error:", err);
    alert("Something went wrong");
  }
}

