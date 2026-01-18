/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        outputFileTracingIncludes: {
            '/api/agent': [
                './_bmad/**/*', 
                './_bmad-output/**/*',
                './services/**/*',
                './expert-agent-architecture.md'
            ]
        }
    }
};

export default nextConfig;