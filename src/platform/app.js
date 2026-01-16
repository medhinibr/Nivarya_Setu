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
        const r = await fetch(`/api/auth/${type.toLowerCase()}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: pass }) });
        const d = await r.json(); setLoading(false);
        if (d.status === 'success') onAuth(d.user || { name: 'Demo User' }); else alert(d.message);
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
        <div style={{ padding: '32px', height: '100%', overflow: 'auto' }}>
            <h2 style={{ marginBottom: '24px' }}>Market Screener</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
                {['ALL', 'TOP_GAINERS', 'TOP_LOSERS'].map(f => (
                    <button key={f} className={`nav-item ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f.replace('_', ' ')}</button>
                ))}
            </div>
            <table style={{ width: '100%' }}>
                <thead><tr><th>Symbol</th><th>Sector</th><th>Price</th><th>Change</th><th>RSI</th></tr></thead>
                <tbody>{data.map(s => (<tr key={s.symbol}><td>{s.symbol}</td><td>{s.sector}</td><td>₹{s.price}</td><td className={s.change > 0 ? 'text-up' : 'text-down'}>{s.change}%</td><td>{s.rsi}</td></tr>))}</tbody>
            </table>
        </div>
    );
};

const ChartWidget = ({ symbol, onTrade }) => {
    const ref = useRef(null);
    useEffect(() => {
        const tv = window.TradingView;
        if (tv && ref.current) {
            ref.current.id = "tv_" + Math.random().toString(36).substr(2, 9);
            new tv.widget({ "autosize": true, "symbol": `BSE:${symbol ? symbol.replace('.NS', '') : "RELIANCE"}`, "interval": "D", "theme": "dark", "container_id": ref.current.id });
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
        <div style={{ padding: '32px', height: '100%', overflow: 'auto' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                {['STOCKCASES', 'IPO', 'MF'].map(s => (<button key={s} className={`nav-item ${section === s ? 'active' : ''}`} onClick={() => setSection(s)}>{s}</button>))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {data.map((item, i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: '700', fontSize: '18px', marginBottom: '12px' }}>{item.name}</div>
                        <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>{item.desc || item.status}</p>
                        <button className="landing-btn" style={{ marginTop: '20px', width: '100%', padding: '10px' }} onClick={() => addToast('success', 'Order Placed', `Request for ${item.name} sent.`)}>Invest</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const OrderModal = ({ isOpen, type, symbol, price, onClose, onSubmit }) => {
    if (!isOpen) return null;
    const [qty, setQty] = useState(1);
    const isBuy = type === 'BUY';
    return (
        <div className="modal-overlay">
            <div className="modal" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>{type} {symbol}</h3>
                <div style={{ marginBottom: '20px' }}><label className="badge">Qty</label><input className="search-input" style={{ width: '100%', paddingLeft: '15px' }} type="number" value={qty} onChange={e => setQty(e.target.value)} /></div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="landing-btn" style={{ flex: 1, background: isBuy ? 'var(--blue)' : 'var(--red)', color: isBuy ? '#000' : '#fff' }} onClick={() => onSubmit({ qty, type: 'MARKET', price })}>{type}</button>
                    <button className="nav-item" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const WATCHLIST_DATA = {
    EQUITY: [{ id: 'RELIANCE.NS', n: 'Reliance', def: 2450 }, { id: 'TCS.NS', n: 'TCS', def: 3240 }, { id: 'HDFCBANK.NS', n: 'HDFC Bank', def: 1650 }, { id: 'INFY.NS', n: 'Infosys', def: 1420 }, { id: 'SBIN.NS', n: 'SBI', def: 580 }],
    FNO: [{ id: 'NIFTY 25OCT FUT', n: 'NIFTY FUT', def: 19650 }, { id: 'BANKNIFTY 25OCT FUT', n: 'BANKNIFTY FUT', def: 44500 }],
    MCX: [{ id: 'GOLD 05OCT FUT', n: 'GOLD', def: 59500 }], CDS: []
};
const ALL_SEGMENTS = [...WATCHLIST_DATA.EQUITY, ...WATCHLIST_DATA.FNO, ...WATCHLIST_DATA.MCX];

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

    const addToast = (type, title, message) => { const id = Date.now(); setToasts(prev => [...prev, { id, type, title, message }]); setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000); };
    const handleAuth = (u) => { localStorage.setItem('auth', 'true'); localStorage.setItem('user', JSON.stringify(u)); setUser(u); setView('APP'); addToast('success', 'Logged In', `Hello, ${u.name}`); };
    const logout = () => { localStorage.clear(); setView('LANDING'); };

    const refresh = async () => {
        if (view !== 'APP') return;
        try {
            const r1 = await fetch('/api/batch_quotes?symbols=' + ALL_SEGMENTS.map(x => x.id).join(','));
            if (r1.ok) setQtys(await r1.json());
            const r2 = await fetch('/api/portfolio');
            if (r2.ok) setPortfolio(await r2.json());
        } catch (e) {}
    };
    useEffect(() => { refresh(); const t = setInterval(refresh, 3000); return () => clearInterval(t); }, [view]);

    if (view === 'LANDING') return <LandingPage onStart={setView} />;
    if (view === 'LOGIN' || view === 'SIGNUP') return <AuthPage type={view} onAuth={handleAuth} onBack={() => setView('LANDING')} />;
    if (['PRIVACY', 'TERMS', 'RISK', 'REFUND'].includes(view)) return <LegalPage type={view} onBack={() => setView('LANDING')} />;

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <ToastContainer toasts={toasts} />
            <OrderModal isOpen={modal.open} type={modal.type} symbol={symbol} price={qtys[symbol]?.price || 0} onClose={() => setModal({ ...modal, open: false })} onSubmit={async (d) => {
                await fetch('/api/place_order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ symbol, side: modal.type, ...d }) });
                setModal({ ...modal, open: false }); addToast('success', 'Order Placed', 'Order processed.'); refresh();
            }} />
            
            <div className="header">
                <div className="logo" onClick={() => setTab('TRADE')}><i className="fas fa-landmark"></i> NIVARYA <span style={{opacity:0.5}}>SETU</span></div>
                <div className="nav">
                    {['TRADE', 'INVEST', 'ORDERS', 'HOLDINGS', 'POSITIONS', 'SCREENER'].map(t => (
                        <div key={t} className={`nav-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</div>
                    ))}
                </div>
                <div className="user-info" onClick={() => setProfileMenu(!profileMenu)} style={{cursor:'pointer'}}>
                    <div style={{ color: 'var(--green)', fontWeight: '700' }}>₹{(portfolio.funds || 0).toLocaleString()}</div>
                    <div className="user-avatar">{user?.name[0]}</div>
                    {profileMenu && <div className="profile-dropdown"><div className="dropdown-item" onClick={logout}>Logout</div></div>}
                </div>
            </div>

            <div className="main">
                {tab === 'TRADE' && (
                    <div className="sidebar">
                        <div className="search-area"><input className="search-input" placeholder="Search..." style={{paddingLeft:'15px'}} /></div>
                        <div className="stock-list custom-scroll">
                            {WATCHLIST_DATA.EQUITY.map(w => (
                                <div key={w.id} className={`stock-item ${symbol === w.id ? 'active' : ''}`} onClick={() => setSymbol(w.id)}>
                                    <div>{w.n}<div style={{fontSize:'10px', color:'var(--text-light)'}}>{w.id}</div></div>
                                    <div className="price-info"><div className={`price-val ${qtys[w.id]?.change >= 0 ? 'text-up' : 'text-down'}`}>₹{qtys[w.id]?.price || w.def}</div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    {tab === 'TRADE' && <div className="center-area" style={{height:'100%'}}><div className="chart-container"><ChartWidget symbol={symbol} onTrade={t => setModal({ open: true, type: t })} /></div><MarketDepth symbol={symbol} /></div>}
                    {tab === 'INVEST' && <InvestDashboard addToast={addToast} />}
                    {tab === 'SCREENER' && <ScreenerDashboard />}
                    {['HOLDINGS', 'POSITIONS', 'ORDERS'].includes(tab) && (
                        <div style={{padding:'40px', height:'100%', overflow:'auto'}}>
                            <h2>{tab}</h2>
                            <table style={{width:'100%', marginTop:'20px'}}>
                                <thead><tr><th>Symbol</th><th>Qty</th><th>Avg</th><th>PnL</th></tr></thead>
                                <tbody>{(portfolio[tab.toLowerCase()] || []).map((p, i) => (<tr key={i}><td>{p.symbol}</td><td>{p.qty}</td><td>{p.avg}</td><td className={p.pnl >= 0 ? 'text-up' : 'text-down'}>{p.pnl}</td></tr>))}</tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><App /></ErrorBoundary>);
