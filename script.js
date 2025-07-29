const scriptURL = 'https://script.google.com/macros/s/AKfycbwB5pUgZVd-WE5wsRs5CNSpF_kFfv4RXPzo_u82XLYLcC_ED7Hl5usF1qWke8e2Xxawow/exec';

const addItemBtn = document.getElementById("addItemBtn");
const itemList = document.getElementById("itemList");
const searchInput = document.getElementById("searchInput");

let items = [];

addItemBtn.addEventListener("click", () => {
    const id = document.getElementById("itemId").value.trim();
    const name = document.getElementById("itemName").value.trim();
    const amount = document.getElementById("itemAmount").value.trim();

    if (id && name && amount) {
        const item = {
            id,
            name,
            amount
        };

        fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(response => {
                if (response.status === 'success') {
                    items.push(item);
                    renderItems(items);
                    clearInputs();
                }
            })
            .catch(err => alert("Failed to add item"));
    } else {
        alert("Please fill all fields.");
    }
});

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = items.filter(item => item.name.toLowerCase().includes(query));
    renderItems(filtered);
});

function renderItems(list) {
    itemList.innerHTML = "";
    list.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item-card";

        itemDiv.innerHTML = `
      <div class="item-details">
        <div class="item-id">ID: ${item.id}</div>
        <div class="item-name">${item.name}</div>
        <div class="item-amount">Amount: ₹${item.amount}</div>
      </div>
      <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>
    `;

        itemList.appendChild(itemDiv);
    });
}

function deleteItem(index) {
    items.splice(index, 1);
    renderItems(items);
}

function clearInputs() {
    document.getElementById("itemId").value = "";
    document.getElementById("itemName").value = "";
    document.getElementById("itemAmount").value = "";
}

// Load items from Google Sheet on page load
window.addEventListener("DOMContentLoaded", () => {
    fetch(scriptURL)
        .then(res => res.json())
        .then(data => {
            items = data;
            renderItems(items);
        })
        .catch(err => {
            console.error("Error loading items:", err);
        });
});