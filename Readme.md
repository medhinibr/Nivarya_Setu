# Nivarya Setu

Nivarya Setu is trading simulation platform tailored for the Indian Stock Market. It provides a realistic environment for testing trading strategies on equities, derivatives, and mutual funds using real-time market data.

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

## Tech Stack

### Frontend
- **React.js 18**: Component-based UI logic.
- **Vanilla CSS**: Premium Institutional Dark Theme.
- **TradingView API**: Professional financial visualization.
- **Babel Standalone**: Browser-side JSX compilation for a zero-build workflow.

### Backend
- **Flask (Python)**: RESTful API and portfolio management logic.
- **YFinance**: Real-time market data fetching.
- **Firebase Auth**: Secure user authentication and Google login.

## Project Structure

```text
Binance-Trade-Bot/
├── src/
│   ├── app.py              # Flask Backend & API
│   └── platform/           # Frontend Assets
│       ├── index.html      # Main Entry Point
│       ├── style.css       # Global Styles
│       └── app.js          # React Components & Logic
├── Readme.md               # Documentation
└── requirements.txt        # Python Dependencies
```

## Installation

### Prerequisites
- Python 3.8 or higher
- Pip (Python package manager)

### Local Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/medhinibr/Binance-Trade-Bot.git
   cd Binance-Trade-Bot
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**:
   Create a `.env` file in the `src/` directory and add your keys (optional for simulation):
   ```env
   FIREBASE_API_KEY=your_actual_key_here
   ```

4. **Run the application**:
   ```bash
   python src/app.py
   ```

5. **Access the Platform**:
   Open your browser and navigate to `http://localhost:5000/`.

## Contributing
Contributions are welcome! Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Contact
For institutional inquiries or feedback, please reach out via GitHub issues.
