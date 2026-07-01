# Nivarya Setu: Advanced Stock Market Simulation Platform

Nivarya Setu is a high-performance, real-time paper trading and stock market simulation platform. It is designed to model the exact operational mechanisms of modern retail brokerage platforms, allowing users to trade equities, indices, and derivatives using real-time market data with virtual capital.

The platform is built with a decoupled architecture featuring a Python-based Flask REST API backend and a responsive single-page React frontend.

---

## Technical Architecture Overview

The application architecture separates the interface layer from database persistence and real-time market queries. 

*   **Frontend**: Single-page application using React 18 served as a static interface. It leverages Babel Standalone for in-browser JSX compilation, eliminating complex build/bundling pipelines. Technical charts are embedded via the TradingView Widget API, and custom styling is enforced using fluid CSS3 variables.
*   **Backend**: Flask REST API serving client requests, executing order routing calculations, caching financial quotes, and interfacing with a cloud PostgreSQL database.
*   **Database**: Supabase cloud PostgreSQL instance for user profile records, live portfolios, order ledgers, and synchronized watchlists.

---

## Core Technical Features

### 1. Intelligent Quote Caching (QuoteCache)
To prevent API rate limits, minimize network latency, and avoid paid data subscriptions, the backend implements a custom, thread-safe memory cache called `QuoteCache`.
*   **Concurrency Control**: Uses Python's `threading.Lock` to serialize read-write operations to the cache dictionary, ensuring thread safety during concurrent Flask requests.
*   **Time-To-Live (TTL)**: Configured with a 15-second TTL. If a cached symbol is requested within 15 seconds, the server returns the cached data instantly. If expired, it triggers a background batch download via `yfinance`.

### 2. Timezone-Aware Order Enforcement
To simulate realistic trading conditions, the order execution engine enforces official Indian Standard Time (IST) market hours.
*   **Timezone Localization**: Uses `pytz` to localize timestamps to the `Asia/Kolkata` timezone.
*   **Execution Rules**: Orders are accepted only on weekdays (Monday through Friday) between 9:15 AM and 3:30 PM IST.
*   **Dynamic Configuration**: This enforcement can be enabled or bypassed globally using the `ENFORCE_MARKET_HOURS` environment variable.

### 3. Transactional Order Execution Engine
The backend routes buy and sell orders through validation pipelines that verify account states before committing database changes:
*   **Buy Orders**: Verifies that the user's `virtual_balance` is greater than or equal to the total order value (`quantity * live_price`). If validated, the cost is deducted from the virtual balance, and holdings are updated or created.
*   **Sell Orders**: Queries the database to confirm the user owns the asset and has a sufficient quantity. If validated, the proceeds (`quantity * live_price`) are credited to the user's balance, and holdings records are updated or deleted.
*   **Atomic Transactions**: Utilizes Supabase query builders to execute updates to the `users` and `portfolio` tables, logging transaction details in the `orders` ledger.

### 4. Cloud Watchlist Synchronization
User watchlists are dynamically synchronized with the database, ensuring a seamless multi-device experience.
*   **Database Integration**: Modifying watchlist items sends POST requests to `/api/watchlist/add` and `/api/watchlist/remove`, storing configurations in the database.
*   **Fallback Resilience**: If the Supabase database is unreachable, the system automatically falls back to the client's `localStorage` and a local in-memory lookup (`PAPER_WATCHLISTS`).

### 5. Global Leaderboard
The leaderboard computes user rankings dynamically by calculating real-time Net Worth:
*   **Calculation Logic**: `Net Worth = Virtual Cash Balance + Sum(Holding Quantity * Real-Time Price)`.
*   **Fallback Mode**: In the absence of a database connection, the system populates a mock leaderboard blending the current user's performance with historically prominent stock market investors.

### 6. Today's Market Action (Gainers and Losers)
The application evaluates price changes across a list of representative liquid Nifty 50 equities, sorts them in real-time, and displays the top 5 gainers and top 5 losers in the sidebar for immediate discovery.

### 7. User Authentication
Includes secure user authentication (login and signup operations) backed by Supabase Auth:
*   **Registration**: Creates user accounts in Supabase Auth and registers them in the database, automatically seeding new portfolios with ₹1,00,000 in virtual trading capital.
*   **Login**: Validates credentials against Supabase Auth, retrieves current cash balances, and synchronizes the active user session.
*   **Robust Fallback**: Includes in-memory and local session routing to allow developer execution without requiring active Supabase cloud configurations.

---

## Technology Stack

### Backend (REST API)
*   **Python**: Core execution runtime.
*   **Flask**: REST API routing, request validation, and endpoint handlers.
*   **yfinance**: Scraping live financial market metrics from Yahoo Finance.
*   **pandas**: Formatting quote datasets and processing tabular data.
*   **Supabase Python Client**: PostgreSQL integration.
*   **pytz**: Timezone conversions.
*   **python-dotenv**: Environment variable management.

### Frontend (User Interface)
*   **React 18**: UI component model, local states, and lifecycle hooks.
*   **Babel Standalone**: In-browser JSX translation.
*   **Vanilla CSS3**: Dark mode UI design featuring glassmorphism, responsive flexbox grids, and fluid animation curves.
*   **TradingView Widget API**: Professional-grade stock charting.
*   **FontAwesome**: Vector icon library.

---

## Database Schema Design (PostgreSQL)

The platform is designed around four relational tables:

### 1. users
Stores account information and simulated cash balances.
*   `email` (Text, Primary Key): Unique identifier.
*   `name` (Text): Display name.
*   `virtual_balance` (Numeric, default: 100000.00): Current cash available to trade.

### 2. portfolio
Tracks asset holdings currently owned by each user.
*   `id` (BigInt, Primary Key, Auto-Increment).
*   `user_email` (Text, Foreign Key pointing to `users.email`).
*   `symbol` (Text): The asset ticker (e.g. RELIANCE.NS).
*   `quantity` (Numeric): Number of shares owned.
*   `avg_price` (Numeric): Average purchase price.
*   `product` (Text): Product type (CNC for delivery, MIS for intraday).

### 3. orders
Audit ledger of all transactions.
*   `id` (BigInt, Primary Key, Auto-Increment).
*   `user_email` (Text, Foreign Key pointing to `users.email`).
*   `symbol` (Text): Asset ticker.
*   `type` (Text): Transaction side (BUY or SELL).
*   `qty` (Integer): Shares transacted.
*   `price` (Numeric): Execution price.
*   `timestamp` (Text): Exact execution date and time.
*   `product` (Text): CNC or MIS.
*   `status` (Text): Order status (COMPLETE, REJECTED).

### 4. watchlist
Persists customized ticker watchlists.
*   `id` (BigInt, Primary Key, Auto-Increment).
*   `user_email` (Text, Foreign Key pointing to `users.email`).
*   `symbol` (Text): Watchlist ticker.

---

## Installation and Local Setup

Follow these steps to run the application locally in an isolated Python environment:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/medhinibr/Nivarya_Setu.git
    cd Nivarya_Setu
    ```

2.  **Initialize Virtual Environment**:
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

5.  **Start the Flask Server**:
    ```bash
    python src/app.py
    ```
    Open your browser and navigate to `http://127.0.0.1:5000/`.

---

## Deployment

The application is pre-configured to run as a serverless backend on Vercel.
*   The `vercel.json` routing configuration maps client requests directly to the Flask entrypoint.
*   Vercel automatically detects the `requirements.txt` file and installs the python dependencies on deployment.
*   Environment variables (`SUPABASE_URL`, `SUPABASE_KEY`, `ENFORCE_MARKET_HOURS`) should be populated in the Vercel project settings dashboard.
