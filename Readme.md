# Nivarya Setu: Advanced Stock Market Simulation Platform

Nivarya Setu is an institutional-grade, zero-cost paper trading simulation platform designed for capital markets. It provides a premium, low-latency interface to execute trades, build watchlists, and track simulated portfolios across equities, derivatives, commodities, and mutual funds using real-time market data.

---

## Key Features

*   **First Impression Landing Page**: An introductory landing page with a hero section ("Master the Stock Market without losing Real Money"), Call to Action (CTA) button, and detailed features cards.
*   **Top Ticker Tape**: A persistent running ticker at the top of the interface displaying real-time points and green/red percentage changes for indices like NIFTY 50, SENSEX, and BANKNIFTY.
*   **Real Market Hours & Holidays**: Restricts order placement to Indian Standard Time (IST) market hours (9:15 AM to 3:30 PM on weekdays). This behavior is controlled dynamically via the `ENFORCE_MARKET_HOURS` configuration.
*   **Cloud Watchlist Sync**: Integrates watchlist tracking with the database. Watchlist modifications (addition or deletion of symbols) are persisted in the cloud under the user's registered account.
*   **Market Action Discovery**: Periodically aggregates price changes for representative NIFTY 50 securities and displays the top 5 gainers and top 5 losers. Users can select any gainer or loser to update the technical chart.
*   **Global Leaderboard**: Implements leaderboard rankings computed from user net worth (cash balance combined with the current value of stock holdings). Falls back to mock stock market legends if Supabase is offline.
*   **100% Free & Keyless Integration**: Uses the `yfinance` API to retrieve live stock price quotes without requiring paid subscriptions, bank accounts, or API keys.
*   **Intelligent In-Memory Caching (`QuoteCache`)**: Implements a thread-safe caching system in Flask with a 15-second Time-To-Live (TTL) to optimize performance, prevent rate limiting, and provide rapid responses to the client.
*   **Global Autocomplete Search**: Interactive search bar that queries Yahoo Finance's autocomplete API in real-time, allowing users to discover and add any global stock, index, ETF, or mutual fund.
*   **Dynamic Watchlist Management**: Stateful sidebar watchlist saved to browser `localStorage` for persistence, complete with real-time price updates, sparkline visual indicators, and a clean remove-from-watchlist interaction.
*   **Automated TradingView Charts**: Dynamically formats ticker symbols to render live TradingView charts for Indian NSE/BSE stocks, global equities (NASDAQ/NYSE), index futures, and commodities.
*   **Virtual Portfolio & Risk Management**:
    *   Starts every user with **₹1,00,000 (1 Lakh)** in virtual cash.
    *   Dynamic margin validations that block orders with insufficient funds.
*   **Holdings P&L Dashboard**:
    *   Top stats cards displaying Invested Value, Current Value, Total P&L, and Today's P&L.
    *   Detailed holdings table including columns for Quantity, Average Cost, LTP, Current Value, Total P&L (absolute and percentage), and Today's P&L.
    *   Color-coded text values (green for gains, red for losses).
*   **SELL Engine (Exit Position)**:
    *   Checks ownership and quantity limits before accepting sell orders.
    *   Adds proceeds (`Live Price * Sold Shares`) back to the user's cash balance.
    *   Updates or deletes rows in the portfolio database table depending on remaining quantity.
*   **Order Book Passbook**:
    *   A ledger showing all historical transactions with exact execution timestamps, transaction type (BUY/SELL), quantity, price, and status.
    *   Badges styled with green (BUY) and red (SELL) for clarity.
*   **Vercel Serverless Ready**: Packaged with a pre-configured `vercel.json` routing layer for instant serverless cloud deployment.

---

## Tech Stack

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

## Project Directory Structure

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

## Local Installation & Setup

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

## Vercel Cloud Deployment

This repository is pre-configured to deploy directly to Vercel as a Python serverless app.

1.  Import your GitHub repository into the **Vercel Dashboard**.
2.  Leave all **Build and Output Settings** as default (Vercel automatically detects `requirements.txt` and runs `pip install`).
3.  Leave the **Environment Variables** empty (no keys or card details needed).
4.  Click **Deploy**!

---

## Security & Simulation Mode
*   **Authentication**: The login screen is a simulation. You can login using any email/password combination (pre-filled default: `demo@pro.com` / `demo123`).
*   **No Card Requirements**: The app is designed to be completely free, relying only on free public API scraping via `yfinance`.
