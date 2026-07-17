console.log("products.js loaded");

fetch("/items")
.then(response => response.json())
.then(items => {

    const products = items.filter(item => item.type === "product");


    products.forEach(product => {

        let containerId = "";


        if (product.category === "shampoo") {
            containerId = "shampoo-products-container";
        }

        else if (product.category === "conditioner") {
            containerId = "conditioner-products-container";
        }

        else if (product.category === "styling-cream") {
            containerId = "styling-cream-products-container";
        }

        else if (product.category === "hair-mask") {
            containerId = "hair-mask-products-container";
        }

        else if (product.category === "hair-lotion") {
            containerId = "hair-loss-products-container";
        }

        else if (product.category === "serum") {
            containerId = "serum-products-container";
        }

        else if (product.category === "skin-care") {
            containerId = "skin-care-products-container";
        }

        else if (product.category === "brightening") {
            containerId = "brightening-products-container";
        }

        else if (product.category === "lip-care") {
            containerId = "lip-balm-products-container";
        }

        else if (product.category === "face-serums") {
            containerId = "face-eye-serum-products-container";
        }

        else if (product.category === "hand-foot-care") {
            containerId = "hand-foot-care-products-container";
        }

        else if (product.category === "personal-care") {
            containerId = "personal-care-products-container";
        }

        else if (product.category === "soap") {
            containerId = "soap-products-container";
        }

        else if (product.category === "baby-products") {
            containerId = "baby-products-container";
        }

        else {
            containerId = "other-products-container";
        }


        const container = document.getElementById(containerId);


        if (container) {

            const card = document.createElement("div");

            card.className = "product";


            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>السعر: ${product.price} جنيه</p>

                <button
                class="add-to-cart"
                data-name="${product.name}"
                data-price="${product.price}">
                أضف إلى سلة التسوق
                </button>
            `;


            container.appendChild(card);

        }

    });

})
.catch(error => {
    console.log("Error loading products:", error);
});