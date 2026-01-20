const complianceEngine = require('./complianceEngine');
const riskEngine = require('./riskEngine');
const db = require('../database/neo4j');
const PDFDocument = require('pdfkit');

const { AWSScanner } = require('../discovery/awsScanner');

class ReportEngine {
    constructor() { }

    async generateReport(type = 'json') {
        // Fetch all data
        let assets = [];
        let scanResults = null;

        try {
            if (await db.verifyConnection()) {
                assets = await db.getAssets();
            }
        } catch (e) { console.log('DB fetch failed, failing over to mock scan'); }

        // If no assets from DB, use Mock Scanner (Demo Mode)
        if (assets.length === 0) {
            console.log("Generating report using Mock Data...");
            const scanner = new AWSScanner('us-east-1', null);
            scanResults = await scanner.runAllScans();

            // Normalize for report
            const compliance = complianceEngine.assess(scanResults.findings);

            const reportData = {
                generatedAt: new Date().toISOString(),
                summary: scanResults.stats,
                compliance: compliance,
                findings: scanResults.findings,
                assetsScanned: scanResults.assets.length
            };

            return this.formatReport(reportData, type);
        }

        // Normal DB Flow
        const analysis = riskEngine.evaluate(assets);
        const compliance = complianceEngine.assess(analysis.findings);

        const reportData = {
            generatedAt: new Date().toISOString(),
            summary: analysis.stats,
            compliance: compliance,
            findings: analysis.findings,
            assetsScanned: analysis.analyzedAssets.length
        };

        return this.formatReport(reportData, type);
    }

    formatReport(reportData, type) {
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

                // Academic Methodology Section
                doc.fontSize(16).text('1. Methodology');
                doc.fontSize(10).text('This security assessment utilizes a hybrid analysis engine combining:');
                doc.list([
                    'NIST AI Risk Management Framework (AI RMF 1.0) for governance and mapping.',
                    'Microsoft STRIDE Threat Model (Spoofing, Tampering, Repudiation, etc.) for threat categorization.',
                    'CIS Benchmarks for AWS Foundation Level 2 for cloud infrastructure hardening.'
                ]);
                doc.moveDown();

                // Risk Matrix Visualization
                doc.fontSize(16).text('2. Risk Matrix');
                doc.fontSize(10).text('Distribution of identified risks by severity and impact:');
                doc.moveDown(0.5);

                // Simple textual matrix for PDFKit
                doc.font('Courier').text('-----------------------------------------');
                doc.text('| Severity   | Count | Impact              |');
                doc.text('-----------------------------------------');
                const criticalCount = reportData.summary.criticalCount || 0;
                const highCount = reportData.summary.highCount || 0;
                const totalRisks = reportData.summary.totalRisks || 0;
                const mediumCount = totalRisks - criticalCount - highCount;
                doc.text(`| CRITICAL   | ${String(criticalCount).padEnd(5)} | Immediate Action    |`);
                doc.text(`| HIGH       | ${String(highCount).padEnd(5)} | High Priority       |`);
                doc.text(`| MEDIUM     | ${String(mediumCount).padEnd(5)} | Scheduled Remediation|`);
                doc.text('-----------------------------------------');
                doc.font('Helvetica');
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
