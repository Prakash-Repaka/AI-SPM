# AegisAI-SPM: Architecture & Security Concepts

## 1. What are we building?
**AegisAI-SPM (Security Posture Management)** is a specialized security platform for Artificial Intelligence workloads on AWS. Think of it as a "digital immune system" for your AI models and data.

### Why do we need it?
Traditional security tools scan servers. They don't understand that a **SageMaker Endpoint** connects to an **S3 Bucket** with sensitive training data using an **IAM Role**. AegisAI understands these relationships.

### Core Architecture
1.  **Discovery Layer ("The Eyes")**:
    - Scanners (`sagemakerScanner`, `bedrockScanner`, `s3Scanner`) connect to AWS and find all AI assets.
2.  **Graph Layer ("The Context")**:
    - We don't just list assets; we map them in a **Neo4j Graph Database**.
    - We map: `(Internet) -> [Public Endpoint] -> [IAM Role] -> [Training Data]`.
3.  **Analysis Layer ("The Brain")**:
    - **Risk Engine**: Scores individual findings (e.g., "Unencrypted Bucket").
    - **Attack Path Engine**: Traces how a hacker could move through your system.
    - **Compliance Engine**: Checks against government rules (NIST) and hacker guides (OWASP).
    - **Threat Engine (STRIDE)**: *[New]* Classifies threats by type (Spoofing, Tampering, etc.).

---

## 2. Managing Threats with STRIDE
We are integrating the **STRIDE Framework** to categorize every finding. This ensures we cover all vectors of attack.

| STRIDE Category | What it means | How AegisAI Measures it |
| :--- | :--- | :--- |
| **S**poofing | Impersonating someone else | **IAM Scanner**: Detects `ts:AssumeRole` permissions and Overprivileged roles (`IAM-001`). |
| **T**ampering | Changing data/code maliciously | **SageMaker Scanner**: Finds Notebooks with direct internet access (`SM-001`) where code can be injected. |
| **R**epudiation | "It wasn't me" (No logs) | **Bedrock Scanner**: Alerts if Model Invocation Logging is disabled (`BEDROCK-001`). |
| **I**nformation Disclosure | Leaking sensitive info | **S3 Scanner**: Finds unencrypted/public buckets (`S3-001`). **SageMaker**: Secrets in env vars (`SM-003`). |
| **D**enial of Service | Crashing the system | **Infrastructure**: Checks for lack of auto-scaling or limits (Planned). |
| **E**levation of Privilege | Gaining admin rights | **Graph Analysis**: Finds paths where a weak role leads to Admin access. |

## 3. Security Implementation Strategy
We measure security using a **Depth-in-Defense** approach:
1.  **Static Configuration Check**: Is the setting wrong? (e.g., Encrypted=False).
2.  **Network Reachability**: Is it exposed to the internet? (Graph Analysis).
3.  **Identity Entitlement**: Who can access it? (IAM Analysis).
4.  **Data Sensitivity**: Does it matter? (Tagging/Classification).

## 4. Why this is the "Best One"
Most SPM tools stop at step 1. AegisAI goes to step 3 and 4 using Graph Theory. By adding **STRIDE**, we provide a holistic threat model that speaks the language of security architects.
