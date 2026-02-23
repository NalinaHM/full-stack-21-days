const API_BASE = ''; // same origin (http://localhost:3000)

// State
let products = [];
let cart = [];
let discountPercent = 0;

// DOM elements
const productsEl = document.getElementById('products');
const cartItemsEl = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const discountInputEl = document.getElementById('discountInput');
const applyDiscountBtn = document.getElementById('applyDiscountBtn');
const logEl = document.getElementById('log');

// ---- Event loop log helper ----
function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  const line = `[${timestamp}] ${message}\n`;
  logEl.textContent += line;
  logEl.scrollTop = logEl.scrollHeight;
  console.log(message);
}

// ---- Fetch products using async/await + Fetch API ----
async function fetchProducts() {
  log('fetchProducts(): sync start');

  // Event loop demo: microtask vs macrotask
  Promise.resolve().then(() => {
    log('Promise microtask ran before setTimeout macrotask');
  });

  setTimeout(() => {
    log('setTimeout macrotask executed');
  }, 0);

  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    products = data;
    log('Products fetched from backend');
    renderProducts();
  } catch (err) {
    log(`Error fetching products: ${err.message}`);
  }
}

// ---- Render products ----
function renderProducts() {
  productsEl.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';

    const title = document.createElement('h3');
    title.textContent = p.name;

    const price = document.createElement('div');
    price.className = 'product-price';
    price.textContent = `₹${p.price.toLocaleString()}`;

    const stock = document.createElement('div');
    stock.className = 'product-stock';
    stock.textContent = `In stock: ${p.stock}`;

    const btn = document.createElement('button');
    btn.className = 'button';
    btn.textContent = 'Add to cart';
    btn.onclick = () => addToCart(p.id);

    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(stock);
    card.appendChild(btn);
    productsEl.appendChild(card);
  });
}

// ---- Cart operations ----
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.product.id === productId);
  if (existing) {
    if (existing.quantity < product.stock) {
      existing.quantity += 1;
    } else {
      log('Cannot add more than stock quantity');
    }
  } else {
    cart.push({ product, quantity: 1 });
  }
  log(`Added "${product.name}" to cart`);
  renderCart();
}

function renderCart() {
  cartItemsEl.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.className = 'cart-item';

    const left = document.createElement('span');
    left.textContent = `${item.product.name} × ${item.quantity}`;

    const right = document.createElement('span');
    right.textContent = `₹${(item.product.price * item.quantity).toLocaleString()}`;

    li.appendChild(left);
    li.appendChild(right);
    cartItemsEl.appendChild(li);
  });

  updateTotals();
}

function updateTotals() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  totalEl.textContent = `₹${total.toFixed(2)}`;
}

// ---- Discount feature ----
applyDiscountBtn.addEventListener('click', () => {
  const val = Number(discountInputEl.value);
  if (isNaN(val) || val < 0 || val > 90) {
    alert('Enter a discount between 0 and 90');
    return;
  }
  discountPercent = val;
  log(`Discount set to ${discountPercent}%`);
  updateTotals();
});

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  log('Page loaded (sync). Calling fetchProducts() with async/await.');
  fetchProducts();
});