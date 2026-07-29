
console.log("SCRIPT VERSION TEST");

let cartKey = "cart_guest";

let searchTimer;

async function updateCartKey() {

    console.log("UPDATE CART STARTED");

    console.log(
"SUPABASE =",
window.supabaseClient
);

    if (!window.supabaseClient) {

    console.log(
    "WAITING FOR SUPABASE"
    );

    await new Promise(resolve => {

        window.addEventListener(
            "supabaseReady",
            resolve,
            { once:true }
        );

    });

}

    const { data: sessionData } =
    await window.supabaseClient.auth.getSession();

    console.log(
        "SESSION DATA =",
        sessionData
    );

   if (sessionData.session) {

    console.log("USER FOUND");

    cartKey =
    `cart_${sessionData.session.user.id}`;

    // move guest cart to user cart
    const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];

    if (guestCart.length > 0) {

        const userCart = JSON.parse(localStorage.getItem(cartKey)) || [];

        const mergedCart = [
            ...userCart,
            ...guestCart
        ];

        localStorage.setItem(
            cartKey,
            JSON.stringify(mergedCart)
        );

        localStorage.removeItem("cart_guest");

        console.log("GUEST CART MOVED TO USER CART");
    }

}

    else {

        console.log("NO SESSION FOUND");

        cartKey = "cart_guest";

    }

    console.log(
        "FINAL CART KEY =",
        cartKey
    );

}

// =====================================
// UPDATE CART COUNT
// =====================================

const cartCount = document.getElementById("cart-count");

console.log("COUNTER =",cartKey);

console.log(
JSON.parse(
localStorage.getItem(cartKey)
));

if (cartCount) {

    updateCartKey().then(() => {

        const cart =
        JSON.parse(
        localStorage.getItem(cartKey)
        ) || [];

        cartCount.textContent = cart.length;

        console.log(
        "CART COUNT =",
        cart.length
        );

    });

}



// =====================================
// HOME PAGE
// =====================================

const offersButton = document.getElementById("offers-button");
const productsButton = document.getElementById("products-button");
const cartButton = document.getElementById("cart-button");
const trackingButton = document.getElementById("tracking-button");
const productInfoButton = document.getElementById("product-info-button");


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

    trackingButton.addEventListener("click", function () {

        window.location.href = "order-tracking.html";

    });

}


if (productInfoButton) {

    productInfoButton.addEventListener("click", function () {

        window.location.href = "product-info.html";

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

    button.addEventListener(

"click",

async function () {

await updateCartKey();

console.log(
"ADDING TO:",
cartKey
);

const productName = button.dataset.name;

const productPrice = Number(button.dataset.price);

let cart =
JSON.parse(localStorage.getItem(cartKey))
|| [];


console.log(
"BEFORE PUSH =",
cart
);


        cart.push({

            name: productName,
            price: productPrice,
            quantity: 1

        });


      localStorage.setItem(
cartKey,
JSON.stringify(cart)
);


console.log(
"CART AFTER ADD =",
cart
);


console.log(
"AFTER SAVE =",
JSON.parse(
localStorage.getItem(cartKey)
)
);

        alert("تمت إضافة المنتج إلى سلة التسوق!");

    })

});

// =====================================
// OFFERS PAGE
// =====================================




// =====================================
// SHOPPING CART
// =====================================

const placeOrderButton = document.getElementById("place-order-button");
const clearCartButton = document.getElementById("");
const continueShoppingButton = document.getElementById("continue-shopping-button");
const browseProductsButton = document.getElementById("browse-products-button");
const browseOffersButton = document.getElementById("browse-offers-button");
const couponCodeInput =
document.getElementById("coupon-code");


const applyCouponButton =
document.getElementById("apply-coupon-button");


const couponMessage =
document.getElementById("coupon-message");


const discountAmount =
document.getElementById("discount-amount");


let appliedDiscount = 0;

let appliedCoupon = null;


async function applyCoupon() {

    const couponCode =
    couponCodeInput.value.trim().toUpperCase();


    if (!couponCode) {

        couponMessage.textContent =
        "يرجى إدخال كود الخصم.";

        return;

    }


    const { data: coupon, error } =
await window.supabaseClient
.from("coupons")
.select("*")
.eq("code", couponCode)
.limit(1)
.maybeSingle();

console.log("ALL COUPON RESULT:", coupon);

console.log("SEARCHING COUPON:", couponCode);
console.log("COUPON DATA:", coupon);
console.log("COUPON ERROR:", error);


    if (error || !coupon) {

    console.log("COUPON SEARCH ERROR:", error);
    console.log("COUPON RESULT:", coupon);

    couponMessage.textContent =
    "كود الخصم غير صحيح.";

    return;

}




const today = new Date();


const expirationDate =

new Date(
coupon.expires_at
);



if(

today > expirationDate

){

couponMessage.textContent =

"انتهت صلاحية كود الخصم.";

return;

}



if(

coupon.current_uses >=
coupon.maximum_uses

){

couponMessage.textContent =

"لقد وصل هذا الكود إلى الحد الأقصى للاستخدام.";

return;

}


const {

data: userData

} = await window.supabaseClient
.auth.getUser();


if (!userData.user) {

    couponMessage.textContent =
    "يرجى تسجيل الدخول أولاً.";

    return;

}


const userId = userData.user.id;


const userEmail = userData.user.email;


const {

data: usedCoupon,
error: usedCouponError

} = await window.supabaseClient

.from("coupon_usage")

.select("*")

.eq("user_id",userId)

.eq("coupon_code",coupon.code)

.maybeSingle();


console.log(
"USED COUPON =",
usedCoupon
);

console.log(
"USED COUPON ERROR =",
usedCouponError
);



if(

usedCoupon

){

couponMessage.textContent =

"لقد قمت باستخدام هذا الكود مسبقاً.";

return;

}


    const cart =
    JSON.parse(
    localStorage.getItem(cartKey)
    ) || [];


console.log(
"CART CONTENT =",
cart
);

console.log(
"MINIMUM PURCHASE =",
coupon.minimum_purchase
);

const total =
cart.reduce((sum, item) => {

    return sum +
    (item.price * item.quantity);

}, 0);

console.log(
"TOTAL =",
total
);


    if (total < coupon.minimum_purchase) {

        couponMessage.textContent =
        "هذا الكود يحتاج إلى حد أدنى للطلب.";

        return;

    }


    if (coupon.type === "percentage") {

        appliedDiscount =
        (total * coupon.value) / 100;

    }

    else if (coupon.type === "fixed") {

        appliedDiscount =
        coupon.value;

    }


    appliedCoupon =
    coupon.code;


   const finalTotal =
total - appliedDiscount;


discountAmount.textContent =
"الخصم: "
+ appliedDiscount +
" جنيه";


document.getElementById(
"total-price"
).textContent =
finalTotal + " جنيه";


await window.supabaseClient

.from("coupon_usage")

.insert([

{

user_id:
userId,

coupon_code:
coupon.code,

discount_amount:
appliedDiscount

}

]);


console.log(
"COUPON INSERTED SUCCESSFULLY"
);

console.log(
"DISCOUNT =",
appliedDiscount
);

console.log(
"FINAL TOTAL =",
finalTotal
);



await window.supabaseClient

.from("coupons")

.update({

current_uses:

coupon.current_uses + 1

})

.eq(

"code",

coupon.code

);


couponMessage.textContent =
"تم تطبيق كود الخصم بنجاح!";

}


if (applyCouponButton) {

    applyCouponButton.addEventListener(
        "click",
        applyCoupon
    );

}

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


async function loadCart(){

    await updateCartKey();

console.log(
"CURRENT PAGE =",
window.location.pathname
);

console.log(
"CART ITEMS =",
document.getElementById("cart-items")
);

// DISPLAY PRODUCTS IN CART

console.log(
"DISPLAY PRODUCTS STARTED"
);

const cartItems = document.getElementById("cart-items");
const emptyCartMessage = document.getElementById("empty-cart-message");

if(cartItems){

    cartItems.innerHTML = "";

}

console.log(
"CART KEY BEFORE DISPLAY =",
cartKey
);

console.log("CART ITEMS =", cartItems);
console.log("EMPTY MESSAGE =", emptyCartMessage);
console.log(
"EMPTY MESSAGE =",
emptyCartMessage
);


if (cartItems) {


console.log(
"CART DISPLAY WORKING"
);

const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

console.log(
"CART COUNT KEY =",
cartKey
);

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

    }
        // PLUS BUTTONS

        const plusButtons = document.querySelectorAll(".plus-button");


        plusButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                let cart = JSON.parse(localStorage.getItem(cartKey)) || [];


                let product = cart.find(function (item) {

                    return item.name === button.dataset.name;

                });


                product.quantity++;


                localStorage.setItem(cartKey, JSON.stringify(cart));


                location.reload();

            });

        });



        // MINUS BUTTONS

        const minusButtons = document.querySelectorAll(".minus-button");


        minusButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                let cart = JSON.parse(localStorage.getItem(cartKey)) || [];


                let product = cart.find(function (item) {

                    return item.name === button.dataset.name;

                });


                if (product.quantity > 1) {

                    product.quantity--;

                }


                localStorage.setItem(cartKey, JSON.stringify(cart));


                location.reload();

            });

        });

    }




// REMOVE BUTTONS

const removeButtons = document.querySelectorAll(".remove-button");

removeButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        cart = cart.filter(function (item) {

            return item.name !== button.dataset.name;

        });

        localStorage.setItem(cartKey, JSON.stringify(cart));

        location.reload();

    });

});



// UPDATE TOTAL PRICE

const totalPriceElement = document.getElementById("total-price");

if (totalPriceElement) {

    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    let total = 0;


    cart.forEach(function (product) {

        total += product.price * product.quantity;

    });


    totalPriceElement.textContent = total + " جنيه";

}

}


// =====================================
// CHECKOUT SYSTEM
// =====================================

/*if (placeOrderButton) {

    placeOrderButton.addEventListener("click", function () {

        const name = document.getElementById("customer-name").value;
        const phone = document.getElementById("customer-phone").value;
        const address = document.getElementById("customer-address").value;
        const notes = document.getElementById("customer-notes").value;

        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        if (name === "" || phone === "" || address === "") {

            alert("من فضلك املأ الاسم ورقم الهاتف والعنوان");
            return;

        }

        if (cart.length === 0) {

            alert("سلة التسوق فارغة");
            return;

        }

        let total = 0;

        cart.forEach(function (product) {
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

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(order)

        })

            .then(function (response) {
                return response.json();
            })

            .then(function (data) {

                if (data.success) {

                    localStorage.setItem(
                        "lastOrderID",
                        order.id
                    );

                    alert(
                        "تم إرسال الطلب بنجاح!\n\nرقم طلبك هو: " + order.id
                    );

                    localStorage.removeItem(cartKey);

                    window.location.href = "index.html";

                } else {

                    alert("حدث خطأ أثناء إرسال الطلب.");

                }

            })

            .catch(function (error) {

                console.error("Order Error:", error);

                alert("حدث خطأ أثناء الاتصال بالخادم.");

            });

    });

}

*/


// =====================================
// ADMIN PANEL
// =====================================

const newOrdersSection = document.getElementById("new-orders");
const preparingOrdersSection = document.getElementById("preparing-orders");
const shippedOrdersSection = document.getElementById("shipped-orders");
const deliveredOrdersSection = document.getElementById("delivered-orders");

console.log(newOrdersSection);

if (newOrdersSection) {


    window.addEventListener("supabaseReady", async () => {

const { data: orders, error } = await window.supabaseClient
    .from("orders")
    .select("*");
console.log("ADMIN ORDERS:", orders);

if (error) {
    console.log(error);
    return;
}

            const newOrdersCount = document.getElementById("new-orders-count");
            const preparingOrdersCount = document.getElementById("preparing-orders-count");
            const shippedOrdersCount = document.getElementById("shipped-orders-count");
            const deliveredOrdersCount = document.getElementById("delivered-orders-count");
            const totalOrdersCount = document.getElementById("total-orders-count");
            const totalProfit = document.getElementById("total-profit");

            console.log(orders[0]);

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

orders.forEach(function (order) {

    profit += (order.final_total || order.total_price);

});

            totalProfit.textContent = profit;


            orders.forEach(function (order) {


                if (order.status === "new") {

                    console.log("ORDER FOUND!");


                    let itemsHTML = "";

                    order.items.forEach(function (item) {

                        itemsHTML += `
    <li>
        ${item.name} - ${item.quantity} × ${item.price} جنيه
    </li>
    `;

                    });


                    newOrdersSection.innerHTML += `

<div class="order-card">

    <h3>
       رقم الطلب: ${order.tracking_code}
    </h3>

    <p>
        الاسم: ${order.customer_name}
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
    الإجمالي الأصلي:
    ${order.total_price} جنيه
</p>

<p>
    كود الخصم:
    ${order.coupon_used || "لا يوجد"}
</p>

<p>
    قيمة الخصم:
    ${order.discount_amount || 0} جنيه
</p>

<p>
    الإجمالي النهائي:
    ${order.final_total || order.total_price} جنيه
</p>

<p>
    التاريخ:
    ${order.created_at || "لا يوجد"}
</p>

    <button class="prepare-order" data-id="${order.tracking_code}">
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



            orders.forEach(function (order) {


                if (order.status === "preparing") {

                    console.log("ORDER FOUND!");


                    let itemsHTML = "";

                    order.items.forEach(function (item) {

                        itemsHTML += `
    <li>
        ${item.name} - ${item.quantity} × ${item.price} جنيه
    </li>
    `;

                    });


                    preparingOrdersSection.innerHTML += `

<div class="order-card">

    <h3>
       رقم الطلب: ${order.tracking_code}
    </h3>

    <p>
        الاسم: ${order.customer_name}
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
    الإجمالي الأصلي:
    ${order.total_price} جنيه
</p>

<p>
    كود الخصم:
    ${order.coupon_used || "لا يوجد"}
</p>

<p>
    قيمة الخصم:
    ${order.discount_amount || 0} جنيه
</p>

<p>
    الإجمالي النهائي:
    ${order.final_total || order.total_price} جنيه
</p>

<p>
    التاريخ:
    ${order.created_at || "لا يوجد"}
</p>

    <button class="ship-order" data-id="${order.tracking_code}">
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



            orders.forEach(function (order) {


                if (order.status === "shipped") {

                    console.log("SHIPPED ORDER FOUND!");

                    let itemsHTML = "";

                    order.items.forEach(function (item) {

                        itemsHTML += `
            <li>
                ${item.name} - ${item.quantity} × ${item.price} جنيه
            </li>
            `;

                    });


                    shippedOrdersSection.innerHTML += `

        <div class="order-card">

            <h3>
               رقم الطلب: ${order.tracking_code}
            </h3>

            <p>
                الاسم: ${order.customer_name}
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
    الإجمالي الأصلي:
    ${order.total_price} جنيه
</p>

<p>
    كود الخصم:
    ${order.coupon_used || "لا يوجد"}
</p>

<p>
    قيمة الخصم:
    ${order.discount_amount || 0} جنيه
</p>

<p>
    الإجمالي النهائي:
    ${order.final_total || order.total_price} جنيه
</p>

<p>
    التاريخ:
    ${order.created_at || "لا يوجد"}
</p>


            <button class="deliver-order" data-id="${order.tracking_code}">
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





            orders.forEach(function (order) {


                if (order.status === "delivered") {

                    console.log("DELIVERED ORDER FOUND!");

                    let itemsHTML = "";

                    order.items.forEach(function (item) {

                        itemsHTML += `
            <li>
                ${item.name} - ${item.quantity} × ${item.price} جنيه
            </li>
            `;

                    });


                    deliveredOrdersSection.innerHTML += `

        <div class="order-card">

            <h3>
               رقم الطلب: ${order.tracking_code}
            </h3>

            <p>
                الاسم: ${order.customer_name}
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
    الإجمالي الأصلي:
    ${order.total_price} جنيه
</p>

<p>
    كود الخصم:
    ${order.coupon_used || "لا يوجد"}
</p>

<p>
    قيمة الخصم:
    ${order.discount_amount || 0} جنيه
</p>

<p>
    الإجمالي النهائي:
    ${order.final_total || order.total_price} جنيه
</p>

<p>
    التاريخ:
    ${order.created_at || "لا يوجد"}
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

async function updateOrderStatus(orderID, newStatus) {


    console.log("SUPABASE:", window.supabaseClient);
    console.log("ID:", orderID);
    console.log("TYPE:", typeof orderID);
    console.log("STATUS:", newStatus);

const { data, error } = await window.supabaseClient        .from("orders")
        .update({
            status: newStatus
        })
        .eq("tracking_code", orderID)
        .select();

    if (error) {

        console.log("UPDATE ERROR:", error);

    } else {

        console.log("ORDER UPDATED:", data);

        location.reload();

    }

}


async function deleteOrder(orderID) {

    console.log("DELETE FROM SUPABASE:", orderID);

    const { data, error } = await window.supabaseClient
        .from("orders")
        .delete()
        .eq("id", orderID);


    if (error) {

        console.log("DELETE ERROR:", error);

        alert("حدث خطأ أثناء حذف الطلب");

    } else {

        console.log("ORDER DELETED:", data);

        location.reload();

    }


}
// PREPARING / SHIPPING / DELIVERED / DELETE / COPY

document.addEventListener("click", function (event) {

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


    trackButton.addEventListener("click", function () {


        const phone =
            document.getElementById("tracking-phone").value;


        const id =
            document.getElementById("tracking-id").value;



        fetch("/orders")

            .then(function (response) {

                return response.json();

            })

            .then(function (orders) {



                const order = orders.find(function (order) {


                    return order.phone === phone && order.id === id;


                });



                const result =
                    document.getElementById("tracking-result");



                if (order) {


                    let statusText = "";



                    if (order.status === "new") {

                        statusText = "🟢 تم استلام الطلب";

                    }


                    else if (order.status === "preparing") {

                        statusText = "🔧 قيد التجهيز";

                    }


                    else if (order.status === "shipped") {

                        statusText = "🚚 تم الشحن";

                    }


                    else if (order.status === "delivered") {

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

                else {


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


copyButtons.forEach(function (button) {


    button.addEventListener("click", function () {


        const phone = button.dataset.phone;


        navigator.clipboard.writeText(phone);


        alert("تم نسخ رقم الهاتف: " + phone);


    });


});



// =====================================
// ADMIN LOGOUT
// =====================================






document.addEventListener("click", function (event) {

    if (event.target.classList.contains("delete-order")) {

        const confirmDelete = confirm("هل أنت متأكد من حذف الطلب؟");

        if (confirmDelete) {

            deleteOrder(
                event.target.dataset.id
            );

        }

    }

    if (event.target.classList.contains("prepare-order")) {

        updateOrderStatus(
            event.target.dataset.id,
            "preparing"
        );

    }

    if (event.target.classList.contains("ship-order")) {

        updateOrderStatus(
            event.target.dataset.id,
            "shipped"
        );

    }

    if (event.target.classList.contains("deliver-order")) {

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

        if (productName.includes(search) && search !== "") {

            if (firstMatch === null) {

                firstMatch = productContainer;

            }

        }


    });

    if (firstMatch) {

        clearTimeout(searchTimer);

        searchTimer = setTimeout(() => {

            firstMatch.scrollIntoView({

                behavior: "smooth",
                block: "center"

            });

            // Wait until scrolling is finished
            setTimeout(() => {

                firstMatch.classList.add("highlight-product");

                // Keep the highlight for 5 seconds
                setTimeout(() => {

                    firstMatch.classList.remove("highlight-product");

                }, 5000);

            }, 1000);

        }, 100);

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


    async function testOrder() {
        const { data, error } = await supabaseClient
            .from("orders")
            .insert([
                {
                    customer_name: "Test Customer",
                    address: "Alexandria",
                    notes: "Testing order",
                    items: [
                        {
                            name: "Test Product",
                            price: 100,
                            quantity: 1
                        }
                    ],
                    total_price: 100,
                    status: "pending"
                }
            ]);

        if (error) {
            console.log("Order error:", error);
        } else {
            console.log("Order sent:", data);
        }
    }

console.log("ABOUT TO CREATE CUSTOMER FUNCTION");

window.loadCustomerName = async function() {

    console.log("FUNCTION STARTED");

    console.log("LOAD CUSTOMER NAME WORKING");

    const { data: sessionData } =
    await window.supabaseClient.auth.getSession();


  if (!sessionData.session) {

    console.log("NO SESSION FOUND");

    cartKey = "cart_guest";

    return;

}


   const userId = sessionData.session.user.id;



console.log(
"LOAD CUSTOMER NAME FINISHED"
);

console.log("CURRENT CART:", cartKey);


    console.log("USER ID:", userId);


    const { data: profile, error } =
    await window.supabaseClient
        .from("profiles")
        .select("name")
        .eq("id", userId)
        .single();


    console.log("PROFILE:", profile);

console.log("PROFILE ERROR:", error);


if (profile) {

    console.log(
    "CUSTOMER NAME:",
    profile.name);


    
const customerNameDisplay =
    document.getElementById(
    "customer-name-display"
    );




    if (customerNameDisplay) {

        customerNameDisplay.textContent =

        profile.name;

    }



}

updateCartKey().then(() => {
    loadCart();
});

}


console.log("BEFORE SUPABASE LISTENER");

window.addEventListener(
"supabaseReady",

async function(){

await window.loadCustomerName();

await updateCartKey();

}

);


    window.addEventListener("supabaseReady", () => {

        const orderButton = document.getElementById("place-order-button");

        if (orderButton) {

            orderButton.addEventListener("click", window.placeOrder);

        }

    });


    window.placeOrder = async function() {

         const name =
document.getElementById("customer-name-display").textContent;

        const phone = document.getElementById("customer-phone").value;

        const address = document.getElementById("customer-address").value;

        const notes = document.getElementById("customer-notes").value;


const { data: sessionData } =
await window.supabaseClient.auth.getSession();


const user = sessionData.session.user;

if (!user) {

    alert("يرجى تسجيل الدخول أولاً");

    return;

}


const userId = user.id;

const userEmail = user.email;



        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];


        const total = cart.reduce((sum, item) => {

            return sum + (item.price * item.quantity);

        }, 0);



        if (cart.length === 0) {

            alert("السلة فارغة");

            return;

        }


        if (!name || !phone || !address) {

            alert("من فضلك أكمل بيانات العميل");

            return;

        }

        const orderNumber = Math.floor(Math.random() * 90000) + 10000;


        const { data, error } = await supabaseClient

            .from("orders")

            .insert([

                {

                    customer_name: name,

                    customer_email: userEmail,

                    user_id: userId,

                    phone: phone,

                    address: address,

                    notes: notes,

                    items: cart,

                    total_price: total,

                    coupon_used: appliedCoupon,

                    discount_amount: appliedDiscount,

                    final_total: total - appliedDiscount,

                    status: "new",

                     tracking_code: orderNumber, 

                }

            ]);



        if (error) {

            console.log("Order error:", error);

            alert("حدث خطأ أثناء إرسال الطلب");

        }

        else {

            console.log("Order sent:", data);

                console.log("ORDER CODE:", orderNumber);

document.getElementById("popup-order-id").textContent =
"رقم طلبك: #" + orderNumber;

            
document.getElementById("order-success-popup").style.display = "flex";

confetti({
    particleCount: 200,
    spread: 180,
    origin: { y: 0.6 }
});

localStorage.removeItem(cartKey);

setTimeout(() => {

    window.location.href = "index.html";

}, 3000);

}

};


console.log("PLACE ORDER FUNCTION:", typeof window.placeOrder);


window.addEventListener("supabaseReady", async () => {

    const { data, error } =
    await window.supabaseClient
    .from("coupons")
    .select("*");


    console.log(
        "ALL COUPONS FROM WEBSITE:",
        data
    );


    console.log(
        "COUPONS ERROR:",
        error
    );

});





const phrases = [

"محتاجة مساعدة؟",

"نحن هنا لمساعدتك",

"يسعدنا خدمتك",

"هل تحتاجي إلى استشارة؟",

"تواصل معنا الآن"

];


let currentPhrase = 0;

const whatsappMessage =
document.getElementById("whatsapp-message");




function showNextPhrase() {

    if (!whatsappMessage) {
        return;
    }

    whatsappMessage.style.opacity = "0";


    setTimeout(function () {

        whatsappMessage.textContent =
        phrases[currentPhrase];

        whatsappMessage.style.opacity = "1";

    },1000);

}

    setTimeout(function () {

    if (whatsappMessage) {

        whatsappMessage.style.opacity = "0";

    }

},16000);


    setTimeout(function () {

        currentPhrase++;

        if (currentPhrase >= phrases.length) {

            currentPhrase = 0;

        }

        showNextPhrase();

    },17000);



if(whatsappMessage){

whatsappMessage.textContent =

phrases[currentPhrase];


whatsappMessage.style.opacity = "1";

}


setTimeout(function () {

    if(whatsappMessage){

    whatsappMessage.style.opacity = "0";

    }

},15000);



window.addEventListener("supabaseReady", () => {

const createCouponButton =
document.getElementById(
"create-coupon-button"
);


if (!createCouponButton) {

return;

}


createCouponButton.addEventListener(

"click",

async () => {


const couponName =
document.getElementById(
"coupon-name"
).value.toUpperCase();


const couponType =
document.getElementById(
"coupon-type"
).value;


const couponValue =
Number(

document.getElementById(
"coupon-value"
).value

);


const minimumPurchase =

Number(

document.getElementById(
"minimum-purchase"
).value

);


const maximumUses =

Number(

document.getElementById(
"maximum-uses"
).value

);


const couponExpiration =

document.getElementById(
"coupon-expiration"
).value;

const couponActive =


document.getElementById(
"coupon-active"
).value === "true";



const couponMessage =

document.getElementById(
"coupon-message"
);


const {

data: existingCoupon,

error: existingCouponError

} =

await window.supabaseClient
.from("coupons")
.select("*")
.eq("code", couponName)
.maybeSingle();



if(existingCoupon){

couponMessage.textContent =

"هذا الكود موجود بالفعل.";

return;

}


const { error } =

await window.supabaseClient
.from("coupons")
.insert([

{

code: couponName,

type: couponType,

value: couponValue,

active: couponActive,

minimum_purchase:
minimumPurchase,

maximum_uses:
maximumUses,

expires_at:
couponExpiration

}

]);


if(error){

couponMessage.textContent =

"حدث خطأ أثناء إنشاء الكود.";


console.log(error);

return;

}


couponMessage.textContent =

"تم إنشاء كود الخصم بنجاح!";



document.getElementById(
"coupon-name"
).value = "";


document.getElementById(
"coupon-value"
).value = "";


document.getElementById(
"minimum-purchase"
).value = "";


document.getElementById(
"coupon-type"
).value = "percentage";


document.getElementById(
"coupon-active"
).value = "true";

});

});



