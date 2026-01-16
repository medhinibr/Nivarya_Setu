# Nivarya Setu

Nivarya Setu is trading simulation platform tailored for the Indian Stock Market. It provides a realistic environment for testing trading strategies on equities, derivatives, and mutual funds using real-time market data.

![React](https://img.shields.io/badge/Frontend-React_18-blue?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Backend-Python_Flask-green?style=for-the-badge&logo=python)

## Overview

Nivarya Setu is designed for high-performance trading simulation. By separating the logic into modular components, the platform ensures scalability and a premium user experience.

## Language Breakdown
*Note: GitHub classifies the React frontend under "JavaScript". All logic in `src/platform/app.jsx` is written using React functional components and hooks.*

- **Python (Flask)**: Handles the API, user portfolio state, and market data simulation.
- **JavaScript (React/JSX)**: Manages the entire UI, real-time updates, and interactive charting.
- **CSS3**: Implementation of a custom, institutional-grade dark theme tailored for financial terminals.
- **HTML5**: Semi-semantic structure for the core application shell.

## Key Features

### Core Trading
- **Real-Time Data Integration**: Fetches live quotes for NSE/BSE stocks, commodities, and forex via Yahoo Finance.
- **Professional Charting**: Integrated TradingView charts for advanced technical analysis.
- **Order Terminal**: Supports Market, Limit, and Intraday/Delivery order types.

### Institutional Onboarding
- **Swift Digital Entry**: Lightning-fast, paperless registration.
- **AI-Powered KYC**: Secure, frictionless verification process.
- **Interactive FAQ**: Comprehensive guide for new traders.

### Advanced Modules
- **Mutual Funds & SIPs**: Dedicated section to explore funds and calculate returns.
- **F&O (Futures & Options)**: Trade derivatives with simulated margin requirements.
- **IPO Dashboard**: Track listings and simulate IPO applications.

## Technical Architecture

The project follows a modern, decoupled architecture:
1.  **Frontend**: Built with **React 18** using **JSX**. To maintain a zero-build environment for deployment ease, it uses **Babel Standalone** for browser-side compilation.
2.  **Backend**: A **Flask** server that acts as a secure API gateway and manages mock order execution.

## Project Structure

```text
Nivarya-Setu/
├── src/
│   ├── app.py              # Flask API & Order Management
│   └── platform/           # Modular Frontend
│       ├── index.html      # Application Shell
│       ├── style.css       # Institutional Dark Theme (CSS)
│       └── app.jsx         # React Frontend Logic (JSX)
├── Readme.md               # Professional Documentation
└── requirements.txt        # Backend Dependencies
```

## Getting Started

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
2.  **Run Server**:
    ```bash
    python src/app.py
    ```
3.  **Access Terminal**:
    Visit `http://localhost:5000/` in your browser.

## Contributing
Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for institutional guidelines.

## Contact
For institutional inquiries or feedback, please reach out via GitHub issues.
