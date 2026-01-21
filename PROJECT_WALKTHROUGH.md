# AegisAI-SPM: Platform Walkthrough & Documentation

**Date**: January 21, 2026
**Project**: AI Security Posture Management Platform

---

## 1. Executive Summary

**AegisAI-SPM** is a comprehensive security platform designed specifically to secure AI workloads in the cloud. As organizations rapidly adopt Generative AI, the attack surface has expanded. AegisAI provides a holistic solution integrating "Shadow AI" discovery, active "Red Teaming" simulation, and graph-based risk analysis.

This document serves as a complete walkthrough of the platform's capabilities, demonstrating the user journey from detection to remediation.

---

## 2. Dashboard: The Security Command Center

The **Dashboard** acts as the central hub for security operations. It provides a high-level overview of the organization's AI security posture.

![Dashboard Overview](docs/images/dashboard_1768989862515.png)

**Key Features:**
- **Security Score**: A real-time calculated metric (0-100) representing the overall health of the AI environment.
- **Risk Counters**: Immediate visibility into Critical, High, and Medium risks.
- **Global Threat Map**: A visual representation of geographic threat origins.
- **Recent Alerts**: A feed of the latest security findings requiring attention.

---

## 3. Asset Inventory: Visibility ("The Eyes")

The **Asset Inventory** module automatically scans cloud environments (AWS SageMaker, S3, IAM) to catalog all AI-related resources.

![Asset Inventory](docs/images/inventory_1768989892606.png)

**Capabilities:**
- **Auto-Discovery**: Detects SageMaker Endpoints, Training Jobs, and Models.
- **Classification**: Categorizes assets by type and region.
- **Status Monitoring**: Tracks the operational status (In Service, Creating, Failed) of AI services.

---

## 4. Graph Explorer: Contextual Analysis ("The Brain")

Traditional lists fail to show *context*. The **Graph Explorer** visualizes the complex relationships between assets to identify hidden attack paths.

![Graph Explorer](docs/images/graph_1768989918654.png)

**How it Works:**
- **Node Visualization**: Assets are represented as nodes (e.g., Internet, LB, Model, Data).
- **Attack Path Analysis**: Highlights paths where an attacker could move from the Internet to sensitive training data.
- **Interactive Exploration**: Users can drag and zoom to investigate specific clusters of infrastructure.

---

## 5. AI Red Teaming: Active Defense ("The Shield")

The **Red Team Simulator** is a standout feature that moves beyond passive scanning to active testing. It simulates adversarial attacks against AI models.

![Red Team Simulator](docs/images/red_team_1768989952027.png)

**Functionality:**
- **Attack Simulation**:  executes payloads such as "Prompt Injection" (e.g., "Ignore previous instructions").
- **Guardrail Testing**: Verifies if the model's safety filters block the attack.
- **Live Feedback**: Shows the Model's response and classifies the result as "Blocked" (Success) or "Bypassed" (Failure).

---

## 6. Shadow AI Discovery

The **Shadow AI** module analyzes network logs to detect unauthorized use of external AI tools by employees.

![Shadow AI Discovery](docs/images/shadow_ai_1768989981311.png)

**Features:**
- **Log Ingestion**: Parses firewall/DNS logs (CSV/JSON).
- **Threat Intel Matching**: Compares traffic against a database of known AI domains (e.g., openai.com, huggingface.co).
- **Sanctioned vs. Unsanctioned**: Clearly separates approved tools from risky, "shadow" usage.

---

## 7. Technical Architecture

The platform is built on a modern stack ensuring scalability and performance.

```mermaid
graph TD
    User[Security User] -->|HTTPS| Frontend[React Frontend (Vite)]
    Frontend -->|REST API| Backend[Node.js / Express Backend]
    
    subgraph Data Layer
    Backend -->|Asset Graph| Neo4j[(Neo4j Graph DB)]
    Backend -->|User Data| MongoDB[(MongoDB)]
    end
    
    subgraph AI & Cloud
    Backend -->|Boto3/SDK| AWS[AWS Cloud (SageMaker/S3)]
    Backend -->|API| LLM[LLM Provider (Bedrock/OpenAI)]
    end
```

---

## 8. Conclusion

AegisAI-SPM successfully shifts the paradigm from static checking to dynamic, context-aware analysis. By rigorously testing models with the Red Team Simulator and mapping risks with the Graph Explorer, it offers a robust defense for the next generation of AI-integrated infrastructure.
