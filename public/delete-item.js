console.log("🔥 DELETE ITEMS JS LOADED");

async function loadItems() {
    if (!window.supabaseClient) {
        console.log("⏳ Waiting for Supabase...");

        window.addEventListener(
            "supabaseReady",
            loadItems,
            { once: true }
        );

        return;
    }

    const supabase = window.supabaseClient;
    const container = document.getElementById("items-container");

    if (!container) {
        console.error("❌ ITEMS CONTAINER NOT FOUND");
        return;
    }

    container.innerHTML = "جاري تحميل العناصر...";

    // =========================
    // LOAD PRODUCTS
    // =========================

    const {
        data: products,
        error: productsError
    } = await supabase
        .from("products")
        .select("*")
        .order("id");

    if (productsError) {
        console.error("❌ PRODUCTS ERROR:", productsError);
        container.innerHTML = "حدث خطأ أثناء تحميل المنتجات.";
        return;
    }

    // =========================
    // LOAD OFFERS
    // =========================

    const {
        data: bundles,
        error: bundlesError
    } = await supabase
        .from("bundles")
        .select("*")
        .order("id");

    if (bundlesError) {
        console.error("❌ BUNDLES ERROR:", bundlesError);
        container.innerHTML = "حدث خطأ أثناء تحميل العروض.";
        return;
    }

    console.log("✅ PRODUCTS:", products);
    console.log("✅ BUNDLES:", bundles);

    container.innerHTML = "";

    // =========================
    // PRODUCTS
    // =========================

    const productsTitle = document.createElement("h2");
    productsTitle.textContent = "المنتجات";
    container.appendChild(productsTitle);

    products.forEach(function (product) {
        const card = document.createElement("div");

        card.className = "product";

        card.innerHTML = `
            <h3>${product.name}</h3>

            <p>
                السعر: ${product.price} جنيه
            </p>

            <p>
                منتج
            </p>

            <button class="delete-button">
                حذف
            </button>
        `;

        const button = card.querySelector(".delete-button");

        button.onclick = async function () {

            const confirmDelete = confirm(
                'هل تريد حذف المنتج "' +
                product.name +
                '"؟'
            );

            if (!confirmDelete) {
                return;
            }

            console.log(
                "🗑️ TRYING TO DELETE PRODUCT:",
                product.id
            );

            // =========================
            // DELETE PRODUCT
            // =========================

            const {
                data: deletedProduct,
                error: deleteError
            } = await supabase
                .from("products")
                .delete()
                .eq("id", product.id)
                .select();

            console.log(
                "🆔 PRODUCT ID:",
                product.id
            );

            console.log(
                "🗑️ DELETED PRODUCT:",
                deletedProduct
            );

            console.log(
                "❌ DELETE ERROR:",
                deleteError
            );

            if (deleteError) {
                console.error(
                    "❌ PRODUCT DELETE ERROR:",
                    deleteError
                );

                alert(
                    "حدث خطأ أثناء حذف المنتج:\n" +
                    deleteError.message
                );

                return;
            }

            if (
                !deletedProduct ||
                deletedProduct.length === 0
            ) {
                console.error(
                    "❌ NO PRODUCT WAS DELETED"
                );

                alert(
                    "لم يتم حذف المنتج من Supabase."
                );

                return;
            }

            console.log(
                "✅ PRODUCT DELETED SUCCESSFULLY"
            );

            alert(
                "تم حذف المنتج بنجاح!"
            );

            location.reload();
        };

        container.appendChild(card);
    });

    // =========================
    // OFFERS
    // =========================

    const bundlesTitle = document.createElement("h2");

    bundlesTitle.textContent =
        "العروض والباقات";

    bundlesTitle.style.marginTop =
        "40px";

    container.appendChild(bundlesTitle);

    bundles.forEach(function (bundle) {

        const card = document.createElement("div");

        card.className = "product";

        card.innerHTML = `
            <h3>${bundle.name}</h3>

            <p>
                السعر: ${bundle.price} جنيه
            </p>

            <p>
                عرض
            </p>

            <button class="delete-button">
                حذف
            </button>
        `;

        const button =
            card.querySelector(".delete-button");

        button.onclick = async function () {

            const confirmDelete = confirm(
                'هل تريد حذف العرض "' +
                bundle.name +
                '"؟'
            );

            if (!confirmDelete) {
                return;
            }

            console.log(
                "🗑️ TRYING TO DELETE BUNDLE:",
                bundle.id
            );

            // =========================
            // DELETE BUNDLE ITEMS
            // =========================

            const {
                error: itemsDeleteError
            } = await supabase
                .from("bundle_items")
                .delete()
                .eq("bundle_id", bundle.id);

            console.log(
                "🗑️ BUNDLE ITEMS DELETE ERROR:",
                itemsDeleteError
            );

            if (itemsDeleteError) {

                console.error(
                    "❌ BUNDLE ITEMS DELETE ERROR:",
                    itemsDeleteError
                );

                alert(
                    "لم يتم حذف منتجات العرض:\n" +
                    itemsDeleteError.message
                );

                return;
            }

            // =========================
            // DELETE BUNDLE
            // =========================

            const {
                data: deletedBundle,
                error: bundleDeleteError
            } = await supabase
                .from("bundles")
                .delete()
                .eq("id", bundle.id)
                .select();

            console.log(
                "🗑️ DELETED BUNDLE:",
                deletedBundle
            );

            console.log(
                "❌ BUNDLE DELETE ERROR:",
                bundleDeleteError
            );

            if (bundleDeleteError) {

                console.error(
                    "❌ BUNDLE DELETE ERROR:",
                    bundleDeleteError
                );

                alert(
                    "حدث خطأ أثناء حذف العرض:\n" +
                    bundleDeleteError.message
                );

                return;
            }

            if (
                !deletedBundle ||
                deletedBundle.length === 0
            ) {

                console.error(
                    "❌ NO BUNDLE WAS DELETED"
                );

                alert(
                    "لم يتم حذف العرض من Supabase."
                );

                return;
            }

            console.log(
                "✅ BUNDLE DELETED SUCCESSFULLY"
            );

            alert(
                "تم حذف العرض بنجاح!"
            );

            location.reload();
        };

        container.appendChild(card);
    });

    console.log(
        "🎉 ALL ITEMS LOADED FOR DELETION"
    );
}

loadItems();