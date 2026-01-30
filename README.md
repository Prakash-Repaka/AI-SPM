# AegisAI-SPM: AI Security Posture Management Platform

## Problem Statement

Organizations deploying AI/ML workloads on cloud platforms face critical security challenges:
- **Lack of Visibility**: Traditional security tools don't understand AI-specific resources like SageMaker endpoints, Bedrock models, or AI training data stored in S3 buckets
- **Complex Attack Surfaces**: AI systems involve intricate relationships between models, data, IAM roles, and network configurations that create hidden vulnerabilities
- **Compliance Gaps**: Meeting AI-specific security standards (OWASP Top 10 for LLMs, NIST AI Framework) requires specialized monitoring
- **Shadow AI**: Unauthorized AI usage and unmonitored AI services create blind spots in security posture
- **Prompt Injection Risks**: AI models are vulnerable to adversarial attacks that traditional security tools cannot detect

## Solution Overview

**AegisAI-SPM** is an intelligent security platform that acts as a "digital immune system" for AI workloads on AWS. It discovers, maps, and analyzes AI assets using graph database technology to understand relationships and attack paths that traditional tools miss.

The platform combines:
- **Automated Discovery**: Scans AWS accounts to identify all AI/ML resources (SageMaker, Bedrock, Lambda, S3)
- **Graph-Based Analysis**: Maps relationships between assets to identify attack paths and cascading risks
- **AI Red Teaming**: Simulates prompt injection and adversarial attacks to test model resilience
- **Shadow AI Detection**: Analyzes logs to detect unauthorized AI service usage
- **Automated Remediation**: Generates AWS CLI commands and Terraform code to fix security issues
- **Threat Intelligence**: Integrates real-time CVE feeds and AI-specific vulnerability alerts

## Features

### Core Security Features
- **AI Asset Discovery**: Automatically scans and inventories SageMaker endpoints, Bedrock models, Lambda functions, S3 buckets, and IAM roles
- **Risk Assessment Engine**: Scores vulnerabilities using STRIDE threat modeling framework (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)
- **Attack Path Visualization**: Interactive 3D graph showing how attackers could move through your AI infrastructure
- **Compliance Mapping**: Checks against NIST AI Framework, OWASP Top 10 for LLMs, and AWS best practices
- **Real-time Monitoring**: Live dashboard with security metrics and threat indicators

### Advanced Features
- **AI Red Team Simulator**: Test models against prompt injection, jailbreak attempts, and adversarial inputs
- **Shadow AI Discovery**: Upload firewall/DNS logs to detect unauthorized AI service usage
- **Automated Remediation**: One-click generation of fix scripts (AWS CLI, Terraform, Python)
- **Cost Risk Estimation**: Calculate financial impact of security vulnerabilities
- **Threat Intelligence Feed**: Real-time CVE alerts and AI-specific vulnerability notifications
- **PDF Report Generation**: Executive-ready security assessment reports
- **Security Chatbot**: AI-powered assistant for security queries and guidance

### User Experience
- **Cyber-Themed UI**: Modern, terminal-inspired interface with glassmorphism effects
- **Interactive Dashboards**: Real-time charts and metrics using Recharts
- **Multi-Factor Authentication**: Secure login with 2FA support
- **Role-Based Access Control**: Admin and user roles with different permissions
- **Audit Logging**: Complete activity tracking for compliance

## Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Databases**: 
  - Neo4j (Graph Database for relationship mapping)
  - MongoDB (User data and audit logs)
- **Cloud Integration**: AWS SDK v3 (Bedrock, SageMaker, S3, Lambda, IAM, CloudTrail)
- **AI/LLM**: OpenAI API (for chatbot and red teaming)
- **Authentication**: JWT, bcrypt, Speakeasy (2FA)
- **Testing**: Jest, Supertest

### Frontend
- **Framework**: React 19 with Vite
- **Routing**: React Router DOM
- **UI Libraries**: 
  - Lucide React (icons)
  - Recharts (data visualization)
  - React Force Graph 2D (network visualization)
- **Styling**: Tailwind CSS with custom cyber theme
- **HTTP Client**: Axios
- **Testing**: Vitest, React Testing Library

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Version Control**: GitHub
- **Package Management**: npm
- **Process Management**: Concurrently (for running frontend + backend)
- **Development**: Nodemon (hot reload)

## System Architecture

```
User → Web Interface (React) → API Gateway (Express) → Processing Layer → Output

Flow Details:
1. User authenticates via Login/Signup (JWT + 2FA)
2. Dashboard displays security metrics from MongoDB + Neo4j
3. User initiates AWS scan → Backend scanners query AWS APIs
4. Discovered assets stored in Neo4j graph database
5. Risk Engine analyzes findings using STRIDE framework
6. Attack Path Engine traces relationships in graph
7. Results displayed in interactive dashboards and 3D visualizations
8. User can generate remediation scripts or PDF reports
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  Dashboard | Asset Inventory | Risk Viewer | Red Team   │
└─────────────────────┬───────────────────────────────────┘
                      │ REST API
┌─────────────────────▼───────────────────────────────────┐
│                  Backend (Express)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │  Discovery  │  │   Analysis   │  │  Remediation   │ │
│  │   Scanners  │  │    Engine    │  │    Engine      │ │
│  └──────┬──────┘  └──────┬───────┘  └────────┬───────┘ │
└─────────┼────────────────┼──────────────────┼──────────┘
          │                │                  │
    ┌─────▼─────┐    ┌────▼─────┐      ┌────▼─────┐
    │    AWS    │    │  Neo4j   │      │ MongoDB  │
    │    APIs   │    │  Graph   │      │  Users   │
    └───────────┘    └──────────┘      └──────────┘
```

## How It Works

### 1. Asset Discovery
- User provides AWS credentials (or uses mock mode for testing)
- Backend scanners query AWS APIs to discover AI/ML resources
- Assets are stored in Neo4j with relationships (e.g., SageMaker → IAM Role → S3 Bucket)

### 2. Security Analysis
- **Risk Engine** evaluates each asset against security best practices
- **STRIDE Framework** categorizes threats (Spoofing, Tampering, etc.)
- **Graph Analysis** identifies attack paths through connected resources
- Findings are scored by severity (Critical, High, Medium, Low)

### 3. Visualization & Reporting
- Interactive dashboards display metrics and trends
- 3D force-directed graph shows asset relationships
- Attack paths highlighted in red
- PDF reports generated for compliance

### 4. Remediation
- User selects a finding
- System generates fix scripts:
  - AWS CLI commands
  - Terraform infrastructure-as-code
  - Python automation scripts
- User can copy and execute in their environment

### 5. Continuous Monitoring
- Red Team simulator tests AI models for vulnerabilities
- Shadow AI detector analyzes uploaded logs
- Threat intelligence feed provides real-time CVE alerts

## Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Docker Desktop** (for Neo4j database)
- **AWS Account** (optional - mock mode available)
- **Git**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Prakash-Repaka/AI-SPM.git
cd AI-SPM

# Install all dependencies (root, backend, frontend)
npm run install:all

# Start Neo4j database
docker-compose up -d

# Start both backend and frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Neo4j Browser**: http://localhost:7474 (username: neo4j, password: password)

### Detailed Setup

#### 1. Database Setup
```bash
# Ensure Docker Desktop is running
docker-compose up -d

# Verify Neo4j is running
# Open http://localhost:7474 in browser
# Login with username: neo4j, password: password
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Optional: Configure AWS credentials
# Create .env file or use ~/.aws/credentials
# For testing, mock mode works without AWS credentials

npm start
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (Optional)

Create `backend/.env` for AWS integration:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
OPENAI_API_KEY=your_openai_key  # For AI chatbot
```

## Sample Input / Output

### Input: AWS Account Scan
```
User clicks "Scan AWS Account" → System discovers:
- 3 SageMaker Endpoints
- 2 Bedrock Models
- 15 S3 Buckets
- 8 Lambda Functions
- 12 IAM Roles
```

### Output: Security Findings
```
Critical Findings (2):
- S3-001: Unencrypted bucket containing training data
- SM-001: SageMaker notebook with direct internet access

High Findings (5):
- IAM-001: Overprivileged role with admin access
- BEDROCK-001: Model invocation logging disabled
- S3-002: Public bucket exposure

Attack Path Detected:
Internet → Public SageMaker Endpoint → IAM Role → S3 Bucket (PII Data)
```

### Output: Remediation Script
```bash
# Generated AWS CLI commands to fix S3-001
aws s3api put-bucket-encryption \
  --bucket my-training-data \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
```

## Learning Outcomes

### Technical Skills
- ✅ **Graph Database Mastery**: Learned to model complex relationships using Neo4j and Cypher query language
- ✅ **AWS Security**: Deep understanding of AWS IAM, SageMaker, Bedrock, and security best practices
- ✅ **Full-Stack Development**: Built end-to-end application with React frontend and Node.js backend
- ✅ **AI/LLM Integration**: Implemented OpenAI API for chatbot and red teaming simulations
- ✅ **Security Frameworks**: Applied STRIDE threat modeling and OWASP Top 10 for LLMs

### Security Concepts
- ✅ **Attack Path Analysis**: Visualizing how attackers exploit connected vulnerabilities
- ✅ **Prompt Engineering**: Designing adversarial prompts to test AI model resilience
- ✅ **Shadow IT Detection**: Analyzing logs to identify unauthorized service usage
- ✅ **Compliance Mapping**: Aligning findings with NIST and OWASP standards

### Software Engineering
- ✅ **Microservices Architecture**: Separated concerns into scanners, analyzers, and remediation engines
- ✅ **Testing**: Implemented unit and integration tests with Jest
- ✅ **Containerization**: Used Docker for consistent development environments
- ✅ **API Design**: Built RESTful APIs with proper error handling and authentication

## Limitations

### Current Constraints
- **Cloud Provider**: Currently supports AWS only (Azure/GCP support planned)
- **Local Deployment**: Runs on local machine; requires Docker and Node.js
- **Mock Data**: Without AWS credentials, uses simulated data for demonstration
- **API Rate Limits**: OpenAI integration subject to API quotas
- **Real-time Scanning**: Manual scan initiation (continuous monitoring planned)

### Known Issues
- Large AWS accounts (>1000 resources) may experience slow scan times
- 3D graph visualization performance degrades with >500 nodes
- PDF report generation limited to 50 findings per report

## Future Enhancements

### Short-term (Next Release)
- 🚀 **Multi-Cloud Support**: Add Azure ML and Google Vertex AI scanners
- 🚀 **Automated Scheduling**: Cron-based automatic scanning
- 🚀 **Email Alerts**: Notification system for critical findings
- 🚀 **Enhanced UI**: Dark/light theme toggle, mobile responsiveness

### Medium-term
- 🚀 **ML-Powered Risk Scoring**: Use machine learning to improve risk predictions
- 🚀 **Integration Hub**: Connect with Slack, Jira, PagerDuty
- 🚀 **Custom Policies**: User-defined security rules and compliance frameworks
- 🚀 **Historical Trending**: Track security posture changes over time

### Long-term
- 🚀 **Cloud Deployment**: SaaS version with multi-tenant architecture
- 🚀 **AI Model Fingerprinting**: Detect model theft and unauthorized copies
- 🚀 **Blockchain Audit Trail**: Immutable security event logging
- 🚀 **Federated Learning Security**: Scan distributed ML training environments

## Contributors

This project was developed as part of an academic initiative to advance AI security research:

- **R. Prakash** - Lead Developer & Architecture
- **K. Danush** - Backend Development & AWS Integration
- **J. Jyothi** - Frontend Development & UI/UX Design
- **V. S. Swetha** - Security Analysis & Testing
- **K. Ashok** - Database Design & Graph Modeling

---

## License

This project is developed for educational purposes as part of a university coursework.

## Acknowledgments

- **OWASP Foundation** for LLM security guidelines
- **NIST** for AI risk management framework
- **AWS** for comprehensive cloud security documentation
- **Neo4j** for graph database technology

---

**⚠️ Disclaimer**: This tool is for authorized security assessment only. Always obtain proper authorization before scanning cloud environments.

**🔗 GitHub Repository**: [https://github.com/Prakash-Repaka/AI-SPM](https://github.com/Prakash-Repaka/AI-SPM)

**📧 Contact**: For questions or contributions, please open an issue on GitHub.
