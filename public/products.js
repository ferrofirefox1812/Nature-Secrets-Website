window.addEventListener("supabaseReady", loadProducts);

async function loadProducts() {

    if (!window.supabaseClient) {
        console.log("Supabase not ready yet...");
        return;
    }

    const { data, error } = await window.supabaseClient
        .from("products")
        .select("*")
        .order("id");

    if (error) {
        console.error(error);
        return;
    }

    console.log(data);

    data.forEach(product => {

        const categoryMap = {
            "الشامبو": "shampoo-products-container",
            "البلسم": "conditioner-products-container",
            "كريم التصفيف": "styling-cream-products-container",
            "حمام الكريم": "hair-mask-products-container",
            "لوشن التساقط والإنبات": "hair-loss-products-container",
            "السيروم": "serum-products-container",
            "العناية بالبشرة": "skin-care-products-container",
            "منتجات التفتيح": "brightening-products-container",
            "مرطبات الشفاه": "lip-balm-products-container",
            "سيرومات البشرة والعين": "skin-serums-products-container",
            "العناية باليد والقدم": "hand-foot-care-products-container",
            "العناية الشخصية": "personal-care-products-container",
            "الصابون": "soap-products-container",
            "منتجات الأطفال حديثي الولادة": "baby-products-container",
            "منتجات أخرى": "other-products-container",

            "shampoo": "shampoo-products-container",
            "conditioner": "conditioner-products-container",
            "styling-cream": "styling-cream-products-container",
            "hair-mask": "hair-mask-products-container",
            "hair-lotion": "hair-loss-products-container",
            "serum": "serum-products-container",
            "skin-care": "skin-care-products-container",
            "brightening": "brightening-products-container",
            "lip-care": "lip-balm-products-container",
            "face-serums": "skin-serums-products-container",
            "hand-foot-care": "hand-foot-care-products-container",
            "personal-care": "personal-care-products-container",
            "soap": "soap-products-container",
            "baby-products": "baby-products-container",
            "other": "other-products-container"
        };

        const container = document.getElementById(
            categoryMap[product.category]
        );

        if (!container) {
            console.log("Missing category:", product.category);
            return;
        }

        const card = document.createElement("div");

        card.className = "product";

        let imageHTML = "";

        if (
            product.image &&
            typeof product.image === "string" &&
            product.image.trim() !== ""
        ) {
            imageHTML = `
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="product-image"
                >
            `;
        }

        card.innerHTML = `
            ${imageHTML}

            <h3>${product.name}</h3>

            <p>
                السعر: ${product.price} جنيه
            </p>

            <button
    class="add-to-cart"
    data-id="${product.id}"
    data-name="${product.name}"
    data-price="${product.price}"
    data-stock="${product.stock_quantity || 0}">
    أضف إلى سلة التسوق
</button>

            <hr>
        `;

        container.appendChild(card);
    });

    setupCartButtons();
}


function setupCartButtons() {

    document.querySelectorAll(".add-to-cart").forEach(button => {

        button.onclick = function () {

            const id = Number(this.dataset.id);

            const name = this.dataset.name;

            const price = Number(this.dataset.price);

            const stock = Number(this.dataset.stock);

            // ==============================
            // OUT OF STOCK
            // ==============================

            if (stock <= 0) {

                alert("هذا المنتج غير متوفر حالياً.");

                return;
            }


            updateCartKey().then(() => {

                let cart =
                    JSON.parse(localStorage.getItem(cartKey)) || [];


                // ==============================
                // FIND EXISTING PRODUCT
                // ==============================

                const existingProduct =
                    cart.find(item => item.id === id);


                // ==============================
                // CHECK CURRENT QUANTITY
                // ==============================

                const currentQuantity =
                    existingProduct
                        ? existingProduct.quantity
                        : 0;


                // ==============================
                // STOCK LIMIT
                // ==============================

                if (currentQuantity >= stock) {

                    alert(
                        `لا يمكنك إضافة المزيد من هذا المنتج.\n\n` +
                        `المتاح في المخزون: ${stock}`
                    );

                    return;
                }


                // ==============================
                // ADD PRODUCT
                // ==============================

                if (existingProduct) {

                    existingProduct.quantity++;

                } else {

                    cart.push({

                        id: id,

                        name: name,

                        price: price,

                        quantity: 1

                    });

                }


                // ==============================
                // SAVE CART
                // ==============================

                localStorage.setItem(
                    cartKey,
                    JSON.stringify(cart)
                );


                // ==============================
                // BUTTON FEEDBACK
                // ==============================

                button.textContent =
                    "✓ تمت الإضافة";

                button.disabled = true;


                setTimeout(() => {

                    button.textContent =
                        "أضف إلى سلة التسوق";

                    button.disabled = false;

                }, 1500);

            });

        };

    });

}