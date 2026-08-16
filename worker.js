export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        // Admin login
        if (
            url.pathname === "/admin-login" &&
            request.method === "POST"
        ) {

            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Admin authentication is being migrated."
                }),
                {
                    status: 503,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }

        // Serve the website from /public
        return env.ASSETS.fetch(request);

    }
};