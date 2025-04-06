// ✅ Generate Invoice ID & Date
const invoiceId = `INV-${Date.now()}`;
document.getElementById("invoiceId").innerText = invoiceId;
const date = new Date().toLocaleDateString();
document.getElementById("invoiceDate").innerText = date;

const invoiceTable = document.querySelector("#invoiceTable tbody");
let invoiceItems = [];

// ✅ Add Item to Invoice
function addItem() {
  const item = document.getElementById("item").value;
  const qty = parseFloat(document.getElementById("qty").value);
  const price = parseFloat(document.getElementById("price").value);

  if (!item || isNaN(qty) || isNaN(price)) return;

  const total = qty * price;
  invoiceItems.push({ item, qty, price, total });

  const row = invoiceTable.insertRow();
  row.innerHTML = `
    <td>${item}</td>
    <td>${qty}</td>
    <td>${price.toFixed(2)}</td>
    <td>${total.toFixed(2)}</td>
  `;

  updateTotals();

  // Clear inputs
  document.getElementById("item").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("price").value = "";
}

// ✅ Update Subtotal, GST, Grand Total
function updateTotals() {
  let subtotal = invoiceItems.reduce((sum, i) => sum + i.total, 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  document.getElementById("subtotal").innerText = subtotal.toFixed(2);
  document.getElementById("gst").innerText = gst.toFixed(2);
  document.getElementById("grandTotal").innerText = grandTotal.toFixed(2);
}

// ✅ Download Invoice as PDF
function downloadPDF() {
  const element = document.querySelector(".container");
  html2pdf().from(element).save("invoice.pdf");
}

// ✅ Save Invoice to Local Storage
function saveInvoice() {
    const customerName = document.getElementById("customerName").value;
    const contact = document.getElementById("customerContact").value;
    const grandTotal = document.getElementById("grandTotal").innerText;
  
    const invoiceData = {
      invoiceId,
      date,
      customerName,
      contact,
      items: invoiceItems,
      subtotal,
      gst: subtotal * 0.18,
      grandTotal
    };
  
    // Save to Firebase
    database.ref("invoices").push(invoiceData)
      .then(() => alert("✅ Invoice saved to Firebase!"))
      .catch((err) => alert("❌ Error saving invoice: " + err));
  
    // Also save locally for history UI
    const entry = `${invoiceId} | ${date} | Rs. ${grandTotal}`;
    let history = JSON.parse(localStorage.getItem("invoiceHistory") || "[]");
    history.push(entry);
    localStorage.setItem("invoiceHistory", JSON.stringify(history));
    displayHistory();
  }
  
  

// ✅ Display Invoice History
function displayHistory() {
  const list = document.getElementById("invoiceHistory");
  list.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("invoiceHistory") || "[]");
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}
displayHistory();

// 🌗 Dark Mode Toggle with Icon and Local Storage
const toggle = document.getElementById("darkModeToggle");
const icon = document.getElementById("themeIcon");

function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  icon.textContent = dark ? "🌙" : "🌞";
  localStorage.setItem("darkMode", dark);
}

const savedDark = JSON.parse(localStorage.getItem("darkMode"));
if (savedDark) {
  toggle.checked = true;
  applyTheme(true);
}

toggle.addEventListener("change", () => {
  applyTheme(toggle.checked);
});
// firebase.js
const firebaseConfig = {
    databaseURL: "https://invoice-generator-68e98-default-rtdb.firebaseio.com/",
    apiKey: "YOUR_API_KEY",
    authDomain: "invoice-generator-68e98.firebaseapp.com",
    projectId: "invoice-generator-68e98",
    storageBucket: "invoice-generator-68e98.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  