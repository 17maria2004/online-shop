let currentProduct = null;
let currentQuantity = 1;
let maxStock = 0;

// Function to get URL parameter
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Function to safely get element by ID
function safeGetElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with id '${id}' not found`);
  }
  return element;
}

// Function to load and display product
async function loadProduct() {
  const productId = getUrlParameter('id');
  console.log('Product ID from URL:', productId);
  
  if (!productId) {
    console.log('No product ID found, redirecting to products.html');
    window.location.href = 'products.html';
    return;
  }

  try {
    console.log('Fetching products.json...');
    const response = await fetch('products.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products = await response.json();
    console.log('Products loaded:', products);
    
    const decodedId = decodeURIComponent(productId);
    console.log('Looking for product:', decodedId);
    
    currentProduct = products.find(p => p.title === decodedId);
    console.log('Found product:', currentProduct);

    if (!currentProduct) {
      console.error('Product not found with title:', decodedId);
      alert('Product not found!');
      window.location.href = 'products.html';
      return;
    }

    displayProduct();
  } catch (error) {
    console.error('Error loading product:', error);
    
    if (error.message.includes('404')) {
      alert('products.json file not found. Make sure it exists in the same directory as your HTML files.');
    } else if (error.message.includes('Failed to fetch')) {
      alert('Cannot load product data. Are you running this from a web server?');
    } else {
      alert('Error loading product data: ' + error.message);
    }
    
    window.location.href = 'products.html';
  }
}

// Function to display product details
function displayProduct() {
  const product = currentProduct;
  maxStock = product.stock;

  console.log('Displaying product:', product);

  // Update document title
  document.title = `${product.title} - furni.shop`;

// Display product information
  const productImage = safeGetElement("product-image");
  const productTitle = safeGetElement("product-title");
  const productCategory = safeGetElement("product-category");
  const productDesc = safeGetElement("product-desc");

  if (productImage) {
    productImage.src = product.image;
    productImage.alt = product.title;
  }
  if (productTitle) productTitle.textContent = product.title;
  if (productCategory) productCategory.textContent = product.category;
  if (productDesc) productDesc.textContent = product.description;

  // Display badges
  const badgesContainer = safeGetElement('product-badges');
  if (badgesContainer) {
    badgesContainer.innerHTML = '';
    if (product.new) {
      badgesContainer.innerHTML += '<span class="badge badge--new">New</span>';
    }
    if (product.sustainable) {
      badgesContainer.innerHTML += '<span class="badge badge--sustainable">🌿 Sustainable</span>';
    }
  }

  // Display price
  const priceContainer = safeGetElement('product-price');
  if (priceContainer) {
    const hasDiscount = product.discount && product.discountPercent;
    
    if (hasDiscount) {
      const discountAmount = (product.price * (product.discountPercent / 100));
      const finalPrice = (product.price - discountAmount).toFixed(2);
      priceContainer.innerHTML = `
        <span class="old-price">$${product.price.toFixed(2)}</span>
        <span class="new-price">$${finalPrice}</span>
        <span class="discount-badge">-${product.discountPercent}% ${product.discount}</span>
      `;
    } else {
      priceContainer.innerHTML = `$${product.price.toFixed(2)}`;
    }
  }

  // Display stock status
  const stockContainer = safeGetElement('product-stock');
  const addToCartBtn = safeGetElement('add-to-cart');
  const increaseBtn = safeGetElement('increase-qty');
  const decreaseBtn = safeGetElement('decrease-qty');
  
  if (stockContainer) {
    if (product.stock > 0) {
      stockContainer.className = 'product-stock in-stock';
      stockContainer.innerHTML = `<i class="ri-check-line"></i> In Stock: ${product.stock} available`;
    } else {
      stockContainer.className = 'product-stock out-of-stock';
      stockContainer.innerHTML = `<i class="ri-close-line"></i> Out of Stock`;
      if (addToCartBtn) addToCartBtn.disabled = true;
      if (increaseBtn) increaseBtn.disabled = true;
      if (decreaseBtn) decreaseBtn.disabled = true;
    }
  }

  // Reset quantity
  currentQuantity = product.stock > 0 ? 1 : 0;
  const quantityDisplay = safeGetElement('quantity-display');
  if (quantityDisplay) {
    quantityDisplay.textContent = currentQuantity;
  }
}

// Function to setup event listeners
function setupEventListeners() {
  // Quantity controls
  const increaseBtn = safeGetElement('increase-qty');
  const decreaseBtn = safeGetElement('decrease-qty');

  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      if (currentQuantity < maxStock) {
        currentQuantity++;
        const quantityDisplay = safeGetElement('quantity-display');
        if (quantityDisplay) {
          quantityDisplay.textContent = currentQuantity;
        }
      }
    });
  }

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        const quantityDisplay = safeGetElement('quantity-display');
        if (quantityDisplay) {
          quantityDisplay.textContent = currentQuantity;
        }
      }
    });
  }

  // Add to cart functionality
  const addToCartBtn = safeGetElement('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      if (!currentProduct || currentProduct.stock < currentQuantity) {
        alert('Not enough stock available!');
        return;
      }

      const hasDiscount = currentProduct.discount && currentProduct.discountPercent;
      const finalPrice = hasDiscount 
        ? (currentProduct.price * (1 - currentProduct.discountPercent / 100))
        : currentProduct.price;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find(item => item.id === currentProduct.title);

      if (existing) {
        existing.quantity += currentQuantity;
      } else {
        cart.push({
          id: currentProduct.title,
          title: currentProduct.title,
          price: parseFloat(finalPrice.toFixed(2)),
          image: currentProduct.image,
          quantity: currentQuantity
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Update cart count if function exists
      if (typeof updateCartCount === 'function') {
        updateCartCount();
      }

      // Update stock display (for demo purposes)
      currentProduct.stock -= currentQuantity;
      maxStock = currentProduct.stock;
      
      const stockContainer = safeGetElement('product-stock');
      if (currentProduct.stock <= 0) {
        if (stockContainer) {
          stockContainer.className = 'product-stock out-of-stock';
          stockContainer.innerHTML = `<i class="ri-close-line"></i> Out of Stock`;
        }
        addToCartBtn.disabled = true;
        const increaseBtn = safeGetElement('increase-qty');
        const decreaseBtn = safeGetElement('decrease-qty');
        if (increaseBtn) increaseBtn.disabled = true;
        if (decreaseBtn) decreaseBtn.disabled = true;
        currentQuantity = 0;
      } else {
        if (stockContainer) {
          stockContainer.innerHTML = `<i class="ri-check-line"></i> In Stock: ${currentProduct.stock} available`;
        }
        currentQuantity = 1;
      }
      
      const quantityDisplay = safeGetElement('quantity-display');
      if (quantityDisplay) {
        quantityDisplay.textContent = currentQuantity;
      }

      alert(`${currentProduct.title} added to cart!`);
    });
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, initializing...');
  
  // Check if we're on the right page (single product page)
  const productContainer = document.querySelector('.single-product-container');
  if (!productContainer) {
    console.log('Not on single product page, skipping initialization');
    return;
  }
  
  setupEventListeners();
  loadProduct();
  
  // Update cart count if function exists
  if (typeof updateCartCount === 'function') {
    updateCartCount();
  }
});