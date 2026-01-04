const JOBADDER_AUTH_URL = "https://id.jobadder.com/connect/authorize";
const JOBADDER_TOKEN_URL = "https://id.jobadder.com/connect/token";
const JOBADDER_API_URL = "https://api.jobadder.com/v2";

export const jobAdderService = {
    getAuthorizationUrl: () => {
        const clientId = process.env.NEXT_PUBLIC_JOBADDER_CLIENT_ID;
        const redirectUri = process.env.NEXT_PUBLIC_JOBADDER_REDIRECT_URI;
        const scope = "read read_candidate read_company read_job read_placement offline_access";

        if (!clientId || !redirectUri) {
            console.error("Missing JobAdder credentials");
            return "#";
        }

        const params = new URLSearchParams({
            response_type: "code",
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
            state: "random_state_string", // In prod, use a real random string
        });

        return `${JOBADDER_AUTH_URL}?${params.toString()}`;
    },

    exchangeToken: async (code) => {
        const clientId = process.env.JOBADDER_CLIENT_ID;
        constclientSecret = process.env.JOBADDER_CLIENT_SECRET;
        const redirectUri = process.env.NEXT_PUBLIC_JOBADDER_REDIRECT_URI;

        const response = await fetch(JOBADDER_TOKEN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to exchange token");
        }

        return await response.json();
    },

    fetchCandidates: async (accessToken) => {
        const response = await fetch(`${JOBADDER_API_URL}/candidates`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return await response.json();
    },

    fetchCompanies: async (accessToken) => {
        const response = await fetch(`${JOBADDER_API_URL}/companies`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return await response.json();
    },

    fetchJobs: async (accessToken) => {
        const response = await fetch(`${JOBADDER_API_URL}/jobs`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return await response.json();
    }
};
