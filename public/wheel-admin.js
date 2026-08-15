let editingRewardId = null;

async function loadProductsDropdown() {

    const select = document.getElementById("reward-product");

    if (!select) return;

    const { data, error } = await window.supabaseClient
        .from("products")
        .select("id,name")
        .order("name");

    if (error) {
        console.error(error);
        return;
    }

    select.innerHTML = `
        <option value="">
            اختر منتج
        </option>
    `;

    data.forEach(product => {

        select.innerHTML += `
            <option value="${product.id}">
                ${product.name}
            </option>
        `;

    });

}

async function loadWheelRewards() {

    const container = document.getElementById("wheel-rewards-list");

    if (!container) return;

    const { data, error } = await window.supabaseClient
        .from("wheel_settings")
        .select("*")
        .order("reward_order", { ascending: true });

    console.log("WHEEL SETTINGS =", data);
    console.log("WHEEL ERROR =", error);

    if (error) return;

    container.innerHTML = "";

    data.forEach((reward) => {

        container.innerHTML += `

        <div class="wheel-card">

            <h3>${reward.reward_name}</h3>

            <p><strong>Type:</strong> ${reward.reward_type}</p>

            <p><strong>Value:</strong> ${reward.reward_value}</p>

            <p><strong>Probability:</strong> ${reward.probability}%</p>

            <p><strong>Status:</strong> ${
                reward.enabled ? "🟢 Enabled" : "🔴 Disabled"
            }</p>

            <button class="edit-wheel-reward" data-id="${reward.id}">
                ✏️ Edit
            </button>

            <button class="delete-wheel-reward" data-id="${reward.id}">
                🗑 Delete
            </button>

        </div>

        `;

    });

document.querySelectorAll(".delete-wheel-reward").forEach((button) => {

    button.onclick = async function () {

        const confirmed = confirm("Are you sure you want to delete this reward?");

        if (!confirmed) return;

        const rewardId = this.dataset.id;

        const { error } = await window.supabaseClient

            .from("wheel_settings")

            .delete()

            .eq("id", rewardId);

        if (error) {

            alert("❌ " + error.message);

            return;

        }

        alert("🗑 Reward Deleted!");

        loadWheelRewards();

    };

});


document.querySelectorAll(".edit-wheel-reward").forEach((button) => {

    button.onclick = function () {

        const rewardId = this.dataset.id;

        const reward = data.find(r => r.id == rewardId);

        if (!reward) return;


        editingRewardId = reward.id;


        document.getElementById("reward-name").value = reward.reward_name;

        document.getElementById("reward-type").value = reward.reward_type;

        document.getElementById("reward-value").value = reward.reward_value;

        document.getElementById("reward-probability").value = reward.probability;

        document.getElementById("reward-enabled").checked = reward.enabled;

document.getElementById("reward-product").value =
    reward.product_reference || "";


        document.getElementById("reward-type")
        .dispatchEvent(new Event("change"));


        document.getElementById("wheel-popup").style.display = "flex";

    };

});

}

window.addEventListener("supabaseReady", () => {

    loadWheelRewards();
    loadProductsDropdown();

});

if (window.supabaseClient) {

    loadWheelRewards();
    loadProductsDropdown();

}


// OPEN POPUP

document.getElementById("add-wheel-reward").onclick = function(){

    document.getElementById("wheel-popup").style.display = "flex";

};

// CLOSE POPUP

document.getElementById("close-wheel-popup").onclick = function(){

    document.getElementById("wheel-popup").style.display = "none";

};

const rewardType = document.getElementById("reward-type");

function updateRewardFields() {

    const couponFields =
        document.getElementById("coupon-fields");

    const productFields =
        document.getElementById("product-fields");

    const rewardValueLabel =
        document.getElementById("reward-value-label");

    if (rewardType.value === "coupon") {

        couponFields.style.display = "block";
        productFields.style.display = "none";

        rewardValueLabel.textContent =
            "Discount %";

    }

    else if (rewardType.value === "voucher") {

        couponFields.style.display = "block";
        productFields.style.display = "none";

        rewardValueLabel.textContent =
            "Voucher Amount (EGP)";

    }

    else if (rewardType.value === "product") {

        couponFields.style.display = "none";
        productFields.style.display = "block";

    }

}


rewardType.addEventListener("change", updateRewardFields);

updateRewardFields();

document.getElementById("save-wheel-reward").onclick = async function () {

    console.log("SAVE BUTTON CLICKED");

    const rewardName = document.getElementById("reward-name").value;

    const rewardType = document.getElementById("reward-type").value;

    const rewardValue = Number(document.getElementById("reward-value").value);

    const productReference =
    document.getElementById("reward-product").value || null;

    const probability = Number(document.getElementById("reward-probability").value);

    const enabled = document.getElementById("reward-enabled").checked;

    let error;

if (editingRewardId === null) {

    ({ error } = await window.supabaseClient

        .from("wheel_settings")

        .insert({

            reward_order: 1,
reward_name: rewardName,
reward_type: rewardType,
reward_value: rewardValue,
product_reference:
    rewardType === "product"
        ? productReference
        : null,
probability: probability,
enabled: enabled

        }));

} else {

    const { data: updatedReward, error: updateError } =
        await window.supabaseClient

            .from("wheel_settings")

            .update({

                reward_name: rewardName,
                reward_type: rewardType,
                reward_value: rewardValue,
                product_reference:
                    rewardType === "product"
                        ? productReference
                        : null,
                probability: probability,
                enabled: enabled

            })

            .eq("id", editingRewardId)
            .select()
            .single();

    console.log("EDITING ID =", editingRewardId);
    console.log("UPDATED REWARD =", updatedReward);
    console.log("UPDATE ERROR =", updateError);

    error = updateError;

    if (!updateError && !updatedReward) {

        alert(
            "⚠️ لم يتم تعديل الجائزة. تحقق من صلاحيات UPDATE في Supabase."
        );

        return;
    }
}

    if (error) {

        alert("❌ " + error.message);

        return;

    }

    console.log("Editing ID =", editingRewardId);

console.log("Reward Name =", rewardName);

console.log("Update Error =", error);

alert("✅ Saved Successfully!");

document.getElementById("wheel-popup").style.display = "none";

editingRewardId = null;

loadWheelRewards();

};