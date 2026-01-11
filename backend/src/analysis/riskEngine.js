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
    }
];

class RiskEngine {
    constructor() { }

    evaluate(assets) {
        let findings = [];

        for (const asset of assets) {
            let assetRiskScore = 0;

            for (const rule of RULES) {
                if (rule.check(asset)) {
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

            // Annotate asset with risk
            asset.riskScore = assetRiskScore;
            asset.findingsCount = findings.filter(f => f.assetId === asset.id).length;
        }

        return {
            analyzedAssets: assets,
            findings: findings,
            stats: this.calculateStats(findings, assets)
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
