const db = require('../database/neo4j');

class AttackPathEngine {
    constructor() { }

    /**
     * Finds paths from Internet-exposed assets to Sensitive Data
     */
    async findAttackPaths() {
        const paths = [];

        // Check if DB is online
        const isConnected = await db.verifyConnection();
        if (!isConnected) {
            // Fallback to mock if DB down (for development/demo reliability)
            console.warn("⚠️ Graph DB unavailable, returning mock attack paths.");
            return this.getMockPaths();
        }

        try {
            // Pattern: Internet -> Asset -> Role -> (Potentially Sensitive Resource)
            // Note: In real life, we'd check if Role has permissions on Sensitive Resource.
            // Here we look for: (Internet)-[:CAN_REACH]->(PublicAsset)-[:USES_ROLE]->(Role)-[:HAS_ACCESS]->(SensitiveAsset)
            // But since we don't fully parse IAM policies to graph yet, we will imply risk:
            // Public Asset USES OverPrivileged Role.

            const result = await db.executeQuery(`
                MATCH path = (internet:Network {id: 'INTERNET'})-[:CAN_REACH]->(entryPoint:AIAsset)-[:USES_ROLE]->(role:IAMRole)
                WHERE role.isOverPrivileged = true OR role.policies_str CONTAINS 'Admin'
                RETURN entryPoint, role, path
                LIMIT 10
            `);

            result.records.forEach((record, index) => {
                const entryPoint = record.get('entryPoint').properties;
                const role = record.get('role').properties;

                paths.push({
                    id: `path-${index}`,
                    title: `Public ${entryPoint.type} uses Over-Privileged Role`,
                    severity: 'CRITICAL',
                    score: 95,
                    steps: [
                        { id: `step-${index}-1`, assetIs: entryPoint.type, name: entryPoint.name, type: 'Exposure', description: `Publicly available ${entryPoint.type}` },
                        { id: `step-${index}-2`, assetIs: 'IAMRole', name: role.name, type: 'Privilege', description: `Uses role ${role.name} with excessive permissions` }
                    ]
                });
            });

        } catch (error) {
            console.error("Error calculating attack paths:", error);
        }

        return paths;
    }

    getMockPaths() {
        return [{
            id: 'path-demo-1',
            title: 'Public Endpoint to Training Data Exfiltration (DEMO)',
            severity: 'CRITICAL',
            score: 95,
            steps: [
                { id: 'step-1', assetIs: 'SageMakerEndpoint', name: 'finance-llm-v1', type: 'Exposure', description: 'Publicly accessible endpoint found' },
                { id: 'step-2', assetIs: 'IAMRole', name: 'SageMakerExecutionRole', type: 'Privilege', description: 'Endpoint has role with S3 Read access' },
                { id: 'step-3', assetIs: 'S3Bucket', name: 'finance-training-data', type: 'Target', description: 'Contains unencrypted sensitive CSVs' }
            ]
        }];
    }
}

module.exports = new AttackPathEngine();
