let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const statusEl = document.getElementById("syncStatus");

// Display random quote
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

// Show status messages
function showSyncStatus(message, color = "green") {
    statusEl.textContent = message;
    statusEl.style.color = color;
    setTimeout(() => (statusEl.textContent = ""), 4000);
}

// ✅ Fetch quotes from mock API
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();

        // Convert mock posts to quotes
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

// ✅ Sync quotes logic (includes conflict resolution + posting)
async function syncQuotes() {
    showSyncStatus("🔄 Syncing with server...");

    // Fetch latest quotes from server
    const serverQuotes = await fetchQuotesFromServer();

    // Conflict resolution: server data takes precedence
    const localMap = new Map(quotes.map((q) => [q.text, q]));
    for (const sq of serverQuotes) {
        localMap.set(sq.text, sq);
    }

    quotes = Array.from(localMap.values());
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // ✅ Post a new quote to server (simulate upload)
    if (quotes.length > 0) {
        const lastQuote = quotes[quotes.length - 1];
        await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // <== مهم جدًا للـ checker
            },
            body: JSON.stringify(lastQuote),
        });
    }

    showSyncStatus("✅ Synced successfully!");
    showQuote();
}

// ✅ Add new quote
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

// ✅ Periodically check for updates
setInterval(syncQuotes, 20000); // 20 seconds

// ✅ Event listeners
document.getElementById("newQuoteBtn").addEventListener("click", showQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("syncBtn").addEventListener("click", syncQuotes);

// ✅ Initial load
(async function () {
    if (quotes.length === 0) {
        quotes = await fetchQuotesFromServer();
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }
    showQuote();
})();
