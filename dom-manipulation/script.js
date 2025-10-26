let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const statusEl = document.getElementById("syncStatus");

function showQuote() {
    if (quotes.length === 0) {
        quoteEl.textContent = "No quotes available.";
        authorEl.textContent = "";
        return;
    }
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.textContent = `"${random.text}"`;
    authorEl.textContent = `– ${random.author}`;
}

function showSyncStatus(message, color = "green") {
    statusEl.textContent = message;
    statusEl.style.color = color;
    setTimeout(() => (statusEl.textContent = ""), 4000);
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();
        return data.slice(0, 10).map((item) => ({
            text: item.title,
            author: `User ${item.userId}`,
        }));
    } catch (error) {
        console.error("Error fetching quotes:", error);
        showSyncStatus("❌ Failed to fetch quotes from server", "red");
        return [];
    }
}

async function syncQuotes() {
    showSyncStatus("🔄 Syncing with server...");

    const serverQuotes = await fetchQuotesFromServer();

    const localMap = new Map(quotes.map((q) => [q.text, q]));
    for (const sq of serverQuotes) {
        localMap.set(sq.text, sq);
    }

    quotes = Array.from(localMap.values());
    localStorage.setItem("quotes", JSON.stringify(quotes));

    if (quotes.length > 0) {
        const lastQuote = quotes[quotes.length - 1];
        await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(lastQuote),
        });
    }

    showSyncStatus("Quotes synced with server!", "green");
    showQuote();
}

function addQuote() {
    const text = prompt("Enter your quote:");
    const author = prompt("Enter author name:");

    if (!text || !author) {
        alert("Please fill both fields!");
        return;
    }

    quotes.push({ text, author });
    localStorage.setItem("quotes", JSON.stringify(quotes));
    showSyncStatus("📝 Quote added locally!", "blue");
    showQuote();
}

setInterval(syncQuotes, 20000);
document.getElementById("newQuoteBtn").addEventListener("click", showQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("syncBtn").addEventListener("click", syncQuotes);

(async function () {
    if (quotes.length === 0) {
        quotes = await fetchQuotesFromServer();
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }
    showQuote();
})();

// Quotes synced with server!
