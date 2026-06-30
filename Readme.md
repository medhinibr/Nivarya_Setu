# Nivarya Setu: Advanced Stock Market Simulation Platform

Nivarya Setu is an institutional-grade, zero-cost paper trading simulation platform designed for the Indian and global capital markets. It provides a premium, low-latency interface to execute trades, build watchlists, and track simulated portfolios across equities, derivatives, commodities, and mutual funds using real-time market data.

---

## 🚀 Key Features

*   **100% Free & Keyless Integration**: Uses the `yfinance` API to retrieve live stock price quotes without requiring paid subscriptions, bank accounts, or API keys.
*   **Intelligent In-Memory Caching (`QuoteCache`)**: Implements a thread-safe caching system in Flask with a 15-second Time-To-Live (TTL) to optimize performance, prevent rate limiting, and provide rapid responses to the client.
*   **Global Autocomplete Search**: Interactive search bar that queries Yahoo Finance's autocomplete API in real-time, allowing users to discover and add any global stock, index, ETF, or mutual fund.
*   **Dynamic Watchlist Management**: Stateful sidebar watchlist saved to browser `localStorage` for persistence, complete with real-time price updates, sparkline visual indicators, and a clean remove-from-watchlist interaction.
*   **Automated TradingView Charts**: Dynamically formats ticker symbols to render live TradingView charts for Indian NSE/BSE stocks, global equities (NASDAQ/NYSE), index futures, and commodities.
*   **Virtual Portfolio & Risk Management**:
    *   Starts every user with **₹1,00,000 (1 Lakh)** in virtual cash.
    *   Dynamic margin validations that block orders with insufficient funds.
    *   Real-time Unrealized P&L, holdings averages, and position tracking.
*   **Vercel Serverless Ready**: Packaged with a pre-configured `vercel.json` routing layer for instant serverless cloud deployment.

---

## 🛠️ Tech Stack

### Frontend (User Interface)
*   **React 18**: Dynamic component-driven interface with stateful hooks (`useState`, `useEffect`, `useRef`).
*   **Babel Standalone**: Browser-side JSX compilation for a simplified, zero-bundler setup.
*   **Vanilla CSS3**: Custom dark-themed institutional layout utilizing fluid CSS variables, CSS grid layouts, glassmorphism transitions, and responsive scrolls.
*   **TradingView Widget**: Advanced technical analysis charting engine.

### Backend (APIs & Calculations)
*   **Python 3.14**: Performance-optimized core programming environment.
*   **Flask Framework**: Lightweight REST API endpoints for user sessions, stock searches, batch pricing, and trade executions.
*   **YFinance & Pandas**: Data analysis and retrieval toolkit used to download and parse multi-index stock metrics.

---

## 📂 Project Directory Structure

```text
Nivarya_Setu/
├── src/
│   ├── app.py              # Central Flask Server, QuoteCache, and Order Routing
│   └── platform/           # Frontend Application Code
│       ├── index.html      # Main shell with TradingView & FontAwesome libraries
│       ├── style.css       # Bespoke Dark Institutional Design System (CSS)
│       └── app.jsx         # React UI Components, Debounce Search, & State Manager
├── vercel.json             # Vercel Serverless Function rewrites & routing configuration
├── requirements.txt        # Backend dependencies (Flask, yfinance, pandas, etc.)
└── Readme.md               # End-to-end Project Documentation
```

---

## 💻 Local Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/medhinibr/Nivarya_Setu.git
    cd Nivarya_Setu
    ```

2.  **Set up Virtual Environment**:
    Create a clean isolated environment (recommended Python 3.10+):
    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    ```

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Server**:
    ```bash
    python src/app.py
    ```
    Open your browser and navigate to `http://127.0.0.1:5000/`.

---

## ☁️ Vercel Cloud Deployment

This repository is pre-configured to deploy directly to Vercel as a Python serverless app.

1.  Import your GitHub repository into the **Vercel Dashboard**.
2.  Leave all **Build and Output Settings** as default (Vercel automatically detects `requirements.txt` and runs `pip install`).
3.  Leave the **Environment Variables** empty (no keys or card details needed).
4.  Click **Deploy**!

---

## 🔐 Security & Simulation Mode
*   **Authentication**: The login screen is a simulation. You can login using any email/password combination (pre-filled default: `demo@pro.com` / `demo123`).
*   **No Card Requirements**: The app is designed to be completely free, relying only on free public API scraping via `yfinance`.
