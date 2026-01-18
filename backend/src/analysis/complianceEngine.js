class ComplianceEngine {
    constructor() {
        this.frameworks = {
            'OWASP-LLM': {
                name: 'OWASP Top 10 for LLM',
                mappings: {
                    'SM-001': 'LLM08: Excessive Agency',
                    'SM-002': 'LLM08: Excessive Agency',
                    'SM-003': 'LLM06: Sensitive Information Disclosure',
                    'IAM-001': 'LLM08: Excessive Agency',
                    'S3-001': 'LLM06: Sensitive Information Disclosure',
                    'BEDROCK-001': 'LLM09: Overreliance'
                }
            },
            'NIST-AI-RMF': {
                name: 'NIST AI Risk Management Framework',
                mappings: {
                    'SM-001': 'Protect 2.3: System Safety',
                    'SM-003': 'Protect 2.4: Data Security',
                    'S3-001': 'Protect 2.4: Data Security',
                    'BEDROCK-001': 'Measure 2.6: System Monitoring'
                }
            }
        };
    }

    mapFindings(findings) {
        return findings.map(f => {
            const compliance = {};

            // For each framework, check if this ruleId is mapped
            Object.keys(this.frameworks).forEach(fwKey => {
                const framework = this.frameworks[fwKey];
                const requirement = framework.mappings[f.ruleId];
                if (requirement) {
                    compliance[fwKey] = requirement;
                }
            });

            return { ...f, compliance };
        });
    }

    getComplianceReport(findings) {
        const report = {
            summary: { 'OWASP-LLM': 0, 'NIST-AI-RMF': 0 },
            details: {}
        };

        const mapped = this.mapFindings(findings);

        mapped.forEach(f => {
            if (f.compliance) {
                Object.keys(f.compliance).forEach(fw => {
                    const req = f.compliance[fw];
                    report.summary[fw] = (report.summary[fw] || 0) + 1;

                    if (!report.details[fw]) report.details[fw] = [];
                    report.details[fw].push({
                        ruleId: f.ruleId,
                        requirement: req,
                        assetId: f.id,
                        severity: f.severity
                    });
                });
            }
        });

        return report;
    }
}

module.exports = new ComplianceEngine();
