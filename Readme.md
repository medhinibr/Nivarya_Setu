# Nivarya Setu: Advanced Trading Simulation Platform

Nivarya Setu is an institutional-grade trading simulation environment designed for the Indian capital markets. The platform provides a high-fidelity interface for executing and testing trading strategies across multiple asset classes, including equities, derivatives, and mutual funds, utilizing synchronized market data.

## Executive Overview

The platform is engineered to facilitate financial literacy and strategy validation through a sophisticated, zero-latency simulation engine. By leveraging a decoupled architectural pattern, Nivarya Setu ensures high availability and modularity, providing users with a professional terminal experience.

## Technology Stack and Language Classification

The project utilizes a modern full-stack architecture. For administrative transparency on version control platforms, the following language distribution is maintained:

*   **Backend (Python/Flask)**: Manages the core simulation logic, RESTful API endpoints, and persistent user state.
*   **Frontend (React/JSX)**: Implements complex UI components and real-time data streaming logic.
*   **Styling (Vanilla CSS)**: Employs a bespoke institutional dark theme optimized for financial data density.
*   **Structure (HTML5)**: Provides the semantic foundation for the application shell.

*Note: In repository analytics, React components are categorized under JavaScript. All frontend logic resides within `src/platform/app.jsx` using modern functional paradigms.*

## Core Functionalities

### Market Execution
*   **Real-Time Data Streams**: Integration with financial data providers for live NSE/BSE, commodity, and currency quotes.
*   **Analytic Componentry**: Embedded professional charting utilities for multidimensional technical analysis.
*   **Order Management**: Support for diverse order types including Market, Limit, and Intraday/Delivery classifications.

### User Onboarding and Compliance
*   **Digital Registration**: Automated, paperless onboarding workflow.
*   **Verification Protocols**: Integrated KYC simulation for secure user authentication.
*   **Knowledge Base**: Structured documentation for platform navigation and market fundamentals.

### Asset Class Diversification
*   **Investments**: Comprehensive modules for Mutual Fund exploration and Systematic Investment Plan (SIP) simulation.
*   **Derivatives**: Dedicated F&O environment with margin requirement calculations.
*   **Primary Markets**: IPO tracking and subscription simulation dashboard.

## Technical Architecture

The architecture adheres to a modern, service-oriented design:
1.  **Client Tier**: Built on React 18 using JSX syntax. Utilizes browser-side compilation via Babel for streamlined deployment synchronization.
2.  **Server Tier**: A resilient Flask-based backend serving as the centralized gateway for data processing and order ledger management.

## Project Directory Structure

```text
Nivarya-Setu/
├── src/
│   ├── app.py              # Central API and Portfolio Logic
│   └── platform/           # Modular Frontend Assets
│       ├── index.html      # Primary Application Entry
│       ├── style.css       # Institutional Design System (CSS)
│       └── app.jsx         # React Logic and Componentry (JSX)
├── Readme.md               # Project Documentation
└── requirements.txt        # System Dependencies
```

## Setup and Installation

### System Configuration
1.  **Install Required Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
2.  **Initialize Application Server**:
    ```bash
    python src/app.py
    ```
3.  **Terminal Access**:
    Navigate to `http://localhost:5000/` via a supported web browser.

## Contribution and Governance
Detailed guidelines for project contribution and pull request protocols are documented in [CONTRIBUTING.md](CONTRIBUTING.md).

## Contact Information
For institutional inquiries, technical feedback, or reporting system anomalies, please utilize the project's issue tracking system on GitHub.
