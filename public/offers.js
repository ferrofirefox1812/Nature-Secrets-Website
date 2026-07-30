fetch("/items")
.then(response => response.json())
.then(items => {

    const offers = items.filter(item => item.type === "offer");

    offers.forEach(offer => {

        let containerId = "";

        if (offer.category === "hair-loss-bundles") {
            containerId = "hair-loss-bundles-container";
        }

        else if (offer.category === "sensitive-skin-bundles") {
            containerId = "sensitive-skin-bundles-container";
        }

        else if (offer.category === "oily-skin-bundles") {
            containerId = "oily-skin-bundles-container";
        }

        else if (offer.category === "hair-care-bundles") {
            containerId = "hair-care-bundles-container";
        }

        else if (offer.category === "special-offers") {
            containerId = "special-offers-container";
        }

        else if (offer.category === "optional-additions") {
            containerId = "optional-additions-container";
        }

        const container = document.getElementById(containerId);

        // Skip if no matching container exists
        if (!container) return;

        const card = document.createElement("div");

        // Makes the dynamically created offers look like your normal bundles
        card.className = "bundle-card";

        card.innerHTML = `
            <span class="offer-badge">
                🔥 عرض خاص
            </span>

            <h3>${offer.name}</h3>

            <p>
    ${offer.description || ""}
</p>

${
    offer.productsIncluded &&
    offer.productsIncluded.length > 0
        ? `
        <h4>محتويات العرض:</h4>
        <ul>
            ${offer.productsIncluded
                .map(product => `<li>${product}</li>`)
                .join("")}
        </ul>
        `
        : ""
}

${
    offer.oldPrice
        ? `<p class="old-price">السعر الأصلي: ${offer.oldPrice} جنيه</p>`
        : ""
}

<p class="new-price">
    سعر العرض: ${offer.price} جنيه
</p>
            <button
                class="add-to-cart"
                data-name="${offer.name}"
                data-price="${offer.price}">
                أضف إلى سلة التسوق
            </button>
        `;

        container.appendChild(card);

const button =

card.querySelector(".add-to-cart");


button.addEventListener(

"click",

async function(){

await updateCartKey();


const productName =

button.dataset.name;


const productPrice =

Number(

button.dataset.price

);


let cart =

JSON.parse(

localStorage.getItem(cartKey)

)

|| [];


cart.push({

name:productName,

price:productPrice,

quantity:1

});


localStorage.setItem(

cartKey,

JSON.stringify(cart)

);


alert(

"تمت إضافة المنتج إلى سلة التسوق!"

);


}

);

card.querySelector(".add-to-cart")
.addEventListener("click", function(){

addToCart(

offer.name,

offer.price

);

});

    });

})
.catch(error => {
    console.error("Error loading offers:", error);
});