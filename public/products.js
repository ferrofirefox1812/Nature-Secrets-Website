

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
    // Arabic categories — existing products
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

    // English categories — newly created products
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

const container = document.getElementById(categoryMap[product.category]);

if (!container) {
    console.log("Missing category:", product.category);
    return;
}

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

            <hr>
        `;

        container.appendChild(card);
    });

    setupCartButtons();
}

function setupCartButtons() {

    document.querySelectorAll(".add-to-cart").forEach(button => {

        button.onclick = function () {

           const name = this.dataset.name;
const price = Number(this.dataset.price);

updateCartKey().then(() => {

    let cart =
    JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingProduct = cart.find(item => item.name === name);

    if(existingProduct){

        existingProduct.quantity++;

    }else{

        cart.push({

            name,
            price,
            quantity: 1

        });

    }

    localStorage.setItem(cartKey, JSON.stringify(cart));

    alert(`${name} تمت إضافته إلى السلة`);

});
        };

    });

}