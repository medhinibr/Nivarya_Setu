# Nivarya Setu: Advanced Trading Simulation Platform

Nivarya Setu is an institutional-grade trading simulation environment designed for the Indian capital markets. The platform provides a high-fidelity interface for executing and testing trading strategies across multiple asset classes, including equities, derivatives, and mutual funds, utilizing synchronized market data.

## Executive Overview

The platform is engineered to facilitate financial literacy and strategy validation through a sophisticated, zero-latency simulation engine. By leveraging a decoupled architectural pattern, Nivarya Setu ensures high availability and modularity, providing users with a professional terminal experience.

## Comprehensive Technical Stack

Nivarya Setu is built upon a resilient and modern technology stack designed for performance, security, and scalability.

### Frontend Development
*   **React 18**: Used for building complex, state-driven user interfaces through functional components and hooks.
*   **Babel Standalone**: Employed for real-time, browser-side JSX compilation to maintain a zero-build deployment workflow.
*   **Vanilla CSS3**: Implementation of a bespoke Institutional Design System, optimized for low-latency rendering and high data density.
*   **Typography & Iconography**: Integration of Google Fonts (Inter, Roboto Mono) and FontAwesome 6 for a refined, professional aesthetic.

### Backend Infrastructure
*   **Python 3.x**: The core programming language for backend operations and data processing.
*   **Flask Framework**: Utilized for architecting a RESTful API gateway that handles client requests and portfolio logic.
*   **YFinance**: Integration with the Yahoo Finance API for retrieving real-time market quotes and historical benchmarks.
*   **Python-Dotenv**: Manages environment-level configurations and sensitive credentials securely.

### Financial Visualization & Analytics
*   **TradingView API**: Professional-grade charting library integrated for advanced technical analysis and real-time price action visualization.
*   **Market Depth Simulation**: Bespoke logic for simulating Bid/Ask spreads and liquidity depth.

### Authentication & Security
*   **Firebase Authentication**: Centralized identity management system supporting secure email/password protocols.
*   **Google OAuth 2.0**: Seamless third-party authentication integration for institutional-grade security and user convenience.

## Core Functionalities

### Market Execution
*   **Real-Time Data Streams**: Live synchronization for NSE/BSE, commodity, and currency data.
*   **Analytic Componentry**: Multi-timeframe technical charting and indicator support.
*   **Order Management**: Support for Market, Limit, and Intraday/Delivery order classifications.

### Asset Class Diversification
*   **Investments**: Modules for Mutual Fund exploration and Systematic Investment Plan (SIP) simulation.
*   **Derivatives**: Dedicated environment for F&O trading with automated margin calculations.
*   **Primary Markets**: Track listings and subscribe to IPO simulations through a dedicated portal.

## Project Structure

```text
Nivarya-Setu/
├── src/
│   ├── app.py              # Central Flask API and Portfolio Logic
│   └── platform/           # Modular Frontend Architecture
│       ├── index.html      # Application Shell
│       ├── style.css       # Institutional Design System (CSS)
│       └── app.jsx         # React Logic and Componentry (JSX)
├── Readme.md               # Professional Documentation
└── requirements.txt        # System-level Dependencies
```

## Setup and Installation

1.  **Dependency Management**:
    ```bash
    pip install -r requirements.txt
    ```
2.  **Configuration**:
    Ensure a `.env` file is present in the `src/` directory with necessary API keys.
3.  **Deployment**:
    ```bash
    python src/app.py
    ```
    Access the platform at `http://localhost:5000/`.

## Governance
Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for contribution protocols and code standards.

## Contact
For technical inquiries or system anomalies, please utilize the GitHub issue tracking platform.
