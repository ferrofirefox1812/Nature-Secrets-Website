async function startAuth() {

    console.log("START AUTH WORKING");

    if (!window.supabaseClient) {
        console.log("⏳ Supabase not ready...");
        return;
    }


    // ==============================
    // CHECK CURRENT SESSION
    // ==============================

    const { data } =
        await window.supabaseClient.auth.getSession();


    if (data.session) {

        const userId =
            data.session.user.id;

        const userEmail =
            data.session.user.email;


        // ==============================
        // AUTH ELEMENTS
        // ==============================

        const authPopup =
            document.getElementById("auth-popup");

        const missingNamePopup =
            document.getElementById("missing-name-popup");

        const welcomeMessage =
            document.getElementById("welcome-message");

        const logoutButton =
            document.getElementById("logout-button");


        // Hide login popup if it exists

        if (authPopup) {
            authPopup.style.display = "none";
        }


        // ==============================
        // LOAD PROFILE
        // ==============================

        const { data: profile } =
            await window.supabaseClient
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .maybeSingle();


        // ==============================
        // PROFILE DOES NOT EXIST
        // ==============================

        if (!profile) {

            if (missingNamePopup) {

                missingNamePopup.style.display =
                    "flex";


                const saveMissingName =
                    document.getElementById(
                        "save-missing-name"
                    );


                if (saveMissingName) {

                    saveMissingName.onclick =
                        async function () {

                            const nameInput =
                                document.getElementById(
                                    "missing-name-input"
                                );


                            if (!nameInput) {
                                return;
                            }


                            const enteredName =
                                nameInput.value.trim();


                            if (!enteredName) {

                                alert(
                                    "Please enter your name."
                                );

                                return;
                            }


                            const { error } =
                                await window.supabaseClient
                                    .from("profiles")
                                    .insert([

                                        {
                                            id: userId,
                                            name: enteredName,
                                            email: userEmail
                                        }

                                    ]);


                            if (error) {

                                console.error(
                                    "❌ PROFILE ERROR:",
                                    error
                                );

                                alert(
                                    error.message
                                );

                                return;
                            }


                            location.reload();

                        };

                }

            }

            return;
        }


        // ==============================
        // SHOW USER INFORMATION
        // ==============================

        if (profile) {

            if (welcomeMessage) {

                welcomeMessage.textContent =
                    "Hi, " + profile.name;

            }


            if (logoutButton) {

                logoutButton.style.display =
                    "inline-block";

            }

        }

    }

    else {

        // ==============================
        // USER NOT LOGGED IN
        // ==============================

        const authPopup =
            document.getElementById("auth-popup");

        const logoutButton =
            document.getElementById("logout-button");


        if (authPopup) {

            authPopup.style.display =
                "flex";

        }


        if (logoutButton) {

            logoutButton.style.display =
                "none";

        }

    }


    // ==============================
    // SIGN UP
    // ==============================

    const signupButton =
        document.getElementById("signup-button");


    if (signupButton) {

        signupButton.addEventListener(
            "click",
            async () => {

                const email =
                    document.getElementById(
                        "auth-email"
                    )?.value;

                const password =
                    document.getElementById(
                        "auth-password"
                    )?.value;

                const name =
                    document.getElementById(
                        "auth-name"
                    )?.value;


                localStorage.setItem(
                    "pending_name",
                    name
                );


                const { error } =
                    await window.supabaseClient.auth.signUp({

                        email: email,

                        password: password,

                        options: {

                            emailRedirectTo:
                                window.location.origin

                        }

                    });


                if (error) {

                    console.log(
                        "SIGN UP ERROR =",
                        error
                    );

                    alert(error.message);

                    return;

                }


                alert(
                    "تم إنشاء الحساب بنجاح!\n\n" +
                    "يرجى التحقق من بريدك الإلكتروني " +
                    "ثم اضغط على رابط التفعيل قبل تسجيل الدخول."
                );


                const authPopup =
                    document.getElementById(
                        "auth-popup"
                    );


                if (authPopup) {

                    authPopup.style.display =
                        "none";

                }

            }
        );

    }


    // ==============================
    // SIGN IN
    // ==============================

    const signinButton =
        document.getElementById("signin-button");


    if (signinButton) {

        signinButton.addEventListener(
            "click",
            async () => {

                const email =
                    document.getElementById(
                        "auth-email"
                    )?.value;

                const password =
                    document.getElementById(
                        "auth-password"
                    )?.value;


                const { error } =
                    await window.supabaseClient.auth
                        .signInWithPassword({

                            email: email,

                            password: password

                        });


                if (error) {

                    alert(error.message);

                }

                else {

                    location.reload();

                }

            }
        );

    }

}


// ==============================
// LOGOUT
// ==============================

const logoutButton =
    document.getElementById(
        "logout-button"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            await window.supabaseClient.auth.signOut();

            location.reload();

        }
    );

}


// ==============================
// START AUTH
// ==============================

window.addEventListener(
    "supabaseReady",
    startAuth,
    { once: true }
);