const API_URL = "http://localhost:3000";

/* --------------------------
   REFERRAL AUTO DETECT
--------------------------- */

const params = new URLSearchParams(window.location.search);
const referralCode = params.get("ref");

if (referralCode) {
    const referralInput = document.getElementById("register-invited");
    if (referralInput) {
        referralInput.value = referralCode;
    }
}

/* --------------------------
   LOGIN
--------------------------- */

document.getElementById("login-btn")?.addEventListener("click", async () => {

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);

        window.location.href = "dashboard.html";

    } else {

        alert(data.message);

    }

});

/* --------------------------
   REGISTER
--------------------------- */

document.getElementById("register-btn")?.addEventListener("click", async () => {

    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    // Get referral code input value safely
const invited_by = document.getElementById("register-invited")?.value || "";
const invitedCode = invited_by.trim() === "" ? null : invited_by;

// Use invitedCode in fetch
const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, invited_by: invitedCode })
});

    const data = await res.json();

    if (res.ok) {
        alert("Registration successful. Please login.");
    } else {
        alert(data.message);
    }

});


/* --------------------------
   DASHBOARD
--------------------------- */

if (window.location.pathname.includes("dashboard.html")) {

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (!username || !token) {
        window.location.href = "index.html";
    }

    async function loadDashboard() {

        const res = await fetch(`${API_URL}/dashboard/${username}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });


        if (!res.ok) {
    alert("Failed to load dashboard");
    return;
}

const data = await res.json();


        /* USER INFO */

        document.getElementById("balance").innerText = data.user.balance;
        document.getElementById("referral-code").innerText = data.user.referral_code;

        /* REFERRAL LINK */

        const referralLink =
            window.location.origin +
            "/index.html?ref=" +
            data.user.referral_code;

        const referralInput = document.getElementById("referral-link");

        if (referralInput) {
            referralInput.value = referralLink;
        }

        /* TRANSACTIONS */

        const tbody = document.getElementById("transactions-body");

        if (tbody) {

            tbody.innerHTML = "";

            data.transactions.forEach(tx => {

                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${tx.type}</td>
                    <td>${tx.amount}</td>
                    <td>${tx.status}</td>
                    <td>${tx.reference || "-"}</td>
                    <td>${tx.date}</td>
                `;

                tbody.appendChild(tr);

            });

        }

    }

    loadDashboard();

    
    /* --------------------------
       VERIFY PAYMENT PAGE
    --------------------------- */

    if (window.location.pathname.includes("verify.html")) {

        const reference = new URLSearchParams(window.location.search).get("reference");

        if (reference) {

            fetch(`${API_URL}/paystack/verify/${reference}`)
                .then(res => res.json())
                .then(data => {

                    alert(data.message);

                    window.location.href = "dashboard.html";

                });

        }

    }

    /* --------------------------
       SET WALLET
    --------------------------- */

    document.getElementById("wallet-btn")?.addEventListener("click", async () => {

       const bank_name = document.getElementById("bank-name").value;
const account_number = document.getElementById("account-number").value;
const account_name = document.getElementById("account-name").value;


        const res = await fetch(`${API_URL}/set-wallet`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
    username,
    bank_name,
    account_number,
    account_name
})


        });

        const data = await res.json();

        alert(data.message);

    });

    /* --------------------------
       DAILY PROFIT
    --------------------------- */

    document.getElementById("profit-btn")?.addEventListener("click", async () => {

        const res = await fetch(`${API_URL}/daily-profit`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                username
            })

        });

        const data = await res.json();

        alert("Daily profit earned: " + data.profit);

        loadDashboard();

    });

    /* --------------------------
       WITHDRAW
    --------------------------- */

    document.getElementById("withdraw-btn")?.addEventListener("click", async () => {

        const amount = document.getElementById("withdraw-amount").value;

        const res = await fetch(`${API_URL}/withdraw`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                username,
                amount
            })

        });

        const data = await res.json();

        alert(data.message);

        loadDashboard();

    });

    /* --------------------------
       LEADERBOARD
    --------------------------- */

    async function loadLeaderboard() {

        const res = await fetch(`${API_URL}/leaderboard`);

        const data = await res.json();

        const tbody = document.getElementById("leaderboard-body");

        if (!tbody) return;

        tbody.innerHTML = "";

        data.forEach(row => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${row.invited_by}</td>
                <td>${row.total_referrals}</td>
            `;

            tbody.appendChild(tr);

        });

    }

    loadLeaderboard();

    /* --------------------------
       COPY REFERRAL LINK
    --------------------------- */

    window.copyReferral = function () {
    const input = document.getElementById("referral-link");

    navigator.clipboard.writeText(input.value);

    alert("Referral link copied!");
};

    /* --------------------------
       LOGOUT
    --------------------------- */

    document.getElementById("logout-btn")?.addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "index.html";

    });

}


    