require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ status: 'AegisAI-SPM Backend is running', version: '1.0.0' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
// Routes
const redTeamRoutes = require('./src/routes/redTeam');
const authRoutes = require('./src/routes/auth'); // New Auth
app.use('/api/red-team', redTeamRoutes);
app.use('/api/auth', authRoutes); // Mount Auth

// Mock Data Routes (Keep existing ones)
// Scan Routes
const { AWSScanner } = require('./src/discovery/awsScanner');

// DB Service
const db = require('./src/database/neo4j');

app.post('/api/scan', async (req, res) => {
    try {
        const { config } = req.body;
        // Pass user config if it exists and has keys
        const scanner = new AWSScanner(
            config?.region || process.env.AWS_REGION,
            (config?.accessKeyId && config?.secretAccessKey) ? config : null
        );

        const results = await scanner.runAllScans();
        res.json({
            status: 'success',
            message: 'Scan completed successfully',
            data: results,
            stats: results.stats // Include stats in root response for dashboard
        });
    } catch (error) {
        console.error('Scan Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Scan failed',
            error: error.message
        });
    }
});

// Asset Routes
app.get('/api/assets', async (req, res) => {
    try {
        // Try to fetch from DB first
        if (await db.verifyConnection()) {
            const assets = await db.getAssets();
            return res.json({ status: 'success', data: assets });
        }

        // If DB down, return empty (Frontend handles mock fallback for demo)
        res.json({ status: 'warning', message: 'Database disconnected', data: [] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Graph Routes
app.get('/api/graph', async (req, res) => {
    try {
        if (await db.verifyConnection()) {
            const data = await db.getGraphData();
            res.json({ status: 'success', data });
        } else {
            // Mock Fallback if DB is down
            const nodes = [
                { id: 'finance-llm-v1', group: 1, label: 'SageMaker Endpoint' },
                { id: 'SageMakerExecutionRole', group: 2, label: 'IAM Role' },
                { id: 'finance-training-data', group: 3, label: 'S3 Bucket' },
                { id: 'internet', group: 0, label: 'Internet' }
            ];
            const links = [
                { source: 'internet', target: 'finance-llm-v1', label: 'EXPOSED_TO' },
                { source: 'finance-llm-v1', target: 'SageMakerExecutionRole', label: 'ASSUMES' },
                { source: 'SageMakerExecutionRole', target: 'finance-training-data', label: 'READS' }
            ];
            res.json({ status: 'success', data: { nodes, links } });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Attack Paths Route
const attackPathEngine = require('./src/analysis/attackPathEngine');
app.get('/api/risks/paths', async (req, res) => {
    try {
        const paths = await attackPathEngine.findAttackPaths();
        res.json({ status: 'success', data: paths });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Report Routes
const reportEngine = require('./src/analysis/reportEngine');
app.get('/api/reports', async (req, res) => {
    try {
        console.log('Report generation requested, type:', req.query.type || 'json');
        const type = req.query.type || 'json';
        const report = await reportEngine.generateReport(type);
        console.log('Report generated successfully');
        res.json({ status: 'success', data: report });
    } catch (error) {
        console.error('Report generation error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            status: 'error',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Remediation Routes (V2.0)
const remediationEngine = require('./src/analysis/remediationEngine');
app.post('/api/remediate', (req, res) => {
    try {
        const { finding } = req.body;
        if (!finding) return res.status(400).json({ status: 'error', message: 'Finding data required' });

        const fix = remediationEngine.generateFix(finding);
        res.json({ status: 'success', data: fix });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// ... existing imports ...
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const logParser = require('./src/discovery/logParser');

// Configure Multer for temp uploads
const upload = multer({ dest: 'uploads/' });

// Ensure uploads dir exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// ... existing routes ...

// Shadow AI Routes
app.post('/api/shadow-ai/upload-logs', upload.single('logfile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileType = req.file.mimetype === 'application/json' || req.file.originalname.endsWith('.json') ? 'json' : 'csv';

        console.log(`Processing log file: ${req.file.originalname} (${fileType})`);

        const findings = await logParser.parseLogFile(filePath, fileType);

        // Cleanup temp file
        fs.unlinkSync(filePath);

        // Calculate stats
        const stats = {
            sanctioned: findings.filter(f => f.status === 'Sanctioned').length,
            unsanctioned: findings.filter(f => f.status === 'Unsanctioned').length,
            risky: findings.filter(f => f.risk === 'HIGH').length
        };

        res.json({ status: 'success', data: { findings, stats } });

    } catch (error) {
        console.error("Log Parsing Error:", error);
        res.status(500).json({ status: 'error', message: 'Failed to parse logs' });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
