console.log("🔥 MY ORDERS JS LOADED");

async function loadMyOrders() {

    if (!window.supabaseClient) {

        console.log("⏳ Waiting for Supabase...");

        window.addEventListener(
            "supabaseReady",
            loadMyOrders,
            { once: true }
        );

        return;
    }

    const supabase = window.supabaseClient;

    const container =
        document.getElementById("orders-container");

    if (!container) {

        console.error("❌ ORDERS CONTAINER NOT FOUND");

        return;
    }

    container.innerHTML =
        "<p>جاري تحميل طلباتك...</p>";


    // ==============================
    // GET CURRENT USER
    // ==============================

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();


    if (userError || !user) {

        console.error(
            "❌ USER ERROR:",
            userError
        );

        container.innerHTML = `
            <p>
                يجب تسجيل الدخول أولاً لرؤية طلباتك.
            </p>
        `;

        return;
    }


    console.log(
        "👤 CURRENT USER:",
        user.id
    );


    // ==============================
    // LOAD USER ORDERS
    // ==============================

    const {
        data: orders,
        error: ordersError
    } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
            ascending: false
        });


    if (ordersError) {

        console.error(
            "❌ ORDERS ERROR:",
            ordersError
        );

        container.innerHTML = `
            <p>
                حدث خطأ أثناء تحميل طلباتك.
            </p>
        `;

        return;
    }


    console.log(
        "✅ MY ORDERS:",
        orders
    );


    // ==============================
    // NO ORDERS
    // ==============================

    if (!orders || orders.length === 0) {

        container.innerHTML = `
            <div class="empty-orders">

                <h2>
                    📦 لا توجد طلبات حتى الآن
                </h2>

                <p>
                    عندما تقوم بعمل طلب،
                    سيظهر هنا.
                </p>

            </div>
        `;

        return;
    }


    // ==============================
    // DISPLAY ORDERS
    // ==============================

    container.innerHTML = "";


    orders.forEach(order => {

        const card =
            document.createElement("div");

        card.className =
            "order-card";


        // ==============================
        // FORMAT DATE
        // ==============================

        const orderDate =
            new Date(
                order.created_at
            ).toLocaleDateString(
                "ar-EG",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );


        // ==============================
        // STATUS
        // ==============================

        let statusText =
            "قيد التجهيز";

        if (order.status === "preparing") {

            statusText =
                "🟡 قيد التجهيز";

        }

        else if (order.status === "shipped") {

            statusText =
                "🔵 تم الشحن";

        }

        else if (order.status === "delivered") {

            statusText =
                "🟢 تم التوصيل";

        }

        else if (order.status === "cancelled") {

            statusText =
                "🔴 تم إلغاء الطلب";

        }

        else if (order.status) {

            statusText =
                order.status;

        }


        // ==============================
        // ITEMS
        // ==============================

        let itemsHTML = "";

        try {

            const items =
                typeof order.items === "string"
                    ? JSON.parse(order.items)
                    : order.items;

            if (Array.isArray(items)) {

                itemsHTML = items.map(item => {

                    return `
                        <li>
                            ${item.name}
                            × ${item.quantity}
                            — ${item.price} جنيه
                        </li>
                    `;

                }).join("");

            }

        } catch (error) {

            console.error(
                "❌ ITEMS ERROR:",
                error
            );

        }


        // ==============================
        // CREATE CARD
        // ==============================

      card.innerHTML = `

    <div class="order-summary">

        <div>

            <h2>
                📦 طلب #${orders.indexOf(order) + 1}
            </h2>

            <p>
                📅 ${orderDate}
            </p>

            <p class="order-status status-${order.status}">
                ${statusText}
            </p>

        </div>

        <button
            class="order-details-button"
            type="button"
        >
            عرض التفاصيل
            <span>▼</span>
        </button>

    </div>


    <div class="order-details">

        ${
            order.tracking_code
                ? `
                <p>
                    🚚 كود التتبع:
                    <strong>
                        ${order.tracking_code}
                    </strong>
                </p>
                `
                : ""
        }


        <h3>
            المنتجات
        </h3>

        <ul>
            ${itemsHTML}
        </ul>


        ${
            Number(order.discount_amount) > 0
                ? `
                <p>
                    🏷️ الخصم:
                    ${order.discount_amount}
                    جنيه
                </p>
                `
                : ""
        }


        <p>
            💰
            <strong>
                الإجمالي:
                ${
                    order.final_total ??
                    order.total_price
                }
                جنيه
            </strong>
        </p>

    </div>

`;

const detailsButton =
    card.querySelector(".order-details-button");

const details =
    card.querySelector(".order-details");

detailsButton.addEventListener(
    "click",
    function () {

        const isOpen =
            details.classList.contains("show");

        if (isOpen) {

            details.classList.remove("show");

            detailsButton.innerHTML =
                `عرض التفاصيل <span>▼</span>`;

        } else {

            details.classList.add("show");

            detailsButton.innerHTML =
                `إخفاء التفاصيل <span>▲</span>`;

        }

    }
);

        container.appendChild(card);

    });


    console.log(
        "🎉 MY ORDERS DISPLAYED"
    );

}


// ==============================
// START
// ==============================

loadMyOrders();