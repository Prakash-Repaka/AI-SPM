const config = require('../config');
const { SageMakerScanner } = require('./scanners/sagemakerScanner');
const { BedrockScanner } = require('./scanners/bedrockScanner');
const { S3Scanner } = require('./scanners/s3');
const { IAMScanner } = require('./scanners/iam');
const db = require('../database/neo4j');
const riskEngine = require('../analysis/riskEngine');

class AWSScanner {
    constructor(region = config.aws.region, credentials = null) {
        this.region = region;
        this.credentials = credentials;
        this.scanners = [
            new SageMakerScanner(region, credentials),
            new BedrockScanner(region, credentials),
            new S3Scanner(region, credentials),
            new IAMScanner(region, credentials)
        ];
        // Enforce names for mock generation reliability
        this.scanners[0].name = 'SageMakerScanner';
        this.scanners[1].name = 'BedrockScanner';
        this.scanners[2].name = 'S3Scanner';
        this.scanners[3].name = 'IAMScanner';
    }

    async runAllScans() {
        const results = {};
        const allAssets = [];

        console.log(`Starting scan in region: ${this.region}`);

        for (const scanner of this.scanners) {
            const scannerName = scanner.name || scanner.constructor.name;

            // STRICT SEPARATION: Real vs Demo
            if (this.credentials) {
                // --- REAL MODE ---
                console.log(`Running REAL scan for: ${scannerName}`);
                try {
                    const assets = await scanner.scan();
                    results[scannerName] = assets || [];
                    allAssets.push(...(assets || []));
                    console.log(`✅ ${scannerName}: Found ${assets?.length || 0} assets (Real)`);
                } catch (error) {
                    console.error(`❌ ${scannerName} Failed (Real Mode):`, error.message);
                    // In Real Mode, we DO NOT fallback to mock data. We report zero/error.
                    results[scannerName] = [];
                }
            } else {
                // --- DEMO MODE ---
                console.log(`Running DEMO (Mock) scan for: ${scannerName}`);
                const assets = this.generateMockAssets(scannerName);
                results[scannerName] = assets;
                allAssets.push(...assets);
                console.log(`✅ ${scannerName}: Generated ${assets.length} mock assets`);
            }
        }

        // --- RISK ANALYSIS ---
        console.log("Analyzing Risks...");
        const analysis = riskEngine.evaluate(allAssets);
        console.log(`Risk Analysis Complete. Found ${analysis.stats.totalRisks} risks.`);

        // Persist to Graph DB
        if (await db.verifyConnection()) {
            console.log("Saving assets to Neo4j...");
            for (const asset of analysis.analyzedAssets) {
                await db.ingestAsset(asset);
            }
        } else {
            console.log("⚠️ Skipping Neo4j ingestion (DB not reachable)");
        }

        return {
            data: results,
            assets: analysis.analyzedAssets,
            findings: analysis.findings,
            stats: analysis.stats,
            threats: analysis.threats
        };
    }

    generateMockAssets(scannerName) {
        if (scannerName === 'SageMakerScanner') {
            return [
                {
                    id: 'arn:aws:sagemaker:us-east-1:123456789012:endpoint/finance-llm-v1',
                    arn: 'arn:aws:sagemaker:us-east-1:123456789012:endpoint/finance-llm-v1',
                    name: 'finance-llm-v1',
                    type: 'SageMakerEndpoint',
                    region: 'us-east-1',
                    accountId: '123456789012',
                    status: 'InService',
                    variantName: 'prod-variant-1',
                    modelName: 'llama-2-7b-finance-tuned',
                    instanceType: 'ml.g5.2xlarge',
                    isPublic: true,
                    hasVulnerableImage: true, // NEW: Supply Chain Risk
                    tags: { Environment: 'Production', Owner: 'DataScienceTeam' }
                },
                {
                    id: 'arn:aws:sagemaker:us-east-1:123456789012:endpoint/internal-embedding-model',
                    arn: 'arn:aws:sagemaker:us-east-1:123456789012:endpoint/internal-embedding-model',
                    name: 'internal-embedding-model',
                    type: 'SageMakerEndpoint',
                    region: 'us-east-1',
                    accountId: '123456789012',
                    status: 'InService',
                    variantName: 'v1',
                    modelName: 'bert-base-uncased',
                    instanceType: 'ml.m5.large',
                    isPublic: false,
                    tags: { Environment: 'Internal' }
                },
                {
                    id: 'arn:aws:sagemaker:us-east-1:123456789012:endpoint/customer-support-agent',
                    arn: 'arn:aws:sagemaker:us-east-1:123456789012:endpoint/customer-support-agent',
                    name: 'customer-support-agent',
                    type: 'SageMakerEndpoint',
                    region: 'us-east-1',
                    accountId: '123456789012',
                    status: 'InService',
                    variantName: 'blue',
                    modelName: 'gpt-j-6b-finetuned',
                    instanceType: 'ml.c5.xlarge',
                    isPublic: true,
                    tags: { Environment: 'PublicFacing', Project: 'SupportBot' }
                }
            ];
        }
        else if (scannerName === 'S3Scanner') {
            return [
                {
                    id: 'arn:aws:s3:::finance-training-data',
                    arn: 'arn:aws:s3:::finance-training-data',
                    name: 'finance-training-data',
                    type: 'S3Bucket',
                    region: this.region,
                    accountId: '123456789012',
                    status: 'Active',
                    isEncrypted: false,
                    isPublic: false,
                    tags: { Environment: 'Production', Type: 'TrainingData' }
                },
                {
                    id: 'arn:aws:s3:::public-model-share', // NEW: Poisoning Risk
                    arn: 'arn:aws:s3:::public-model-share',
                    name: 'public-model-share',
                    type: 'S3Bucket',
                    region: this.region,
                    accountId: '123456789012',
                    status: 'Active',
                    isEncrypted: true,
                    isPublic: true,
                    isPublicWrite: true, // CRITICAL: Allows poisoning
                    tags: { Environment: 'Staging' }
                },
                {
                    id: 'arn:aws:s3:::hr-employee-records',
                    arn: 'arn:aws:s3:::hr-employee-records',
                    name: 'hr-employee-records',
                    type: 'S3Bucket',
                    region: this.region,
                    accountId: '123456789012',
                    status: 'Active',
                    isEncrypted: false,
                    isPublic: false,
                    tags: { CONFIDENTIAL: 'TRUE' }
                }
            ];
        }
        else if (scannerName === 'IAMScanner') {
            return [
                {
                    id: 'arn:aws:iam::123456789012:role/SageMakerExecutionRole',
                    arn: 'arn:aws:iam::123456789012:role/SageMakerExecutionRole',
                    name: 'SageMakerExecutionRole',
                    type: 'IAMRole',
                    region: 'global',
                    accountId: '123456789012',
                    status: 'Active',
                    policies: ['AmazonS3FullAccess', 'AmazonSageMakerFullAccess'],
                    isOverPrivileged: true,
                    tags: { Team: 'DataScience' }
                },
                {
                    id: 'arn:aws:iam::123456789012:role/LegacyAdminRole',
                    arn: 'arn:aws:iam::123456789012:role/LegacyAdminRole',
                    name: 'LegacyAdminRole',
                    type: 'IAMRole',
                    region: 'global',
                    accountId: '123456789012',
                    status: 'Active',
                    policies: ['AdministratorAccess'],
                    isOverPrivileged: true,
                    tags: { Deprecated: 'True' }
                }
            ];
        }
        else if (scannerName === 'BedrockScanner') {
            return [
                {
                    id: `arn:aws:bedrock:${this.region}:123456789012:settings`,
                    arn: `arn:aws:bedrock:${this.region}:123456789012:settings`,
                    name: 'Bedrock-Regional-Settings',
                    type: 'BedrockService',
                    region: this.region,
                    status: 'Active',
                    findings: [{
                        id: 'BEDROCK-001',
                        ruleId: 'BEDROCK-001',
                        severity: 'HIGH',
                        title: 'Model Invocation Logging Disabled',
                        description: 'Bedrock model invocation logging is disabled (Mock Finding).'
                    }],
                    tags: {}
                }
            ];
        }
        return [];
    }
}

module.exports = { AWSScanner };
