from flask import Flask, jsonify, request, send_from_directory
import random
from datetime import datetime, time
import threading
import time as time_mod
import os
import urllib.request
import json
import yfinance as yf
import pandas as pd
from supabase import create_client, Client
import pytz

from dotenv import load_dotenv

# Load .env manually from current directory with force override
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path, override=True)

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

# Remove /rest/v1/ suffix if present to prevent PGRST125 invalid path error
if supabase_url and "/rest/v1" in supabase_url:
    supabase_url = supabase_url.split("/rest/v1")[0]

print(f"DEBUG: URL is {supabase_url}")
if supabase_key:
    print(f"DEBUG: KEY starts with {supabase_key[:10]}...")

supabase = None
if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
    except Exception as e:
        print(f"Supabase Client Init Error: {e}")




YF_MAP = {
    'RELIANCE.NS': 'RELIANCE.NS',
    'TCS.NS': 'TCS.NS',
    'HDFCBANK.NS': 'HDFCBANK.NS',
    'INFY.NS': 'INFY.NS',
    'SBIN.NS': 'SBIN.NS',
    'TATAMOTORS.NS': 'TATAMOTORS.NS',
    'ITC.NS': 'ITC.NS',
    'ICICIBANK.NS': 'ICICIBANK.NS',
    'NIFTY 25OCT FUT': '^NSEI',
    'BANKNIFTY 25OCT FUT': '^NSEBANK',
    'GOLD 05OCT FUT': 'GC=F',
    'USDINR 27SEP FUT': 'INR=X',
    'EURINR 27SEP FUT': 'EURINR=X',
    'GBPINR 27SEP FUT': 'GBPINR=X'
}

class QuoteCache:
    def __init__(self, ttl_seconds=15):
        self.ttl = ttl_seconds
        self.cache = {} # maps symbol -> {price, change, timestamp}
        self.lock = threading.Lock()

    def get_quotes(self, symbols):
        with self.lock:
            now = time.time()
            missing_or_expired = []
            for sym in symbols:
                if not sym:
                    continue
                if sym not in self.cache or (now - self.cache[sym]['timestamp']) > self.ttl:
                    missing_or_expired.append(sym)
            
            if missing_or_expired:
                # Map simulation symbols to yFinance tickers
                yf_symbols = []
                symbol_map = {}
                for sym in missing_or_expired:
                    yf_sym = YF_MAP.get(sym, sym)
                    yf_symbols.append(yf_sym)
                    symbol_map[yf_sym] = sym
                
                try:
                    # Download 2 days of data to compute percent change
                    data = yf.download(yf_symbols, period="2d", group_by='ticker', progress=False)
                    
                    for yf_sym in yf_symbols:
                        sym = symbol_map[yf_sym]
                        ticker_df = None
                        
                        if isinstance(data.columns, pd.MultiIndex):
                            if yf_sym in data.columns.levels[0]:
                                ticker_df = data[yf_sym].dropna()
                        else:
                            ticker_df = data.dropna()
                        
                        if ticker_df is not None and not ticker_df.empty:
                            last_row = ticker_df.iloc[-1]
                            price = float(last_row['Close'])
                            if len(ticker_df) >= 2:
                                prev_close = float(ticker_df.iloc[-2]['Close'])
                            else:
                                prev_close = float(last_row.get('Open', price))
                            
                            change = ((price - prev_close) / prev_close) * 100 if prev_close != 0 else 0.0
                            self.cache[sym] = {
                                "price": round(price, 2),
                                "change": round(change, 2),
                                "timestamp": now
                            }
                        else:
                            # Fallback if ticker not found or empty
                            if sym not in self.cache:
                                base = mock_defaults.get(sym, 500.0)
                                self.cache[sym] = {
                                    "price": base,
                                    "change": 0.0,
                                    "timestamp": now
                                }
                except Exception as e:
                    print(f"Error fetching quotes from Yahoo Finance: {e}")
                    # Set temporary fallback values so we don't crash
                    for sym in missing_or_expired:
                        if sym not in self.cache:
                            base = mock_defaults.get(sym, 500.0)
                            self.cache[sym] = {
                                "price": base,
                                "change": 0.0,
                                "timestamp": now
                            }
            
            return {sym: {"price": self.cache[sym]['price'], "change": self.cache[sym]['change']} for sym in symbols if sym in self.cache}

quote_cache = QuoteCache(ttl_seconds=15)


app = Flask(__name__, static_folder='platform', static_url_path='')

@app.route('/api/config')
def get_config():
    return jsonify({
        "firebase": {
            "apiKey": os.environ.get("FIREBASE_API_KEY", "your_api_key"),
            "authDomain": "futurex-trading-bcd05.firebaseapp.com",
            "projectId": "futurex-trading-bcd05",
            "storageBucket": "futurex-trading-bcd05.firebasestorage.app",
            "messagingSenderId": "22335494160",
            "appId": "1:22335494160:web:c292b4f13736785aa9d295",
            "measurementId": "G-SBEMZN69SZ"
        }
    })

# MOCK DATA
mock_defaults = {
    # Equities
    'RELIANCE.NS': 2450.00, 'TCS.NS': 3240.00, 'HDFCBANK.NS': 1650.00,
    'INFY.NS': 1420.00, 'SBIN.NS': 580.00, 'TATAMOTORS.NS': 980.00,
    'ITC.NS': 430.00, 'ICICIBANK.NS': 950.00,
    
    # F&O - Futures
    'NIFTY 25OCT FUT': 19650.00,
    'BANKNIFTY 25OCT FUT': 44500.00,
    
    # F&O - Options (Nifty)
    'NIFTY 19500 CE': 145.50,
    'NIFTY 19500 PE': 85.20,
    'NIFTY 19600 CE': 88.00,
    'NIFTY 19600 PE': 120.50,
    
    # F&O - Options (BankNifty)
    'BANKNIFTY 44000 CE': 320.00,
    'BANKNIFTY 44000 PE': 180.00,
    
    # COMMODITIES (MCX)
    'GOLD 05OCT FUT': 59500.00,
    'SILVER 05SEP FUT': 74200.00,
    'CRUDEOIL 19SEP FUT': 7150.00,
    
    # CURRENCY (CDS)
    'USDINR 27SEP FUT': 83.15,
    'EURINR 27SEP FUT': 89.40,
    'GBPINR 27SEP FUT': 104.50,
}

# --- STATE ---
PAPER_STATE = {
    "funds": 100000.00,
    "holdings": [],
    "positions": {}, 
    "orders": [],
    "transactions": [
        {"id": 1, "time": "2023-10-01 10:00:23", "desc": "Account Opened", "type": "SYSTEM", "amount": 0, "bal": 0},
        {"id": 2, "time": "2023-10-01 10:05:45", "desc": "Welcome Bonus Funds", "type": "DEPOSIT", "amount": 100000.00, "bal": 100000.00}
    ]
}

#  INVESTMENT MOCK DATA 
MOCK_BASKETS = [
    {
        "id": "b1", "name": "IT Giants", "desc": "Top 3 Indian IT companies", "min_amt": 5000, 
        "stocks": [{"symbol": "TCS.NS", "weight": "40%"}, {"symbol": "INFY.NS", "weight": "35%"}, {"symbol": "WIPRO.NS", "weight": "25%"}]
    },
    {
        "id": "b2", "name": "Banking Titans", "desc": "Leading private sector banks", "min_amt": 8000,
        "stocks": [{"symbol": "HDFCBANK.NS", "weight": "50%"}, {"symbol": "ICICIBANK.NS", "weight": "50%"}]
    },
    {
        "id": "b3", "name": "EV Future", "desc": "Companies driving the EV revolution", "min_amt": 3500,
        "stocks": [{"symbol": "TATAMOTORS.NS", "weight": "60%"}, {"symbol": "RELIANCE.NS", "weight": "40%"}]
    }
]

MOCK_IPOS = [
    {"name": "Tata Technologies", "price_band": "475-500", "status": "OPEN", "close_date": "18 Sep"},
    {"name": "Mamaearth", "price_band": "308-324", "status": "UPCOMING", "close_date": "25 Sep"},
    {"name": "IdeaForge", "price_band": "638-672", "status": "CLOSED", "close_date": "10 Aug"}
]

MOCK_MFS = [
    {"name": "HDFC Mid-Cap Opportunities", "nav": 124.5, "cagr_3y": "28.5%", "min_sip": 500},
    {"name": "SBI Small Cap Fund", "nav": 156.8, "cagr_3y": "32.1%", "min_sip": 500},
    {"name": "Parag Parikh Flexi Cap", "nav": 65.4, "cagr_3y": "22.4%", "min_sip": 1000},
    {"name": "Axis Bluechip Fund", "nav": 52.1, "cagr_3y": "14.2%", "min_sip": 500}
]

MOCK_BONDS = [
    {"name": "SGB 2023-24 Series II", "yield": "2.50% pa", "price": 5923, "maturity": "2031"},
    {"name": "7.54% GS 2036", "yield": "7.54%", "price": 100.25, "maturity": "2036"},
    {"name": "REC Ltd Tax Free Bond", "yield": "4.80%", "price": 1150, "maturity": "2027"}
]

@app.route('/')
def home():
    return send_from_directory('platform', 'index.html')

@app.route('/api/login', methods=['POST'])
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')

        if not email:
            return jsonify({"status": "error", "message": "Email is required"}), 400

        # Step A: Check database for email if Supabase client is initialized
        if supabase:
            response = supabase.table('users').select('*').eq('email', email).execute()

            # Step B: User already exists, return data
            if len(response.data) > 0:
                user_data = response.data[0]
                # Sync local PAPER_STATE funds
                PAPER_STATE['funds'] = float(user_data.get('virtual_balance', 100000.0))
                return jsonify({
                    "status": "success",
                    "message": "Login successful",
                    "user": {
                        "name": email.split('@')[0],
                        "email": email,
                        "virtual_balance": float(user_data.get('virtual_balance', 100000.0))
                    }
                }), 200
            
            # Step C: New user, insert into DB
            else:
                new_user = {
                    "email": email,
                    "virtual_balance": 100000.0
                }
                insert_response = supabase.table('users').insert(new_user).execute()
                user_data = insert_response.data[0]
                PAPER_STATE['funds'] = 100000.0
                return jsonify({
                    "status": "success",
                    "message": "New account created",
                    "user": {
                        "name": email.split('@')[0],
                        "email": email,
                        "virtual_balance": 100000.0
                    }
                }), 201
        else:
            # Fallback to local memory simulation
            PAPER_STATE['funds'] = 100000.0
            return jsonify({
                "status": "success",
                "message": "Login successful (Simulation)",
                "user": {
                    "name": email.split('@')[0],
                    "email": email,
                    "virtual_balance": 100000.0
                }
            }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    return jsonify({"status": "success", "message": "User registered"})

@app.route('/api/user/update', methods=['POST'])
def update_user():
    data = request.json
    # In a real app, this would update DB. Here we just echo back success.
    return jsonify({"status": "success", "message": "Profile updated successfully"})

@app.route('/api/invest/ipos')
def get_ipos(): return jsonify(MOCK_IPOS)

@app.route('/api/invest/mutual_funds')
def get_mfs(): return jsonify(MOCK_MFS)

@app.route('/api/invest/bonds')
def get_bonds(): return jsonify(MOCK_BONDS)

@app.route('/api/baskets')
def get_baskets(): return jsonify(MOCK_BASKETS)

@app.route('/api/place_basket', methods=['POST'])
def place_basket():
    data = request.json
    basket_id = data.get('basket_id')
    basket = next((b for b in MOCK_BASKETS if b['id'] == basket_id), None)
    
    if not basket:
        return jsonify({"status": "error", "message": "Basket not found"}), 404
        
    if PAPER_STATE['funds'] < basket['min_amt']:
        return jsonify({"status": "error", "message": "Insufficient funds to buy this basket"}), 400
        
    PAPER_STATE['funds'] -= basket['min_amt']
    # Record transaction
    PAPER_STATE['transactions'].append({
        "id": f"txn_{len(PAPER_STATE['transactions'])+1}",
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "type": "BASKET_BUY",
        "amount": -basket['min_amt'],
        "bal": PAPER_STATE['funds'],
        "desc": f"Bought Basket: {basket['name']}"
    })
    
    return jsonify({"status": "success", "message": f"Successfully invested in {basket['name']}!"})

@app.route('/api/invest/mf/sip', methods=['POST'])
def start_sip():
    data = request.json
    name = data.get('name')
    PAPER_STATE['transactions'].append({
        "id": f"txn_{len(PAPER_STATE['transactions'])+1}",
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "type": "SIP_START",
        "amount": 0,
        "bal": PAPER_STATE['funds'],
        "desc": f"SIP started for {name}"
    })
    return jsonify({"status": "success", "message": f"SIP for {name} started successfully"})

@app.route('/api/invest/ipo/apply', methods=['POST'])
def apply_ipo():
    data = request.json
    name = data.get('name')
    PAPER_STATE['transactions'].append({
        "id": f"txn_{len(PAPER_STATE['transactions'])+1}",
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "type": "IPO_APP",
        "amount": 0, 
        "bal": PAPER_STATE['funds'],
        "desc": f"Applied for IPO: {name}"
    })
    return jsonify({"status": "success", "message": f"Application for {name} submitted"})

@app.route('/api/invest/bond/buy', methods=['POST'])
def buy_bond():
    data = request.json
    name = data.get('name')
    price = data.get('price', 0)
    if PAPER_STATE['funds'] < price:
        return jsonify({"status": "error", "message": "Insufficient funds"}), 400
    PAPER_STATE['funds'] -= price
    PAPER_STATE['transactions'].append({
        "id": f"txn_{len(PAPER_STATE['transactions'])+1}",
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "type": "BOND_BUY",
        "amount": -price,
        "bal": PAPER_STATE['funds'],
        "desc": f"Purchased Bond: {name}"
    })
    return jsonify({"status": "success", "message": f"Invested in {name} successfully"})


# SCREENER DATA
SCREENER_DATA = [
    {"symbol": "RELIANCE.NS", "sector": "Energy", "price": 2450, "change": 1.2, "rsi": 65, "pe": 24.5, "volume": "High"},
    {"symbol": "TCS.NS", "sector": "IT", "price": 3240, "change": -0.5, "rsi": 42, "pe": 29.1, "volume": "Medium"},
    {"symbol": "HDFCBANK.NS", "sector": "Banking", "price": 1650, "change": 0.8, "rsi": 58, "pe": 19.8, "volume": "High"},
    {"symbol": "INFY.NS", "sector": "IT", "price": 1420, "change": -1.2, "rsi": 35, "pe": 22.4, "volume": "Medium"},
    {"symbol": "ITC.NS", "sector": "FMCG", "price": 430, "change": 0.5, "rsi": 72, "pe": 26.0, "volume": "High"},
    {"symbol": "TATAMOTORS.NS", "sector": "Auto", "price": 620, "change": 2.5, "rsi": 78, "pe": 45.0, "volume": "Very High"},
    {"symbol": "ADANIENT.NS", "sector": "Energy", "price": 2500, "change": -3.5, "rsi": 28, "pe": 85.0, "volume": "High"},
    {"symbol": "BAJFINANCE.NS", "sector": "Finance", "price": 7200, "change": 1.1, "rsi": 62, "pe": 35.0, "volume": "Medium"},
]

@app.route('/api/screener')
def get_screener():
    filter_type = request.args.get('filter', 'ALL')
    data = SCREENER_DATA
    
    if filter_type == 'TOP_GAINERS':
        data = [s for s in SCREENER_DATA if s['change'] > 0]
    elif filter_type == 'TOP_LOSERS':
        data = [s for s in SCREENER_DATA if s['change'] < 0]
    elif filter_type == 'RSI_OVERBOUGHT':
        data = [s for s in SCREENER_DATA if s['rsi'] > 70]
    elif filter_type == 'RSI_OVERSOLD':
        data = [s for s in SCREENER_DATA if s['rsi'] < 30]
        
    return jsonify(data)

@app.route('/api/generate_key', methods=['POST'])
def generate_key():
    import uuid
    return jsonify({"key": f"ik_{str(uuid.uuid4())[:16]}", "secret": f"is_{str(uuid.uuid4())[:16]}"})

@app.route('/api/batch_quotes')
def get_batch_quotes():
    symbols = [s for s in request.args.get('symbols', '').split(',') if s]
    quotes = quote_cache.get_quotes(symbols)
    
    response_map = {}
    for sym in symbols:
        if sym in quotes:
            response_map[sym] = {
                "price": quotes[sym]['price'],
                "change": quotes[sym]['change']
            }
        else:
            base = mock_defaults.get(sym, 500.0)
            response_map[sym] = {"price": base, "change": 0.0}

    # Add indices (Nifty 50 and Bank Nifty)
    index_quotes = quote_cache.get_quotes(['NIFTY 25OCT FUT', 'BANKNIFTY 25OCT FUT'])
    nifty_price = index_quotes.get('NIFTY 25OCT FUT', {}).get('price', 19500.0)
    nifty_chg = index_quotes.get('NIFTY 25OCT FUT', {}).get('change', 0.0)
    bank_price = index_quotes.get('BANKNIFTY 25OCT FUT', {}).get('price', 44000.0)
    bank_chg = index_quotes.get('BANKNIFTY 25OCT FUT', {}).get('change', 0.0)
    
    response_map['indices'] = {
        "NIFTY": {"price": nifty_price, "chg": nifty_chg},
        "BANKNIFTY": {"price": bank_price, "chg": bank_chg}
    }

    return jsonify(response_map)

def get_mock_depth(price):
    price = float(price)
    bids = []
    asks = []
    for i in range(1, 6):
        spread = price * 0.0005 * i
        qty_base = int(10000 / price) if price > 0 else 100
        bids.append({"price": round(price - spread, 2), "qty": random.randint(1, 10) * qty_base, "orders": random.randint(1, 20)})
        asks.append({"price": round(price + spread, 2), "qty": random.randint(1, 10) * qty_base, "orders": random.randint(1, 20)})
    return {"bids": bids, "asks": asks, "total_bid": sum(b['qty'] for b in bids), "total_ask": sum(a['qty'] for a in asks)}

@app.route('/api/market_depth')
def market_depth_api():
    sym = request.args.get('symbol', 'RELIANCE.NS')
    quotes = quote_cache.get_quotes([sym])
    curr = quotes.get(sym, {}).get('price', mock_defaults.get(sym, 2500.0))
    return jsonify(get_mock_depth(curr))

@app.route('/api/funds/history')
def get_funds_history():
    return jsonify(PAPER_STATE['transactions'][::-1])

@app.route('/api/portfolio')
def get_portfolio():
    email = request.args.get('email')
    
    # If Supabase client is initialized and email is provided, query from database
    if supabase and email:
        try:
            # 1. Fetch user balance
            user_res = supabase.table('users').select('*').eq('email', email).execute()
            funds = 100000.0
            if user_res.data:
                funds = float(user_res.data[0].get('virtual_balance', 100000.0))
                
            # 2. Fetch holdings from portfolio table
            portfolio_res = supabase.table('portfolio').select('*').eq('user_email', email).execute()
            holdings = []
            holding_syms = []
            for item in portfolio_res.data:
                sym = item.get('symbol')
                qty = float(item.get('quantity', 0))
                avg_price = float(item.get('average_price', 0))
                if qty > 0:
                    holdings.append({
                        "symbol": sym,
                        "qty": qty,
                        "avg": avg_price,
                        "ltp": avg_price,
                        "type": "CNC",
                        "value": qty * avg_price,
                        "pnl": 0.0,
                        "pnl_pct": 0.0
                    })
                    holding_syms.append(sym)
            
            # Fetch batch quotes to update current price (LTP) and PNL
            quotes = quote_cache.get_quotes(holding_syms) if holding_syms else {}
            total_val = funds
            total_invested = 0.0
            today_pnl = 0.0
            for h in holdings:
                sym = h['symbol']
                quote = quotes.get(sym, {})
                current_price = quote.get('price', h['avg'])
                change = quote.get('change', 0.0)
                
                h['ltp'] = round(current_price, 2)
                h['value'] = round(current_price * h['qty'], 2)
                h['pnl'] = round(h['value'] - (h['avg'] * h['qty']), 2)
                h['pnl_pct'] = round((h['pnl'] / (h['avg'] * h['qty'])) * 100, 2) if h['avg'] != 0 else 0.0
                
                prev_close = current_price / (1.0 + (change / 100.0)) if change != -100.0 else current_price
                h['day_change'] = round(change, 2)
                h['day_pnl'] = round(h['qty'] * (current_price - prev_close), 2)
                
                total_invested += h['avg'] * h['qty']
                total_val += h['value']
                today_pnl += h['day_pnl']

            # 3. Fetch orders (transactions)
            tx_res = supabase.table('transactions').select('*').eq('user_email', email).execute()
            orders = []
            
            # Sort locally since ordering might need specific field index
            sorted_txs = sorted(tx_res.data, key=lambda x: x.get('created_at', ''), reverse=True)
            for tx in sorted_txs:
                created_at = tx.get('created_at', '')
                if created_at:
                    try:
                        time_str = created_at.split('T')[1].split('.')[0]
                    except:
                        time_str = datetime.now().strftime("%H:%M:%S")
                else:
                    time_str = datetime.now().strftime("%H:%M:%S")
                
                orders.append({
                    "time": time_str,
                    "symbol": tx.get('symbol'),
                    "type": tx.get('order_type'),
                    "product": "CNC",
                    "qty": float(tx.get('quantity', 0)),
                    "price": float(tx.get('price', 0)),
                    "status": "COMPLETE"
                })

            return jsonify({
                "funds": round(funds, 2),
                "holdings": holdings,
                "positions": [], 
                "orders": orders,
                "total_value": round(total_val, 2),
                "invested_val": round(total_invested, 2),
                "current_val": round(total_val - funds, 2),
                "total_pnl": round(sum(h['pnl'] for h in holdings), 2),
                "today_pnl": round(today_pnl, 2)
            })

        except Exception as e:
            print(f"Error fetching portfolio from Supabase: {e}")
            pass

    # Fallback to local memory simulation (PAPER_STATE)
    total_val = PAPER_STATE['funds']
    total_invested = 0.0
    today_pnl = 0.0
    holding_syms = [h['symbol'] for h in PAPER_STATE['holdings']]
    position_syms = list(PAPER_STATE['positions'].keys())
    all_syms = list(set(holding_syms + position_syms))
    
    quotes = quote_cache.get_quotes(all_syms) if all_syms else {}
    
    for h in PAPER_STATE['holdings']:
        sym = h['symbol']
        quote = quotes.get(sym, {})
        current_price = quote.get('price', h['avg'])
        change = quote.get('change', 0.0)
        
        h['ltp'] = round(current_price, 2)
        h['value'] = round(h['ltp'] * h['qty'], 2)
        h['pnl'] = round(h['value'] - (h['avg'] * h['qty']), 2)
        h['pnl_pct'] = round((h['pnl'] / (h['avg'] * h['qty'])) * 100, 2) if h['avg'] != 0 else 0.0
        
        prev_close = current_price / (1.0 + (change / 100.0)) if change != -100.0 else current_price
        h['day_change'] = round(change, 2)
        h['day_pnl'] = round(h['qty'] * (current_price - prev_close), 2)
        
        total_invested += h['avg'] * h['qty']
        total_val += h['value']
        today_pnl += h['day_pnl']

    pos_list = []
    total_pos_pnl = 0.0
    for sym, pos in PAPER_STATE['positions'].items():
        if pos['qty'] != 0:
            quote = quotes.get(sym, {})
            current_price = quote.get('price', pos['avg'])
            change = quote.get('change', 0.0)
            
            mtm = (current_price - pos['avg']) * pos['qty']
            pos_entry = {
                "symbol": sym, "qty": pos['qty'], "avg": pos['avg'], 
                "ltp": round(current_price, 2), "pnl": round(mtm, 2), "product": "MIS"
            }
            pos_list.append(pos_entry)
            total_pos_pnl += mtm

    return jsonify({
        "funds": round(PAPER_STATE['funds'], 2),
        "holdings": PAPER_STATE['holdings'],
        "positions": pos_list, 
        "orders": PAPER_STATE['orders'][::-1],
        "total_value": round(total_val + total_pos_pnl, 2),
        "invested_val": round(total_invested, 2),
        "current_val": round(total_val - PAPER_STATE['funds'], 2),
        "total_pnl": round(total_pos_pnl + sum(h['pnl'] for h in PAPER_STATE['holdings']), 2),
        "today_pnl": round(today_pnl, 2)
    })

@app.route('/api/search')
def search_tickers():
    import urllib.parse
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={urllib.parse.quote(query)}&newsCount=0"
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            quotes = data.get('quotes', [])
            results = []
            for q in quotes:
                quote_type = q.get('quoteType')
                if quote_type in ['EQUITY', 'ETF', 'INDEX', 'MUTUALFUND']:
                    results.append({
                        "symbol": q.get('symbol'),
                        "name": q.get('shortname') or q.get('longname') or q.get('symbol'),
                        "exchange": q.get('exchange')
                    })
            return jsonify(results[:8])
    except Exception as e:
        print("Search API error:", e)
        return jsonify([])


@app.route('/api/add_funds', methods=['POST'])
def add_funds():
    data = request.json
    amt = float(data.get('amount', 0))
    PAPER_STATE['funds'] += amt
    
    # Ledger Entry
    PAPER_STATE['transactions'].append({
        "id": f"txn_{len(PAPER_STATE['transactions'])+1}",
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "type": "DEPOSIT",
        "amount": amt,
        "bal": PAPER_STATE['funds'],
        "desc": "Funds Added via UPI"
    })
    
    # Sync to Supabase
    email = data.get('email')
    if supabase and email:
        try:
            supabase.table('users').update({"virtual_balance": PAPER_STATE['funds']}).eq('email', email).execute()
        except Exception as e:
            print(f"Failed to sync add_funds to Supabase: {e}")
            
    return jsonify({"status": "success", "new_balance": PAPER_STATE['funds']})

@app.route('/api/place_order', methods=['POST'])
def place_order():
    try:
        data = request.json
        
        # Check market hours if ENFORCE_MARKET_HOURS is True
        ENFORCE_MARKET_HOURS = os.environ.get('ENFORCE_MARKET_HOURS', 'False').lower() == 'true'
        if ENFORCE_MARKET_HOURS:
            ist = pytz.timezone('Asia/Kolkata')
            now = datetime.now(ist)
            if now.weekday() >= 5: # 5=Saturday, 6=Sunday
                return jsonify({"status": "error", "message": "Market is currently closed. Please place orders between 9:15 AM and 3:30 PM on weekdays."}), 400
            current_time = now.time()
            if current_time < time(9, 15) or current_time > time(15, 30):
                return jsonify({"status": "error", "message": "Market is currently closed. Please place orders between 9:15 AM and 3:30 PM on weekdays."}), 400

        email = data.get('email')
        symbol = data.get('symbol')
        side = (data.get('order_type') or data.get('side') or 'BUY').upper()
        qty = float(data.get('quantity') or data.get('qty') or 0)
        price = float(data.get('price') or 0)
        product = data.get('product', 'CNC')

        if qty <= 0:
            return jsonify({"status": "error", "message": "Quantity must be greater than zero"}), 400

        total_value = qty * price

        # If Supabase client is initialized and email is provided
        if supabase and email:
            # 1. Fetch user balance
            user_res = supabase.table('users').select('*').eq('email', email).execute()
            if not user_res.data:
                return jsonify({"status": "error", "message": "User not found in database"}), 404
            
            user_data = user_res.data[0]
            current_balance = float(user_data.get('virtual_balance', 100000.0))

            if side == 'BUY':
                if current_balance < total_value:
                    return jsonify({"status": "error", "message": f"Insufficient funds. Required: ₹{total_value:.2f}, Available: ₹{current_balance:.2f}"}), 400
                
                new_balance = current_balance - total_value
                
                # Update user balance
                supabase.table('users').update({'virtual_balance': new_balance}).eq('email', email).execute()

                # Record transaction
                supabase.table('transactions').insert({
                    'user_email': email,
                    'symbol': symbol,
                    'order_type': 'BUY',
                    'quantity': qty,
                    'price': price
                }).execute()

                # Update portfolio (holdings)
                port_res = supabase.table('portfolio').select('*').eq('user_email', email).eq('symbol', symbol).execute()
                if port_res.data:
                    existing = port_res.data[0]
                    old_qty = float(existing.get('quantity', 0))
                    old_avg = float(existing.get('average_price', 0))
                    new_qty = old_qty + qty
                    new_avg = (old_qty * old_avg + total_value) / new_qty
                    
                    supabase.table('portfolio').update({
                        'quantity': new_qty,
                        'average_price': round(new_avg, 2)
                    }).eq('id', existing['id']).execute()
                else:
                    supabase.table('portfolio').insert({
                        'user_email': email,
                        'symbol': symbol,
                        'quantity': qty,
                        'average_price': price
                    }).execute()

                PAPER_STATE['funds'] = new_balance
                return jsonify({"status": "success", "message": f"Successfully bought {qty} shares of {symbol}", "new_balance": new_balance}), 200

            elif side == 'SELL':
                # Check if user has enough quantity of symbol
                port_res = supabase.table('portfolio').select('*').eq('user_email', email).eq('symbol', symbol).execute()
                if not port_res.data:
                    return jsonify({"status": "error", "message": f"You do not own any shares of {symbol}"}), 400
                
                existing = port_res.data[0]
                old_qty = float(existing.get('quantity', 0))
                if old_qty < qty:
                    return jsonify({"status": "error", "message": f"Insufficient shares. Owned: {old_qty}, Trying to sell: {qty}"}), 400
                
                new_balance = current_balance + total_value
                new_qty = old_qty - qty
                
                # Update user balance
                supabase.table('users').update({'virtual_balance': new_balance}).eq('email', email).execute()

                # Record transaction
                supabase.table('transactions').insert({
                    'user_email': email,
                    'symbol': symbol,
                    'order_type': 'SELL',
                    'quantity': qty,
                    'price': price
                }).execute()

                # Update portfolio
                if new_qty <= 0:
                    supabase.table('portfolio').delete().eq('id', existing['id']).execute()
                else:
                    supabase.table('portfolio').update({
                        'quantity': new_qty
                    }).eq('id', existing['id']).execute()

                PAPER_STATE['funds'] = new_balance
                return jsonify({"status": "success", "message": f"Successfully sold {qty} shares of {symbol}", "new_balance": new_balance}), 200

        else:
            # Fallback to local memory simulation (PAPER_STATE)
            if side == 'BUY':
                if PAPER_STATE['funds'] < total_value:
                    return jsonify({"status": "error", "message": f"Insufficient Margin. Req: {total_value:.2f}"}), 400
                PAPER_STATE['funds'] -= total_value
                
                # Update holdings
                holding_item = next((h for h in PAPER_STATE['holdings'] if h['symbol'] == symbol), None)
                if holding_item:
                    old_val = holding_item['qty'] * holding_item['avg']
                    holding_item['qty'] += qty
                    holding_item['avg'] = round((old_val + total_value) / holding_item['qty'], 2)
                else:
                    PAPER_STATE['holdings'].append({
                        "symbol": symbol, "qty": qty, "avg": price,
                        "ltp": price, "type": "CNC", "value": total_value, "pnl": 0, "pnl_pct": 0
                    })
            else: # SELL
                holding_item = next((h for h in PAPER_STATE['holdings'] if h['symbol'] == symbol), None)
                if not holding_item or holding_item['qty'] < qty:
                    return jsonify({"status": "error", "message": "Insufficient Holdings"}), 400
                
                PAPER_STATE['funds'] += total_value
                holding_item['qty'] -= qty
                if holding_item['qty'] <= 0:
                    PAPER_STATE['holdings'].remove(holding_item)

            PAPER_STATE['orders'].append({
                "time": datetime.now().strftime("%H:%M:%S"),
                "symbol": symbol, "type": side, "product": product,
                "qty": qty, "price": price, "status": "COMPLETE"
            })

            return jsonify({"status": "success", "message": f"Order Executed. New balance: ₹{PAPER_STATE['funds']:.2f}", "new_balance": PAPER_STATE['funds']}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/square_off', methods=['POST'])
def square_off():
    data = request.json
    symbol = data.get('symbol')
    if symbol in PAPER_STATE['positions']:
        pos = PAPER_STATE['positions'][symbol]
        qty = pos['qty']
        if qty != 0:
            side = 'SELL' if qty > 0 else 'BUY'
            price = mock_defaults.get(symbol, 1000) 
            PAPER_STATE['positions'][symbol] = {"qty": 0, "avg": 0}
            
            # Refund Margin (Simulated)
            PAPER_STATE['funds'] += (abs(qty) * price)

            PAPER_STATE['orders'].append({
                "time": datetime.now().strftime("%H:%M:%S"),
                "symbol": symbol, "type": side, "product": "MIS (Auto)",
                "qty": abs(qty), "price": price, "status": "COMPLETE"
            })
            return jsonify({"status": "success"})
    return jsonify({"status": "error", "message": "Position not found"})

@app.route('/test-db', methods=['GET'])
def test_db():
    if not supabase:
        return jsonify({"status": "error", "message": "Supabase client is not initialized. Check your environment variables."})
    try:
        response = supabase.table('users').select('*').execute()
        return jsonify({"status": "success", "data": response.data})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# In-memory watchlist fallback dictionary
PAPER_WATCHLISTS = {}

TOP_STOCKS = [
    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'SBIN.NS',
    'ICICIBANK.NS', 'BHARTIARTL.NS', 'ITC.NS', 'LT.NS', 'HINDUNILVR.NS',
    'MARUTI.NS', 'SUNPHARMA.NS', 'TATAMOTORS.NS', 'ONGC.NS', 'ADANIENT.NS',
    'AXISBANK.NS', 'NTPC.NS', 'KOTAKBANK.NS', 'COALINDIA.NS', 'M&M.NS'
]

@app.route('/api/watchlist', methods=['GET'])
def get_watchlist():
    email = request.args.get('email')
    if supabase and email:
        try:
            res = supabase.table('watchlist').select('*').eq('user_email', email).execute()
            if not res.data:
                # Insert default watchlist
                defaults = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'SBIN.NS']
                to_insert = [{'user_email': email, 'symbol': sym} for sym in defaults]
                supabase.table('watchlist').insert(to_insert).execute()
                res = supabase.table('watchlist').select('*').eq('user_email', email).execute()
            
            result = []
            name_map = {
                'RELIANCE.NS': 'Reliance Industries',
                'TCS.NS': 'TCS',
                'HDFCBANK.NS': 'HDFC Bank',
                'INFY.NS': 'Infosys',
                'SBIN.NS': 'SBI',
                'NIFTY 25OCT FUT': 'NIFTY FUT',
                'BANKNIFTY 25OCT FUT': 'BANKNIFTY FUT',
                'GOLD 05OCT FUT': 'GOLD'
            }
            for item in res.data:
                sym = item.get('symbol')
                name = name_map.get(sym, sym.split('.')[0] if '.' in sym else sym)
                result.append({
                    "id": sym,
                    "n": name,
                    "def": 100
                })
            return jsonify(result)
        except Exception as e:
            print(f"Error fetching watchlist: {e}")
    
    # Fallback to local memory / default
    email_key = email or 'default'
    if email_key not in PAPER_WATCHLISTS:
        PAPER_WATCHLISTS[email_key] = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'SBIN.NS']
    
    result = []
    name_map = {
        'RELIANCE.NS': 'Reliance Industries',
        'TCS.NS': 'TCS',
        'HDFCBANK.NS': 'HDFC Bank',
        'INFY.NS': 'Infosys',
        'SBIN.NS': 'SBI',
        'NIFTY 25OCT FUT': 'NIFTY FUT',
        'BANKNIFTY 25OCT FUT': 'BANKNIFTY FUT',
        'GOLD 05OCT FUT': 'GOLD'
    }
    for sym in PAPER_WATCHLISTS[email_key]:
        name = name_map.get(sym, sym.split('.')[0] if '.' in sym else sym)
        result.append({
            "id": sym,
            "n": name,
            "def": 100
        })
    return jsonify(result)

@app.route('/api/watchlist/add', methods=['POST'])
def add_watchlist():
    try:
        data = request.json
        email = data.get('email')
        symbol = data.get('symbol')
        if not symbol:
            return jsonify({"status": "error", "message": "Symbol is required"}), 400
            
        if supabase and email:
            # Check if already exists
            exist = supabase.table('watchlist').select('*').eq('user_email', email).eq('symbol', symbol).execute()
            if not exist.data:
                supabase.table('watchlist').insert({
                    'user_email': email,
                    'symbol': symbol
                }).execute()
            return jsonify({"status": "success"})
        
        # Fallback
        email_key = email or 'default'
        if email_key not in PAPER_WATCHLISTS:
            PAPER_WATCHLISTS[email_key] = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'SBIN.NS']
        if symbol not in PAPER_WATCHLISTS[email_key]:
            PAPER_WATCHLISTS[email_key].append(symbol)
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"Error adding to watchlist: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/watchlist/remove', methods=['POST'])
def remove_watchlist():
    try:
        data = request.json
        email = data.get('email')
        symbol = data.get('symbol')
        if not symbol:
            return jsonify({"status": "error", "message": "Symbol is required"}), 400
            
        if supabase and email:
            supabase.table('watchlist').delete().eq('user_email', email).eq('symbol', symbol).execute()
            return jsonify({"status": "success"})
        
        # Fallback
        email_key = email or 'default'
        if email_key not in PAPER_WATCHLISTS:
            PAPER_WATCHLISTS[email_key] = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'SBIN.NS']
        if symbol in PAPER_WATCHLISTS[email_key]:
            PAPER_WATCHLISTS[email_key].remove(symbol)
        return jsonify({"status": "success"})
    except Exception as e:
        print(f"Error removing from watchlist: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/market_action', methods=['GET'])
def get_market_action():
    try:
        quotes = quote_cache.get_quotes(TOP_STOCKS)
        stock_list = []
        for sym, d in quotes.items():
            stock_list.append({
                "symbol": sym,
                "name": sym.replace(".NS", ""),
                "price": d.get("price", 0.0),
                "change": d.get("change", 0.0)
            })
        # Sort by change descending
        sorted_stocks = sorted(stock_list, key=lambda x: x['change'])
        gainers = sorted_stocks[-5:][::-1]
        losers = sorted_stocks[:5]
        return jsonify({
            "gainers": gainers,
            "losers": losers
        })
    except Exception as e:
        print(f"Error getting market action: {e}")
        return jsonify({"gainers": [], "losers": []})

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    if supabase:
        try:
            # Fetch all users
            users_res = supabase.table('users').select('email', 'name', 'virtual_balance').execute()
            # Fetch all portfolios
            port_res = supabase.table('portfolio').select('user_email', 'symbol', 'quantity').execute()
            
            portfolios = {}
            all_symbols = set()
            for p in port_res.data:
                email = p.get('user_email')
                sym = p.get('symbol')
                qty = float(p.get('quantity', 0))
                if qty > 0:
                    if email not in portfolios:
                        portfolios[email] = []
                    portfolios[email].append({"symbol": sym, "qty": qty})
                    all_symbols.add(sym)
            
            # Get quotes for all symbols
            quotes = quote_cache.get_quotes(list(all_symbols)) if all_symbols else {}
            
            leaderboard = []
            for u in users_res.data:
                email = u.get('email')
                name = u.get('name') or email.split('@')[0]
                balance = float(u.get('virtual_balance', 100000.0))
                
                holdings_value = 0.0
                if email in portfolios:
                    for h in portfolios[email]:
                        sym = h['symbol']
                        ltp = quotes.get(sym, {}).get('price', 0.0)
                        holdings_value += h['qty'] * ltp
                
                net_worth = balance + holdings_value
                leaderboard.append({
                    "name": name,
                    "net_worth": round(net_worth, 2)
                })
            
            # Sort and rank
            leaderboard.sort(key=lambda x: x['net_worth'], reverse=True)
            ranked = []
            for rank, item in enumerate(leaderboard[:10], 1):
                ranked.append({
                    "rank": rank,
                    "name": item['name'],
                    "net_worth": item['net_worth']
                })
            return jsonify(ranked)
        except Exception as e:
            print(f"Error calculating leaderboard: {e}")
    
    # Fallback mock leaderboard
    try:
        demo_net_worth = PAPER_STATE['funds'] + sum(
            h['qty'] * quote_cache.get_quotes([h['symbol']]).get(h['symbol'], {}).get('price', h['avg'])
            for h in PAPER_STATE['holdings']
        )
    except Exception:
        demo_net_worth = 100000.0

    mock_data = [
        {"rank": 1, "name": "Vijay Kedia (Mock)", "net_worth": 182430.50},
        {"rank": 2, "name": "Rakesh J. (Mock)", "net_worth": 154320.00},
        {"rank": 3, "name": "Radhakishan D. (Mock)", "net_worth": 125890.20},
        {"rank": 4, "name": "Demo User (You)", "net_worth": round(demo_net_worth, 2)},
        {"rank": 5, "name": "Nikhil Kamath (Mock)", "net_worth": 98500.00},
        {"rank": 6, "name": "Porinju V. (Mock)", "net_worth": 92100.40}
    ]
    # Re-sort because Demo User might have more
    mock_data.sort(key=lambda x: x['net_worth'], reverse=True)
    for idx, item in enumerate(mock_data, 1):
        item['rank'] = idx
    return jsonify(mock_data[:10])

if __name__ == '__main__':
    app.run(debug=True, port=5000)

