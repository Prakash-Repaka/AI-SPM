# AegisAI-SPM: AI Security Posture Management Platform

![Dashboard Preview](frontend/src/assets/dashboard_mockup.png)

## 🛡️ Project Overview

**AegisAI-SPM** is an advanced security platform designed to protect Artificial Intelligence workloads in the cloud. Unlike traditional security scanners that view resources in isolation, AegisAI acts as a "digital immune system" by mapping the relationships between AI models, data, and permissions to identify complex attack paths.

This project was built to address the growing need for specialized security observability in the era of Generative AI, moving beyond passive scanning to active defense.

## 🚀 Key Features

### 1. 🔍 Shadow AI Discovery
automatically detects unauthorized AI usage within the organization by analyzing network logs. It identifies usage of public AI tools (ChatGPT, Claude, HuggingFace) to prevent data leakage.

### 2. ⚔️ Red Teaming Simulator
A dedicated environment to test AI guardrails against real-world adversarial attacks.
- **Simulations**: Prompt Injection, Jailbreaking, Data Exfiltration.
- **Validation**: Verifies if current defenses can block these attacks.

### 3. 🛡️ Automated Remediation
"Fix It" capability that translates security findings into actionable defenses.
- Generates Terraform/CLI code to patch vulnerabilities (e.g., encrypting S3 buckets, tightening IAM roles).

### 4. 🕸️ Graph-Based Risk Analysis
Utilizes **Neo4j** to map assets and visualize attack paths:
- `(Internet) -> [Public Endpoint] -> [IAM Role] -> [Training Data]`
- calculates risk scores based on reachability and data sensitivity.

### 5. 📊 Comprehensive Dashboard
A modern, dark-themed UI providing a real-time view of:
- Total AI Assets & Critical Risks.
- Geographical threat map.
- Compliance status (NIST, OWASP).

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS (Dark Mode UI), Recharts (Visualizations), Lucide React (Icons).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (User/Report data), Neo4j (Graph relationships).
- **Security Framework**: STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege).

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Neo4j (Optional, for graph features)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Prakash-Repaka/AI-SPM.git
    cd AI-SPM
    ```

2.  **Install Dependencies**
    ```bash
    # Install root dependencies
    npm install

    # Install Backend dependencies
    cd backend
    npm install

    # Install Frontend dependencies
    cd ../frontend
    npm install
    ```

3.  **Run the Application**
    From the root directory:
    ```bash
    npm start
    ```
    This command concurrently starts:
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:3000`

## 📁 Project Structure

- **/frontend**: React application source code.
  - `/src/components`: UI components (Dashboard, Scanners, Simulators).
  - `/src/assets`: Images and static resources.
- **/backend**: Express server and API endpoints.
  - `/src/routes`: API route definitions.
  - `/src/models`: Database schemas.





