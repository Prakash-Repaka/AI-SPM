/**
 * Base Asset Class
 */
class AIAsset {
    constructor(data) {
        this.id = data.id;
        this.arn = data.arn;
        this.name = data.name;
        this.region = data.region;
        this.accountId = data.accountId;
        this.type = data.type; // 'SageMakerEndpoint', 'S3Bucket', etc.
        this.tags = data.tags || {};
        this.riskScore = 0;
        this.findings = [];
    }
}

class SageMakerEndpoint extends AIAsset {
    constructor(data) {
        super({ ...data, type: 'SageMakerEndpoint' });
        this.status = data.status;
        this.variantName = data.variantName;
        this.modelName = data.modelName;
        this.instanceType = data.instanceType;
        this.isPublic = data.isPublic || false;
    }
}

class S3Bucket extends AIAsset {
    constructor(data) {
        super({ ...data, type: 'S3Bucket' });
        this.isEncrypted = data.isEncrypted;
        this.publicAccessBlock = data.publicAccessBlock;
        this.containsSensitiveData = data.containsSensitiveData || false;
    }
}

module.exports = {
    AIAsset,
    SageMakerEndpoint,
    S3Bucket
};
