// ✅ تحميل الكوتس من localStorage أو مصفوفة افتراضية
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// ✅ حفظ الكوتس
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ عرض كوت عشوائية
function showRandomQuote() {
    const category = localStorage.getItem("selectedCategory") || "all";
    const filteredQuotes = category === "all"
        ? quotes
        : quotes.filter(q => q.category === category);

    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "<p>No quotes in this category yet.</p>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `
    <p>${randomQuote.text}</p>
    <p><em>${randomQuote.category}</em></p>
  `;

    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// ✅ إنشاء نموذج إضافة كوت جديدة (مطلوب من التاسك السابق)
function createAddQuoteForm() {
    const formContainer = document.getElementById("formContainer");
    formContainer.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Enter a new quote" />
    <input type="text" id="newQuoteCategory" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// ✅ إضافة كوت جديدة
function addQuote() {
    const text = document.getElementById("newQuoteText").value;
    const category = document.getElementById("newQuoteCategory").value;

    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        populateCategories(); // ✅ تحديث الفلتر بالكوت الجديدة
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        showRandomQuote();
    } else {
        alert("Please fill in both fields!");
    }
}

// ✅ تصدير الكوتس لملف JSON
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();
    URL.revokeObjectURL(url);
}

// ✅ استيراد الكوتس من ملف JSON
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
}

// ✅ دالة لتعبئة قائمة الكاتيجوريات
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = ["all", ...new Set(quotes.map(q => q.category))];

    categoryFilter.innerHTML = uniqueCategories
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join("");

    const savedCategory = localStorage.getItem("selectedCategory") || "all";
    categoryFilter.value = savedCategory;
}

// ✅ دالة لتصفية الكوتس حسب الكاتيجوري المختار
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);
    showRandomQuote();
}

// ✅ زر عرض كوت جديدة
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ✅ تحميل البيانات عند فتح الصفحة
window.onload = function () {
    populateCategories();
    const lastViewed = sessionStorage.getItem("lastViewedQuote");
    if (lastViewed) {
        const quote = JSON.parse(lastViewed);
        document.getElementById("quoteDisplay").innerHTML = `
      <p>${quote.text}</p>
      <p><em>${quote.category}</em></p>
    `;
    } else {
        showRandomQuote();
    }
};
