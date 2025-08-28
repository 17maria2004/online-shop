// search.js - Improved search functionality
document.addEventListener("DOMContentLoaded", function() {
  console.log("Search script loaded");
  initializeSearch();
});

let searchProductsData = [];
let isSearchVisible = false;

function initializeSearch() {
  // Load products first
  loadProductsForSearch().then(() => {
    setupSearch();
    setupSearchToggle();
    checkForSearchOnLoad();
  });
}

function loadProductsForSearch() {
  return fetch("products.json")
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Failed to load products");
      }
      return response.json();
    })
    .then(function(data) {
      searchProductsData = data;
      console.log("Products loaded for search:", searchProductsData.length);
      return data;
    })
    .catch(function(error) {
      console.error("Could not load products for search:", error);
      return [];
    });
}

function setupSearch() {
  const navSearch = document.getElementById("nav-search");
  if (!navSearch) {
    console.error("nav-search element not found");
    return;
  }

  const searchInput = navSearch.querySelector('input[type="text"]');
  if (!searchInput) {
    console.error("Search input not found");
    return;
  }

  // Create search results container if it doesn't exist
  let searchResults = navSearch.querySelector(".search-results");
  if (!searchResults) {
    searchResults = document.createElement("div");
    searchResults.className = "search-results";
    navSearch.appendChild(searchResults);
  }

  // Set up event listeners
  setupSearchEvents(searchInput, searchResults);
}

function setupSearchEvents(searchInput, searchResults) {
  // Input event for real-time search
  searchInput.addEventListener("input", function(e) {
    const query = e.target.value.trim();
    
    // Show/hide clear icon based on input
    const clearIcon = document.querySelector(".clear-icon");
    if (clearIcon) {
      clearIcon.style.display = query ? "block" : "none";
    }
    
    if (query.length > 1) { // Only search after 2 characters
      performSearch(query, searchResults);
    } else {
      hideSearchResults(searchResults);
    }
  });

  // Clear input when clear icon is clicked
  const clearIcon = document.querySelector(".clear-icon");
  if (clearIcon) {
    clearIcon.addEventListener("click", function() {
      searchInput.value = "";
      searchInput.focus();
      hideSearchResults(searchResults);
      this.style.display = "none";
    });
  }

  // Focus event to show recent results
  searchInput.addEventListener("focus", function() {
    const query = searchInput.value.trim();
    if (query.length > 1) {
      performSearch(query, searchResults);
    }
  });

  // Enter key to navigate to search results
  searchInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        navigateToSearchResults(query);
      }
    }
  });

  // Search icon click
  const searchIcon = document.querySelector(".search-icon");
  if (searchIcon) {
    searchIcon.addEventListener("click", function(e) {
      e.stopPropagation();
      const query = searchInput.value.trim();
      if (query) {
        navigateToSearchResults(query);
      } else {
        searchInput.focus();
      }
    });
  }

  // Close search results when clicking outside
  document.addEventListener("click", function(e) {
    if (!e.target.closest(".nav__search")) {
      hideSearchResults(searchResults);
    }
  });
}

function setupSearchToggle() {
  const searchToggle = document.getElementById("search-toggle");
  const navSearch = document.getElementById("nav-search");
  
  if (searchToggle && navSearch) {
    searchToggle.addEventListener("click", function() {
      isSearchVisible = !isSearchVisible;
      
      if (isSearchVisible) {
        navSearch.classList.add("active");
        const searchInput = navSearch.querySelector('input[type="text"]');
        if (searchInput) {
          searchInput.focus();
        }
      } else {
        navSearch.classList.remove("active");
        hideSearchResults(navSearch.querySelector(".search-results"));
      }
    });
  }
}

function performSearch(query, searchResults) {
  if (searchProductsData.length === 0) {
    showNoResults(searchResults, "Products not loaded yet");
    return;
  }

  const results = searchProductsData.filter(product => {
    const titleMatch = product.title.toLowerCase().includes(query.toLowerCase());
    const categoryMatch = product.category.toLowerCase().includes(query.toLowerCase());
    const descriptionMatch = product.description && 
                            product.description.toLowerCase().includes(query.toLowerCase());
    
    return titleMatch || categoryMatch || descriptionMatch;
  });

  displaySearchResults(results, query, searchResults);
}

function displaySearchResults(results, query, searchResults) {
  searchResults.innerHTML = "";
  
  if (results.length === 0) {
    showNoResults(searchResults, query);
    return;
  }

  // Create header
  const header = document.createElement("div");
  header.className = "search-header";
  header.textContent = `Found ${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`;
  searchResults.appendChild(header);

  // Show up to 5 results
  const limitedResults = results.slice(0, 5);
  
  limitedResults.forEach(product => {
    const resultItem = createSearchResultItem(product);
    searchResults.appendChild(resultItem);
  });

  // Show "view all" if there are more results
  if (results.length > 5) {
    const footer = document.createElement("div");
    footer.className = "search-footer";
    footer.textContent = `View all ${results.length} results`;
    footer.addEventListener("click", function() {
      navigateToSearchResults(query);
    });
    searchResults.appendChild(footer);
  }

  showSearchResults(searchResults);
}

function createSearchResultItem(product) {
  const resultItem = document.createElement("div");
  resultItem.className = "search-result-item";
  resultItem.setAttribute("data-product-id", encodeURIComponent(product.title));

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.title;
  resultItem.appendChild(img);

  const productInfo = document.createElement("div");
  productInfo.className = "search-product-info";

  const title = document.createElement("div");
  title.className = "search-product-title";
  title.textContent = product.title;
  productInfo.appendChild(title);

  const category = document.createElement("div");
  category.className = "search-product-category";
  category.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
  productInfo.appendChild(category);

  const price = document.createElement("div");
  price.className = "search-product-price";
  
  // Handle discounted prices
  if (product.discount && product.discountPercent) {
    const discountAmount = (product.price * (product.discountPercent / 100));
    const finalPrice = (product.price - discountAmount).toFixed(2);
    price.innerHTML = `<span class="old-price">$${product.price.toFixed(2)}</span> $${finalPrice}`;
  } else {
    price.textContent = `$${product.price.toFixed(2)}`;
  }
  
  productInfo.appendChild(price);
  resultItem.appendChild(productInfo);

  resultItem.addEventListener("click", function() {
    const productId = this.getAttribute("data-product-id");
    window.location.href = "singleProduct.html?id=" + productId;
    hideSearchResults(document.querySelector(".search-results"));
  });

  return resultItem;
}

function showNoResults(searchResults, query) {
  searchResults.innerHTML = "";
  
  const noResultsDiv = document.createElement("div");
  noResultsDiv.className = "search-no-results";

  const icon = document.createElement("i");
  icon.className = "ri-search-line";
  noResultsDiv.appendChild(icon);

  const message = document.createElement("div");
  message.textContent = query ? `No products found for "${query}"` : "No products found";
  noResultsDiv.appendChild(message);

  const suggestion = document.createElement("div");
  suggestion.style.marginTop = "10px";
  suggestion.style.fontSize = "14px";
  
//   const suggestionText = document.createTextNode("Try different keywords or browse our ");
  const link = document.createElement("a");
  link.href = "products.html";
  link.style.color = "var(--primary-color)";
  link.textContent = "products page";
  
  suggestion.appendChild(suggestionText);
  suggestion.appendChild(link);
  noResultsDiv.appendChild(suggestion);

  searchResults.appendChild(noResultsDiv);
  showSearchResults(searchResults);
}

function showSearchResults(searchResults) {
  searchResults.style.display = "block";
}

function hideSearchResults(searchResults) {
  if (searchResults) {
    searchResults.style.display = "none";
  }
}

function navigateToSearchResults(query) {
  localStorage.setItem("searchQuery", query);
  window.location.href = "products.html?search=" + encodeURIComponent(query);
}

function checkForSearchOnLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search") || localStorage.getItem("searchQuery");
  
  if (searchQuery && window.location.pathname.includes("products.html")) {
    // If we're on the products page, filter products
    filterProductsOnPage(searchQuery);
  }
  
  // Set search input value if there's a query
  const searchInput = document.querySelector("#nav-search input");
  if (searchInput && searchQuery) {
    searchInput.value = searchQuery;
    
    // Show clear icon if there's a query
    const clearIcon = document.querySelector(".clear-icon");
    if (clearIcon) {
      clearIcon.style.display = "block";
    }
  }
}

function filterProductsOnPage(query) {
  const productContainer = document.querySelector(".product__container");
  if (!productContainer) return;

  const allProducts = productContainer.querySelectorAll(".product__card");
  let visibleCount = 0;

  allProducts.forEach(card => {
    const titleElement = card.querySelector("h4");
    const title = titleElement ? titleElement.textContent.toLowerCase() : "";
    
    const categorySection = card.closest(".product__section");
    let category = "";
    if (categorySection) {
      const categoryHeader = categorySection.querySelector(".product__category");
      category = categoryHeader ? categoryHeader.textContent.toLowerCase() : "";
    }

    if (title.includes(query.toLowerCase()) || category.includes(query.toLowerCase())) {
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  createOrUpdateSearchHeader(query, visibleCount);
}

function createOrUpdateSearchHeader(query, visibleCount) {
  let productContainer = document.querySelector(".product__container");
  if (!productContainer) return;

  let searchHeader = productContainer.querySelector(".search-results-header");
  
  if (!searchHeader) {
    searchHeader = document.createElement("div");
    searchHeader.className = "search-results-header";
    
    // Insert after the section header
    const sectionHeader = productContainer.querySelector(".section__header");
    if (sectionHeader) {
      sectionHeader.parentNode.insertBefore(searchHeader, sectionHeader.nextSibling);
    } else {
      productContainer.insertBefore(searchHeader, productContainer.firstChild);
    }
  }
  
  searchHeader.innerHTML = `
    <h3>Search Results for "${query}"</h3>
    <p>Found ${visibleCount} product${visibleCount !== 1 ? "s" : ""}</p>
    <button class="clear-search-btn">Clear Search</button>
  `;
  
  const clearBtn = searchHeader.querySelector(".clear-search-btn");
  clearBtn.addEventListener("click", clearSearch);
}

function clearSearch() {
  localStorage.removeItem("searchQuery");
  
  // Show all products
  const allProducts = document.querySelectorAll(".product__card");
  allProducts.forEach(card => {
    card.style.display = "block";
  });
  
  // Remove search header
  const searchHeader = document.querySelector(".search-results-header");
  if (searchHeader) {
    searchHeader.remove();
  }
  
  // Clear search input
  const searchInput = document.querySelector("#nav-search input");
  if (searchInput) {
    searchInput.value = "";
  }
  
  // Hide clear icon
  const clearIcon = document.querySelector(".clear-icon");
  if (clearIcon) {
    clearIcon.style.display = "none";
  }
  
  // Update URL without reloading
  const url = new URL(window.location);
  url.searchParams.delete("search");
  window.history.replaceState({}, "", url);
}