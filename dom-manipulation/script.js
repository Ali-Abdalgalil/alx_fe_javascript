// مصفوفة الكوتس
const quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// ✅ دالة لعرض كوت عشوائية
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `
    <p>${randomQuote.text}</p>
    <p><em>${randomQuote.category}</em></p>
  `;
}

// ✅ دالة لإضافة كوت جديدة
function addQuote() {
    const text = document.getElementById("newQuoteText").value;
    const category = document.getElementById("newQuoteCategory").value;

    if (text && category) {
        quotes.push({ text, category });
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        showRandomQuote();
    }
}

// ✅ الدالة الجديدة اللي الفاحص طالبها: createAddQuoteForm()
function createAddQuoteForm() {
    const container = document.getElementById("formContainer");

    // إنشاء العناصر
    const inputText = document.createElement("input");
    inputText.id = "newQuoteText";
    inputText.type = "text";
    inputText.placeholder = "Enter a new quote";

    const inputCategory = document.createElement("input");
    inputCategory.id = "newQuoteCategory";
    inputCategory.type = "text";
    inputCategory.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.addEventListener("click", addQuote);

    // إضافتهم للـ DOM
    container.appendChild(inputText);
    container.appendChild(inputCategory);
    container.appendChild(addButton);
}

// ✅ إضافة Event Listener لزرار "Show New Quote"
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ✅ استدعاء الدالة لإنشاء الفورم لما الصفحة تفتح
createAddQuoteForm();

// === Dynamic Quote Generator with Local Storage & JSON ===

// تحميل الكوتس من localStorage لو موجودة
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// دالة لحفظ الكوتس في localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// عرض كوت عشوائية
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `
    <p>${randomQuote.text}</p>
    <p><em>${randomQuote.category}</em></p>
  `;
    // نحفظ آخر كوت شوهدت في sessionStorage (اختياري)
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// إضافة كوت جديدة
function addQuote() {
    const text = document.getElementById("newQuoteText").value;
    const category = document.getElementById("newQuoteCategory").value;

    if (text && category) {
        quotes.push({ text, category });
        saveQuotes(); // نحفظ التحديث
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        showRandomQuote();
    }
}

// إنشاء فورم إضافة الكوتس
function createAddQuoteForm() {
    const container = document.getElementById("formContainer");

    const inputText = document.createElement("input");
    inputText.id = "newQuoteText";
    inputText.type = "text";
    inputText.placeholder = "Enter a new quote";

    const inputCategory = document.createElement("input");
    inputCategory.id = "newQuoteCategory";
    inputCategory.type = "text";
    inputCategory.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.addEventListener("click", addQuote);

    // زر تصدير (Export)
    const exportButton = document.createElement("button");
    exportButton.textContent = "Export JSON";
    exportButton.addEventListener("click", exportToJsonFile);

    // إدخال ملف (Import)
    const importInput = document.createElement("input");
    importInput.type = "file";
    importInput.id = "importFile";
    importInput.accept = ".json";
    importInput.addEventListener("change", importFromJsonFile);

    container.appendChild(inputText);
    container.appendChild(inputCategory);
    container.appendChild(addButton);
    container.appendChild(document.createElement("br"));
    container.appendChild(exportButton);
    container.appendChild(importInput);
}

// ✅ تصدير JSON
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

// ✅ استيراد JSON
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

// زر عرض كوت جديدة
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// إنشاء الفورم عند تحميل الصفحة
createAddQuoteForm();

// تحميل آخر كوت شوهدت (اختياري)
window.addEventListener("load", () => {
    const lastQuote = sessionStorage.getItem("lastViewedQuote");
    if (lastQuote) {
        const q = JSON.parse(lastQuote);
        document.getElementById("quoteDisplay").innerHTML = `
      <p>${q.text}</p>
      <p><em>${q.category}</em></p>
    `;
    } else {
        showRandomQuote();
    }
});

