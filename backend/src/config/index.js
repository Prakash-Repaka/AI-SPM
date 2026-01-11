require('dotenv').config();

const config = {
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
    },
    neo4j: {
        uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
        user: process.env.NEO4J_USER || 'neo4j',
        password: process.env.NEO4J_PASSWORD || 'password',
    },
    scan: {
        intervalHours: parseInt(process.env.SCAN_INTERVAL_HOURS || '24', 10),
    }
};

module.exports = config;
