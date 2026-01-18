/**
 * Misconfiguration Detection & Risk Scoring Engine
 */

// Risk Rules Repository
const RULES = [
    {
        id: 'SM-001',
        description: 'SageMaker Endpoint is publicly accessible',
        severity: 'CRITICAL',
        riskScore: 90,
        check: (asset) => asset.type === 'SageMakerEndpoint' && asset.isPublic,
        remediation: 'Update NetworkConfig to use VpcConfig and remove public internet access.'
    },
    {
        id: 'S3-001',
        description: 'Sensitive Training Data Bucket is unencrypted',
        severity: 'HIGH',
        riskScore: 75,
        check: (asset) => asset.type === 'S3Bucket' && !asset.isEncrypted,
        remediation: 'Enable Server-Side Encryption (SSE-S3 or KMS) on the bucket.'
    },
    {
        id: 'IAM-001',
        description: 'IAM Role has Over-Privileged Access (AdministratorAccess)',
        severity: 'HIGH',
        riskScore: 80,
        check: (asset) => asset.type === 'IAMRole' && asset.isOverPrivileged,
        remediation: 'Apply Least Privilege Principle. Remove AdministratorAccess and scope down permissions.'
    },
    {
        id: 'S3-002',
        description: 'S3 Bucket allows Public Write (Data Poisoning Risk)',
        severity: 'CRITICAL',
        riskScore: 95,
        check: (asset) => asset.type === 'S3Bucket' && asset.isPublicWrite,
        remediation: 'Disable public write access immediately via Bucket Policy or ACLs.'
    },
    {
        id: 'SM-004',
        description: 'SageMaker Model uses Vulnerable Container Image (CVE-2024-XYZ)',
        severity: 'HIGH',
        riskScore: 85,
        check: (asset) => asset.type === 'SageMakerEndpoint' && asset.hasVulnerableImage,
        remediation: 'Update the Inference Image to the latest patched version from ECR.'
    }
];


const threatEngine = require('./threatEngine');

class RiskEngine {
    constructor() { }

    evaluate(assets) {
        let findings = [];

        for (const asset of assets) {
            let assetRiskScore = 0;

            // 1. Collect findings already reported by Scanners (e.g., Bedrock, SageMaker)
            if (asset.findings && asset.findings.length > 0) {
                findings.push(...asset.findings);
            }

            // 2. Run Centralized Risk Rules
            for (const rule of RULES) {
                if (rule.check(asset)) {
                    // Avoid duplicates if scanner already found it
                    const alreadyFound = asset.findings && asset.findings.some(f => f.ruleId === rule.id);

                    if (!alreadyFound) {
                        // Create Finding
                        const finding = {
                            id: `${rule.id}-${asset.id.slice(-8)}`,
                            ruleId: rule.id,
                            assetId: asset.id,
                            assetName: asset.name,
                            severity: rule.severity,
                            description: rule.description,
                            score: rule.riskScore,
                            remediation: rule.remediation,
                            timestamp: new Date().toISOString()
                        };
                        findings.push(finding);

                        // Simple max score aggregation for the asset
                        if (rule.riskScore > assetRiskScore) {
                            assetRiskScore = rule.riskScore;
                        }
                    }
                }
            }

            // Annotate asset with risk
            asset.riskScore = assetRiskScore;
            asset.findingsCount = findings.filter(f => f.assetId === asset.id).length;
        }

        // --- NEW: STRIDE ANALYSIS ---
        // Pass all findings through the ThreatEngine
        const threatAnalysis = threatEngine.analyze(findings);

        return {
            analyzedAssets: assets,
            findings: threatAnalysis.findings, // Now enriched with STRIDE
            stats: this.calculateStats(findings, assets),
            threats: threatAnalysis.matrix // STRIDE Heatmap data
        };
    }

    calculateStats(findings, assets) {
        return {
            totalAssets: assets.length,
            totalRisks: findings.length,
            criticalCount: findings.filter(f => f.severity === 'CRITICAL').length,
            highCount: findings.filter(f => f.severity === 'HIGH').length,
            averageRiskScore: assets.reduce((acc, curr) => acc + (curr.riskScore || 0), 0) / (assets.length || 1)
        };
    }
}

module.exports = new RiskEngine();
