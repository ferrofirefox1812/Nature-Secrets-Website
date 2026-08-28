console.log("🔥 EDIT ITEMS JS LOADED");

async function loadItems() {

    // ==============================
    // WAIT FOR SUPABASE
    // ==============================

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

    const container =
        document.getElementById("items-container");

    if (!container) {

        console.error(
            "❌ ITEMS CONTAINER NOT FOUND"
        );

        return;
    }

    container.innerHTML =
        "جاري تحميل العناصر...";


    // ==============================
    // LOAD PRODUCTS
    // ==============================

    const {
        data: products,
        error: productsError
    } = await supabase
        .from("products")
        .select("*")
        .order("id");

    if (productsError) {

        console.error(
            "❌ PRODUCTS ERROR:",
            productsError
        );

        container.innerHTML =
            "حدث خطأ أثناء تحميل المنتجات.";

        return;
    }


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

        container.innerHTML =
            "حدث خطأ أثناء تحميل العروض.";

        return;
    }


    console.log(
        "✅ PRODUCTS:",
        products
    );

    console.log(
        "✅ BUNDLES:",
        bundles
    );


    container.innerHTML = "";


    // ==============================
    // PRODUCTS
    // ==============================

    const productsTitle =
        document.createElement("h2");

    productsTitle.textContent =
        "المنتجات";

    container.appendChild(
        productsTitle
    );


    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "product";

        card.innerHTML = `

            <h3>
                ${escapeHTML(product.name)}
            </h3>

            <p>
                السعر: ${product.price} جنيه
            </p>

            <button class="edit-button">
                تعديل المنتج
            </button>

        `;


        card.querySelector(
            ".edit-button"
        ).onclick = function () {

            showProductEditor(
                product,
                container,
                supabase
            );

        };


        container.appendChild(
            card
        );

    });


    // ==============================
    // BUNDLES
    // ==============================

    const bundlesTitle =
        document.createElement("h2");

    bundlesTitle.textContent =
        "العروض والباقات";

    bundlesTitle.style.marginTop =
        "40px";

    container.appendChild(
        bundlesTitle
    );


    bundles.forEach(bundle => {

        const card =
            document.createElement("div");

        card.className =
            "product";

        card.innerHTML = `

            <h3>
                ${escapeHTML(bundle.name)}
            </h3>

            <p>
                السعر: ${bundle.price} جنيه
            </p>

            ${
                bundle.old_price
                    ? `
                        <p>
                            السعر الأصلي:
                            ${bundle.old_price}
                            جنيه
                        </p>
                    `
                    : ""
            }

            <button class="edit-button">
                تعديل العرض
            </button>

        `;


        card.querySelector(
            ".edit-button"
        ).onclick = function () {

            showBundleEditor(
                bundle,
                products,
                container,
                supabase
            );

        };


        container.appendChild(
            card
        );

    });


    console.log(
        "🎉 ALL ITEMS LOADED FOR EDITING"
    );

}


// ==========================================
// PRODUCT EDITOR
// ==========================================

function showProductEditor(
    product,
    container,
    supabase
) {

    container.innerHTML = `

        <h2>
            تعديل المنتج:
            ${escapeHTML(product.name)}
        </h2>

        <label>
            اسم المنتج
        </label>

        <br>

        <input
            id="edit-name"
            value="${escapeHTML(product.name || "")}"
        >

        <br><br>

        <label>
            السعر
        </label>

        <br>

        <input
            id="edit-price"
            type="number"
            value="${product.price || 0}"
        >

        <br><br>

        <label>
            كمية المخزون
        </label>

        <br>

        <input
            id="edit-stock"
            type="number"
            min="0"
            value="${product.stock_quantity || 0}"
        >

        <br><br>

        <label>
            رابط الصورة
        </label>

        <br>

        <input
            id="edit-image"
            value="${escapeHTML(product.image || "")}"
            placeholder="رابط الصورة"
        >

        <br><br>

        <label>
            الوصف
        </label>

        <br>

        <textarea
            id="edit-description"
        >${escapeHTML(product.description || "")}</textarea>

        <br><br>

        <button id="save-product">
            حفظ التعديل
        </button>

        <button id="cancel-edit">
            إلغاء
        </button>

    `;


    document.getElementById(
        "save-product"
    ).onclick = async function () {

        const updatedProduct = {

            name:
                document
                    .getElementById("edit-name")
                    .value
                    .trim(),

            price:
                Number(
                    document
                        .getElementById("edit-price")
                        .value
                ),

            stock_quantity:
                Math.max(
                    0,
                    Number(
                        document
                            .getElementById("edit-stock")
                            .value
                    ) || 0
                ),

            image:
                document
                    .getElementById("edit-image")
                    .value
                    .trim(),

            description:
                document
                    .getElementById("edit-description")
                    .value
                    .trim()

        };


        if (!updatedProduct.name) {

            alert(
                "اكتب اسم المنتج."
            );

            return;
        }


      const {
    data: updatedData,
    error: updateError
} = await supabase
    .from("products")
    .update(updatedProduct)
    .eq("id", product.id)
    .select();

console.log("🆔 PRODUCT ID:", product.id);
console.log("📝 UPDATE DATA:", updatedProduct);
console.log("📦 UPDATED ROW:", updatedData);
console.log("❌ UPDATE ERROR:", updateError);

if (updateError) {

    console.error(
        "❌ PRODUCT UPDATE ERROR:",
        updateError
    );

    alert(
        "حدث خطأ أثناء تعديل المنتج:\n" +
        updateError.message
    );

    return;
}

if (!updatedData || updatedData.length === 0) {

    console.error(
        "❌ NO PRODUCT WAS UPDATED"
    );

    alert(
        "لم يتم تعديل المنتج. لم يتم العثور على المنتج في Supabase."
    );

    return;
}

alert(
    "تم تعديل المنتج بنجاح!"
);

location.reload();


        if (error) {

            console.error(
                "❌ PRODUCT UPDATE ERROR:",
                error
            );

            alert(
                "حدث خطأ أثناء تعديل المنتج:\n" +
                error.message
            );

            return;
        }


        alert(
            "تم تعديل المنتج بنجاح!"
        );


        location.reload();

    };


    document.getElementById(
        "cancel-edit"
    ).onclick = function () {

        location.reload();

    };

}


// ==========================================
// BUNDLE EDITOR
// ==========================================

async function showBundleEditor(
    bundle,
    products,
    container,
    supabase
) {

    container.innerHTML =
        "جاري تحميل منتجات العرض...";


    // ==============================
    // LOAD CURRENT BUNDLE ITEMS
    // ==============================

    const {
        data: currentItems,
        error
    } = await supabase
        .from("bundle_items")
        .select("*")
        .eq("bundle_id", bundle.id)
        .order("id");


    if (error) {

        console.error(
            "❌ BUNDLE ITEMS ERROR:",
            error
        );

        container.innerHTML =
            "حدث خطأ أثناء تحميل منتجات العرض.";

        return;
    }


    console.log(
        "📦 CURRENT BUNDLE ITEMS:",
        currentItems
    );


    // ==============================
    // CURRENTLY SELECTED PRODUCTS
    // ==============================

    const selectedProducts = {};


    currentItems.forEach(item => {

        const productId =
            Number(item.product_id);


        if (
            selectedProducts[productId] === undefined
        ) {

            selectedProducts[productId] =
                item.quantity || 1;

        }

    });


    console.log(
        "✅ SELECTED PRODUCTS:",
        selectedProducts
    );


    // ==============================
    // EDITOR
    // ==============================

    container.innerHTML = `

        <h2>
            تعديل العرض:
            ${escapeHTML(bundle.name)}
        </h2>

        <label>
            اسم العرض
        </label>

        <br>

        <input
            id="bundle-name"
            value="${escapeHTML(bundle.name || "")}"
        >

        <br><br>

        <label>
            السعر
        </label>

        <br>

        <input
            id="bundle-price"
            type="number"
            value="${bundle.price || 0}"
        >

        <br><br>

        <label>
            السعر الأصلي
        </label>

        <br>

        <input
            id="bundle-old-price"
            type="number"
            value="${bundle.old_price || ""}"
        >

        <br><br>

        <label>
            التصنيف
        </label>

        <br>

        <select id="bundle-category">

            <option value="hair-loss-bundles">
                علاج التساقط والقشرة والإنبات
            </option>

            <option value="sensitive-skin-bundles">
                البشرة الحساسة والجافة والعادية
            </option>

            <option value="oily-skin-bundles">
                البشرة الدهنية
            </option>

            <option value="hair-care-bundles">
                العناية بالشعر
            </option>

            <option value="optional-additions">
                الإضافات الاختيارية
            </option>

            <option value="special-offers">
                العروض الخاصة
            </option>

        </select>

        <br><br>

        <label>
            الوصف
        </label>

        <br>

        <textarea id="bundle-description">${escapeHTML(
            bundle.description || ""
        )}</textarea>

        <br><br>

        <label>
            رابط الصورة
        </label>

        <br>

        <input
            id="bundle-image"
            value="${escapeHTML(bundle.image || "")}"
            placeholder="رابط الصورة"
        >

        <br><br>

        <h3>
            منتجات العرض
        </h3>

        <p>
            اختر المنتجات الموجودة داخل هذا العرض:
        </p>

        <div id="bundle-products-list"></div>

        <br>

        <button id="save-bundle">
            حفظ التعديل
        </button>

        <button id="cancel-bundle">
            إلغاء
        </button>

    `;


    // ==============================
    // SET CATEGORY
    // ==============================

    const categorySelect =
        document.getElementById(
            "bundle-category"
        );


    categorySelect.value =
        bundle.category ||
        "special-offers";


    // ==============================
    // DISPLAY ALL PRODUCTS
    // ==============================

    const productsList =
        document.getElementById(
            "bundle-products-list"
        );


    products.forEach(product => {

        const quantity =
            selectedProducts[product.id] || 1;


        const isSelected =
            selectedProducts[product.id]
            !== undefined;


        const row =
            document.createElement("div");


        row.style.marginBottom =
            "10px";


        row.innerHTML = `

            <label>

                <input
                    type="checkbox"
                    class="bundle-product-checkbox"
                    data-product-id="${product.id}"
                    ${isSelected ? "checked" : ""}
                >

                ${escapeHTML(product.name)}

                — ${product.price} جنيه

            </label>

            <input
                type="number"
                min="1"
                value="${quantity}"
                class="bundle-product-quantity"
                data-product-id="${product.id}"
                style="width:70px; margin-right:10px;"
            >

        `;


        productsList.appendChild(
            row
        );

    });


    console.log(
        "✅ ALL PRODUCTS DISPLAYED FOR BUNDLE EDIT"
    );


    // ==============================
    // SAVE BUNDLE
    // ==============================

    document.getElementById(
        "save-bundle"
    ).onclick = async function () {

        const saveButton =
            document.getElementById(
                "save-bundle"
            );


        saveButton.disabled =
            true;


        saveButton.textContent =
            "جاري الحفظ...";


        try {

            // ==============================
            // GET VALUES
            // ==============================

            const name =
                document
                    .getElementById(
                        "bundle-name"
                    )
                    .value
                    .trim();


            const price =
                Number(
                    document
                        .getElementById(
                            "bundle-price"
                        )
                        .value
                );


            const oldPriceValue =
                document
                    .getElementById(
                        "bundle-old-price"
                    )
                    .value;


            const oldPrice =
                oldPriceValue === ""
                    ? null
                    : Number(oldPriceValue);


            const category =
                document
                    .getElementById(
                        "bundle-category"
                    )
                    .value;


            const description =
                document
                    .getElementById(
                        "bundle-description"
                    )
                    .value
                    .trim();


            const image =
                document
                    .getElementById(
                        "bundle-image"
                    )
                    .value
                    .trim();


            // ==============================
            // VALIDATION
            // ==============================

            if (!name) {

                alert(
                    "اكتب اسم العرض."
                );

                return;
            }


            if (!price) {

                alert(
                    "اكتب سعر العرض."
                );

                return;
            }


            // ==============================
            // COLLECT SELECTED PRODUCTS
            // ==============================

            const selectedItems = [];


            document
                .querySelectorAll(
                    ".bundle-product-checkbox"
                )
                .forEach(checkbox => {

                    if (!checkbox.checked) {
                        return;
                    }


                    const productId =
                        Number(
                            checkbox.dataset.productId
                        );


                    const quantityInput =
                        document.querySelector(
                            `.bundle-product-quantity[data-product-id="${productId}"]`
                        );


                    const quantity =
                        Math.max(
                            1,
                            Number(
                                quantityInput.value
                            ) || 1
                        );


                    selectedItems.push({

                        bundle_id:
                            bundle.id,

                        product_id:
                            productId,

                        quantity:
                            quantity

                    });

                });


            console.log(
                "📝 NEW SELECTED ITEMS:",
                selectedItems
            );


            // ==============================
            // UPDATE BUNDLE
            // ==============================

            const {
                error: updateError
            } = await supabase
                .from("bundles")
                .update({

                    name:
                        name,

                    price:
                        price,

                    old_price:
                        oldPrice,

                    category:
                        category,

                    description:
                        description,

                    image:
                        image

                })
                .eq(
                    "id",
                    bundle.id
                );


            if (updateError) {

                console.error(
                    "❌ BUNDLE UPDATE ERROR:",
                    updateError
                );

                alert(
                    "حدث خطأ أثناء تعديل العرض:\n" +
                    updateError.message
                );

                return;
            }


            console.log(
                "✅ BUNDLE INFORMATION UPDATED"
            );


            // ==============================
            // DELETE OLD BUNDLE ITEMS
            // ==============================

            console.log(
                "🗑️ DELETING OLD BUNDLE ITEMS..."
            );


            const {
                error: deleteItemsError
            } = await supabase
                .from("bundle_items")
                .delete()
                .eq(
                    "bundle_id",
                    bundle.id
                );


            if (deleteItemsError) {

                console.error(
                    "❌ OLD BUNDLE ITEMS DELETE ERROR:",
                    deleteItemsError
                );

                alert(
                    "حدث خطأ أثناء حذف المنتجات القديمة:\n" +
                    deleteItemsError.message
                );

                return;
            }


            console.log(
                "✅ DELETE REQUEST FINISHED"
            );


            // ==============================
            // VERIFY DELETE
            // ==============================

            const {
                data: remainingItems,
                error: verifyError
            } = await supabase
                .from("bundle_items")
                .select("id, product_id")
                .eq(
                    "bundle_id",
                    bundle.id
                );


            if (verifyError) {

                console.error(
                    "❌ DELETE VERIFICATION ERROR:",
                    verifyError
                );

                alert(
                    "حدث خطأ أثناء التحقق من حذف المنتجات القديمة."
                );

                return;
            }


            console.log(
                "🔍 REMAINING ITEMS:",
                remainingItems
            );


            if (
                remainingItems &&
                remainingItems.length > 0
            ) {

                console.error(
                    "❌ OLD ITEMS STILL EXIST:",
                    remainingItems
                );

                alert(
                    "Supabase لم يحذف المنتجات القديمة.\n\n" +
                    "لم تتم إضافة المنتجات الجديدة حتى لا تتكرر."
                );

                return;
            }


            console.log(
                "🎉 ALL OLD ITEMS SUCCESSFULLY DELETED"
            );


            // ==============================
            // INSERT NEW PRODUCTS
            // ==============================

            if (
                selectedItems.length > 0
            ) {

                console.log(
                    "➕ INSERTING NEW PRODUCTS:",
                    selectedItems
                );


                const {
                    error: insertItemsError
                } = await supabase
                    .from("bundle_items")
                    .insert(
                        selectedItems
                    );


                if (insertItemsError) {

                    console.error(
                        "❌ BUNDLE ITEMS INSERT ERROR:",
                        insertItemsError
                    );

                    alert(
                        "تم حذف المنتجات القديمة لكن حدث خطأ أثناء إضافة المنتجات الجديدة:\n" +
                        insertItemsError.message
                    );

                    return;
                }


                console.log(
                    "✅ NEW PRODUCTS INSERTED"
                );

            }


            // ==============================
            // FINAL CHECK
            // ==============================

            const {
                data: finalItems,
                error: finalError
            } = await supabase
                .from("bundle_items")
                .select(
                    "id, bundle_id, product_id, quantity"
                )
                .eq(
                    "bundle_id",
                    bundle.id
                )
                .order("id");


            if (finalError) {

                console.error(
                    "❌ FINAL CHECK ERROR:",
                    finalError
                );

            } else {

                console.log(
                    "🎉 FINAL BUNDLE ITEMS:",
                    finalItems
                );

            }


            alert(
                "تم تعديل العرض والمنتجات بنجاح!"
            );


            location.reload();

        } finally {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "حفظ التعديل";

        }

    };


    // ==============================
    // CANCEL
    // ==============================

    document.getElementById(
        "cancel-bundle"
    ).onclick = function () {

        location.reload();

    };

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// START
// ==========================================

loadItems();