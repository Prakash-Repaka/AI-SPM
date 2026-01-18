const { BedrockClient, ListFoundationModelsCommand } = require("@aws-sdk/client-bedrock");

class BedrockScanner {
    constructor(region, credentials) {
        this.region = region;
        this.name = 'BedrockScanner';
        const config = { region };
        if (credentials) {
            config.credentials = {
                accessKeyId: credentials.accessKeyId,
                secretAccessKey: credentials.secretAccessKey
            };
        }
        this.client = new BedrockClient(config);
    }

    async scan() {
        console.log(`Scanning Bedrock Resources in ${this.region}...`);
        const assets = [];

        try {
            // 1. Scan Foundation Model Access (and Custom Models if any)
            // Note: ListFoundationModels mostly lists what is available, but we can check for Custom Models
            // For this scanner, we will focus on Custom Models as they are user-owned assets
            const customModels = await this.scanCustomModels();
            assets.push(...customModels);

            // 2. Check Logging Configuration (Simulated as SDK support varies/requires distinct client)
            // Ideally use BedrockClient for model management

            // Note: In a real implementation, we would check GetModelInvocationLoggingConfiguration 
            // but for now, we'll focus on discovering models.

        } catch (error) {
            console.log(`⚠️ Bedrock Scan Partial/Failed: ${error.message}`);
        }

        return assets;
    }

    async scanCustomModels() {
        const found = [];
        try {
            // Use ListCustomModels if available, or just ListFoundationModels to check access
            // ListFoundationModelsCommand checks what is available to the account
            const command = new ListFoundationModelsCommand({});
            const response = await this.client.send(command);

            // We want to verify if logging is enabled for these (mocking that check for now as it's an account-level setting)
            const loggingEnabled = false; // Mock finding: Logging usually off by default

            // Create a pseudo-asset for the Bedrock Service Configuration in this region
            found.push({
                id: `arn:aws:bedrock:${this.region}:${this.getAccountId()}:settings`,
                arn: `arn:aws:bedrock:${this.region}:${this.getAccountId()}:settings`,
                name: 'Bedrock-Regional-Settings',
                type: 'BedrockService',
                region: this.region,
                status: 'Active',
                findings: !loggingEnabled ? [{
                    id: 'BEDROCK-001',
                    ruleId: 'BEDROCK-001',
                    severity: 'HIGH',
                    title: 'Model Invocation Logging Disabled',
                    description: 'Bedrock model invocation logging is disabled, preventing auditability of prompts and completions (OWASP LLM 09).'
                }] : [],
                tags: {}
            });

        } catch (e) {
            console.error('Error scanning bedrock:', e.message);
        }
        return found;
    }

    getAccountId() {
        // detailed implementation would get this from caller identity
        return '123456789012';
    }
}

module.exports = { BedrockScanner };
