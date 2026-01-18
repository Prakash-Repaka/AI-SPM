class ThreatEngine {
    constructor() {
        this.strideMap = {
            'SM-001': 'Tampering', // Public Notebook -> Code Injection/Tampering
            'SM-002': 'Information Disclosure', // No VPC -> Traffic interception
            'SM-003': 'Information Disclosure', // Secrets in Env -> Credential Leak
            'S3-001': 'Information Disclosure', // Unencrypted Data -> Data Leak
            'IAM-001': 'Elevation of Privilege', // Overprivileged Role -> Escalate rights
            'BEDROCK-001': 'Repudiation', // No Logs -> Cannot prove who did what
            // Graph-based
            'AttackPath-PrivEsc': 'Elevation of Privilege',
            'AttackPath-Exfiltration': 'Information Disclosure'
        };

        this.descriptions = {
            'Spoofing': {
                threat: 'An attacker uses stolen AWS access keys to impersonate a legitimate user or service.',
                mitigation: 'Use IAM roles, enforce MFA, and rotate keys regularly.'
            },
            'Tampering': {
                threat: 'Unauthorized modification of data in S3 buckets or SageMaker model artifacts.',
                mitigation: 'Enable S3 Object Lock, use signed URLs, and restrict write permissions.'
            },
            'Repudiation': {
                threat: 'A user denies initiating a SageMaker inference or modifying S3 data.',
                mitigation: 'Enable AWS CloudTrail and integrate with CloudWatch/Security Hub.'
            },
            'Information Disclosure': {
                threat: 'Sensitive data exposed via misconfigured S3 buckets or logs.',
                mitigation: 'Encrypt S3/SageMaker data (KMS) and use VPC endpoints.'
            },
            'Denial of Service': {
                threat: 'Overloading SageMaker endpoints or S3 with requests.',
                mitigation: 'Implement API throttling, auto-scaling, and use AWS Shield/WAF.'
            },
            'Elevation of Privilege': {
                threat: 'Exploiting overly permissive IAM roles to gain access to resources.',
                mitigation: 'Apply least privilege and use IAM Access Analyzer.'
            }
        };
    }
    classify(ruleId) {
        return this.strideMap[ruleId] || 'Elevation of Privilege'; // Default pessimistic
    }

    analyze(findings) {
        const matrix = {
            'Spoofing': 0,
            'Tampering': 0,
            'Repudiation': 0,
            'Information Disclosure': 0,
            'Denial of Service': 0,
            'Elevation of Privilege': 0
        };

        findings.forEach(f => {
            const category = this.classify(f.ruleId);
            matrix[category]++;

            // Enrich the finding with STRIDE context
            if (this.descriptions[category]) {
                f.stride = {
                    category: category,
                    threat: this.descriptions[category].threat,
                    mitigation: this.descriptions[category].mitigation
                };
            } else {
                f.stride = {
                    category: category,
                    threat: 'Unknown Threat',
                    mitigation: 'Review security configuration.'
                };
            }
        });

        return { matrix, findings };
    }
}

module.exports = new ThreatEngine();
