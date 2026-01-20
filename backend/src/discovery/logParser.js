const fs = require('fs');
const csv = require('csv-parser');
const AI_DOMAINS = require('../utils/aiDomains');

const LogParser = {
    /**
     * Parse a log file (CSV or JSON) and return AI findings.
     * @param {string} filePath - Path to the uploaded file
     * @param {string} fileType - 'csv' or 'json'
     */
    parseLogFile: (filePath, fileType) => {
        return new Promise((resolve, reject) => {
            const findings = [];
            const timestamp = new Date().toISOString();

            if (fileType === 'json') {
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    const logs = JSON.parse(data);

                    // Normalize and check logs
                    logs.forEach((log, index) => {
                        const domain = log.destination || log.domain || log.dest; // Flexible key mapping
                        const analysis = LogParser.analyzeDomain(domain);

                        if (analysis) {
                            findings.push({
                                id: `log-${index}`,
                                source: log.source_ip || log.source || 'Unknown',
                                dest: domain,
                                app: analysis.name,
                                status: analysis.sanctioned ? 'Sanctioned' : 'Unsanctioned',
                                risk: analysis.risk,
                                bytes: log.bytes || '0 KB',
                                time: log.timestamp || timestamp,
                                type: analysis.type
                            });
                        }
                    });

                    resolve(findings);
                } catch (err) {
                    reject(err);
                }

            } else {
                // assume CSV
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        // Flexible key mapping for CSV headers
                        const domain = row['destination'] || row['domain'] || row['dest'] || row['url'];
                        if (domain) {
                            const analysis = LogParser.analyzeDomain(domain);
                            if (analysis) {
                                findings.push({
                                    id: `log-${findings.length}`,
                                    source: row['source_ip'] || row['source'] || 'Unknown',
                                    dest: domain,
                                    app: analysis.name,
                                    status: analysis.sanctioned ? 'Sanctioned' : 'Unsanctioned',
                                    risk: analysis.risk,
                                    bytes: row['bytes'] || '0 KB',
                                    time: row['timestamp'] || timestamp,
                                    type: analysis.type
                                });
                            }
                        }
                    })
                    .on('end', () => {
                        resolve(findings);
                    })
                    .on('error', (err) => {
                        reject(err);
                    });
            }
        });
    },

    analyzeDomain: (domain) => {
        // Simple direct match or subdomain check
        // e.g. api.openai.com matches openai.com logic if exact API match not found? 
        // For now, let's look for substring matches in our dictionary keys

        if (!domain) return null;
        const cleanDomain = domain.toLowerCase().trim();

        for (const key of Object.keys(AI_DOMAINS)) {
            if (cleanDomain.includes(key)) {
                return AI_DOMAINS[key];
            }
        }
        return null;
    }
};

module.exports = LogParser;
