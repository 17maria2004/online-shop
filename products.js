document.addEventListener("DOMContentLoaded", () => {
    fetch("products.json")
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch products.json");
            return res.json();
        })
        .then(data => {
            const container = document.querySelector(".product__container");
            if (!container) return;

            // Group products by category
            const categories = {};

            data.forEach(product => {
                if (!categories[product.category]) {
                    categories[product.category] = [];
                }
                categories[product.category].push(product);
            });

            // Clear container and add title
            container.innerHTML = `<h2 class="section__header">Products</h2>`;

            // Create a section for each category
            for (const category in categories) {
                const section = document.createElement("div");
                section.classList.add("product__section");

                // Capitalize category name
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

                section.innerHTML = `
                    <h3 class="product__category">${categoryName}</h3>
                    <div class="product__grid">
                        ${categories[category].map(product => `
                            <div class="product__card">
                                <img src="${product.image}" alt="${product.title}" />
                                <h4>${product.title}</h4>
                                <p>$${product.price.toFixed(2)}</p>
                            </div>
                        `).join('')}
                    </div>
                `;

                container.appendChild(section);
            }
        })
        .catch(error => {
            console.error("Error loading products:", error);
        });
});
