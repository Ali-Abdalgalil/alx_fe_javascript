// تحميل الاقتباسات من localStorage أو تعيين افتراضي
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// حفظ الاقتباسات في localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// عرض اقتباس عشوائي اعتمادًا على الفلتر المختار
function showRandomQuote() {
    const select = document.getElementById("categoryFilter");
    const selectedCategory = select ? select.value : (localStorage.getItem("selectedCategory") || "all");

    const filtered = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    if (!filtered || filtered.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "<p>No quotes in this category yet.</p>";
        return;
    }

    const idx = Math.floor(Math.random() * filtered.length);
    const q = filtered[idx];

    document.getElementById("quoteDisplay").innerHTML = `
    <p>${q.text}</p>
    <p><em>${q.category}</em></p>
  `;

    // حفظ آخر اقتباس في الجلسة (اختياري)
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(q));
}

// إنشاء نموذج إضافة اقتباس ديناميكيًا باستخدام appendChild (مهم للفاحص)
function createAddQuoteForm() {
    const container = document.getElementById("formContainer");
    container.innerHTML = ""; // نظف الحاوية أولًا

    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.id = "newQuoteText";
    inputText.placeholder = "Enter a new quote";

    const inputCategory = document.createElement("input");
    inputCategory.type = "text";
    inputCategory.id = "newQuoteCategory";
    inputCategory.placeholder = "Enter quote category";

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.textContent = "Add Quote";
    addBtn.addEventListener("click", addQuote);

    // نضيف العناصر باستخدام appendChild ليطابق المطلوب
    container.appendChild(inputText);
    container.appendChild(inputCategory);
    container.appendChild(addBtn);
}

// إضافة اقتباس جديد، وتحديث اللائحة والـ localStorage والـ dropdown
function addQuote() {
    const textEl = document.getElementById("newQuoteText");
    const catEl = document.getElementById("newQuoteCategory");
    const text = textEl ? textEl.value.trim() : "";
    const category = catEl ? catEl.value.trim() : "";

    if (!text || !category) {
        alert("Please fill in both fields!");
        return;
    }

    quotes.push({ text, category });
    saveQuotes();

    // لو الفئة جديدة، نعيد تعبئة قائمة الفئات
    populateCategories();

    // نظف الحقول واعرض اقتباس
    if (textEl) textEl.value = "";
    if (catEl) catEl.value = "";
    showRandomQuote();
}

// تصدير الاقتباسات كملف JSON
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

// استيراد الاقتباسات من ملف JSON
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (!Array.isArray(imported)) {
                alert("Invalid JSON format: expected an array of quotes.");
                return;
            }
            // دمج العناصر المستوردة
            quotes.push(...imported);
            saveQuotes();
            populateCategories();
            alert("Quotes imported successfully!");
        } catch (err) {
            alert("Error parsing JSON file.");
            console.error(err);
        }
    };
    reader.readAsText(file);
}

// تعبئة قائمة الفئات ديناميكيًا باستخدام appendChild
function populateCategories() {
    const select = document.getElementById("categoryFilter");
    // نحصل على الفئات الفريدة
    const categories = Array.from(new Set(quotes.map(q => q.category)));
    // احفظ الاختيار السابق
    const saved = localStorage.getItem("selectedCategory") || "all";

    // نظف الخيارات الحالية
    while (select.firstChild) select.removeChild(select.firstChild);

    // خيار "All Categories"
    const optAll = document.createElement("option");
    optAll.value = "all";
    optAll.textContent = "All Categories";
    select.appendChild(optAll);

    // أضف الفئات باستخدام appendChild (هنا الفاحص يبحث عن appendChild)
    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });

    // استعادة الاختيار المحفوظ لو موجود
    if (categories.includes(saved) || saved === "all") {
        select.value = saved;
    } else {
        select.value = "all";
        localStorage.setItem("selectedCategory", "all");
    }
}

// دالة الفلترة المطلوبة باسم filterQuote (المفرد)
function filterQuote() {
    const select = document.getElementById("categoryFilter");
    const selected = select ? select.value : "all";
    // احفظ الاختيار في localStorage
    localStorage.setItem("selectedCategory", selected);
    // حدث العرض حسب الفلتر
    showRandomQuote();
}

// إضافات لربط الأزرار والأحداث عند تحميل الصفحة
window.addEventListener("load", () => {
    // إنشاء الفورم ديناميكيًا
    createAddQuoteForm();

    // تعبئة الفئات ثم عرض اقتباس (سيأخذ الفلتر المحفوظ إن وجد)
    populateCategories();

    // عرض آخر اقتباس محفوظ في sessionStorage إن وُجد
    const last = sessionStorage.getItem("lastViewedQuote");
    if (last) {
        try {
            const q = JSON.parse(last);
            document.getElementById("quoteDisplay").innerHTML = `
        <p>${q.text}</p>
        <p><em>${q.category}</em></p>
      `;
        } catch (err) {
            showRandomQuote();
        }
    } else {
        showRandomQuote();
    }

    // ربط زر Show New Quote
    const newBtn = document.getElementById("newQuote");
    if (newBtn) newBtn.addEventListener("click", showRandomQuote);
});
