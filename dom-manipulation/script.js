// تحميل البيانات من localStorage أو تعيين افتراضي
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// عرض اقتباس عشوائي
function showRandomQuote() {
    const select = document.getElementById("categoryFilter");
    const selected = select ? select.value : "all";

    const filtered = selected === "all"
        ? quotes
        : quotes.filter(q => q.category === selected);

    if (filtered.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "<p>No quotes found.</p>";
        return;
    }

    const q = filtered[Math.floor(Math.random() * filtered.length)];
    document.getElementById("quoteDisplay").innerHTML = `
    <p>${q.text}</p>
    <p><em>${q.category}</em></p>
  `;
}

// إنشاء فورم إضافة اقتباس
function createAddQuoteForm() {
    const container = document.getElementById("formContainer");
    container.innerHTML = "";

    const inputText = document.createElement("input");
    inputText.id = "newQuoteText";
    inputText.placeholder = "Enter a new quote";

    const inputCategory = document.createElement("input");
    inputCategory.id = "newQuoteCategory";
    inputCategory.placeholder = "Enter quote category";

    const btn = document.createElement("button");
    btn.textContent = "Add Quote";
    btn.addEventListener("click", addQuote);

    container.appendChild(inputText);
    container.appendChild(inputCategory);
    container.appendChild(btn);
}

// إضافة اقتباس جديد
function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();

    if (!text || !category) {
        alert("Please fill both fields");
        return;
    }

    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    showRandomQuote();

    // تزامن التغيير مع السيرفر
    syncWithServer(true);
}

// تصدير كملف JSON
function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();
    URL.revokeObjectURL(url);
}

// استيراد من JSON
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        const imported = JSON.parse(e.target.result);
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
    };
    reader.readAsText(file);
}

// تعبئة الفئات
function populateCategories() {
    const select = document.getElementById("categoryFilter");
    const categories = Array.from(new Set(quotes.map(q => q.category)));

    while (select.firstChild) select.removeChild(select.firstChild);

    const allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = "All Categories";
    select.appendChild(allOpt);

    categories.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        select.appendChild(opt);
    });

    select.value = localStorage.getItem("selectedCategory") || "all";
}

// الفلترة
function filterQuote() {
    const select = document.getElementById("categoryFilter");
    const val = select.value;
    localStorage.setItem("selectedCategory", val);
    showRandomQuote();
}

// ==================== 🛰️ تزامن البيانات مع السيرفر ====================

// محاكاة جلب البيانات من "سيرفر"
async function fetchFromServer() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        const data = await res.json();
        // نحول البيانات لصيغة الاقتباسات
        return data.map(p => ({
            text: p.title,
            category: "Server"
        }));
    } catch (err) {
        console.error("Fetch error:", err);
        return [];
    }
}

// حفظ حالة التزامن
function showSyncStatus(msg, color = "green") {
    const status = document.getElementById("syncStatus");
    status.style.color = color;
    status.textContent = msg;
    setTimeout(() => (status.textContent = ""), 4000);
}

// دالة التزامن الفعلي
async function syncWithServer(addedLocally = false) {
    const serverQuotes = await fetchFromServer();

    let updated = false;

    // فحص التعارض (Conflict)
    const localTexts = quotes.map(q => q.text);
    const newFromServer = serverQuotes.filter(q => !localTexts.includes(q.text));

    if (newFromServer.length > 0) {
        quotes.push(...newFromServer);
        saveQuotes();
        updated = true;
        showSyncStatus("New quotes fetched from server.");
    }

    if (addedLocally) {
        showSyncStatus("Local quote added and synced to server (simulated).");
    }

    if (!updated && !addedLocally) {
        showSyncStatus("Data is up-to-date.");
    }

    populateCategories();
}

// تكرار المزامنة كل 30 ثانية
setInterval(syncWithServer, 30000);

// ============================================================

// عند تحميل الصفحة
window.addEventListener("load", () => {
    createAddQuoteForm();
    populateCategories();
    showRandomQuote();
    syncWithServer();
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
});
