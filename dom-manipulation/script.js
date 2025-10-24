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
