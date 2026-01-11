class ComplianceEngine {
    constructor() {
        // NIST AI RMF 1.0 Controls Mapping
        this.frameworks = {
            'NIST_AI_RMF': {
                name: 'NIST AI Risk Management Framework',
                controls: {
                    'GOVERN-1.1': { description: 'Policies and processes are in place', relatedRules: ['IAM-001', 'IAM-002'] },
                    'MAP-1.2': { description: 'AI system context is understood', relatedRules: ['SM-001'] }, // Public endpoints break this
                    'MANAGE-2.3': { description: 'Data protection strategies implemented', relatedRules: ['S3-001'] }, // Unencrypted data
                    'MANAGE-4.1': { description: 'Post-deployment monitoring', relatedRules: ['SM-002'] }
                }
            }
        };
    }

    assess(findings) {
        const complianceReport = {
            framework: 'NIST AI RMF',
            score: 100,
            controls: []
        };

        const activeFindings = new Set(findings.map(f => f.ruleId));
        let failedControls = 0;
        let totalControls = Object.keys(this.frameworks.NIST_AI_RMF.controls).length;

        for (const [controlId, data] of Object.entries(this.frameworks.NIST_AI_RMF.controls)) {
            // Check if any related rule failed
            const failedRules = data.relatedRules.filter(ruleId => activeFindings.has(ruleId));
            const status = failedRules.length > 0 ? 'FAIL' : 'PASS';

            if (status === 'FAIL') failedControls++;

            complianceReport.controls.push({
                id: controlId,
                description: data.description,
                status: status,
                impact: status === 'FAIL' ? 'High' : 'None',
                failedRules: failedRules
            });
        }

        // Calculate simple percentage score
        complianceReport.score = Math.round(((totalControls - failedControls) / totalControls) * 100);

        return complianceReport;
    }
}

module.exports = new ComplianceEngine();
