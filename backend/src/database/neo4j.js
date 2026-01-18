const neo4j = require('neo4j-driver');
const config = require('../config');

class DatabaseService {
    constructor() {
        this.driver = neo4j.driver(
            config.neo4j.uri,
            neo4j.auth.basic(config.neo4j.user, config.neo4j.password),
            { disableLosslessIntegers: true } // Return native JS numbers
        );
    }

    async verifyConnection() {
        try {
            const serverInfo = await this.driver.getServerInfo();
            console.log('✅ Connected to Neo4j:', serverInfo.address);
            return true;
        } catch (error) {
            console.error('❌ Neo4j Connection Failed:', error.message);
            return false;
        }
    }

    async ingestAsset(asset) {
        const session = this.driver.session();
        try {
            // Create asset node and owner/account relationships
            await session.run(
                `
        MERGE (a:AIAsset {id: $asset.id})
        SET a += $asset
        MERGE (acc:AWSAccount {id: $asset.accountId})
        MERGE (a)-[:OWNED_BY]->(acc)
        WITH a
        CALL apoc.create.addLabels(a, [$asset.type]) YIELD node
        RETURN node
        `,
                { asset }
            );

            // 2. Create Internet Exposure Relationship
            if (asset.isPublic) {
                await session.run(
                    `
                    MATCH (a:AIAsset {id: $id})
                    MERGE (internet:Network {id: 'INTERNET', name: 'Public Internet'})
                    MERGE (internet)-[:CAN_REACH]->(a)
                    `,
                    { id: asset.id }
                );
            }

            // 3. Create IAM Role Relationships
            // Check specific fields dynamically or mapped from tags
            const roleArn = asset.tags?.roleArn || asset.tags?.RoleArn || asset.executionRoleArn;
            if (roleArn) {
                await session.run(
                    `
                    MATCH (a:AIAsset {id: $id})
                    MERGE (r:IAMRole {arn: $roleArn})
                    SET r.id = $roleArn, r.type = 'IAMRole'
                    MERGE (a)-[:USES_ROLE]->(r)
                    `,
                    { id: asset.id, roleArn }
                );
            }

        } catch (error) {
            console.error(`Error ingesting asset ${asset.id}:`, error.message);
        } finally {
            await session.close();
        }
    }

    async executeQuery(cypher, params = {}) {
        const session = this.driver.session();
        try {
            return await session.run(cypher, params);
        } catch (error) {
            console.error('Neo4j Query Error:', error.message);
            throw error;
        } finally {
            await session.close();
        }
    }

    async getAssets(label = 'AIAsset') {
        const session = this.driver.session();
        try {
            const result = await session.run(
                `MATCH (n:${label}) RETURN n`
            );
            return result.records.map(record => record.get('n').properties);
        } finally {
            await session.close();
        }
    }

    async getGraphData() {
        const session = this.driver.session();
        try {
            const result = await session.run(`
                MATCH (n)-[r]->(m)
                RETURN n, r, m
                LIMIT 100
            `);

            const nodes = new Map();
            const links = [];

            result.records.forEach(record => {
                const n = record.get('n');
                const m = record.get('m');
                const r = record.get('r');

                if (!nodes.has(n.properties.id)) {
                    nodes.set(n.properties.id, {
                        id: n.properties.id,
                        label: n.labels[0], // e.g., AIAsset, IAMRole
                        ...n.properties
                    });
                }
                if (!nodes.has(m.properties.id)) {
                    nodes.set(m.properties.id, {
                        id: m.properties.id,
                        label: m.labels[0],
                        ...m.properties
                    });
                }

                links.push({
                    source: n.properties.id,
                    target: m.properties.id,
                    type: r.type
                });
            });

            return {
                nodes: Array.from(nodes.values()),
                links: links
            };
        } finally {
            await session.close();
        }
    }

    close() {
        return this.driver.close();
    }
}

// Singleton instance
const db = new DatabaseService();
module.exports = db;
