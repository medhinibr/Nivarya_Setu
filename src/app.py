from flask import Flask, jsonify, request, send_from_directory
import random
from datetime import datetime
import threading
import time
import os
import urllib.request
import json
import yfinance as yf
import pandas as pd
from supabase import create_client, Client

# Load .env manually from current directory
env_path = os.path.join(os.path.dirname(__file__), '.env')
try:
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line:
                k, v = line.strip().split('=', 1)
                os.environ[k] = v.strip().strip('"') # Handle quotes if present
except: pass

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

# Auto-correct swapped URL and KEY if pasted in reverse
if supabase_url and supabase_key:
    if not supabase_url.startswith("http") and supabase_key.startswith("http"):
        supabase_url, supabase_key = supabase_key, supabase_url

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
    total_val = PAPER_STATE['funds']
    
    # Collect all symbols we need to fetch quotes for
    holding_syms = [h['symbol'] for h in PAPER_STATE['holdings']]
    position_syms = list(PAPER_STATE['positions'].keys())
    all_syms = list(set(holding_syms + position_syms))
    
    quotes = quote_cache.get_quotes(all_syms) if all_syms else {}
    
    # 1. Update Holdings
    for h in PAPER_STATE['holdings']:
        sym = h['symbol']
        current_price = quotes.get(sym, {}).get('price', h['avg'])
        h['ltp'] = round(current_price, 2)
        h['value'] = round(h['ltp'] * h['qty'], 2)
        h['pnl'] = round(h['value'] - (h['avg'] * h['qty']), 2)
        h['pnl_pct'] = round((h['pnl'] / (h['avg'] * h['qty'])) * 100, 2) if h['avg'] != 0 else 0.0
        total_val += h['value']

    # 2. Update Intraday Positions
    pos_list = []
    total_pnl = 0
    for sym, pos in PAPER_STATE['positions'].items():
        if pos['qty'] != 0:
            current_price = quotes.get(sym, {}).get('price', pos['avg'])
            # MTM
            mtm = (current_price - pos['avg']) * pos['qty']
            pos_entry = {
                "symbol": sym, "qty": pos['qty'], "avg": pos['avg'], 
                "ltp": round(current_price, 2), "pnl": round(mtm, 2), "product": "MIS"
            }
            pos_list.append(pos_entry)
            total_pnl += mtm

    return jsonify({
        "funds": round(PAPER_STATE['funds'], 2),
        "holdings": PAPER_STATE['holdings'],
        "positions": pos_list, 
        "orders": PAPER_STATE['orders'][::-1],
        "total_value": round(total_val, 2),
        "total_pnl": round(total_pnl + sum(h['pnl'] for h in PAPER_STATE['holdings']), 2)
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
    data = request.json
    symbol = data.get('symbol')
    side = data.get('side') 
    qty = int(data.get('qty', 0))
    product = data.get('product', 'CNC') 
    price = float(data.get('price', 0)) 

    # 1. VALIDATIONS
    order_value = qty * price
    
    if side == 'BUY':
        if PAPER_STATE['funds'] < order_value:
             return jsonify({"status": "error", "message": f"Insufficient Margin. Req: {order_value}"})
        PAPER_STATE['funds'] -= order_value 

    elif side == 'SELL':
        if product == 'CNC':
            holding_item = next((h for h in PAPER_STATE['holdings'] if h['symbol'] == symbol), None)
            if not holding_item or holding_item['qty'] < qty:
                 return jsonify({"status": "error", "message": "Insufficient Holdings"})
        
        if side == 'SELL': 
            PAPER_STATE['funds'] += order_value 

    # 2. EXECUTION
    PAPER_STATE['orders'].append({
         "time": datetime.now().strftime("%H:%M:%S"),
         "symbol": symbol, "type": side, "product": product,
         "qty": qty, "price": price, "status": "COMPLETE"
    })

    # UPDATE PORTFOLIO
    if product == 'CNC':
        holding_item = next((h for h in PAPER_STATE['holdings'] if h['symbol'] == symbol), None)
        if side == 'BUY':
            if holding_item:
                old_val = holding_item['qty'] * holding_item['avg']
                new_val = qty * price
                holding_item['qty'] += qty
                holding_item['avg'] = round((old_val + new_val) / holding_item['qty'], 2)
            else:
                PAPER_STATE['holdings'].append({
                    "symbol": symbol, "qty": qty, "avg": price,
                    "ltp": price, "type": "CNC", "value": order_value, "pnl": 0, "pnl_pct": 0
                })
        else: 
             if holding_item:
                 holding_item['qty'] -= qty
                 if holding_item['qty'] <= 0:
                     PAPER_STATE['holdings'].remove(holding_item)

    else: # MIS
        if symbol not in PAPER_STATE['positions']:
            PAPER_STATE['positions'][symbol] = {"qty": 0, "avg": 0}
        p = PAPER_STATE['positions'][symbol]
        
        if side == 'BUY':
             p['qty'] += qty
             p['avg'] = price 
        else: 
             p['qty'] -= qty
             p['avg'] = price 

    # Sync to Supabase
    email = data.get('email')
    if supabase and email:
        try:
            supabase.table('users').update({"virtual_balance": PAPER_STATE['funds']}).eq('email', email).execute()
        except Exception as e:
            print(f"Failed to sync order balance to Supabase: {e}")

    return jsonify({"status": "success", "message": "Order Placed"})

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
