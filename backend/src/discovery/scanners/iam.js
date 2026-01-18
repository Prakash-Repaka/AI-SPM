const { IAMClient, ListRolesCommand, ListAttachedRolePoliciesCommand } = require("@aws-sdk/client-iam");

class IAMScanner {
    constructor(region, credentials) {
        this.region = region;
        this.name = 'IAMScanner';
        const config = { region };
        if (credentials) {
            config.credentials = {
                accessKeyId: credentials.accessKeyId,
                secretAccessKey: credentials.secretAccessKey
            };
        }
        this.client = new IAMClient(config);
    }

    async scan() {
        console.log(`Scanning IAM Roles in ${this.region}...`);
        try {
            const command = new ListRolesCommand({});
            const response = await this.client.send(command);
            const roles = response.Roles || [];

            const assets = [];
            for (const role of roles) {
                // Filter for "AI" or interesting roles to keep noise down? 
                // For now, scan all, or maybe just SageMaker execution roles as those are critical for AI SPM.

                // Check for dangerous permissions (Simulated "Real" check)
                let isOverPrivileged = false;
                try {
                    const policiesCmd = new ListAttachedRolePoliciesCommand({ RoleName: role.RoleName });
                    const policiesRes = await this.client.send(policiesCmd);
                    const policies = policiesRes.AttachedPolicies || [];

                    // Simple heuristic for "Over Privileged" - having broad Admin or S3 Full Access
                    isOverPrivileged = policies.some(p =>
                        p.PolicyName.includes('AdministratorAccess') ||
                        p.PolicyName.includes('AmazonS3FullAccess')
                    );
                } catch (e) { console.log('Error checking policies', e.message); }

                assets.push({
                    id: role.Arn,
                    arn: role.Arn,
                    name: role.RoleName,
                    type: 'IAMRole',
                    region: 'global',
                    accountId: role.Arn.split(':')[4],
                    createdAt: role.CreateDate,
                    status: 'Active',
                    isOverPrivileged: isOverPrivileged,
                    tags: {}
                });
            }

            if (assets.length > 0) return assets;
            return []; // Fallback to mock if empty only handled by parent

        } catch (error) {
            console.log(`⚠️ IAM Real Scan Failed (${error.message}).`);
            return [];
        }
    }
}

module.exports = { IAMScanner };
