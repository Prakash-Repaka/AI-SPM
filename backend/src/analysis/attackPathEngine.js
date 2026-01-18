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
        return [
            {
                id: 'path-demo-1',
                title: 'AI Data Poisoning via Public Write S3',
                severity: 'CRITICAL',
                score: 98,
                steps: [
                    { id: 'step-1', assetIs: 'Network', name: 'INTERNET', type: 'Source', description: 'Attacker from Public Internet' },
                    { id: 'step-2', assetIs: 'S3Bucket', name: 'public-model-share', type: 'Exploit', description: 'Bucket allows Public Write (Data Poisoning)' },
                    { id: 'step-3', assetIs: 'SageMakerEndpoint', name: 'finance-llm-v1', type: 'Target', description: 'Consumes poisoned data for inference' }
                ]
            },
            {
                id: 'path-demo-2',
                title: 'Supply Chain Compromise (Vulnerable Image)',
                severity: 'HIGH',
                score: 85,
                steps: [
                    { id: 'step-1', assetIs: 'ContainerRegistry', name: 'DockerHub', type: 'Source', description: 'Compromised Upstream Image' },
                    { id: 'step-2', assetIs: 'SageMakerEndpoint', name: 'finance-llm-v1', type: 'Vulnerability', description: 'Running CVE-2024-XYZ (Remote Exec)' },
                    { id: 'step-3', assetIs: 'IAMRole', name: 'SageMakerExecutionRole', type: 'Privilege', description: 'Role allows S3 Full Access' },
                    { id: 'step-4', assetIs: 'S3Bucket', name: 'finance-training-data', type: 'Exfiltration', description: 'Sensitive financial data stolen' }
                ]
            }
        ];
    }
}

module.exports = new AttackPathEngine();
