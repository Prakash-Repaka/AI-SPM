class RemediationEngine {
    constructor() {
        this.playbooks = {
            'S3-001': {
                title: 'Enable Server-Side Encryption (KMS)',
                risk: 'Data At Rest is not encrypted.',
                cli: 'aws s3api put-bucket-encryption --bucket <bucket_name> --server-side-encryption-configuration \'{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "aws:kms"}}]}\'',
                terraform: `resource "aws_s3_bucket_server_side_encryption_configuration" "example" {
  bucket = aws_s3_bucket.example.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}`
            },
            'S3-002': {
                title: 'Block Public Access (Data Poisoning Prevention)',
                risk: 'Bucket allows public writes, enabling data poisoning.',
                cli: 'aws s3api put-public-access-block --bucket <bucket_name> --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"',
                terraform: `resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.example.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}`
            },
            'SM-001': {
                title: 'Enable Data Encryption for SageMaker Endpoint',
                risk: 'Model endpoint data is not encrypted.',
                cli: 'aws sagemaker create-endpoint-config --endpoint-config-name <config-name> --kms-key-id <kms-key-arn> ...',
                terraform: '(Terraform requires re-creation of Endpoint Config resource with kms_key_arn)'
            },
            'SM-004': {
                title: 'Update Vulnerable Container Image',
                risk: 'Container image has known CVEs (Supply Chain Risk).',
                cli: 'aws sagemaker create-model --model-name <new-model-name> --primary-container Image=<secure-image-uri> ...',
                terraform: `resource "aws_sagemaker_model" "example" {
  primary_container {
    image = "123456789012.dkr.ecr.us-east-1.amazonaws.com/secure-image:latest"
  }
}`
            },
            'IAM-001': {
                title: 'Detach AdministratorAccess Policy',
                risk: 'Role has excessive privileges (AdminAccess).',
                cli: 'aws iam detach-role-policy --role-name <role_name> --policy-arn arn:aws:iam::aws:policy/AdministratorAccess',
                terraform: '# Remove the aws_iam_role_policy_attachment resource linking AdministratorAccess'
            }
        };
    }

    generateFix(finding) {
        const playbook = this.playbooks[finding.ruleId];
        if (!playbook) {
            return {
                available: false,
                message: 'No automated remediation available for this rule type yet.'
            };
        }

        return {
            available: true,
            title: playbook.title,
            risk: playbook.risk,
            actions: [
                {
                    type: 'AWS CLI',
                    code: playbook.cli.replace('<bucket_name>', finding.assetName).replace('<role_name>', finding.assetName)
                },
                {
                    type: 'Terraform',
                    code: playbook.terraform
                }
            ]
        };
    }
}

module.exports = new RemediationEngine();
