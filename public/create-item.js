const itemType = document.getElementById("item-type");
const categorySelect = document.getElementById("category-select");


// ==============================
// TYPE CHANGE
// ==============================

itemType.addEventListener("change", () => {

    const bundleTitle =
        document.getElementById("bundle-products-title");

    const bundleContainer =
        document.getElementById("bundle-products-container");

    const oldPriceTitle =
        document.getElementById("old-price-title");

    const oldPriceInput =
        document.getElementById("item-old-price");


    if (itemType.value === "offer") {

        bundleTitle.style.display = "block";
        bundleContainer.style.display = "block";

        oldPriceTitle.style.display = "block";
        oldPriceInput.style.display = "block";

        loadBundleProducts();

    } else {

        bundleTitle.style.display = "none";
        bundleContainer.style.display = "none";

        oldPriceTitle.style.display = "none";
        oldPriceInput.style.display = "none";

    }


    categorySelect.innerHTML = "";


    // PRODUCT CATEGORIES

    if (itemType.value === "product") {

        categorySelect.innerHTML = `

        <option value="">اختر الفئة</option>

        <option value="shampoo">
            الشامبو
        </option>

        <option value="conditioner">
            البلسم
        </option>

        <option value="styling-cream">
            كريم التصفيف
        </option>

        <option value="hair-mask">
            حمام الكريم
        </option>

        <option value="hair-lotion">
            لوشن التساقط والإنبات
        </option>

        <option value="serum">
            السيروم
        </option>

        <option value="skin-care">
            العناية بالبشرة
        </option>

        <option value="brightening">
            منتجات التفتيح
        </option>

        <option value="lip-care">
            مرطبات الشفاه
        </option>

        <option value="face-serums">
            سيرومات البشرة والعين
        </option>

        <option value="hand-foot-care">
            العناية باليد والقدم
        </option>

        <option value="personal-care">
            العناية الشخصية
        </option>

        <option value="soap">
            الصابون
        </option>

        <option value="baby-products">
            منتجات الأطفال حديثي الولادة
        </option>

        <option value="other">
            منتجات أخرى
        </option>

        `;

    }


    // OFFER CATEGORIES

    else if (itemType.value === "offer") {

        categorySelect.innerHTML = `

        <option value="">اختر الفئة</option>

        <option value="hair-loss-bundles">
            مجموعات علاج التساقط والقشرة والإنبات
        </option>

        <option value="sensitive-skin-bundles">
            مجموعات العناية بالبشرة الحساسة والجافة والعادية
        </option>

        <option value="oily-skin-bundles">
            مجموعات العناية بالبشرة الدهنية
        </option>

        <option value="hair-care-bundles">
            مجموعات العناية بالشعر
        </option>

        <option value="special-offers">
            العروض الخاصة
        </option>

        <option value="optional-additions">
            الإضافات الاختيارية
        </option>

        `;

    }

});


// ==============================
// CREATE ITEM
// ==============================

document
    .getElementById("create-item-button")
    .addEventListener("click", async () => {

        try {

            // Make sure Supabase is available

            if (!window.supabaseClient) {

                alert("Supabase is not ready yet.");

                return;

            }


            const supabase =
                window.supabaseClient;


            const type =
                itemType.value;

            const name =
                document
                    .getElementById("item-name")
                    .value
                    .trim();

            const price =
                Number(
                    document
                        .getElementById("item-price")
                        .value
                );

            const image =
                document
                    .getElementById("item-image")
                    .value
                    .trim();

            const description =
                document
                    .getElementById("item-description")
                    .value
                    .trim();


            // ==========================
            // BASIC VALIDATION
            // ==========================

            if (!type) {

                alert("اختر نوع العنصر أولاً.");

                return;

            }

            if (!name) {

                alert("أدخل اسم المنتج أو العرض.");

                return;

            }

            if (!price || price < 0) {

                alert("أدخل سعراً صحيحاً.");

                return;

            }


            // ==========================
            // CREATE PRODUCT
            // ==========================

            if (type === "product") {

                const category =
                    categorySelect.value;


                if (!category) {

                    alert("اختر فئة المنتج.");

                    return;

                }


                const { data, error } =
                    await supabase
                        .from("products")
                        .insert([{

                            name: name,

                            category: category,

                            price: price,

                            image: image || null,

                            description:
                                description || null

                        }])
                        .select()
                        .single();


                if (error) {

                    console.error(
                        "PRODUCT CREATE ERROR:",
                        error
                    );

                    alert(
                        "حدث خطأ أثناء إنشاء المنتج:\n" +
                        error.message
                    );

                    return;

                }


                console.log(
                    "PRODUCT CREATED:",
                    data
                );


                alert(
                    "تم إنشاء المنتج بنجاح!"
                );


                window.location.href =
                    "admin.html";

                return;

            }


            // ==========================
            // CREATE BUNDLE / OFFER
            // ==========================

            if (type === "offer") {

                const selectedProducts =
                    Array.from(
                        document.querySelectorAll(
                            ".bundle-product:checked"
                        )
                    ).map(
                        checkbox =>
                            Number(checkbox.value)
                    );


                if (
                    selectedProducts.length === 0
                ) {

                    alert(
                        "اختر منتجاً واحداً على الأقل للعرض."
                    );

                    return;

                }


                // Create bundle first

                const { data: bundle, error: bundleError } =
                    await supabase
                        .from("bundles")
                        .insert([{

                            name: name,

                            price: price,

                            image: image || null,

                            description:
                                description || null

                        }])
                        .select()
                        .single();


                if (bundleError) {

                    console.error(
                        "BUNDLE CREATE ERROR:",
                        bundleError
                    );

                    alert(
                        "حدث خطأ أثناء إنشاء العرض:\n" +
                        bundleError.message
                    );

                    return;

                }


                console.log(
                    "BUNDLE CREATED:",
                    bundle
                );


                // ==========================
                // CREATE BUNDLE ITEMS
                // ==========================

                const bundleItems =
                    selectedProducts.map(
                        productId => ({

                            bundle_id:
                                bundle.id,

                            product_id:
                                productId,

                            quantity: 1

                        })
                    );


                const {
                    error: bundleItemsError
                } = await supabase
                    .from("bundle_items")
                    .insert(bundleItems);


                if (bundleItemsError) {

                    console.error(
                        "BUNDLE ITEMS ERROR:",
                        bundleItemsError
                    );


                    // Remove bundle if its
                    // products couldn't be saved

                    await supabase
                        .from("bundles")
                        .delete()
                        .eq("id", bundle.id);


                    alert(
                        "حدث خطأ أثناء إضافة منتجات العرض:\n" +
                        bundleItemsError.message
                    );

                    return;

                }


                console.log(
                    "BUNDLE ITEMS CREATED:",
                    bundleItems
                );


                alert(
                    "تم إنشاء العرض بنجاح!"
                );


                window.location.href =
                    "admin.html";

                return;

            }

        } catch (error) {

            console.error(
                "CREATE ITEM ERROR:",
                error
            );

            alert(
                "حدث خطأ غير متوقع:\n" +
                error.message
            );

        }

    });


// ==============================
// LOAD PRODUCTS FOR BUNDLES
// ==============================

async function loadBundleProducts() {

    try {

        if (!window.supabaseClient) {

            console.error(
                "Supabase is not ready."
            );

            return;

        }


        const supabase =
            window.supabaseClient;


        const {
            data: products,
            error
        } = await supabase
            .from("products")
            .select("id,name,price")
            .order("name");


        if (error) {

            console.error(
                "LOAD PRODUCTS ERROR:",
                error
            );

            alert(
                "تعذر تحميل المنتجات:\n" +
                error.message
            );

            return;

        }


        const container =
            document.getElementById(
                "bundle-products-container"
            );


        container.innerHTML = "";


        products.forEach(product => {

            container.innerHTML += `

                <div>

                    <input
                        type="checkbox"
                        class="bundle-product"
                        value="${product.id}"
                    >

                    <label>

                        ${product.name}
                        -
                        ${product.price}
                        جنيه

                    </label>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "LOAD BUNDLE PRODUCTS ERROR:",
            error
        );

    }

}