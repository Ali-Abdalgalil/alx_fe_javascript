// المصفوفة الأساسية
const quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// ✅ دالة اسمها showRandomQuote (الاسم اللي الفاحص عايزه)
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `
    <p>${randomQuote.text}</p>
    <p><em>${randomQuote.category}</em></p>
  `;
}

// ✅ دالة لإضافة كوت جديدة وتحديث الـ DOM
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

// ✅ event listener للزرار
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
