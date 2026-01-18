const { SageMakerClient, ListNotebookInstancesCommand, ListTrainingJobsCommand, DescribeTrainingJobCommand, ListModelsCommand, DescribeModelCommand } = require("@aws-sdk/client-sagemaker");

class SageMakerScanner {
    constructor(region, credentials) {
        this.region = region;
        this.name = 'SageMakerScanner'; // Explicit name for reliability
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
        console.log(`Scanning SageMaker Resources in ${this.region}...`);
        const assets = [];

        try {
            // 1. Scan Notebook Instances
            const notebooks = await this.scanNotebooks();
            assets.push(...notebooks);

            // 2. Scan Training Jobs
            const trainingJobs = await this.scanTrainingJobs();
            assets.push(...trainingJobs);

            // 3. Scan Models
            const models = await this.scanModels();
            assets.push(...models);

        } catch (error) {
            console.log(`⚠️ SageMaker Scan Partial/Failed: ${error.message}`);
        }

        return assets;
    }

    async scanNotebooks() {
        const found = [];
        try {
            const command = new ListNotebookInstancesCommand({});
            const response = await this.client.send(command);

            for (const nb of response.NotebookInstances || []) {
                const isRisk = nb.DirectInternetAccess === 'Enabled';

                found.push({
                    id: nb.NotebookInstanceArn,
                    arn: nb.NotebookInstanceArn,
                    name: nb.NotebookInstanceName,
                    type: 'SageMakerNotebook',
                    region: this.region,
                    status: nb.NotebookInstanceStatus,
                    findings: isRisk ? [{
                        id: 'SM-001',
                        ruleId: 'SM-001',
                        severity: 'HIGH',
                        title: 'Notebook Instance has Direct Internet Access',
                        description: 'Notebook instance is configured with direct internet access, increasing exfiltration risk.'
                    }] : [],
                    tags: {
                        instanceType: nb.InstanceType,
                        roleArn: nb.RoleArn
                    }
                });
            }
        } catch (e) {
            console.error('Error scanning notebooks:', e.message);
        }
        return found;
    }

    async scanTrainingJobs() {
        const found = [];
        try {
            // Limit to recent jobs to avoid scanning history forever
            const command = new ListTrainingJobsCommand({ MaxResults: 10, SortBy: 'CreationTime', SortOrder: 'Descending' });
            const response = await this.client.send(command);

            for (const jobSummary of response.TrainingJobSummaries || []) {
                // Need describe for VPC config
                const descCmd = new DescribeTrainingJobCommand({ TrainingJobName: jobSummary.TrainingJobName });
                const job = await this.client.send(descCmd);

                const hasVpc = job.VpcConfig && job.VpcConfig.Subnets && job.VpcConfig.Subnets.length > 0;

                found.push({
                    id: job.TrainingJobArn,
                    arn: job.TrainingJobArn,
                    name: job.TrainingJobName,
                    type: 'SageMakerTrainingJob',
                    region: this.region,
                    status: job.TrainingJobStatus,
                    findings: !hasVpc ? [{
                        id: 'SM-002',
                        ruleId: 'SM-002',
                        severity: 'MEDIUM',
                        title: 'Training Job Missing VPC Configuration',
                        description: 'Training job runs outside a VPC, potentially exposing training data traffic.'
                    }] : [],
                    tags: {
                        roleArn: job.RoleArn
                    }
                });
            }
        } catch (e) {
            console.error('Error scanning training jobs:', e.message);
        }
        return found;
    }

    async scanModels() {
        const found = [];
        try {
            const command = new ListModelsCommand({ MaxResults: 20, SortBy: 'CreationTime', SortOrder: 'Descending' });
            const response = await this.client.send(command);

            for (const modelSummary of response.Models || []) {
                const descCmd = new DescribeModelCommand({ ModelName: modelSummary.ModelName });
                const model = await this.client.send(descCmd);

                // Check environment variables for potential secrets (naive check)
                let hasExposedSecrets = false;
                if (model.PrimaryContainer && model.PrimaryContainer.Environment) {
                    const envKeys = Object.keys(model.PrimaryContainer.Environment);
                    hasExposedSecrets = envKeys.some(k => k.match(/KEY|SECRET|PASSWORD|TOKEN/i));
                }

                found.push({
                    id: model.ModelArn,
                    arn: model.ModelArn,
                    name: model.ModelName,
                    type: 'SageMakerModel',
                    region: this.region,
                    status: 'Active',
                    findings: hasExposedSecrets ? [{
                        id: 'SM-003',
                        ruleId: 'SM-003',
                        severity: 'CRITICAL',
                        title: 'Potential Secrets in Model Environment Variables',
                        description: 'Model container environment variables appear to contain sensitive credentials.'
                    }] : [],
                    tags: {
                        roleArn: model.ExecutionRoleArn
                    }
                });
            }
        } catch (e) {
            console.error('Error scanning models:', e.message);
        }
        return found;
    }
}

module.exports = { SageMakerScanner };
