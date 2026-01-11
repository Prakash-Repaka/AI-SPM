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
        } catch (error) {
            console.error(`Error ingesting asset ${asset.id}:`, error.message);
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

    close() {
        return this.driver.close();
    }
}

// Singleton instance
const db = new DatabaseService();
module.exports = db;
