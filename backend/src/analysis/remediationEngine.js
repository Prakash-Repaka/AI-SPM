class RemediationEngine {
    constructor() {
        this.templates = {
            'SM-001': (assetId) => {
                const name = assetId.split('/').pop();
                return `# Remediation for Public SageMaker Endpoint
# Step 1: Delete the vulnerable endpoint configuration
aws sagemaker delete-endpoint-config --endpoint-config-name ${name}-config

# Step 2: Create a new config with VpcConfig (Private)
aws sagemaker create-endpoint-config \\
    --endpoint-config-name ${name}-private-config \\
    --production-variants VariantName=AllTraffic,ModelName=${name}-model,InstanceType=ml.m5.large,InitialInstanceCount=1 \\
    --vpc-config SecurityGroupIds=sg-xxxxxx,Subnets=subnet-xxxxxx

# Step 3: Update the endpoint
aws sagemaker update-endpoint --endpoint-name ${name} --endpoint-config-name ${name}-private-config`;
            },
            'S3-001': (assetId) => {
                const name = assetId.split(':::')[1];
                return `# Remediation for Unencrypted S3 Bucket
# Enable AES-256 Server-Side Encryption
aws s3api put-bucket-encryption \\
    --bucket ${name} \\
    --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'`;
            },
            'IAM-001': (assetId) => {
                const roleName = assetId.split('/').pop();
                return `# Remediation for Over-Privileged IAM Role
# Detach AdministratorAccess Policy
aws iam detach-role-policy --role-name ${roleName} --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# Attach a Scoped-Down Policy (Example: ReadOnly)
aws iam attach-role-policy --role-name ${roleName} --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess`;
            }
        };
    }

    generateScript(finding) {
        const generator = this.templates[finding.ruleId];
        if (generator) {
            return generator(finding.assetId);
        }
        return `# No automated remediation available for ${finding.ruleId}. Manual review required.`;
    }
}

module.exports = new RemediationEngine();
