/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    },
    turbopack: {
        root: '.',
    },
    outputFileTracingIncludes: {
        '/api/agent': [
            './_bmad/**/*', 
            './_bmad-output/**/*',
            './services/**/*',
            './expert-agent-architecture.md'
        ]
    }
};

export default nextConfig;