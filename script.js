// ==================== DATA / PRODUCTS ====================
const uniqueComponents = [
  "Arduino UNO R3", "Arduino Mega 2560", "Arduino Nano",
  "ESP32 Dev Board", "Raspberry Pi 4 Model B",
  // … add more
];

const componentPrices = {
  "Arduino UNO R3": 575,
  "Arduino Mega 2560": 950,
  "Arduino Nano": 250,
  "ESP32 Dev Board": 350,
  "Raspberry Pi 4 Model B": 4899,
  // … add more
};

// Create product objects with name, price, image
const products = uniqueComponents.map(name => {
  const price = componentPrices[name] ?? 50;
  const image = `https://via.placeholder.com/150?text=${encodeURIComponent(name)}`;
  return { name, price, image };
});

// ==================== DISPLAY PRODUCTS ====================
const initialDisplayCount = 30;

function displayProducts(list) {
  const container = document.getElementById("product-container");
  container.innerHTML = "";
  const toShow = list.slice(0, initialDisplayCount);
  
  toShow.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onclick="changeImageByUrl('${product.name}')">
      <h3>${product.name}</h3>
      <p>Price: ₹${product.price}</p>
      <button onclick="addToCart('${product.name}')">Add to Cart</button>
      <button onclick="triggerFileUpload('${product.name}')">Replace Image</button>
      <input type="file" id="fileUpload-${product.name}" style="display:none" accept="image/*">
    `;
    
    container.appendChild(card);
  });
}

// ==================== REPLACE IMAGE: URL PROMPT ====================
function changeImageByUrl(name) {
  const url = prompt(`Enter new image URL for ${name}:`);
  if (!url) return;
  const p = products.find(p => p.name === name);
  p.image = url;
  displayProducts(products);
}

// ==================== REPLACE IMAGE: FILE UPLOAD ====================
function triggerFileUpload(name) {
  const input = document.getElementById(`fileUpload-${name}`);
  if (!input) return;
  
  input.onchange = () => {
    const file = input.files[0];
    if (file) handleFileReplace(name, file);
  };
  input.click();
}

function handleFileReplace(name, file) {
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    return;
  }
  
  const p = products.find(p => p.name === name);
  
  // Create a temporary URL for preview using Blob
  const imageUrl = URL.createObjectURL(file);
  p.image = imageUrl;
  
  // Optionally: revoke the object URL later when not needed
  // URL.revokeObjectURL(imageUrl);
  
  displayProducts(products);
}

// ==================== ADD NEW PRODUCT ====================
function addNewProduct() {
  const nameInput = document.getElementById("newProductName");
  const priceInput = document.getElementById("newProductPrice");
  const imageInput = document.getElementById("newProductImage");
  
  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);
  const file = imageInput.files[0];
  
  if (!name) {
    alert("Enter product name");
    return;
  }
  if (isNaN(price) || price <= 0) {
    alert("Enter a valid price");
    return;
  }
  
  let imageURL = `https://via.placeholder.com/150?text=${encodeURIComponent(name)}`;
  if (file) {
    if (!file.type.startsWith("image/")) {
      alert("Uploaded file is not an image.");
      return;
    }
    imageURL = URL.createObjectURL(file);
  }
  
  products.unshift({ name, price, image: imageURL });
  
  nameInput.value = "";
  priceInput.value = "";
  imageInput.value = "";
  
  displayProducts(products);
}

// ==================== CART LOGIC ====================
let cart = [];

function addToCart(name) {
  const p = products.find(p => p.name === name);
  if (p) {
    cart.push(p);
    updateCart();
  }
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCart();
}

function updateCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("total-price");
  container.innerHTML = "";
  
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "";
    document.getElementById("continue-btn").style.display = "none";
    document.getElementById("cart-count").textContent = "0";
    return;
  }
  
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.name} - ₹${item.price}</span>
      <button onclick="removeFromCart(${i})">Remove</button>
    `;
    container.appendChild(div);
  });
  
  totalEl.textContent = `Total: ₹${total}`;
  document.getElementById("continue-btn").style.display = "block";
  document.getElementById("cart-count").textContent = cart.length;
}

// ==================== WHATSAPP CHECKOUT ====================
function showWhatsAppCheckout() {
  document.getElementById("whatsapp-checkout").style.display = "block";
}

function checkoutWhatsApp() {
  if (cart.length === 0) return;
  let msg = "Hello, I'd like to buy the following items:\n";
  cart.forEach(item => {
    msg += `- ${item.name}: ₹${item.price}\n`;
  });
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  msg += `Total: ₹${total}`;
  
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/919010532390?text=${encoded}`, "_blank");
}

// ==================== SEARCH + BACK-TO-TOP ====================
document.getElementById("search").addEventListener("input", function() {
  const val = this.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(val));
  displayProducts(filtered.length ? filtered : products);
});

const topBtn = document.getElementById("backToTopBtn");
window.onscroll = () => {
  if (document.documentElement.scrollTop > 200 || document.body.scrollTop > 200) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
};
topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==================== INITIALIZE ====================
displayProducts(products);
updateCart();
