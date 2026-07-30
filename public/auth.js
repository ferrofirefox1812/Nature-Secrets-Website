let pendingEmail = "";

let pendingPassword = "";

let pendingName = "";

let pendingUser = null;

let waitingForVerification = false;

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

pendingEmail = email;

pendingPassword = password;

pendingName = name;

localStorage.setItem(
"pending_name",
name
);

            const { data, error } = await window.supabaseClient.auth.signUp({

                email: email,

                password: password

            });



            if(error){

                alert(error.message);

            }

            else{

    const user = data.user;

    console.log("USER CREATED:", user);

    pendingUser = user;

console.log("USER SAVED:", user);

    document.getElementById("auth-name").style.display = "none";

    document.getElementById("auth-email").style.display = "none";

    document.getElementById("auth-password").style.display = "none";

    document.getElementById("signin-button").style.display = "none";

    document.getElementById("signup-button").style.display = "none";

    document.getElementById("otp-container").style.display = "block";

    document.getElementById("otp-email").textContent =
    "تم إرسال رمز التحقق إلى " + email;

waitingForVerification = true;

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

const verifyOTPButton =
document.getElementById("verify-otp-button");


if(verifyOTPButton){

    verifyOTPButton.addEventListener("click", async () => {


        const code =
        document.getElementById("otp-code").value;


        const message =
document.getElementById("otp-message");


message.textContent =
"جاري التحقق...";


const { data, error } =
await window.supabaseClient.auth.verifyOtp({

    email: pendingEmail,

    token: code,

    type: "signup"

});


if(error){

    message.textContent =
    "رمز التحقق غير صحيح.";

}


else{

    message.textContent =
    "تم التحقق بنجاح!";


    const loginResult =
    await window.supabaseClient.auth.signInWithPassword({

        email: pendingEmail,

        password: pendingPassword

    });


    if(loginResult.error){

        message.textContent =
        "تم التحقق ولكن فشل تسجيل الدخول.";

    }


    else{

        location.reload();

    }

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