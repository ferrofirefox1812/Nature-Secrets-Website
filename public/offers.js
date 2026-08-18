console.log("🔥 OFFERS JS LOADED");

async function loadSupabaseOffers() {

    // ==============================
    // WAIT FOR SUPABASE
    // ==============================

    if (!window.supabaseClient) {

        console.log("⏳ Waiting for Supabase...");

        window.addEventListener(
            "supabaseReady",
            loadSupabaseOffers,
            { once: true }
        );

        return;
    }

    const supabase = window.supabaseClient;

    console.log("🔥 LOADING OFFERS FROM SUPABASE");


    // ==============================
    // LOAD BUNDLES
    // ==============================

    const {
        data: bundles,
        error: bundlesError
    } = await supabase
        .from("bundles")
        .select("*")
        .order("id");

    if (bundlesError) {

        console.error(
            "❌ BUNDLES ERROR:",
            bundlesError
        );

        return;
    }

    console.log(
        "✅ BUNDLES FROM SUPABASE:",
        bundles
    );


    // ==============================
    // LOAD BUNDLE ITEMS
    // ==============================

    const {
        data: bundleItems,
        error: bundleItemsError
    } = await supabase
        .from("bundle_items")
        .select("*");

    if (bundleItemsError) {

        console.error(
            "❌ BUNDLE ITEMS ERROR:",
            bundleItemsError
        );

        return;
    }

    console.log(
        "✅ BUNDLE ITEMS:",
        bundleItems
    );


    // ==============================
    // DISPLAY BUNDLES
    // ==============================

    for (const bundle of bundles) {

        let containerId = null;


        if (bundle.category === "hair-loss-bundles") {

            containerId =
                "hair-loss-bundles-container";

        }

        else if (
            bundle.category === "sensitive-skin-bundles"
        ) {

            containerId =
                "sensitive-skin-bundles-container";

        }

        else if (
            bundle.category === "oily-skin-bundles"
        ) {

            containerId =
                "oily-skin-bundles-container";

        }

        else if (
            bundle.category === "hair-care-bundles"
        ) {

            containerId =
                "hair-care-bundles-container";

        }

        else if (
            bundle.category === "special-offers"
        ) {

            containerId =
                "special-offers-container";

        }

        else if (
            bundle.category === "optional-additions"
        ) {

            containerId =
                "optional-additions-container";

        }


        if (!containerId) {

            console.log(
                "❌ UNKNOWN BUNDLE CATEGORY:",
                bundle.category
            );

            continue;
        }


        const container =
            document.getElementById(containerId);


        if (!container) {

            console.log(
                "❌ CONTAINER NOT FOUND:",
                containerId
            );

            continue;
        }


        // ==============================
        // FIND PRODUCTS IN BUNDLE
        // ==============================

        const items =
            bundleItems.filter(
                item =>
                    Number(item.bundle_id) ===
                    Number(bundle.id)
            );


        let productsHTML = "";


        if (items.length > 0) {

            const productIds =
                items.map(
                    item =>
                        Number(item.product_id)
                );


            console.log(
                "📦 BUNDLE:",
                bundle.name,
                "PRODUCT IDS:",
                productIds
            );


            const {
                data: products,
                error: productsError
            } = await supabase
                .from("products")
                .select("id, name")
                .in("id", productIds);


            if (productsError) {

                console.error(
                    "❌ PRODUCTS ERROR:",
                    productsError
                );

            }

            else if (
                products &&
                products.length > 0
            ) {

                productsHTML = `
                    <h4>
                        محتويات العرض:
                    </h4>

                    <ul>
                        ${
                            productIds
                                .map(productId => {

                                    const product =
                                        products.find(
                                            p =>
                                                Number(p.id) ===
                                                Number(productId)
                                        );


                                    return product
                                        ? `<li>${product.name}</li>`
                                        : "";

                                })
                                .join("")
                        }
                    </ul>
                `;

            }

        }


        // ==============================
        // CREATE BUNDLE CARD
        // ==============================

        const card =
            document.createElement("div");

        card.className =
            "bundle-card";


        card.innerHTML = `

            <span class="offer-badge">
                🔥 عرض خاص
            </span>

            <h3>
                ${bundle.name}
            </h3>


            ${
                bundle.description
                    ? `
                    <p>
                        ${bundle.description}
                    </p>
                    `
                    : ""
            }


            ${productsHTML}


            ${
                bundle.old_price
                    ? `
                    <p class="old-price">
                        السعر الأصلي:
                        ${bundle.old_price}
                        جنيه
                    </p>
                    `
                    : ""
            }


            <p class="new-price">
                سعر العرض:
                ${bundle.price}
                جنيه
            </p>


            ${
                bundle.old_price &&
                Number(bundle.old_price) >
                Number(bundle.price)

                    ? `
                    <p class="save-money">
                        وفر
                        ${
                            Number(bundle.old_price) -
                            Number(bundle.price)
                        }
                        جنيه 🔥
                    </p>
                    `
                    : ""
            }


            ${
                bundle.image
                    ? `
                    <img
                        src="${bundle.image}"
                        alt="${bundle.name}"
                        style="max-width:100%;"
                    >
                    `
                    : ""
            }


            <button
                class="add-to-cart"
                data-name="${bundle.name}"
                data-price="${bundle.price}"
            >
                أضف إلى سلة التسوق
            </button>

        `;


        container.appendChild(card);


        // ==============================
        // BUNDLE ADD TO CART
        // ==============================

        const button =
            card.querySelector(".add-to-cart");


        button.addEventListener(
            "click",
            async function () {

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
                    ) || [];


                cart.push({

                    name:
                        productName,

                    price:
                        productPrice,

                    quantity:
                        1

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

    }


    // ==================================================
    // OPTIONAL ADDITION PRODUCTS
    // ==================================================

    console.log(
        "🔥 LOADING OPTIONAL ADDITION PRODUCTS"
    );


    const {
        data: optionalProducts,
        error: optionalProductsError
    } = await supabase
        .from("products")
        .select("*")
        .eq("category", "optional-additions")
        .order("id");


    if (optionalProductsError) {

        console.error(
            "❌ OPTIONAL PRODUCTS ERROR:",
            optionalProductsError
        );

    }

    else {

        console.log(
            "✅ OPTIONAL PRODUCTS:",
            optionalProducts
        );


        const optionalContainer =
            document.getElementById(
                "optional-additions-container"
            );


        if (optionalContainer) {

            for (
                const product
                of optionalProducts
            ) {

                const card =
                    document.createElement("div");


                card.className =
                    "bundle-card";


                card.innerHTML = `

                    <h3>
                        ${product.name}
                    </h3>

                    ${
                        product.description
                            ? `
                            <p>
                                ${product.description}
                            </p>
                            `
                            : ""
                    }

                    ${
                        product.image
                            ? `
                            <img
                                src="${product.image}"
                                alt="${product.name}"
                                style="max-width:100%;"
                            >
                            `
                            : ""
                    }

                    <p class="new-price">
                        السعر:
                        ${product.price}
                        جنيه
                    </p>

                    <button
                        class="add-to-cart"
                        data-name="${product.name}"
                        data-price="${product.price}"
                    >
                        أضف إلى سلة التسوق
                    </button>

                `;


                optionalContainer.appendChild(
                    card
                );


                // ==============================
                // OPTIONAL PRODUCT CART
                // ==============================

                const button =
                    card.querySelector(
                        ".add-to-cart"
                    );


                button.addEventListener(
                    "click",
                    async function () {

                        await updateCartKey();


                        const productName =
                            button.dataset.name;


                        const productPrice =
                            Number(
                                button.dataset.price
                            );


                        let cart =
                            JSON.parse(
                                localStorage.getItem(
                                    cartKey
                                )
                            ) || [];


                        cart.push({

                            name:
                                productName,

                            price:
                                productPrice,

                            quantity:
                                1

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

            }

        }

        else {

            console.error(
                "❌ OPTIONAL ADDITIONS CONTAINER NOT FOUND"
            );

        }

    }


    // ==============================
    // FINISHED
    // ==============================

    console.log(
        "🎉 ALL SUPABASE OFFERS AND OPTIONAL PRODUCTS DISPLAYED"
    );

}


// ==============================
// START
// ==============================

loadSupabaseOffers();