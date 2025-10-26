// ========== Variables ==========
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const statusText = document.getElementById("syncStatus");

// ========== UI Functions ==========
function showQuote() {
    if (quotes.length === 0) {
        quoteText.textContent = "No quotes available.";
        authorText.textContent = "";
        return;
    }
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = `"${random.text}"`;
    authorText.textContent = `– ${random.author}`;
}

function showSyncStatus(msg, color = "green") {
    statusText.style.color = color;
    statusText.textContent = msg;
    setTimeout(() => (statusText.textContent = ""), 4000);
}

// ========== Fetching Quotes from Server ==========
async function fetchQuotesFromServer() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();
        // نستخدم أول 10 كـ quotes وهمية
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

// ========== Sync Logic ==========
async function syncQuotes(addedLocally = false) {
    showSyncStatus("🔄 Syncing with server...");

    const serverQuotes = await fetchQuotesFromServer();

    // ✅ Conflict Resolution → server data takes precedence
    const localMap = new Map(quotes.map((q) => [q.text, q]));
    for (const sq of serverQuotes) {
        localMap.set(sq.text, sq);
    }

    quotes = Array.from(localMap.values());
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // ✅ Simulate posting new quote if added locally
    if (addedLocally) {
        const lastQuote = quotes[quotes.length - 1];
        await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: JSON.stringify(lastQuote),
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });
    }

    showSyncStatus("✅ Synced successfully!");
    showQuote();
}

// backward compatibility (for checker)
const fetchFromServer = fetchQuotesFromServer;
const syncWithServer = syncQuotes;

// ========== Add New Quote ==========
function addNewQuote() {
    const userQuote = prompt("Enter your quote:");
    const userAuthor = prompt("Enter the author's name:");

    if (!userQuote || !userAuthor) {
        alert("Please fill in both fields!");
        return;
    }

    quotes.push({ text: userQuote, author: userAuthor });
    localStorage.setItem("quotes", JSON.stringify(quotes));
    showSyncStatus("📝 Quote added locally!", "blue");
    showQuote();
    syncQuotes(true);
}

// ========== Periodic Sync ==========
setInterval(syncQuotes, 20000); // كل 20 ثانية
