

async function startAuth() {
console.log("START AUTH WORKING");



    // CHECK IF USER IS ALREADY LOGGED IN

    const { data } = await window.supabaseClient.auth.getSession();


    if(data.session){

document.getElementById("auth-popup").style.display = "none";

const userId = data.session.user.id;

const userEmail = data.session.user.email;

const pendingName =
localStorage.getItem(
"pending_name"
);


       const { data: profile } = await window.supabaseClient
.from("profiles")
.select("*")
.eq("id", userId)
.maybeSingle();


if(!profile){

document.getElementById(
"missing-name-popup"
).style.display = "flex";


document.getElementById(
"save-missing-name"
).onclick = async function(){


const enteredName =

document.getElementById(
"missing-name-input"
).value.trim();


if(!enteredName){

alert(
"Please enter your name."
);

return;

}


await window.supabaseClient

.from("profiles")

.insert([

{

id:userId,

name:enteredName,

email:userEmail

}

]);


location.reload();


};


return;

}



        if(profile){

    document.getElementById("welcome-message").textContent =
    "Hi, " + profile.name;

    document.getElementById("logout-button").style.display =
    "inline-block";

}

    }

    else{

    document.getElementById("auth-popup").style.display = "flex";

    document.getElementById("logout-button").style.display =
    "none";

}



    // SIGN UP

    const signupButton = document.getElementById("signup-button");


    if(signupButton){

        signupButton.addEventListener("click", async () => {


            const email = document.getElementById("auth-email").value;

            const password = document.getElementById("auth-password").value;

            const name = document.getElementById("auth-name").value;

localStorage.setItem(
"pending_name",
name
);

           const { data, error } =
await window.supabaseClient.auth.signUp({

    email: email,

    password: password,

    options: {

        emailRedirectTo: window.location.origin

    }

});



           if(error){

    console.log("SIGN UP ERROR =", error);

    alert(error.message);

    return;

}

        else {

    alert("تم إنشاء الحساب بنجاح!\n\nيرجى التحقق من بريدك الإلكتروني ثم اضغط على رابط التفعيل قبل تسجيل الدخول.");

    document.getElementById("auth-popup").style.display = "none";

}



        });


    }



    // SIGN IN

    const signinButton = document.getElementById("signin-button");


    if(signinButton){

        signinButton.addEventListener("click", async () => {


            const email = document.getElementById("auth-email").value;

            const password = document.getElementById("auth-password").value;



            const { error } = await window.supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });



            if(error){

                alert(error.message);

            }

            else{

                location.reload();

            }


        });


    }


}


// LOGOUT

const logoutButton = document.getElementById("logout-button");


if(logoutButton){

    logoutButton.addEventListener("click", async () => {


        await window.supabaseClient.auth.signOut();


        location.reload();


    });

}



// START AUTH WHEN SUPABASE IS READY

window.addEventListener("supabaseReady", startAuth);


if(window.supabaseClient){

    startAuth();

}
/*
const verifyOTPButton =
document.getElementById("verify-otp-button");


if(verifyOTPButton){

    verifyOTPButton.addEventListener("click", async () => {


        const otpInputs =
document.querySelectorAll(".otp-input");


let code = "";


otpInputs.forEach((input) => {

    code += input.value;

});


        const message =
document.getElementById("otp-message");


message.textContent =
"جاري التحقق...";





if(code !== pendingOTP){

    message.textContent =
    "رمز التحقق غير صحيح.";

    return;

}


message.textContent =
"تم التحقق بنجاح!";


console.log("EMAIL =", pendingEmail);
console.log("PASSWORD =", pendingPassword);

    const loginResult =
    await window.supabaseClient.auth.signInWithPassword({

        email: pendingEmail,

        password: pendingPassword

    });


   if(loginResult.error){

    console.log("LOGIN ERROR =", loginResult.error);

    alert(loginResult.error.message);

    message.textContent =
    loginResult.error.message;

}


    else{

        location.reload();

    }



    });


}


const resendOTPButton =
document.getElementById("resend-otp-button");


if(resendOTPButton){

    resendOTPButton.addEventListener("click", async () => {


        const message =
        document.getElementById("otp-message");


        message.textContent =
        "جاري إرسال الرمز...";


        const { error } =
        await window.supabaseClient.auth.resend({

            type: "signup",

            email: pendingEmail

        });


        if(error){

            message.textContent =
            error.message;

        }


        else{

            message.textContent =
            "تم إرسال رمز جديد بنجاح!";

        }


    });


}

*/
/*
const otpInputs = document.querySelectorAll(".otp-input");

otpInputs.forEach((input, index) => {

    input.addEventListener("input", function () {

        if (this.value.length === 1 && index < otpInputs.length - 1) {

            otpInputs[index + 1].focus();

        }

    });


    input.addEventListener("keydown", function (event) {

        if (

            event.key === "Backspace" &&

            this.value === "" &&

            index > 0

        ) {

            otpInputs[index - 1].focus();

        }

    });

});

otpInputs[0].addEventListener("paste", function (event) {

    event.preventDefault();

    const pastedCode = event.clipboardData
        .getData("text")
        .trim();

    if (pastedCode.length === 6) {

        for (let i = 0; i < 6; i++) {

            otpInputs[i].value = pastedCode[i];

        }

        otpInputs[5].focus();

    }

});

function startOTPTimer() {

    otpSeconds = 600;

    const timerElement =
    document.getElementById("otp-timer");


    const timer = setInterval(function () {

        const minutes =
        Math.floor(otpSeconds / 60);

        const seconds =
        otpSeconds % 60;


        timerElement.textContent =

        String(minutes).padStart(2, "0")

        +

        ":"

        +

        String(seconds).padStart(2, "0");


        otpSeconds--;


        if (otpSeconds < 0) {

            clearInterval(timer);

            timerElement.textContent =

            "انتهت صلاحية الرمز";

        }


    },1000);

}
    */