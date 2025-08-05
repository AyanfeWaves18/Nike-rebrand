// -----------------------
// Nike Product Database
// -----------------------
const products = [
  { id: 1, title: "Nike Air Zoom Pegasus", category: "shoes", price: "$120", img: "Nike Air Zoom.png" },
  { id: 2, title: "Nike Revolution 5", category: "shoes", price: "$90", img: "Nike revolution 5.png" },
  { id: 3, title: "Nike Dri-FIT Tee", category: "clothing", price: "$40", img: "Nike Dri-FIT Tee.png" },
  { id: 4, title: "Nike Pro Shorts", category: "clothing", price: "$35", img: "Nike Pro Shorts.png" },
  { id: 5, title: "Nike Backpack", category: "accessories", price: "$70", img: "Nike Backpack.png" },
  { id: 6, title: "Nike Running Cap", category: "accessories", price: "$25", img: "Nike Running Cap.png" },
  { id: 7, title: "Nike Phantom Boots", category: "shoes", price: "$150", img: "Nike Phantom Boots.png" },
  { id: 8, title: "Nike Hoodie", category: "clothing", price: "$60", img: "Nike Hoodie.png" },
  { id: 9, title: "Nike Dri-FIT Academy Pants", category: "clothing", price: "$50", img: "Nike Dri-FIT Academy Pants.png" },
  { id: 10, title: "Nike Air Force 1", category: "shoes", price: "$300", img: "Nike Air Force 1.png" },
  { id: 11, title: "Nike Dunk Low", category: "shoes", price: "$200", img: "Nike Dunk Low.png" },
  { id: 12, title: "Nike Premier League Soccer Ball", category: "accessories", price: "$400", img: "Nike Premier League Soccer Ball.png" },
  { id: 13, title: "Nike Water Bottle", category: "accessories", price: "$170", img: "Nike Water Bottle.png" },
  { id: 14, title: "Nike Heritage Waist Pack", category: "accessories", price: "$200", img: "Nike Heritage Waist Pack.png" },
  { id: 15, title: "Nike Running Cap", category: "accessories", price: "$130", img: "Nike Running Cap.png" },
];

// -----------------------
// Cart Counter
// -----------------------
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.querySelectorAll("#cartCount").forEach(el => {
    el.textContent = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  });
}
updateCartCount();

// -----------------------
// Products Page Rendering
// -----------------------
const productsContainer = document.getElementById("productsContainer");
if (productsContainer) {
  function renderProducts(filterText = "", category = "all") {
    productsContainer.innerHTML = "";
    const filtered = products.filter(p => 
      (p.title.toLowerCase().includes(filterText.toLowerCase())) &&
      (category === "all" || p.category === category)
    );

    if (filtered.length === 0) {
      productsContainer.innerHTML = "<p>No products found.</p>";
      return;
    }

    filtered.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("product");
      div.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      `;
      productsContainer.appendChild(div);
    });
  }

  renderProducts();

  document.getElementById("searchInput").addEventListener("input", (e) => {
    renderProducts(e.target.value, document.getElementById("categoryFilter").value);
  });

  document.getElementById("categoryFilter").addEventListener("change", (e) => {
    renderProducts(document.getElementById("searchInput").value, e.target.value);
  });
}

// -----------------------
// Add to Cart Function
// -----------------------
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find(p => p.id === productId);

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${product.title} added to cart!`);
}

// -----------------------
// Cart Page
// -----------------------
const cartItemsContainer = document.getElementById("cartItems");
if (cartItemsContainer) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      document.getElementById("totalPrice").innerText = "Total: $0";
      return;
    }

    cart.forEach((item, index) => {
      let price = parseFloat(item.price.replace("$", ""));
      let qty = item.qty || 1;
      total += price * qty;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.img}" alt="${item.title}">
        <div class="cart-item-info">
          <h3>${item.title}</h3>
          <p>Price: ${item.price}</p>
        </div>
        <div class="cart-item-actions">
          <input type="number" min="1" value="${qty}" data-index="${index}">
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });

    document.getElementById("totalPrice").innerText = `Total: $${total.toFixed(2)}`;

    document.querySelectorAll(".cart-item-actions input").forEach(input => {
      input.addEventListener("change", () => {
        let idx = input.getAttribute("data-index");
        cart[idx].qty = parseInt(input.value);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartCount();
      });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        let idx = btn.getAttribute("data-index");
        cart.splice(idx, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartCount();
      });
    });
  }

  renderCart();
}

// -----------------------
// Checkout Page
// -----------------------
const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
  const paymentMethod = document.getElementById("paymentMethod");
  const cardDetails = document.getElementById("cardDetails");
  const orderSummary = document.getElementById("orderSummary");

  // Render Order Summary
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;
  orderSummary.innerHTML = "<h2>Order Summary</h2>";
  cart.forEach(item => {
    let price = parseFloat(item.price.replace("$", ""));
    let qty = item.qty || 1;
    total += price * qty;
    orderSummary.innerHTML += `<p>${item.title} x${qty} - ${item.price}</p>`;
  });
  orderSummary.innerHTML += `<h3>Total: $${total.toFixed(2)}</h3>`;

  // Payment Method Toggle
  paymentMethod.addEventListener("change", () => {
    cardDetails.style.display = paymentMethod.value === "card" ? "block" : "none";
  });

  // Checkout Form Submit
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty. Add products first.");
      return;
    }

    const name = document.getElementById("fullName").value;
    alert(`Thank you ${name}! Your order has been placed successfully.`);
    localStorage.removeItem("cart");
    updateCartCount();
    window.location.href = "index.html";
  });
}

// -----------------------
// Contact Page
// -----------------------
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push({ name, email, phone, message, date: new Date().toLocaleString() });
    localStorage.setItem("messages", JSON.stringify(messages));

    document.getElementById("contactSuccess").style.display = "block";
    contactForm.reset();
  });
}


// -----------------------
// User Account System
// -----------------------
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const forgotForm = document.getElementById("forgotForm");

// Switch between SignUp and Login
if (document.getElementById("switchToLogin")) {
  document.getElementById("switchToLogin").addEventListener("click", () => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    forgotForm.style.display = "none";
  });
}

if (document.getElementById("switchToSignup")) {
  document.getElementById("switchToSignup").addEventListener("click", () => {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
    forgotForm.style.display = "none";
  });
}

if (document.getElementById("forgotPasswordLink")) {
  document.getElementById("forgotPasswordLink").addEventListener("click", () => {
    signupForm.style.display = "none";
    loginForm.style.display = "none";
    forgotForm.style.display = "block";
  });
}

if (document.getElementById("backToLogin")) {
  document.getElementById("backToLogin").addEventListener("click", () => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    forgotForm.style.display = "none";
  });
}

// Password Strength Checker
if (document.getElementById("signupPassword")) {
  document.getElementById("signupPassword").addEventListener("input", (e) => {
    const strengthText = document.getElementById("passwordStrength");
    const value = e.target.value;
    if (value.length < 6) strengthText.textContent = "Weak Password";
    else if (value.match(/[A-Z]/) && value.match(/[0-9]/) && value.length >= 8)
      strengthText.textContent = "Strong Password";
    else
      strengthText.textContent = "Medium Password";
  });
}

// Signup
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const phone = document.getElementById("signupPhone").value;
    const pass = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("signupConfirm").value;

    if (pass !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.email === email || u.phone === phone)) {
      alert("User already exists!");
      return;
    }

    users.push({ name, email, phone, password: pass });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please login.");
    signupForm.reset();
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  });
}

// Login
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const loginUser = document.getElementById("loginUser").value;
    const loginPass = document.getElementById("loginPassword").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => (u.email === loginUser || u.phone === loginUser) && u.password === loginPass);

    if (!user) {
      alert("Invalid login details!");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "index.html";
  });
}

// Forgot Password
if (forgotForm) {
  forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
      alert("Email not found!");
      return;
    }

    alert(`Password reset link sent to ${email}`);
    forgotForm.reset();
    forgotForm.style.display = "none";
    loginForm.style.display = "block";
  });
}

// Show Logged In User
const userSection = document.getElementById("userSection");
if (userSection) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    userSection.innerHTML = `
      Welcome, ${loggedInUser.name} 
      <button onclick="logout()">Logout</button>
    `;
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.reload();
}
