export default {
    async fetch(request, env) {

        const url = new URL(request.url);


        // ==========================================
        // 🔐 ADMIN LOGIN
        // ==========================================

        if (
            url.pathname === "/api/admin-login" &&
            request.method === "POST"
        ) {

            try {

                const body = await request.json();

                const password = body.password;


                if (!password) {

                    return new Response(
                        JSON.stringify({
                            success: false,
                            message: "Please enter the password."
                        }),
                        {
                            status: 400,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    );

                }


                // Check password stored securely
                // in Cloudflare Environment Variables

                if (
                    password !== env.ADMIN_PASSWORD
                ) {

                    return new Response(
                        JSON.stringify({
                            success: false,
                            message: "Incorrect password."
                        }),
                        {
                            status: 401,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    );

                }


                // Create a signed admin session

                const token =
                    await createAdminToken(env.ADMIN_SECRET);


                return new Response(
                    JSON.stringify({
                        success: true,
                        token: token
                    }),
                    {
                        status: 200,
                        headers: {
                            "Content-Type": "application/json",

                            "Set-Cookie":
                                `natureSecretsAdmin=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=7200`
                        }
                    }
                );

            }

            catch (error) {

                console.error(
                    "ADMIN LOGIN ERROR:",
                    error
                );


                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "Server error."
                    }),
                    {
                        status: 500,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

            }

        }


        // ==========================================
        // 🔐 ADMIN SESSION CHECK
        // ==========================================

        if (
            url.pathname === "/api/admin-check" &&
            request.method === "GET"
        ) {

            const cookies =
                parseCookies(
                    request.headers.get("Cookie")
                );


            const token =
                cookies.natureSecretsAdmin;


            if (!token) {

                return new Response(
                    JSON.stringify({
                        success: false
                    }),
                    {
                        status: 401,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

            }


            const valid =
                await verifyAdminToken(
                    token,
                    env.ADMIN_SECRET
                );


            if (!valid) {

                return new Response(
                    JSON.stringify({
                        success: false
                    }),
                    {
                        status: 401,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

            }


            return new Response(
                JSON.stringify({
                    success: true
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }


        // ==========================================
        // 🚪 ADMIN LOGOUT
        // ==========================================

        if (
            url.pathname === "/api/admin-logout" &&
            request.method === "POST"
        ) {

            return new Response(
                JSON.stringify({
                    success: true
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",

                        "Set-Cookie":
                            "natureSecretsAdmin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
                    }
                }
            );

        }


        // ==========================================
        // 🌐 SERVE WEBSITE
        // ==========================================

        return env.ASSETS.fetch(request);

    }
};


// ==========================================
// 🔐 CREATE ADMIN TOKEN
// ==========================================

async function createAdminToken(secret) {

    const timestamp =
        Date.now().toString();


    const signature =
        await sign(
            timestamp,
            secret
        );


    return `${timestamp}.${signature}`;

}


// ==========================================
// 🔐 VERIFY ADMIN TOKEN
// ==========================================

async function verifyAdminToken(
    token,
    secret
) {

    try {

        const parts =
            token.split(".");


        if (parts.length !== 2) {
            return false;
        }


        const timestamp =
            parts[0];

        const signature =
            parts[1];


        const tokenTime =
            Number(timestamp);


        if (!Number.isFinite(tokenTime)) {
            return false;
        }


        // Session expires after 2 hours

        const TWO_HOURS =
            2 * 60 * 60 * 1000;


        if (
            Date.now() - tokenTime >
            TWO_HOURS
        ) {

            return false;

        }


        const expectedSignature =
            await sign(
                timestamp,
                secret
            );


        return timingSafeEqual(
            signature,
            expectedSignature
        );

    }

    catch {

        return false;

    }

}


// ==========================================
// 🔑 HMAC SIGNATURE
// ==========================================

async function sign(
    message,
    secret
) {

    const encoder =
        new TextEncoder();


    const key =
        await crypto.subtle.importKey(
            "raw",
            encoder.encode(secret),
            {
                name: "HMAC",
                hash: "SHA-256"
            },
            false,
            ["sign"]
        );


    const signature =
        await crypto.subtle.sign(
            "HMAC",
            key,
            encoder.encode(message)
        );


    return Array.from(
        new Uint8Array(signature)
    )
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");

}


// ==========================================
// 🛡️ SAFE STRING COMPARISON
// ==========================================

function timingSafeEqual(
    a,
    b
) {

    if (a.length !== b.length) {
        return false;
    }


    let result = 0;


    for (
        let i = 0;
        i < a.length;
        i++
    ) {

        result |=
            a.charCodeAt(i) ^
            b.charCodeAt(i);

    }


    return result === 0;

}


// ==========================================
// 🍪 READ COOKIES
// ==========================================

function parseCookies(
    cookieHeader
) {

    const cookies = {};


    if (!cookieHeader) {
        return cookies;
    }


    const pairs =
        cookieHeader.split(";");


    for (const pair of pairs) {

        const index =
            pair.indexOf("=");


        if (index === -1) {
            continue;
        }


        const name =
            pair
                .slice(0, index)
                .trim();


        const value =
            pair
                .slice(index + 1)
                .trim();


        cookies[name] = value;

    }


    return cookies;

}