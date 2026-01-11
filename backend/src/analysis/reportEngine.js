const complianceEngine = require('./complianceEngine');

class ReportEngine {
    constructor() { }

    async generateReport(type = 'json') {
        // Fetch all data
        let assets = [];
        try {
            if (await db.verifyConnection()) {
                assets = await db.getAssets();
            }
        } catch (e) { console.log('DB fetch failed, using empty list for report'); }

        // Re-analyze (or fetch stored findings)
        const analysis = riskEngine.evaluate(assets);
        const compliance = complianceEngine.assess(analysis.findings);

        const reportData = {
            generatedAt: new Date().toISOString(),
            summary: analysis.stats,
            compliance: compliance, // New Section
            findings: analysis.findings,
            assetsScanned: analysis.analyzedAssets.length
        };

        if (type === 'json') {
            return reportData;
        }

        // Mock PDF generation (returning JSON structure that would be PDF content)
        return {
            type: 'application/pdf',
            filename: `aegis-report-${Date.now()}.pdf`,
            content: 'Mock PDF Content Binary Placeholder'
        };
    }
}

module.exports = new ReportEngine();
