const { SageMakerClient, ListEndpointsCommand, DescribeEndpointCommand } = require("@aws-sdk/client-sagemaker");
const { SageMakerEndpoint } = require("../../models/assets");

class SageMakerScanner {
    constructor(region, credentials) {
        const config = { region };
        if (credentials) {
            config.credentials = {
                accessKeyId: credentials.accessKeyId,
                secretAccessKey: credentials.secretAccessKey
            };
        }
        this.client = new SageMakerClient(config);
    }

    async scan() {
        const assets = [];
        try {
            const command = new ListEndpointsCommand({});
            const response = await this.client.send(command);

            const endpoints = response.Endpoints || [];

            for (const ep of endpoints) {
                // Get detailed info to check Network Access (VPC vs Public Internet)
                let detail = {};
                try {
                    const detailCommand = new DescribeEndpointCommand({ EndpointName: ep.EndpointName });
                    detail = await this.client.send(detailCommand);
                } catch (e) { console.warn(`Could not describe endpoint ${ep.EndpointName}`); continue; }

                // Determine if Public:
                // SageMaker Endpoints are public by default unless VpcConfig is specified.
                const isPublic = !detail.NetworkConfig || !detail.NetworkConfig.VpcConfig;

                const asset = new SageMakerEndpoint({
                    id: detail.EndpointArn,
                    arn: detail.EndpointArn,
                    name: detail.EndpointName,
                    region: this.client.config.region,
                    accountId: detail.EndpointArn.split(':')[4] || 'unknown',
                    createdAt: detail.CreationTime,
                    status: detail.EndpointStatus,
                    variantName: detail.ProductionVariants?.[0]?.VariantName || 'Unknown',
                    modelName: detail.ProductionVariants?.[0]?.ModelName || 'Unknown',
                    instanceType: detail.ProductionVariants?.[0]?.InstanceType || 'Unknown',
                    isPublic: isPublic
                });

                assets.push(asset);
            }
        } catch (error) {
            console.error("⚠️ SageMaker Real Scan Failed:", error.message);
            // Return empty list so parent can decide to fallback or show nothing
            return [];
        }
        return assets;
    }
}

module.exports = { SageMakerScanner };
