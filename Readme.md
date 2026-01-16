# Nivarya Setu

Nivarya Setu is a professional-grade trading simulation platform tailored for the Indian Stock Market. It provides a realistic environment for testing trading strategies on equities, derivatives, and mutual funds using real-time market data.

![Platform Status](https://img.shields.io/badge/Status-Live-green) ![Market](https://img.shields.io/badge/Market-NSE%2FBSE-blue) ![Data](https://img.shields.io/badge/Data-Real--Time-orange)

## Key Features

**Core Trading**
-   **Real-Time Data Integration**: Fetches live quotes for NSE/BSE stocks, commodities, and forex via Yahoo Finance.
-   **Professional Charting**: Integrated TradingView charts for advanced technical analysis.
-   **Order Terminal**: Supports Market, Limit, and Intraday/Delivery order types.

**Institutional Onboarding**
-   **Swift Digital Entry**: Lightning-fast, paperless registration.
-   **AI-Powered KYC**: Secure, frictionless verification process.
-   **Interactive FAQ**: Comprehensive accordion-style guide for new traders.

**Advanced Modules**
-   **Mutual Funds & SIPs**: Dedicated section to explore funds and calculate returns.
-   **F&O (Futures & Options)**: Trade derivatives with simulated margin requirements.
-   **IPO Dashboard**: Track listings and simulate IPO applications.

## Tech Stack

-   **Frontend:** 
    -   HTML5 (Single Page Architecture)
    -   React.js 18 (Functional Components)
    -   Babel Standalone (In-browser JSX compilation)
-   **Styling:** Vanilla CSS (Institutional Dark Theme)
-   **Backend:** Python (Flask Framework)
-   **Data Provider:** `yfinance` (Yahoo Finance API)
-   **Charting:** TradingView Widget
-   **Icons:** FontAwesome

## Project Structure

```bash
Nivarya-Setu/
├── src/
│   ├── app.py              # Main Flask Application Entry Point
│   └── platform/
│       ├── assets/         # High-fidelity mockups and images
│       └── index.html      # Main Single-Page React Application
├── requirements.txt        # Python Dependencies
├── README.md               # Project Documentation
├── CONTRIBUTING.md         # Contribution Guidelines
└── .gitignore              # Git Configuration
```

## Installation and Setup

Follow these steps to deploy the application locally.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/medhinibr/Binance-Trade-Bot.git
    cd Binance-Trade-Bot
    ```

2.  **Install Dependencies**
    Install the required Python libraries:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Launch the Application**
    Start the backend server:
    ```bash
    python src/app.py
    ```

4.  **Access the Platform**
    Open your web browser and navigate to:
    http://localhost:5000/

## Deployment

To deploy this application to a production environment (e.g., Render, Heroku, or Vercel):

1.  **Backend**: Deploy the Flask app (`src/app.py`) as a web service. Ensure dependencies in `requirements.txt` are installed.
2.  **Environment Variables**: Set up `FLASK_ENV=production` and any necessary API keys (like `FIREBASE_API_KEY`) in your hosting provider's dashboard.
3.  **Static Files**: The Flask app is configured to serve the React frontend (`index.html`) automatically from the root.

## Contributing

We value contributions from the open-source community. If you wish to contribute to the codebase, fix bugs, or propose new features, please consult our contribution guidelines.

Read the full guide here: [CONTRIBUTING.md](CONTRIBUTING.md)

## Contact

For any queries, feel free to reach out:

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:brmedhini@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/medhinibr)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/br-medhini)
[![Linktree](https://img.shields.io/badge/Linktree-39E09B?style=for-the-badge&logo=linktree&logoColor=white)](https://linktr.ee/brmedhini)

<p align="left">
Thank you for checking out the Nivarya Setu project! Feel free to explore and contribute.
</p>