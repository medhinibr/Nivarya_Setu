# Nivarya Setu: Advanced Stock Market Simulation Platform

Nivarya Setu is a high-fidelity, real-time paper trading and stock market simulation platform. It is engineered to emulate the operational structures, order execution pipelines, and user experience of leading modern retail brokerage terminals (such as Zerodha and Groww). The platform allows users to analyze market trends, execute equity transactions, track portfolio performance, and compete in global leaderboards using simulated capital based on live stock market data.

The project features a decoupled architecture combining a Python/Flask REST API backend with a dynamic single-page React frontend.

---

## Technical Architecture

The platform architecture divides user interface rendering, real-time data fetching, and state persistence:

```
[React Frontend] (SPA Client)
        │
        ├── (HTTP REST Requests) ──> [Flask API Backend] 
        │                                  │
        │                                  ├── (Batch Quotes & Scrapes) ──> [yfinance API]
        │                                  │
        │                                  └── (Database Queries) ──> [Supabase Cloud PostgreSQL]
        │
        └── (Embedded Embeds) ──> [TradingView Charting Widget]
```

### 1. Frontend System Design
The frontend is a single-page application built on React 18, delivered without complex webpack/bundling steps through Babel Standalone JSX compilation.
*   **Design System & UI Theme**: Implements an institutional dark-mode interface styled using custom CSS3 variables (`--bg-main`, `--bg-panel`, `--green`, `--red`, `--border`). The layout uses CSS Grid and Flexbox grids to ensure structural integrity across varied viewport sizes.
*   **Micro-Animations**: Features smooth interactive animations, hover states, and state-transition curves to mimic premium desktop trading applications.
*   **Component Architecture**:
    *   **LandingPage**: The entry interface containing a Hero section ("Master the Stock Market without losing Real Money"), a clear call-to-action to initialize trading with ₹1,00,000, and a three-column value proposition section ("Real-time Data", "Zero Risk", "Compete with Friends").
    *   **AuthPage**: A secure credential portal utilizing Supabase Auth to handle email-and-password registration and login requests.
    *   **TradingDesk (Main Dashboard)**: The workspace container displaying:
        *   **Top Ticker Tape**: A scrolling ticker tracking current indexes (NIFTY 50, SENSEX, BANKNIFTY) along with daily percentage gains and losses.
        *   **Watchlist Panel**: A curated and custom sidebar tracking symbol listings, percentage changes, interactive trend sparklines, and quick-add actions.
        *   **TradingView Charting Panel**: An embedded iframe utilizing the TradingView Widget API to render interactive technical stock charts with timeline tools and custom drawing instruments.
        *   **Order Ticket Modal**: Configures transaction variables, supporting Intraday (MIS) and Delivery (CNC) product types, computing margin requirements, and calculating total order valuations.
        *   **Portfolio Ledger**: Dynamically tracks active stock holdings, average buy prices, live last-traded-price updates, and real-time Profit and Loss (P&L) tracking. It also tracks the total realized orders history database.
        *   **Today's Market Action**: Displays a ranked list of the top 5 gainers and losers from liquid Nifty 50 stocks.
        *   **Market Screener**: Provides sorting options based on price filters, percentage changes, and technical indicator metrics like RSI.
        *   **Investment Hub**: Allows users to view and request placements in thematic stock cases, Mutual Funds, and Initial Public Offerings (IPOs).
        *   **Global Leaderboard**: Generates real-time rankings of participants ordered by net worth calculations.
        *   **Legal Compliance Views**: Embedded routes for Privacy, Terms of Service, Risk Disclosures, and Refund Policies.

### 2. Backend System Design
The Flask backend provides routes for authentication, watchlist synchronization, real-time market data requests, and order routing calculations.
*   **Quote Cache (QuoteCache)**: An in-memory cache utilizing a `threading.Lock` concurrency manager to prevent data scraping rate limits. Requests are served from cache if within a 15-second Time-To-Live (TTL) limit; otherwise, the server triggers batch requests to the yfinance API.
*   **Market Hour Verification**: Integrates `pytz` to track trade times under Indian Standard Time (IST). When active, it restricts order execution to weekdays from 9:15 AM to 3:30 PM.
*   **Transactional Order Routing**: Processes buy and sell orders. It updates client cash balances and holdings tables using Supabase query transactions, verifying margins and holdings volumes prior to execution.

---

## REST API Endpoints

### Authentication
*   **`POST /api/signup`**: Registers a user in Supabase Auth and seeds a user database record with ₹1,00,000 in virtual trading capital.
*   **`POST /api/login`**: Authenticates user credentials and returns session tokens and cash balances.

### Market Data
*   **`GET /api/batch_quotes?symbols=SYM1,SYM2`**: Fetches current prices and daily percentage changes for a comma-separated list of symbols.
*   **`GET /api/market_action`**: Returns the top 5 gainers and top 5 losers of the day.
*   **`GET /api/screener?filter=FILTER`**: Returns stock listings filtered by sector, gainers, losers, or RSI metrics.

### Portfolio & Orders
*   **`GET /api/portfolio?email=USER_EMAIL`**: Returns user balances, holdings collections, and order histories.
*   **`POST /api/place_order`**: Executes equity buy/sell transactions, updating balances and holdings.
*   **`POST /api/square_off`**: Closes out active intraday positions and releases margin back to the user balance.

### Watchlists
*   **`GET /api/watchlist?email=USER_EMAIL`**: Returns watchlist items synced from the database.
*   **`POST /api/watchlist/add`**: Adds a symbol to the user's cloud watchlist database.
*   **`POST /api/watchlist/remove`**: Deletes a symbol from the user's cloud watchlist database.

### Rankings & Investments
*   **`GET /api/leaderboard`**: Computes Net Worth calculations (`Cash Balance + Holdings Valuation`) across users to return top rankings.
*   **`GET /api/baskets`**, `/api/invest/ipos`, `/api/invest/mutual_funds`: Returns lists of active IPOs, mutual funds, and thematic stock cases.

---

## Database Schema (PostgreSQL)

The platform is designed around four relational tables:

### 1. users
Manages account registry and available funds.
*   `email` (Text, Primary Key): Unique email address.
*   `name` (Text): Display profile name.
*   `virtual_balance` (Numeric, default: 100000.00): Available cash balance.

### 2. portfolio
Tracks equities currently owned by users.
*   `id` (BigInt, Primary Key, Auto-Increment).
*   `user_email` (Text, Foreign Key referencing `users.email`).
*   `symbol` (Text): Equities ticker name (e.g. TCS.NS).
*   `quantity` (Numeric): Active volume owned.
*   `avg_price` (Numeric): Average cost basis.
*   `product` (Text): CNC (Delivery) or MIS (Intraday).

### 3. orders
Audit ledger of completed transactions.
*   `id` (BigInt, Primary Key, Auto-Increment).
*   `user_email` (Text, Foreign Key referencing `users.email`).
*   `symbol` (Text): Equities ticker.
*   `type` (Text): Transaction side (BUY or SELL).
*   `qty` (Integer): Volume transacted.
*   `price` (Numeric): Execution share price.
*   `timestamp` (Text): Date and time of execution.
*   `product` (Text): CNC or MIS.
*   `status` (Text): Order status (COMPLETE, REJECTED).

### 4. watchlist
Saves personalized watchlists.
*   `id` (BigInt, Primary Key, Auto-Increment).
*   `user_email` (Text, Foreign Key referencing `users.email`).
*   `symbol` (Text): Target equities ticker.

---

## Installation and Local Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/medhinibr/Nivarya_Setu.git
    cd Nivarya_Setu
    ```

2.  **Configure Virtual Environment**:
    Create a clean Python virtual environment:
    ```bash
    python -m venv venv
    ```
    Activate the environment:
    *   **Windows (PowerShell)**:
        ```powershell
        .\venv\Scripts\Activate.ps1
        ```
    *   **macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set Up Configuration**:
    Create a `.env` file in the root directory:
    ```env
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_anon_key
    ENFORCE_MARKET_HOURS=False
    ```

5.  **Run Server**:
    ```bash
    python src/app.py
    ```
    Open your browser and navigate to `http://127.0.0.1:5000/`.

---

## Production Deployment

The application is pre-configured to run as a serverless backend on Vercel:
*   `vercel.json` maps incoming routing requests directly to the Flask instance.
*   Vercel automatically detects `requirements.txt` and provisions the Python environment during compilation.
*   Environment variables (`SUPABASE_URL`, `SUPABASE_KEY`, `ENFORCE_MARKET_HOURS`) should be populated in the Vercel project settings dashboard.
