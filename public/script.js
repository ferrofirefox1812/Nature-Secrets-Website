let searchTimer;

// =====================================
// UPDATE CART COUNT
// =====================================

const cartCount = document.getElementById("cart-count");

if (cartCount) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartCount.textContent = cart.length;

}



// =====================================
// HOME PAGE
// =====================================

const offersButton = document.getElementById("offers-button");
const productsButton = document.getElementById("products-button");
const cartButton = document.getElementById("cart-button");
const trackingButton = document.getElementById("tracking-button");



if (offersButton) {
    offersButton.addEventListener("click", function () {
        window.location.href = "offers.html";
    });
}


if (productsButton) {
    productsButton.addEventListener("click", function () {
        window.location.href = "products.html";
    });
}


if (cartButton) {
    cartButton.addEventListener("click", function () {
        window.location.href = "cart.html";
    });
}

if (trackingButton) {

    trackingButton.addEventListener("click", function(){

        window.location.href = "order-tracking.html";

    });

}

// =====================================
// PRODUCTS PAGE
// =====================================

const homeButton = document.getElementById("home-button");
const goToCartButton = document.getElementById("go-to-cart");


if (homeButton) {
    homeButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });
}


if (goToCartButton) {
    goToCartButton.addEventListener("click", function () {
        window.location.href = "cart.html";
    });
}


// ADD TO CART SYSTEM

const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const productName = button.dataset.name;

const productPrice = Number(button.dataset.price);

        let cart = JSON.parse(localStorage.getItem("cart")) || [];


        cart.push({

            name: productName,
            price: productPrice,
            quantity: 1

        });


        localStorage.setItem("cart", JSON.stringify(cart));


        alert("تمت إضافة المنتج إلى سلة التسوق!");

    });

});



// =====================================
// OFFERS PAGE
// =====================================




// =====================================
// SHOPPING CART
// =====================================

const placeOrderButton = document.getElementById("place-order-button");
const clearCartButton = document.getElementById("clear-cart-button");
const continueShoppingButton = document.getElementById("continue-shopping-button");
const browseProductsButton = document.getElementById("browse-products-button");
const browseOffersButton = document.getElementById("browse-offers-button");


// Continue Shopping

if (continueShoppingButton) {
    continueShoppingButton.addEventListener("click", function () {
        window.location.href = "products.html";
    });
}


// Browse Products

if (browseProductsButton) {
    browseProductsButton.addEventListener("click", function () {
        window.location.href = "products.html";
    });
}


// Browse Offers

if (browseOffersButton) {
    browseOffersButton.addEventListener("click", function () {
        window.location.href = "offers.html";
    });
}


// DISPLAY PRODUCTS IN CART

const cartItems = document.getElementById("cart-items");
const emptyCartMessage = document.getElementById("empty-cart-message");

if (cartItems) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];


    if (cart.length === 0) {

        emptyCartMessage.style.display = "block";

    } else {

        emptyCartMessage.style.display = "none";


        cart.forEach(function (product) {

            cartItems.innerHTML += `
                <section>

                    <h3>${product.name}</h3>

                    <p>السعر: ${product.price} جنيه</p>

                    <button class="minus-button" data-name="${product.name}">
                        -
                    </button>

                    <span>
                        ${product.quantity}
                    </span>

                    <button class="plus-button" data-name="${product.name}">
    +
</button>

<button class="remove-button" data-name="${product.name}">
    حذف
</button>

                </section>
            `;

        });


        // PLUS BUTTONS

        const plusButtons = document.querySelectorAll(".plus-button");


        plusButtons.forEach(function(button) {

            button.addEventListener("click", function() {

                let cart = JSON.parse(localStorage.getItem("cart")) || [];


                let product = cart.find(function(item) {

                    return item.name === button.dataset.name;

                });


                product.quantity++;


                localStorage.setItem("cart", JSON.stringify(cart));


                location.reload();

            });

        });



        // MINUS BUTTONS

        const minusButtons = document.querySelectorAll(".minus-button");


        minusButtons.forEach(function(button) {

            button.addEventListener("click", function() {

                let cart = JSON.parse(localStorage.getItem("cart")) || [];


                let product = cart.find(function(item) {

                    return item.name === button.dataset.name;

                });


                if (product.quantity > 1) {

                    product.quantity--;

                }


                localStorage.setItem("cart", JSON.stringify(cart));


                location.reload();

            });

        });

    }

}



// REMOVE BUTTONS

const removeButtons = document.querySelectorAll(".remove-button");

removeButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart = cart.filter(function(item) {

            return item.name !== button.dataset.name;

        });

        localStorage.setItem("cart", JSON.stringify(cart));

        location.reload();

    });

});



// UPDATE TOTAL PRICE

const totalPriceElement = document.getElementById("total-price");

if (totalPriceElement) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;


    cart.forEach(function(product) {

        total += product.price * product.quantity;

    });


    totalPriceElement.textContent = total + " جنيه";

}


// =====================================
// CHECKOUT SYSTEM
// =====================================

if (placeOrderButton) {

    placeOrderButton.addEventListener("click", function () {

        const name = document.getElementById("customer-name").value;
        const phone = document.getElementById("customer-phone").value;
        const address = document.getElementById("customer-address").value;
        const notes = document.getElementById("customer-notes").value;


        const cart = JSON.parse(localStorage.getItem("cart")) || [];


        if (name === "" || phone === "" || address === "") {

            alert("من فضلك املأ الاسم ورقم الهاتف والعنوان");

            return;

        }


        if (cart.length === 0) {

            alert("سلة التسوق فارغة");

            return;

        }


        let total = 0;


        cart.forEach(function(product) {

            total += product.price * product.quantity;

        });



        const order = {

            id: "NS-" + Math.floor(10000 + Math.random() * 90000),

            name: name,

            phone: phone,

            address: address,

            notes: notes,

            items: cart,

            total: total,

            status: "new",

            date: new Date().toLocaleString()

        };



        fetch("/orders", {

    method:"POST",

    headers:{
        "Content-Type":"application/json"
    },

    body:JSON.stringify(order)

})
.then(function(response){

    return response.json();

})
.then(function(data){


    if(data.success){


        alert("تم إرسال الطلب بنجاح!");


        localStorage.removeItem("cart");


        window.location.href="index.html";


    }


});

        localStorage.setItem(
    "lastOrderID",
    order.id
);


        alert(
    "تم إرسال الطلب بنجاح!\n\nرقم طلبك هو: " + order.id
);



        localStorage.removeItem("cart");



        window.location.href = "index.html";


    });

}




// =====================================
// ADMIN PANEL
// =====================================

const newOrdersSection = document.getElementById("new-orders");
const preparingOrdersSection = document.getElementById("preparing-orders");
const shippedOrdersSection = document.getElementById("shipped-orders");
const deliveredOrdersSection = document.getElementById("delivered-orders");

console.log(newOrdersSection);

if (newOrdersSection) {


fetch("/orders")

.then(function(response){

    return response.json();

})

.then(function(orders){

const newOrdersCount = document.getElementById("new-orders-count");
const preparingOrdersCount = document.getElementById("preparing-orders-count");
const shippedOrdersCount = document.getElementById("shipped-orders-count");
const deliveredOrdersCount = document.getElementById("delivered-orders-count");
const totalOrdersCount = document.getElementById("total-orders-count");
const totalProfit = document.getElementById("total-profit");

console.log(orders);

newOrdersCount.textContent =
    orders.filter(order => order.status === "new").length;

preparingOrdersCount.textContent =
    orders.filter(order => order.status === "preparing").length;

shippedOrdersCount.textContent =
    orders.filter(order => order.status === "shipped").length;

deliveredOrdersCount.textContent =
    orders.filter(order => order.status === "delivered").length;

totalOrdersCount.textContent = orders.length;


let profit = 0;

orders.forEach(function(order) {

    profit += order.total;

});

totalProfit.textContent = profit;


    orders.forEach(function(order) {


        if (order.status === "new") {

    console.log("ORDER FOUND!");
 

            let itemsHTML = "";

order.items.forEach(function(item) {

    itemsHTML += `
    <li>
        ${item.name} - ${item.quantity} × ${item.price} جنيه
    </li>
    `;

});


newOrdersSection.innerHTML += `

<div class="order-card">

    <h3>
        رقم الطلب: ${order.id}
    </h3>

    <p>
        الاسم: ${order.name}
    </p>

    <p>
        الهاتف: ${order.phone}
    </p>

    <p>
        العنوان: ${order.address}
    </p>

    <p>
        ملاحظات: ${order.notes || "لا يوجد"}
    </p>

    <h4>
        المنتجات:
    </h4>

    <ul>
        ${itemsHTML}
    </ul>

    <p>
        الإجمالي: ${order.total} جنيه
    </p>

    <p>
        التاريخ: ${order.date}
    </p>

    <button class="prepare-order" data-id="${order.id}">
        قيد التجهيز
    </button>

    <button class="copy-phone" data-phone="${order.phone}">
        نسخ رقم الهاتف
    </button>

<button class="delete-order" data-id="${order.id}">
    حذف الطلب
</button>

</div>

<hr>

`;
        }

        });



orders.forEach(function(order) {


        if (order.status === "preparing") {

    console.log("ORDER FOUND!");
 

            let itemsHTML = "";

order.items.forEach(function(item) {

    itemsHTML += `
    <li>
        ${item.name} - ${item.quantity} × ${item.price} جنيه
    </li>
    `;

});


preparingOrdersSection.innerHTML += `

<div class="order-card">

    <h3>
        رقم الطلب: ${order.id}
    </h3>

    <p>
        الاسم: ${order.name}
    </p>

    <p>
        الهاتف: ${order.phone}
    </p>

    <p>
        العنوان: ${order.address}
    </p>

    <p>
        ملاحظات: ${order.notes || "لا يوجد"}
    </p>

    <h4>
        المنتجات:
    </h4>

    <ul>
        ${itemsHTML}
    </ul>

    <p>
        الإجمالي: ${order.total} جنيه
    </p>

    <p>
        التاريخ: ${order.date}
    </p>

    <button class="ship-order" data-id="${order.id}">
    تم الشحن
    </button>

    <button class="copy-phone" data-phone="${order.phone}">
        نسخ رقم الهاتف
    </button>

<button class="delete-order" data-id="${order.id}">
    حذف الطلب
</button>

</div>

<hr>

`;
        }

        });

           

    orders.forEach(function(order) {


    if (order.status === "shipped") {

        console.log("SHIPPED ORDER FOUND!");

        let itemsHTML = "";

        order.items.forEach(function(item) {

            itemsHTML += `
            <li>
                ${item.name} - ${item.quantity} × ${item.price} جنيه
            </li>
            `;

        });


        shippedOrdersSection.innerHTML += `

        <div class="order-card">

            <h3>
                رقم الطلب: ${order.id}
            </h3>

            <p>
                الاسم: ${order.name}
            </p>

            <p>
                الهاتف: ${order.phone}
            </p>

            <p>
                العنوان: ${order.address}
            </p>

            <p>
                ملاحظات: ${order.notes || "لا يوجد"}
            </p>

            <h4>
                المنتجات:
            </h4>

            <ul>
                ${itemsHTML}
            </ul>

            <p>
                الإجمالي: ${order.total} جنيه
            </p>

            <p>
                التاريخ: ${order.date}
            </p>


            <button class="deliver-order" data-id="${order.id}">
                تم التسليم
            </button>


            <button class="copy-phone" data-phone="${order.phone}">
                نسخ رقم الهاتف
            </button>

            <button class="delete-order" data-id="${order.id}">
                حذف الطلب
            </button>

        </div>

        <hr>

        `;

    }


});

 



 orders.forEach(function(order) {


     if (order.status === "delivered") {

        console.log("DELIVERED ORDER FOUND!");

        let itemsHTML = "";

        order.items.forEach(function(item) {

            itemsHTML += `
            <li>
                ${item.name} - ${item.quantity} × ${item.price} جنيه
            </li>
            `;

        });


        deliveredOrdersSection.innerHTML += `

        <div class="order-card">

            <h3>
                رقم الطلب: ${order.id}
            </h3>

            <p>
                الاسم: ${order.name}
            </p>

            <p>
                الهاتف: ${order.phone}
            </p>

            <p>
                العنوان: ${order.address}
            </p>

            <p>
                ملاحظات: ${order.notes || "لا يوجد"}
            </p>

            <h4>
                المنتجات:
            </h4>

            <ul>
                ${itemsHTML}
            </ul>

            <p>
                الإجمالي: ${order.total} جنيه
            </p>

            <p>
                التاريخ: ${order.date}
            </p>


            <p>
    ✅ تم تسليم الطلب
</p>


            <button class="copy-phone" data-phone="${order.phone}">
                نسخ رقم الهاتف
            </button>

            <button class="delete-order" data-id="${order.id}">
                حذف الطلب
            </button>

        </div>

        <hr>

        `;

    }


});

});
 
}






// =====================================
// ORDER MANAGEMENT
// =====================================

function updateOrderStatus(orderID, newStatus){

    fetch("/orders/" + orderID, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            status: newStatus
        })

    })

    .then(function(response){

        return response.json();

    })

    .then(function(data){

        if(data.success){

            location.reload();

        }

    });

}


function deleteOrder(orderID){

    fetch("/orders/" + orderID, {

        method: "DELETE"

    })

    .then(function(response){

        return response.json();

    })

    .then(function(data){

        if(data.success){

            location.reload();

        }

    });

}


document.addEventListener("click", function(event) {

    // PREPARING

    if (event.target.classList.contains("prepare-order")) {

        updateOrderStatus(
            event.target.dataset.id,
            "preparing"
        );

    }


    // SHIPPED

    if (event.target.classList.contains("ship-order")) {

        updateOrderStatus(
            event.target.dataset.id,
            "shipped"
        );

    }


    // DELIVERED

    if (event.target.classList.contains("deliver-order")) {

        updateOrderStatus(
            event.target.dataset.id,
            "delivered"
        );

    }


    // DELETE ORDER

    if (event.target.classList.contains("delete-order")) {

        const confirmDelete = confirm(
            "هل أنت متأكد من حذف الطلب؟"
        );

        if (confirmDelete) {

            deleteOrder(
                event.target.dataset.id
            );

        }

    }


    // COPY PHONE NUMBER

    if (event.target.classList.contains("copy-phone")) {

        navigator.clipboard.writeText(
            event.target.dataset.phone
        );

        alert("تم نسخ رقم الهاتف بنجاح!");

    }

});

// =====================================
// SEARCH SYSTEM
// =====================================




// =====================================
// SUCCESS MESSAGES
// =====================================




// =====================================
// ORDER TRACKING
// =====================================


const trackButton = document.getElementById("track-button");


if (trackButton) {


trackButton.addEventListener("click", function(){


const phone =
document.getElementById("tracking-phone").value;


const id =
document.getElementById("tracking-id").value;



fetch("/orders")

.then(function(response){

    return response.json();

})

.then(function(orders){



const order = orders.find(function(order){


return order.phone === phone && order.id === id;


});



const result =
document.getElementById("tracking-result");



if(order){


let statusText = "";



if(order.status === "new"){

statusText = "🟢 تم استلام الطلب";

}


else if(order.status === "preparing"){

statusText = "🔧 قيد التجهيز";

}


else if(order.status === "shipped"){

statusText = "🚚 تم الشحن";

}


else if(order.status === "delivered"){

statusText = "✅ تم التسليم";

}



result.innerHTML = `


<h2>
طلبك رقم: ${order.id}
</h2>


<h3>
${statusText}
</h3>


`;



}

else{


result.innerHTML = `

<p>
لم يتم العثور على الطلب
</p>

`;

}


});


});

}





// =====================================
// COPY PHONE BUTTON
// =====================================

const copyButtons = document.querySelectorAll(".copy-phone");


copyButtons.forEach(function(button){


    button.addEventListener("click", function(){


        const phone = button.dataset.phone;


        navigator.clipboard.writeText(phone);


        alert("تم نسخ رقم الهاتف: " + phone);


    });


});



// =====================================
// ADMIN LOGOUT
// =====================================

const logoutButton = document.getElementById("logout-button");


if(logoutButton){

    logoutButton.addEventListener("click", function(){

        window.location.href = "/admin-logout";

    });

}




document.addEventListener("click", function(event){

    if (event.target.classList.contains("delete-order")) {

    const confirmDelete = confirm("هل أنت متأكد من حذف الطلب؟");

    if (confirmDelete) {

        deleteOrder(
            event.target.dataset.id
        );

    }

}

    if(event.target.classList.contains("prepare-order")){

        updateOrderStatus(
            event.target.dataset.id,
            "preparing"
        );

    }

    if(event.target.classList.contains("ship-order")){

        updateOrderStatus(
            event.target.dataset.id,
            "shipped"
        );

    }

    if(event.target.classList.contains("deliver-order")){

        updateOrderStatus(
            event.target.dataset.id,
            "delivered"
        );

    }

});


function searchProducts() {

    let search = document.getElementById("productSearch").value.toLowerCase();

    let buttons = document.querySelectorAll(".add-to-cart");

    let firstMatch = null;

    buttons.forEach(button => {

        let productName = button.dataset.name.toLowerCase();

        let productContainer = button.closest(".product");

        if (productName.includes(search) || search === "") {

    productContainer.style.display = "";

    if (search !== "" && firstMatch === null) {

        firstMatch = productContainer;

    }

} else {

    productContainer.style.display = "none";

}

});

if (firstMatch) {

    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {

        firstMatch.scrollIntoView({

            behavior: "smooth",
            block: "center"

        });


        firstMatch.classList.add("highlight-product");


        setTimeout(() => {

            firstMatch.classList.remove("highlight-product");

        }, 2000);


    }, 2000);

}

}


const itemType = document.getElementById("item-type");
const categorySelect = document.getElementById("category-select");

if (itemType && categorySelect) {

    itemType.addEventListener("change", () => {

        categorySelect.innerHTML = "";

        if (itemType.value === "product") {

            categorySelect.innerHTML = `
                <option value="">اختر الفئة</option>
                <option value="shampoo">الشامبو</option>
                <option value="conditioner">البلسم</option>
                <option value="hair-serum">السيروم</option>
                <option value="hair-cream">كريم التصفيف</option>
                <option value="hair-mask">حمام الكريم</option>
                <option value="lotion">اللوسيون</option>
                <option value="skin-care">العناية بالبشرة</option>
                <option value="baby-products">منتجات الأطفال</option>
            `;
        }

        else if (itemType.value === "offer") {

            categorySelect.innerHTML = `
                <option value="">اختر الفئة</option>
                <option value="hair-loss-bundles">مجموعات علاج التساقط والقشرة</option>
                <option value="skin-care-bundles">مجموعات العناية بالبشرة</option>
                <option value="hair-care-bundles">مجموعات العناية بالشعر</option>
                <option value="special-offers">العروض الخاصة</option>
            `;
        }

    });

}


