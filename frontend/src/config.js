const config = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://ai-spm.onrender.com/api'
};

// Debug logging
console.log('🔧 Config Debug:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    API_BASE_URL: config.API_BASE_URL,
    allEnvVars: import.meta.env
});

export default config;

