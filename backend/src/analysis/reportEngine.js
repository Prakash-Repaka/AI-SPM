const complianceEngine = require('./complianceEngine');
const riskEngine = require('./riskEngine');
const db = require('../database/neo4j');
const PDFDocument = require('pdfkit');

class ReportEngine {
    constructor() { }

    async generateReport(type = 'json') {
        // Fetch all data
        let assets = [];
        try {
            if (await db.verifyConnection()) {
                assets = await db.getAssets();
            } else {
                // Mock fallback just in case, though usually handled upstream
            }
        } catch (e) { console.log('DB fetch failed, using empty list for report'); }

        // Re-analyze
        const analysis = riskEngine.evaluate(assets);
        const compliance = complianceEngine.assess(analysis.findings);

        const reportData = {
            generatedAt: new Date().toISOString(),
            summary: analysis.stats,
            compliance: compliance,
            findings: analysis.findings,
            assetsScanned: analysis.analyzedAssets.length
        };

        if (type === 'json') {
            return reportData;
        }

        // PDF Generation
        if (type === 'pdf') {
            return new Promise((resolve, reject) => {
                const doc = new PDFDocument();
                let buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve({
                        type: 'application/pdf',
                        filename: `aegis-report-${Date.now()}.pdf`,
                        content: pdfData.toString('base64') // Send as base64 for JSON transport
                    });
                });

                // Header
                doc.fontSize(25).text('AegisAI-SPM Security Report', { align: 'center' });
                doc.moveDown();
                doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
                doc.moveDown();

                // Executive Summary
                doc.fontSize(18).text('Executive Summary');
                doc.fontSize(12).text(`Total Assets Scanned: ${reportData.assetsScanned}`);
                doc.text(`Total Risks Found: ${reportData.summary.totalRisks}`);
                doc.text(`Compliance Score: ${reportData.compliance.score}%`);
                doc.moveDown();

                // Findings
                doc.fontSize(18).text('Detailed Findings');
                reportData.findings.forEach((f, i) => {
                    doc.fontSize(14).text(`${i + 1}. [${f.severity}] ${f.description}`);
                    doc.fontSize(10).text(`   Asset: ${f.assetName} (${f.assetId})`);
                    doc.text(`   Remediation: ${f.remediation}`);
                    doc.moveDown(0.5);
                });

                doc.end();
            });
        }
    }
}

module.exports = new ReportEngine();
