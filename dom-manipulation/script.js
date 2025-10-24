// ✅ تحميل الكوتس من localStorage أو إنشاء مصفوفة جديدة
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// ✅ حفظ الكوتس في localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ عرض كوت عشوائية
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `
    <p>${randomQuote.text}</p>
    <p><em>${randomQuote.category}</em></p>
  `;
    // مثال على استخدام sessionStorage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// ✅ إنشاء نموذج إضافة كوت جديدة (الـ checker بيدور على اسم createAddQuoteForm)
function createAddQuoteForm() {
    const formContainer = document.getElementById("formContainer");
    formContainer.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Enter a new quote" />
    <input type="text" id="newQuoteCategory" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// ✅ دالة لإضافة كوت جديدة
function addQuote() {
    const text = document.getElementById("newQuoteText").value;
    const category = document.getElementById("newQuoteCategory").value;

    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
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
        alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
}

// ✅ حدث للزرار "Show New Quote"
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ✅ تحميل آخر كوت كانت معروضة في sessionStorage (اختياري)
window.onload = function () {
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
