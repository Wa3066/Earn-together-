const API_URL = "http://localhost:3000";

async function startPayment() {
    const amount = document.getElementById("deposit-amount").value;
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (!amount) {
        alert("Enter amount");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/paystack/deposit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                email: username + "@mail.com",
                amount,
                username
            })
        });

        const data = await res.json();

        if (data.data && data.data.authorization_url) {
            window.location.href = data.data.authorization_url;
        } else {
            alert("Payment failed to initialize");
        }

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}