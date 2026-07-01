const { useState, useEffect, useRef, useMemo, Component } = React;

class ErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error(error, errorInfo); }
    render() { return this.state.hasError ? <div className="error-box"><h3>Something went wrong</h3><p>{this.state.error.toString()}</p></div> : this.props.children; }
}

const ToastContainer = ({ toasts }) => (
    <div className="toast-container">
        {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type}`}>
                <div className="toast-icon">{t.type === 'success' ? <i className="fas fa-check-circle text-up" /> : <i className="fas fa-exclamation-circle text-down" />}</div>
                <div>
                    <h4 style={{ fontSize: '13px', marginBottom: '4px', fontWeight: '600' }}>{t.title}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-light)' }}>{t.message}</p>
                </div>
            </div>
        ))}
    </div>
);

const Sparkline = ({ color }) => {
    const points = useMemo(() => {
        let data = [50];
        for (let i = 0; i < 20; i++) data.push(data[i] + (Math.random() - 0.5) * 10);
        const min = Math.min(...data), max = Math.max(...data);
        return data.map((d, i) => `${(i / 20) * 60},${30 - ((d - min) / (max - min)) * 30}`).join(' ');
    }, []);
    return <svg width="60" height="30" style={{ opacity: 0.8 }}><polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
};

const EmptyState = ({ icon, text }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-light)', opacity: 0.5, padding: '40px' }}>
        <i className={`fas ${icon}`} style={{ fontSize: '32px', marginBottom: '10px' }}></i>
        <div style={{ fontSize: '12px' }}>{text}</div>
    </div>
);

const LandingPage = ({ onStart }) => {
    const [mobile, setMobile] = useState('');
    const [activeFaq, setActiveFaq] = useState(null);
    return (
        <div className="landing-page">
            <div className="header">
                <div className="logo" onClick={() => onStart('LANDING')}>
                    <i className="fas fa-landmark"></i>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                        <div style={{ display: 'flex', gap: '4px', fontSize: '18px' }}>NIVARYA <span style={{ fontWeight: '300', opacity: 0.5 }}>SETU</span></div>
                        <div style={{ fontSize: '9px', fontWeight: '500', opacity: 0.4, letterSpacing: '0.3px', marginTop: '2px' }}>A bridge to smart investing</div>
                    </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button className="nav-item" style={{ fontSize: '14px', fontWeight: '600' }} onClick={() => onStart('LOGIN')}>Login</button>
                    <button className="landing-btn" style={{ padding: '10px 24px', fontSize: '13px', borderRadius: '8px' }} onClick={() => onStart('SIGNUP')}>Sign Up</button>
                </div>
            </div>

            <div className="landing-section hero-section">
                <div className="hero-content">
                    <div style={{ textTransform: 'uppercase', color: 'var(--blue)', fontWeight: '800', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>Now live with NSE & BSE</div>
                    <h1>Open Your <br /><span>Free Demat Account</span></h1>
                    <p>Trade & Invest with the next generation platform built for serious wealth creators.</p>

                    <div className="input-bar" style={{ display: 'flex', background: '#111', border: '1px solid var(--border)', borderRadius: '12px', padding: '8px', maxWidth: '500px', marginBottom: '32px' }}>
                        <input type="text" placeholder="Enter mobile number" value={mobile} onChange={e => setMobile(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '0 20px', fontSize: '16px', outline: 'none' }} />
                        <button className="landing-btn" onClick={() => onStart('SIGNUP')} style={{ padding: '12px 24px', fontSize: '14px' }}>Get Started</button>
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div className="promo-badge" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--blue)' }}>₹0</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-light)', lineHeight: '1.4' }}>A/c Opening, AMC<br />& Mutual Funds</div>
                        </div>
                        <div className="promo-badge" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--blue)' }}>₹20</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-light)', lineHeight: '1.4' }}>Per order on Equity<br />Intraday, F&O</div>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <img src="assets/hero_mockup.png" className="hero-img" alt="Platform Mockup" />
                </div>
            </div>

            <div className="landing-section" style={{ background: '#050505' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '42px', fontWeight: '800' }}>Leverage with <span style={{ color: 'var(--blue)' }}>MTF</span></h2>
                    <p style={{ color: 'var(--text-light)', marginTop: '16px' }}>Interest rates for margin trading slashed to just 0.03% per day!</p>
                </div>

                <table className="comparison-table">
                    <thead>
                        <tr><th>Feature</th><th>Standard trading</th><th className="col-highlight">With Nivarya MTF</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Equity Quantity</td><td>100 Shares</td><td className="col-highlight">400 Shares</td></tr>
                        <tr><td>Required Capital</td><td>₹1,00,000</td><td className="col-highlight">₹25,000</td></tr>
                        <tr><td>Interest Rate</td><td>N/A</td><td className="col-highlight">0.03% / day</td></tr>
                        <tr><td>Leverage</td><td>1x</td><td className="col-highlight">4x Leverage</td></tr>
                    </tbody>
                </table>
            </div>

            <div className="landing-section">
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '42px', fontWeight: '800' }}>Investment <span style={{ color: 'var(--blue)' }}>Solutions</span></h2>
                </div>
                <div className="step-grid">
                    <div className="step-card">
                        <i className="fas fa-bolt" style={{ fontSize: '24px', color: 'var(--blue)', marginBottom: '20px' }}></i>
                        <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Swift Digital Entry</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>Paperless registration in under 60 seconds.</p>
                        <div className="step-num">1</div>
                    </div>
                    <div className="step-card">
                        <i className="fas fa-shield-alt" style={{ fontSize: '24px', color: 'var(--blue)', marginBottom: '20px' }}></i>
                        <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>AI-Powered KYC</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>Secure, frictionless verification process.</p>
                        <div className="step-num">2</div>
                    </div>
                    <div className="step-card">
                        <i className="fas fa-chart-line" style={{ fontSize: '24px', color: 'var(--blue)', marginBottom: '20px' }}></i>
                        <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Activate Vision</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>Start building your portfolio instantly.</p>
                        <div className="step-num">3</div>
                    </div>
                </div>
            </div>

            <div className="landing-section" style={{ background: '#050505', borderTop: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '42px', fontWeight: '800' }}>General <span style={{ color: 'var(--blue)' }}>FAQ</span></h2>
                </div>
                <div className="faq-container">
                    {[
                        { q: "What is a Demat Account?", a: "A Demat account holds your shares and securities in electronic format." },
                        { q: "Benefits of Nivarya Setu?", a: "Institutional-grade tools, zero opening charges, and integrated TradingView charts." },
                        { q: "What are the charges?", a: "₹0 for Delivery and flat ₹20 for Intraday/F&O." }
                    ].map((faq, idx) => (
                        <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                            <div className="faq-header" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                                <span style={{ fontWeight: '600' }}>{faq.q}</span>
                                <i className="fas fa-chevron-down"></i>
                            </div>
                            <div className="faq-answer">{faq.a}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="landing-section" style={{ borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
                    {['PRIVACY', 'TERMS', 'RISK', 'REFUND'].map(type => (
                        <span key={type} onClick={() => onStart(type)} style={{ fontSize: '12px', color: 'var(--text-light)', cursor: 'pointer', fontWeight: '600' }}>
                            {type.charAt(0) + type.slice(1).toLowerCase()} Policy
                        </span>
                    ))}
                </div>
                <div className="disclosure-text" style={{ fontSize: '11px', color: 'var(--text-light)', opacity: 0.5 }}>
                    © 2026 Nivarya Setu Financial Services. All rights reserved. <br /><br />
                    Investments in the securities market are subject to market risks. Read all the related documents carefully before investing.
                </div>
            </div>
        </div>
    );
};

const MarketDepth = ({ symbol }) => {
    const [depth, setDepth] = useState({ bids: [], asks: [], total_bid: 0, total_ask: 0 });
    useEffect(() => {
        const fetchDepth = async () => {
            if (!symbol) return;
            try {
                const r = await fetch(`/api/market_depth?symbol=${symbol}`);
                if (r.ok) setDepth(await r.json());
            } catch (e) { }
        };
        fetchDepth();
        const t = setInterval(fetchDepth, 2000);
        return () => clearInterval(t);
    }, [symbol]);
    const bidPct = ((depth.total_bid || 0) / (Math.max(depth.total_bid, depth.total_ask) || 1)) * 100;
    return (
        <div className="depth-container">
            <div style={{ padding: '15px 20px', fontWeight: '700', fontSize: '11px', borderBottom: '1px solid var(--border)' }}>MARKET DEPTH</div>
            <table style={{ width: '100%', fontSize: '11px' }}>
                <thead><tr><th>BID</th><th>QTY</th><th>OFFER</th><th>QTY</th></tr></thead>
                <tbody>{[0, 1, 2, 3, 4].map(i => (<tr key={i}>
                    <td className="text-up">{depth.bids[i]?.price || '-'}</td><td>{depth.bids[i]?.qty || '-'}</td>
                    <td className="text-down">{depth.asks[i]?.price || '-'}</td><td>{depth.asks[i]?.qty || '-'}</td>
                </tr>))}</tbody>
            </table>
            <div style={{ padding: '20px', display: 'flex', gap: '4px', height: '8px', marginTop: 'auto' }}>
                <div style={{ flex: 1, background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: `${bidPct}%`, height: '100%', background: 'var(--green)' }} /></div>
                <div style={{ flex: 1, background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: `${100 - bidPct}%`, height: '100%', background: 'var(--red)' }} /></div>
            </div>
        </div>
    );
};

const AuthPage = ({ type, onAuth, onBack }) => {
    const [email, setEmail] = useState('demo@pro.com');
    const [pass, setPass] = useState('demo123');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        if (!window.FirebaseAuth) { alert("Firebase not initialized."); return; }
        setLoading(true);
        try {
            const { auth, signInWithPopup, GoogleAuthProvider } = window.FirebaseAuth;
            const result = await signInWithPopup(auth, new GoogleAuthProvider());
            onAuth({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL });
        } catch (error) { alert("Google sign-in failed: " + error.message); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            const r = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const d = await r.json(); setLoading(false);
            if (r.ok && d.status === 'success') {
                localStorage.setItem("user_email", d.user.email);
                localStorage.setItem("virtual_balance", d.user.virtual_balance);
                alert(`Welcome! Your balance is ₹${parseFloat(d.user.virtual_balance).toLocaleString("en-IN")}`);
                onAuth(d.user);
            } else {
                alert("Error: " + (d.message || d.error || "Login failed"));
            }
        } catch (error) {
            setLoading(false);
            console.error("Login failed", error);
            alert("Connection error: " + error.message);
        }
    };

    return (
        <div className="auth-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#000' }}>
            <div className="auth-card" style={{ background: 'var(--bg-panel)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border)', width: '400px' }}>
                <button className="nav-item" onClick={onBack} style={{ marginBottom: '20px' }}><i className="fas fa-arrow-left"></i> Home</button>
                <h2 style={{ fontSize: '24px', marginBottom: '30px', textAlign: 'center' }}>{type === 'LOGIN' ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div><label className="badge" style={{ marginBottom: '8px', display: 'block' }}>Email</label><input className="search-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ paddingLeft: '15px' }} /></div>
                    <div><label className="badge" style={{ marginBottom: '8px', display: 'block' }}>Password</label><input className="search-input" type="password" value={pass} onChange={e => setPass(e.target.value)} required style={{ paddingLeft: '15px' }} /></div>
                    <button className="landing-btn" disabled={loading} style={{ width: '100%' }}>{loading ? '...' : type}</button>
                </form>
                <div style={{ margin: '20px 0', textAlign: 'center', color: 'var(--text-light)', fontSize: '11px' }}>OR</div>
                <button className="landing-btn" onClick={handleGoogleLogin} style={{ width: '100%', background: '#fff', color: '#000' }}><i className="fab fa-google"></i> Google Login</button>
            </div>
        </div>
    );
};

const LegalPage = ({ type, onBack }) => {
    const content = {
        PRIVACY: { title: "Privacy Policy", body: "We protect your financial data with industry-standard encryption." },
        TERMS: { title: "Terms & Conditions", body: "By using Nivarya Setu, you agree to our service terms." },
        RISK: { title: "Risk Disclosure", body: "Trading involves risk of capital loss." },
        REFUND: { title: "Refund Policy", body: "Subscription fees are generally non-refundable." }
    }[type] || { title: "Legal", body: "Legal information." };

    return (
        <div style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <button className="nav-item" onClick={onBack} style={{ marginBottom: '40px' }}><i className="fas fa-arrow-left"></i> Home</button>
            <h1 style={{ fontSize: '36px', marginBottom: '32px' }}>{content.title}</h1>
            <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '20px', border: '1px solid var(--border)', lineHeight: '1.8' }}>{content.body}</div>
        </div>
    );
};

const ScreenerDashboard = () => {
    const [filter, setFilter] = useState('ALL'); const [data, setData] = useState([]);
    useEffect(() => { fetch(`/api/screener?filter=${filter}`).then(r => r.json()).then(setData); }, [filter]);
    return (
        <div className="dashboard-container">
            <h1 style={{ fontSize: '32px', marginBottom: '32px', fontWeight: '800' }}>Market Screener</h1>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                {['ALL', 'TOP_GAINERS', 'TOP_LOSERS'].map(f => (
                    <button key={f} className={`nav-item ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f.replace('_', ' ')}</button>
                ))}
            </div>
            <div style={{ background: 'var(--bg-panel)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table className="custom-table">
                    <thead>
                        <tr><th>SYMBOL</th><th>SECTOR</th><th>PRICE</th><th>CHANGE</th><th>RSI</th></tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr><td colSpan="5"><EmptyState icon="fa-search" text="Analyzing market data..." /></td></tr>
                        ) : (
                            data.map(s => (
                                <tr key={s.symbol}>
                                    <td style={{ fontWeight: '700' }}>{s.symbol}</td>
                                    <td style={{ color: 'var(--text-light)' }}>{s.sector}</td>
                                    <td style={{ fontFamily: 'var(--font-mono)' }}>₹{s.price}</td>
                                    <td className={s.change > 0 ? 'text-up' : 'text-down'} style={{ fontWeight: '700' }}>{s.change > 0 ? '+' : ''}{s.change}%</td>
                                    <td style={{ fontFamily: 'var(--font-mono)' }}>{s.rsi}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const formatForTradingView = (symbol) => {
    if (!symbol) return "NSE:RELIANCE";
    let tvSymbol = symbol;
    if (tvSymbol.endsWith('.NS')) return `NSE:${tvSymbol.replace('.NS', '')}`;
    if (tvSymbol.endsWith('.BO')) return `BSE:${tvSymbol.replace('.BO', '')}`;
    if (tvSymbol.includes("FUT") || tvSymbol.includes("CE") || tvSymbol.includes("PE")) {
        if (tvSymbol.includes("NIFTY")) return "NSE:NIFTY";
        if (tvSymbol.includes("BANKNIFTY")) return "NSE:BANKNIFTY";
        return "NSE:NIFTY";
    }
    if (tvSymbol === "GOLD 05OCT FUT") return "COMEX:GC1!";
    return tvSymbol;
};

const ChartWidget = ({ symbol, onTrade }) => {
    const ref = useRef(null);
    useEffect(() => {
        const tv = window.TradingView;
        if (tv && ref.current) {
            ref.current.id = "tv_" + Math.random().toString(36).substr(2, 9);
            const tvSymbol = formatForTradingView(symbol);
            new tv.widget({ 
                "autosize": true, 
                "symbol": tvSymbol, 
                "interval": "D", 
                "theme": "dark", 
                "container_id": ref.current.id 
            });
        }
    }, [symbol]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div ref={ref} style={{ width: '100%', height: '100%' }}></div>
            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="landing-btn" style={{ width: '40px', height: '40px', padding: '0', borderRadius: '8px' }} onClick={() => onTrade('BUY')}><i className="fas fa-plus"></i></button>
                <button className="landing-btn" style={{ width: '40px', height: '40px', padding: '0', borderRadius: '8px', background: 'var(--red)' }} onClick={() => onTrade('SELL')}><i className="fas fa-minus"></i></button>
            </div>
        </div>
    );
};

const InvestDashboard = ({ addToast }) => {
    const [section, setSection] = useState('STOCKCASES');
    const [data, setData] = useState([]);
    useEffect(() => {
        let ep = section === 'STOCKCASES' ? '/api/baskets' : section === 'IPO' ? '/api/invest/ipos' : '/api/invest/mutual_funds';
        fetch(ep).then(r => r.json()).then(setData);
    }, [section]);
    return (
        <div className="dashboard-container">
            <h1 style={{ fontSize: '32px', marginBottom: '32px', fontWeight: '800' }}>Investment Solutions</h1>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                {['STOCKCASES', 'IPO', 'MF'].map(s => (<button key={s} className={`nav-item ${section === s ? 'active' : ''}`} onClick={() => setSection(s)}>{s === 'MF' ? 'Mutual Funds' : s}</button>))}
            </div>
            <div className="basket-grid">
                {data.map((item, i) => (
                    <div key={i} className="basket-card">
                        <div style={{ color: 'var(--blue)', fontSize: '10px', fontWeight: '800', marginBottom: '8px', letterSpacing: '1px' }}>{section}</div>
                        <h3>{item.name}</h3>
                        <p>{item.desc || item.status}</p>
                        <div className="flex-between" style={{ marginTop: 'auto' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>Min. Invest: ₹{section === 'MF' ? '500' : '5,000'}</div>
                            <button className="landing-btn" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '8px' }} onClick={() => addToast('success', 'Order Placed', `Request for {item.name} sent.`)}>Invest</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const OrderModal = ({ isOpen, type, symbol, price, ownedQty = 0, onClose, onSubmit }) => {
    if (!isOpen) return null;
    const [qty, setQty] = useState(1);
    const isBuy = type === 'BUY';

    const handleSetMax = () => {
        if (!isBuy) {
            setQty(ownedQty);
        }
    };

    const handleFormSubmit = () => {
        const qtyNum = parseFloat(qty);
        if (isNaN(qtyNum) || qtyNum <= 0) {
            alert("Quantity must be a positive number.");
            return;
        }
        if (!isBuy && qtyNum > ownedQty) {
            alert(`Insufficient holdings. You own ${ownedQty} shares of ${symbol} but tried to sell ${qtyNum}.`);
            return;
        }
        onSubmit({ qty: qtyNum, type: 'MARKET', price });
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div style={{ padding: '32px' }}>
                    <div className="flex-between" style={{ marginBottom: '32px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '700', marginBottom: '4px' }}>EXECUTE ORDER</div>
                            <h2 style={{ fontSize: '28px', fontWeight: '900' }}>{symbol}</h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="badge" style={{ background: isBuy ? 'rgba(0, 208, 156, 0.1)' : 'rgba(235, 91, 60, 0.1)', color: isBuy ? 'var(--green)' : 'var(--red)', marginBottom: '8px' }}>{type}</div>
                            <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>₹{price}</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <div className="flex-between" style={{ marginBottom: '12px' }}>
                            <label className="badge">QUANTITY (SHARES)</label>
                            {!isBuy && ownedQty > 0 && (
                                <span 
                                    style={{ fontSize: '11px', color: 'var(--text-light)', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={handleSetMax}
                                >
                                    Max Available: {ownedQty}
                                </span>
                            )}
                        </div>
                        <input className="search-input" type="number" value={qty} onChange={e => setQty(e.target.value)} style={{ paddingLeft: '20px', fontSize: '20px', fontWeight: '800' }} />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', marginBottom: '32px', border: '1px solid var(--border)' }}>
                        <div className="flex-between" style={{ marginBottom: '12px' }}>
                            <span style={{ color: 'var(--text-light)' }}>Margin Required</span>
                            <span style={{ fontWeight: '700' }}>₹{(qty * price * 0.2).toLocaleString()}</span>
                        </div>
                        <div className="flex-between">
                            <span style={{ color: 'var(--text-light)' }}>Total Value</span>
                            <span style={{ fontWeight: '700' }}>₹{(qty * price).toLocaleString()}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button className="landing-btn" style={{ flex: 1, background: isBuy ? 'var(--green)' : 'var(--red)', color: isBuy ? '#000' : '#fff' }} onClick={handleFormSubmit}>Place {type} Order</button>
                        <button className="nav-item" onClick={onClose} style={{ padding: '20px' }}>Dismiss</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WATCHLIST_DATA = {
    EQUITY: [{ id: 'RELIANCE.NS', n: 'Reliance Industries', def: 2450 }, { id: 'TCS.NS', n: 'TCS', def: 3240 }, { id: 'HDFCBANK.NS', n: 'HDFC Bank', def: 1650 }, { id: 'INFY.NS', n: 'Infosys', def: 1420 }, { id: 'SBIN.NS', n: 'SBI', def: 580 }],
    FNO: [{ id: 'NIFTY 25OCT FUT', n: 'NIFTY FUT', def: 19650 }, { id: 'BANKNIFTY 25OCT FUT', n: 'BANKNIFTY FUT', def: 44500 }],
    MCX: [{ id: 'GOLD 05OCT FUT', n: 'GOLD', def: 59500 }], CDS: []
};

const App = () => {
    const [view, setView] = useState(localStorage.getItem('auth') ? 'APP' : 'LANDING');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [portfolio, setPortfolio] = useState({ funds: 0, holdings: [], positions: [], orders: [] });
    const [tab, setTab] = useState('TRADE');
    const [symbol, setSymbol] = useState('RELIANCE.NS');
    const [qtys, setQtys] = useState({});
    const [modal, setModal] = useState({ open: false, type: 'BUY' });
    const [toasts, setToasts] = useState([]);
    const [profileMenu, setProfileMenu] = useState(false);

    // Watchlist & Search States
    const [watchlist, setWatchlist] = useState(() => {
        const saved = localStorage.getItem('watchlist');
        return saved ? JSON.parse(saved) : WATCHLIST_DATA.EQUITY;
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const addToast = (type, title, message) => { const id = Date.now(); setToasts(prev => [...prev, { id, type, title, message }]); setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000); };
    const handleAuth = (u) => { localStorage.setItem('auth', 'true'); localStorage.setItem('user', JSON.stringify(u)); setUser(u); setView('APP'); addToast('success', 'Logged In', `Hello, ${u.name}`); };
    const logout = () => { localStorage.clear(); setView('LANDING'); };

    const refresh = async () => {
        if (view !== 'APP') return;
        try {
            const symbolsToFetch = [...watchlist, ...WATCHLIST_DATA.FNO, ...WATCHLIST_DATA.MCX].map(x => x.id);
            const r1 = await fetch('/api/batch_quotes?symbols=' + symbolsToFetch.join(','));
            if (r1.ok) setQtys(await r1.json());
            const email = localStorage.getItem("user_email") || '';
            const r2 = await fetch(`/api/portfolio?email=${encodeURIComponent(email)}`);
            if (r2.ok) setPortfolio(await r2.json());
        } catch (e) { }
    };

    useEffect(() => { refresh(); const t = setInterval(refresh, 5000); return () => clearInterval(t); }, [view, watchlist]);

    // Debounce search effect
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const r = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                if (r.ok) {
                    setSearchResults(await r.json());
                }
            } catch (e) {
                console.error("Search error:", e);
            } finally {
                setIsSearching(false);
            }
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    if (view === 'LANDING') return <LandingPage onStart={setView} />;
    if (view === 'LOGIN' || view === 'SIGNUP') return <AuthPage type={view} onAuth={handleAuth} onBack={() => setView('LANDING')} />;
    if (['PRIVACY', 'TERMS', 'RISK', 'REFUND'].includes(view)) return <LegalPage type={view} onBack={() => setView('LANDING')} />;

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <ToastContainer toasts={toasts} />
            <OrderModal isOpen={modal.open} type={modal.type} symbol={symbol} price={qtys[symbol]?.price || 0} ownedQty={portfolio.holdings?.find(h => h.symbol === symbol)?.qty || 0} onClose={() => setModal({ ...modal, open: false })} onSubmit={async (d) => {
                try {
                    const res = await fetch('/api/place_order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ symbol, side: modal.type, email: localStorage.getItem("user_email"), ...d }) });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.status === 'success') {
                            if (data.new_balance !== undefined) {
                                localStorage.setItem("virtual_balance", data.new_balance);
                            }
                            addToast('success', 'Order Executed', `Successfully ${modal.type.toLowerCase()}ed ${d.qty} shares of ${symbol}.`);
                        } else {
                            addToast('error', 'Order Failed', data.message || 'Execution failed.');
                        }
                    } else {
                        addToast('error', 'Order Failed', 'Server error. Please try again.');
                    }
                } catch (e) {
                    addToast('error', 'Order Failed', 'Network error.');
                }
                setModal({ ...modal, open: false });
                refresh();
            }} />

            <div className="header">
                <div className="logo" onClick={() => setTab('TRADE')}>
                    <i className="fas fa-landmark"></i>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                        <div style={{ display: 'flex', gap: '5px', fontSize: '18px' }}>NIVARYA <span style={{ fontWeight: '300', opacity: 0.5 }}>SETU</span></div>
                        <div style={{ fontSize: '9px', fontWeight: '500', opacity: 0.3, letterSpacing: '0.5px' }}>INSTITUTIONAL TERMINAL</div>
                    </div>
                </div>
                <div className="nav">
                    {['TRADE', 'INVEST', 'ORDERS', 'HOLDINGS', 'POSITIONS', 'SCREENER'].map(t => (
                        <div key={t} className={`nav-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</div>
                    ))}
                </div>
                <div className="user-info" onClick={() => setProfileMenu(!profileMenu)} style={{ cursor: 'pointer', position: 'relative' }}>
                    <div style={{ color: 'var(--green)', fontWeight: '800', fontSize: '15px' }}>₹{(portfolio.funds !== undefined ? portfolio.funds : parseFloat(localStorage.getItem("virtual_balance") || 100000)).toLocaleString("en-IN")}</div>
                    <div className="user-avatar">{user?.name[0]}</div>
                    {profileMenu && (
                        <div className="profile-dropdown" style={{ top: '130%', right: '0' }}>
                            <div className="dropdown-item" style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '14px', fontWeight: '700' }}>{user?.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{user?.email}</div>
                            </div>
                            <div className="dropdown-item" onClick={logout} style={{ padding: '15px 20px', color: 'var(--red)', cursor: 'pointer', fontWeight: '600' }}>Logout</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="main">
                {tab === 'TRADE' && (
                    <div className="sidebar">
                        <div className="search-area" style={{ position: 'relative' }}>
                            <i className="fas fa-search" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '40px', color: 'var(--text-light)', opacity: 0.5 }}></i>
                            <input 
                                className="search-input" 
                                placeholder="Search symbol (e.g. AAPL, Reliance)..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {searchQuery.trim().length >= 2 && (
                                <div className="search-results-dropdown custom-scroll" style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '24px',
                                    right: '24px',
                                    background: 'var(--bg-panel)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    zIndex: 10,
                                    maxHeight: '250px',
                                    overflowY: 'auto',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                                }}>
                                    {isSearching ? (
                                        <div style={{ padding: '15px', fontSize: '12px', color: 'var(--text-light)', textAlign: 'center' }}>Searching...</div>
                                    ) : searchResults.length === 0 ? (
                                        <div style={{ padding: '15px', fontSize: '12px', color: 'var(--text-light)', textAlign: 'center' }}>No results found</div>
                                    ) : (
                                        searchResults.map(res => (
                                            <div 
                                                key={res.symbol} 
                                                className="search-result-item" 
                                                onClick={() => {
                                                    if (!watchlist.some(w => w.id === res.symbol)) {
                                                        const updated = [...watchlist, { id: res.symbol, n: res.name, def: 100 }];
                                                        setWatchlist(updated);
                                                        localStorage.setItem('watchlist', JSON.stringify(updated));
                                                    }
                                                    setSymbol(res.symbol);
                                                    setSearchQuery('');
                                                    setSearchResults([]);
                                                }}
                                                style={{
                                                    padding: '12px 15px',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid var(--border)',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                <div style={{ fontWeight: '700' }}>{res.symbol}</div>
                                                <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.name} ({res.exchange})</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="stock-list custom-scroll">
                            {watchlist.map(w => (
                                <div key={w.id} className={`stock-item ${symbol === w.id ? 'active' : ''}`} style={{ position: 'relative' }} onClick={() => setSymbol(w.id)}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.n}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '2px' }}>{w.id}</div>
                                    </div>
                                    <Sparkline color={qtys[w.id]?.change >= 0 ? 'var(--green)' : 'var(--red)'} />
                                    <div className="price-info">
                                        <div className={`price-val ${qtys[w.id]?.change >= 0 ? 'text-up' : 'text-down'}`}>₹{qtys[w.id]?.price || w.def}</div>
                                        <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '2px' }}>{qtys[w.id]?.change >= 0 ? '+' : ''}{qtys[w.id]?.change || '0.00'}%</div>
                                    </div>
                                    {watchlist.length > 2 && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const updated = watchlist.filter(x => x.id !== w.id);
                                                setWatchlist(updated);
                                                localStorage.setItem('watchlist', JSON.stringify(updated));
                                                if (symbol === w.id) {
                                                    setSymbol(updated[0]?.id || 'RELIANCE.NS');
                                                }
                                            }}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--red)',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                marginLeft: '8px',
                                                opacity: 0.3,
                                                transition: 'opacity 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                            onMouseLeave={e => e.currentTarget.style.opacity = 0.3}
                                            title="Remove from Watchlist"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ flex: 1, overflow: 'hidden', height: '100%' }}>
                    {tab === 'TRADE' && (
                        <div className="center-area" style={{ height: '100%' }}>
                            <div className="chart-container">
                                <ChartWidget symbol={symbol} onTrade={t => setModal({ open: true, type: t })} />
                            </div>
                            <MarketDepth symbol={symbol} />
                        </div>
                    )}
                    {tab === 'INVEST' && <InvestDashboard addToast={addToast} />}
                    {tab === 'SCREENER' && <ScreenerDashboard />}
                    {tab === 'HOLDINGS' && (
                        <div style={{ padding: '40px', height: '100%', overflow: 'auto' }}>
                            {/* Stats Summary Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                                <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Invested Value</div>
                                    <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>₹{(portfolio.invested_val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                </div>
                                <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Value</div>
                                    <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>₹{(portfolio.current_val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                </div>
                                <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total P&L</div>
                                    <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-mono)' }} className={(portfolio.total_pnl || 0) >= 0 ? 'text-up' : 'text-down'}>
                                        {(portfolio.total_pnl || 0) >= 0 ? '+' : ''}₹{(portfolio.total_pnl || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        <span style={{ fontSize: '12px', marginLeft: '6px', opacity: 0.8 }}>
                                            ({portfolio.invested_val ? (((portfolio.total_pnl || 0) / portfolio.invested_val) * 100).toFixed(2) : '0.00'}%)
                                        </span>
                                    </div>
                                </div>
                                <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today's P&L</div>
                                    <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-mono)' }} className={(portfolio.today_pnl || 0) >= 0 ? 'text-up' : 'text-down'}>
                                        {(portfolio.today_pnl || 0) >= 0 ? '+' : ''}₹{(portfolio.today_pnl || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        <span style={{ fontSize: '12px', marginLeft: '6px', opacity: 0.8 }}>
                                            ({portfolio.current_val && portfolio.today_pnl ? (((portfolio.today_pnl || 0) / (portfolio.current_val - portfolio.today_pnl)) * 100).toFixed(2) : '0.00'}%)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Table */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Holdings ({portfolio.holdings?.length || 0})</h2>
                                <button className="nav-item active" style={{ padding: '8px 16px' }} onClick={refresh}>
                                    <i className="fas fa-sync" style={{ marginRight: '6px' }} /> Refresh
                                </button>
                            </div>

                            <div style={{ background: 'var(--bg-panel)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>INSTRUMENT</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>QTY</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>AVG COST</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>LTP</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>CURR. VALUE</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>TOTAL P&L</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>TODAY'S P&L</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(portfolio.holdings || []).length === 0 ? (
                                            <tr><td colSpan="8"><EmptyState icon="fa-box-open" text="No holdings found in your Demat account." /></td></tr>
                                        ) : (
                                            portfolio.holdings.map((h, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                                    <td style={{ padding: '16px 24px' }}>
                                                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{h.symbol}</div>
                                                        <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '2px' }}>CNC Equity</div>
                                                    </td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{h.qty}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{h.avg.toFixed(2)}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>₹{h.ltp.toFixed(2)}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>₹{h.value.toFixed(2)}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: '700' }} className={h.pnl >= 0 ? 'text-up' : 'text-down'}>
                                                        <div>{h.pnl >= 0 ? '+' : ''}₹{h.pnl.toFixed(2)}</div>
                                                        <div style={{ fontSize: '10px', marginTop: '2px' }}>({h.pnl_pct >= 0 ? '+' : ''}{h.pnl_pct.toFixed(2)}%)</div>
                                                    </td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: '700' }} className={(h.day_pnl || 0) >= 0 ? 'text-up' : 'text-down'}>
                                                        <div>{(h.day_pnl || 0) >= 0 ? '+' : ''}₹{(h.day_pnl || 0).toFixed(2)}</div>
                                                        <div style={{ fontSize: '10px', marginTop: '2px' }}>({(h.day_change || 0) >= 0 ? '+' : ''}{(h.day_change || 0).toFixed(2)}%)</div>
                                                    </td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                            <button 
                                                                className="landing-btn" 
                                                                style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', background: 'rgba(0, 208, 156, 0.1)', color: 'var(--green)' }}
                                                                onClick={() => {
                                                                    setSymbol(h.symbol);
                                                                    setModal({ open: true, type: 'BUY' });
                                                                }}
                                                            >
                                                                Add
                                                            </button>
                                                            <button 
                                                                className="landing-btn" 
                                                                style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', background: 'rgba(235, 91, 60, 0.1)', color: 'var(--red)' }}
                                                                onClick={() => {
                                                                    setSymbol(h.symbol);
                                                                    setModal({ open: true, type: 'SELL' });
                                                                }}
                                                            >
                                                                Exit
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {tab === 'POSITIONS' && (
                        <div style={{ padding: '40px', height: '100%', overflow: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Active Positions ({portfolio.positions?.length || 0})</h2>
                                <button className="nav-item active" style={{ padding: '8px 16px' }} onClick={refresh}>
                                    <i className="fas fa-sync" style={{ marginRight: '6px' }} /> Refresh
                                </button>
                            </div>
                            <div style={{ background: 'var(--bg-panel)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>INSTRUMENT</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>QTY</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>AVG PRICE</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>LTP</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>P&L (MTM)</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>PRODUCT</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(portfolio.positions || []).length === 0 ? (
                                            <tr><td colSpan="7"><EmptyState icon="fa-box-open" text="No active intraday positions." /></td></tr>
                                        ) : (
                                            portfolio.positions.map((p, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                                    <td style={{ padding: '16px 24px', fontWeight: '700', fontSize: '14px' }}>{p.symbol}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: '600' }} className={p.qty >= 0 ? 'text-up' : 'text-down'}>{p.qty}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{p.avg.toFixed(2)}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{p.ltp.toFixed(2)}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: '700' }} className={p.pnl >= 0 ? 'text-up' : 'text-down'}>
                                                        {p.pnl >= 0 ? '+' : ''}₹{p.pnl.toFixed(2)}
                                                    </td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                        <span className="badge">{p.product}</span>
                                                    </td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                        <button 
                                                            className="landing-btn" 
                                                            style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', background: 'rgba(235, 91, 60, 0.1)', color: 'var(--red)' }}
                                                            onClick={async () => {
                                                                if (confirm(`Are you sure you want to square off your position in ${p.symbol}?`)) {
                                                                    try {
                                                                        const r = await fetch('/api/square_off', {
                                                                            method: 'POST',
                                                                            headers: { 'Content-Type': 'application/json' },
                                                                            body: JSON.stringify({ symbol: p.symbol })
                                                                        });
                                                                        if (r.ok) {
                                                                            addToast('success', 'Position Squared Off', `Successfully squared off ${p.symbol}.`);
                                                                            refresh();
                                                                        }
                                                                    } catch (e) {
                                                                        addToast('error', 'Action Failed', 'Failed to square off position.');
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Square Off
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {tab === 'ORDERS' && (
                        <div style={{ padding: '40px', height: '100%', overflow: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Order Book ({portfolio.orders?.length || 0})</h2>
                                <button className="nav-item active" style={{ padding: '8px 16px' }} onClick={refresh}>
                                    <i className="fas fa-sync" style={{ marginRight: '6px' }} /> Refresh
                                </button>
                            </div>
                            <div style={{ background: 'var(--bg-panel)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>TIME</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>TYPE</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>INSTRUMENT</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>PRODUCT</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>QTY</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>PRICE</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(portfolio.orders || []).length === 0 ? (
                                            <tr><td colSpan="7"><EmptyState icon="fa-history" text="No orders placed today." /></td></tr>
                                        ) : (
                                            portfolio.orders.map((o, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                                    <td style={{ padding: '16px 24px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>{o.time}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                        <span className="badge" style={{
                                                            background: o.type === 'BUY' ? 'rgba(0, 208, 156, 0.1)' : 'rgba(235, 91, 60, 0.1)',
                                                            color: o.type === 'BUY' ? 'var(--green)' : 'var(--red)',
                                                            fontWeight: '700'
                                                        }}>
                                                            {o.type === 'BUY' ? '🟢 BUY' : '🔴 SELL'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '16px 24px', fontWeight: '700', fontSize: '14px' }}>{o.symbol}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'center' }}><span className="badge">{o.product}</span></td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{o.qty}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>₹{o.price.toFixed(2)}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                        <span className="badge" style={{ background: 'rgba(0, 208, 156, 0.08)', color: 'var(--green)' }}>
                                                            {o.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><App /></ErrorBoundary>);
