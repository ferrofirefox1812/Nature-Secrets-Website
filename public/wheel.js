const homeButton = document.getElementById("home-button");

if (homeButton) {
    homeButton.onclick = () => {
        location.href = "index.html";
    };
}

let currentRotation = 0;

let wheelRewards = [];

let winningSlice = -1;

const birchTexture = new Image();
birchTexture.src = "images/birch-texture.png";

const oakTexture = new Image();
oakTexture.src = "images/oak-texture.png";

window.addEventListener("supabaseReady", loadWheelRewards);

if (window.supabaseClient) {
    loadWheelRewards();
}

async function loadWheelRewards() {

    const { data, error } = await window.supabaseClient
        .from("wheel_settings")
        .select("*")
        .eq("enabled", true)
        .order("reward_order");

    if (error) {

        console.error(error);

        return;

    }

    wheelRewards = data;

    console.log("WHEEL REWARDS:", wheelRewards);

if (
    birchTexture.complete &&
    oakTexture.complete
) {

    drawWheel();

} else {

    let loaded = 0;

    function checkLoaded() {

        loaded++;

        if (loaded === 2) {

            drawWheel();

        }

    }

    birchTexture.onload = checkLoaded;

    oakTexture.onload = checkLoaded;

}

document.getElementById("wheel-loading").style.display = "none";

document.getElementById("wheel").style.display = "block";

document.querySelector(".leaf-ring").style.display = "block";

document.querySelector(".wheel-pointer").style.display = "block";

}

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

function drawWheel() {

    if (wheelRewards.length === 0) return;

    const radius = canvas.width / 2;
    const sliceAngle = (2 * Math.PI) / wheelRewards.length;

    const woodColors = [
    "#F1E5D5", // very light birch
    "#E8D8C3", // light ash
    "#DCC39B", // soft maple
    "#CDB28D", // warm oak
    "#EADBC8", // creamy wood
    "#D6B98C", // oak shade
    "#C2A277", // teak
    "#E8D8C3"  // light birch
];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ===== Wooden slices =====

    wheelRewards.forEach((reward, index) => {

        const rotationOffset = -Math.PI / 2; // Move slice 0 to 12 o'clock

const start = index * sliceAngle + rotationOffset;
const end = start + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius - 25, start, end);
        ctx.closePath();

        let pattern;

if(index % 2 === 0){

    pattern = ctx.createPattern(
        birchTexture,
        "repeat"
    );

}

else{

    pattern = ctx.createPattern(
        oakTexture,
        "repeat"
    );

}

// Glow only the winning slice
if(index === winningSlice){

    ctx.shadowColor = "#FFD54A";
    ctx.shadowBlur = 35;

}

ctx.fillStyle = pattern;

ctx.fill();

// Reset shadow so text doesn't glow
ctx.shadowBlur = 0;

ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 3;
ctx.stroke();

       ctx.save();

ctx.translate(radius, radius);

ctx.rotate(start + sliceAngle / 2);


ctx.fillStyle = "#1B4332";

ctx.textAlign = "center";


ctx.font = "24px Arial";

ctx.fillText(
    "🍃",
    140,
    -20
);


ctx.font = "bold 16px Cairo";

ctx.fillText(
    reward.reward_name,
    140,
    15
);


ctx.restore();

    });

    // ===== Gold outer ring =====

    ctx.beginPath();
    ctx.arc(radius, radius, radius - 15, 0, Math.PI * 2);

   const goldGradient = ctx.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
);

goldGradient.addColorStop(0, "#FFF8D6");
goldGradient.addColorStop(0.18, "#F7E27A");
goldGradient.addColorStop(0.35, "#E5C95B");
goldGradient.addColorStop(0.50, "#D4AF37");
goldGradient.addColorStop(0.72, "#A97912");
goldGradient.addColorStop(0.88, "#F7E27A");
goldGradient.addColorStop(1, "#FFF8D6");

ctx.strokeStyle = goldGradient;
ctx.lineWidth = 16;
ctx.lineCap = "round";
ctx.stroke();

    // ===== Premium green outer ring =====

ctx.beginPath();
ctx.arc(radius, radius, radius - 2, 0, Math.PI * 2);

const greenGradient = ctx.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
);

greenGradient.addColorStop(0, "#52B788");
greenGradient.addColorStop(0.5, "#2D6A4F");
greenGradient.addColorStop(1, "#081C15");

ctx.strokeStyle = greenGradient;
ctx.lineWidth = 8;
ctx.stroke();

    // ===== Center circle =====

    ctx.beginPath();
    ctx.arc(radius, radius, 75, 0, Math.PI * 2);

    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 5;
    ctx.stroke();

     // ===== Center logo image =====

const logo = new Image();

logo.src = "images/wheel-logo.png";

logo.onload = function(){

    ctx.save();

    ctx.beginPath();

    ctx.arc(
    radius,
    radius,
    72,
    0,
    Math.PI * 2
);

    ctx.clip();


    const logoSize = 145;

const size = Math.min(logo.width, logo.height);

ctx.drawImage(

    logo,

    (logo.width - size) / 2,
    (logo.height - size) / 2,
    size,
    size,

    radius - 72,
    radius - 72,
    145,
    145

);


    ctx.restore();

};

}

async function checkWheelCooldown(){

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    if(!user) return;

    const { data: latestReward, error } =
        await window.supabaseClient

        .from("user_rewards")

        .select("wheel_cooldown_until")

        .eq("user_id", user.id)

        .not("wheel_cooldown_until", "is", null)

        .order("id", { ascending: false })

        .limit(1)

        .maybeSingle();

    if(error){

        console.error(
            "COOLDOWN CHECK ERROR:",
            error
        );

        return;

    }

    const cooldownText =
        document.getElementById(
            "wheel-cooldown"
        );

    const spinButton =
        document.getElementById(
            "spin-wheel"
        );

    if(!cooldownText || !spinButton)
        return;

    if(
        !latestReward ||
        !latestReward.wheel_cooldown_until
    ){

        cooldownText.style.display =
            "none";

        spinButton.disabled =
            false;

        return;

    }

    const cooldownUntil =
        new Date(
            latestReward.wheel_cooldown_until
        );

    function updateCooldown(){

        const remaining =
            cooldownUntil.getTime() -
            Date.now();

        if(remaining <= 0){

            cooldownText.textContent =
                "🎡 يمكنك تدوير العجلة الآن!";

            cooldownText.style.display =
                "block";

            spinButton.disabled =
                false;

            return;

        }

        const totalSeconds =
            Math.floor(
                remaining / 1000
            );

        const days =
            Math.floor(
                totalSeconds / 86400
            );

        const hours =
            Math.floor(
                (totalSeconds % 86400) /
                3600
            );

        const minutes =
            Math.floor(
                (totalSeconds % 3600) /
                60
            );

        const seconds =
            totalSeconds % 60;

        cooldownText.textContent =
            `🔒 يمكنك تدوير العجلة مرة أخرى بعد ${days} يوم، ${hours} ساعة، ${minutes} دقيقة، ${seconds} ثانية`;

        cooldownText.style.display =
            "block";

        spinButton.disabled =
            true;

    }

    updateCooldown();

    setInterval(
        updateCooldown,
        1000
    );

}

document.getElementById("spin-wheel").onclick = spinWheel;

async function spinWheel(){

    if(wheelRewards.length === 0){

        alert("No rewards.");
        return;

    }

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    if(!user){

        alert("يرجى تسجيل الدخول أولاً.");
        return;

    }

    // Check latest reward/cooldown
const { data: latestReward, error } =
await window.supabaseClient

    .from("user_rewards")
    .select("wheel_cooldown_until")
    .eq("user_id", user.id)
    .not("wheel_cooldown_until", "is", null)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

if(error){

    console.error("COOLDOWN CHECK ERROR:", error);
    return;

}

if(latestReward && latestReward.wheel_cooldown_until){

    const cooldownUntil =
        new Date(latestReward.wheel_cooldown_until);

    const remaining =
        cooldownUntil.getTime() - Date.now();

    if(remaining > 0){

        const totalSeconds =
            Math.floor(remaining / 1000);

        const days =
            Math.floor(totalSeconds / 86400);

        const hours =
            Math.floor(
                (totalSeconds % 86400) / 3600
            );

        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );

        const seconds =
            totalSeconds % 60;

        alert(
            `🔒 يمكنك تدوير العجلة مرة أخرى بعد ${days} يوم، ${hours} ساعة، ${minutes} دقيقة، ${seconds} ثانية.`
        );

        return;

    }

}

    // Start spin
    const canvas = document.getElementById("wheel");

   const enabledRewards = wheelRewards.filter(
    reward => reward.enabled && Number(reward.probability) > 0
);

if (enabledRewards.length === 0) {

    alert("لا توجد جوائز مفعلة في العجلة.");

    return;

}

const totalProbability =
    enabledRewards.reduce(
        (sum, reward) =>
            sum + Number(reward.probability),
        0
    );

let randomValue =
    Math.random() * totalProbability;

let selectedReward = null;

for (const reward of enabledRewards) {

    randomValue -= Number(reward.probability);

    if (randomValue < 0) {

        selectedReward = reward;

        break;

    }

}

const randomSlice =
    wheelRewards.findIndex(
        reward => reward.id === selectedReward.id
    );

winningSlice = randomSlice;

console.log(
    "🎯 WINNING REWARD =",
    selectedReward.reward_name
);

console.log(
    "🎯 WINNING PROBABILITY =",
    selectedReward.probability + "%"
);

    const cooldownUntil = new Date();

cooldownUntil.setDate(
    cooldownUntil.getDate() + 14
);

window.currentWheelCooldownUntil =
    cooldownUntil.toISOString();

console.log(
    "🎡 COOLDOWN UNTIL =",
    window.currentWheelCooldownUntil
);

    const sliceAngle = 360 / wheelRewards.length;

    const extraSpins = 6 * 360;

    currentRotation =
        extraSpins +
        (360 - randomSlice * sliceAngle) -
        sliceAngle / 2;

    canvas.style.transform =
        `rotate(${currentRotation}deg)`;

    setTimeout(() => {

        drawWheel();

        showWinningMessage();

    }, 6000);

}


async function saveRewardToUser(reward){

    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    if(!user){

        console.log("No logged in user.");
        return;

    }

    const expires = new Date();

await window.supabaseClient
    .from("user_rewards")
    .delete()
    .eq("user_id", user.id)
    .eq("used", false)
    .eq("activated", false);

    expires.setHours(expires.getHours() + 24);

    const { error } = await window.supabaseClient
        .from("user_rewards")
        .insert({

            user_id: user.id,

            reward_id: reward.id,

            reward_name: reward.reward_name,

            reward_type: reward.reward_type,

            reward_value: reward.reward_value,

            product_reference: reward.product_reference,

            expires_at: expires.toISOString(),

wheel_cooldown_until:
    window.currentWheelCooldownUntil,

used: false,

claimed: false,

activated: false

        });

   if(error){

    console.error(
        "❌ REWARD SAVE ERROR =",
        error
    );

}else{

    console.log(
        "✅ Reward Saved Successfully"
    );

    console.log(
        "🔒 COOLDOWN SAVED UNTIL =",
        window.currentWheelCooldownUntil
    );

}

}

async function showWinningMessage(){

    if(winningSlice === -1) return;

    const reward = wheelRewards[winningSlice];
    await saveRewardToUser(reward);

    document.getElementById("reward-popup-title").textContent =
        reward.reward_name;

    document.getElementById("reward-popup").style.display =
        "flex";

}

window.addEventListener("DOMContentLoaded", () => {

    const claimButton =
        document.getElementById("claim-reward");

    if(claimButton){

        claimButton.onclick = async function(){

            const {
                data: { user }
            } = await window.supabaseClient.auth.getUser();

            if(user){

                const { error } = await window.supabaseClient

                    .from("user_rewards")

                    .update({

                        claimed: true

                    })

                    .eq("user_id", user.id)

                    .eq("used", false);

                console.log("Reward claimed:", error);

            }

            document.getElementById("reward-popup").style.display =
                "none";

        };

    }

});


window.addEventListener(
    "supabaseReady",
    checkWheelCooldown
);