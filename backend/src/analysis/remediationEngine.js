class RemediationEngine {
    constructor() {
        this.playbooks = {
            'S3-001': {
                title: 'Enable Server-Side Encryption (KMS)',
                risk: 'Data At Rest is not encrypted, risking data leaks if physical media is compromised.',
                scripts: (asset) => [
                    {
                        language: 'bash',
                        label: 'AWS CLI',
                        code: `aws s3api put-bucket-encryption \\
    --bucket ${asset} \\
    --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "aws:kms"}}]}`
                    },
                    {
                        language: 'hcl',
                        label: 'Terraform',
                        code: `resource "aws_s3_bucket_server_side_encryption_configuration" "secure_bucket" {
  bucket = "${asset}"

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}`
                    },
                    {
                        language: 'python',
                        label: 'Python (Boto3)',
                        code: `import boto3

s3 = boto3.client('s3')

s3.put_bucket_encryption(
    Bucket='${asset}',
    ServerSideEncryptionConfiguration={
        'Rules': [
            {
                'ApplyServerSideEncryptionByDefault': {
                    'SSEAlgorithm': 'aws:kms'
                }
            },
        ]
    }
)`
                    }
                ]
            },
            'S3-002': {
                title: 'Block Public Access (Data Poisoning Prevention)',
                risk: 'Bucket allows public writes, enabling data poisoning.',
                scripts: (asset) => [
                    {
                        language: 'bash',
                        label: 'AWS CLI',
                        code: `aws s3api put-public-access-block \\
    --bucket ${asset} \\
    --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"`
                    },
                    {
                        language: 'hcl',
                        label: 'Terraform',
                        code: `resource "aws_s3_bucket_public_access_block" "block_public" {
  bucket = "${asset}"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}`
                    }
                ]
            },
            'SM-001': {
                title: 'Enable Data Encryption for SageMaker Endpoint',
                risk: 'Model endpoint data is not encrypted.',
                scripts: (asset) => [
                    {
                        language: 'bash',
                        label: 'AWS CLI',
                        code: `aws sagemaker create-endpoint-config \\
    --endpoint-config-name ${asset}-secure-config \\
    --kms-key-id <your-kms-key-arn> \\
    --production-variants ...`
                    }
                ]
            },
            'IAM-001': {
                title: 'Detach AdministratorAccess Policy',
                risk: 'Role has excessive privileges (AdminAccess), violating least privilege.',
                scripts: (asset) => [
                    {
                        language: 'bash',
                        label: 'AWS CLI',
                        code: `aws iam detach-role-policy \\
    --role-name ${asset} \\
    --policy-arn arn:aws:iam::aws:policy/AdministratorAccess`
                    },
                    {
                        language: 'python',
                        label: 'Python (Boto3)',
                        code: `import boto3

iam = boto3.client('iam')

iam.detach_role_policy(
    RoleName='${asset}',
    PolicyArn='arn:aws:iam::aws:policy/AdministratorAccess'
)`
                    }
                ]
            }
        };
    }

    generateFix(finding) {
        const playbook = this.playbooks[finding.ruleId];

        if (!playbook) {
            return {
                available: false,
                message: 'No automated remediation available for this rule type.'
            };
        }

        return {
            available: true,
            title: playbook.title,
            risk: playbook.risk,
            actions: playbook.scripts(finding.assetId || finding.assetName || "example-asset")
        };
    }
}

module.exports = new RemediationEngine();
