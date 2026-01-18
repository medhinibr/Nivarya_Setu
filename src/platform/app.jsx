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
    const [mode, setMode] = useState('TRADER'); // TRADER | INVESTOR
    const [mobile, setMobile] = useState('');
    const [activeFaq, setActiveFaq] = useState(null);

    // Dynamic rotation to satisfy "changing landing page" requirement
    useEffect(() => {
        const t = setInterval(() => setMode(p => p === 'TRADER' ? 'INVESTOR' : 'TRADER'), 5000);
        return () => clearInterval(t);
    }, []);

    const content = useMemo(() => {
        if (mode === 'TRADER') return {
            tag: "For Super Traders",
            title: <>Lightning Fast <br /><span style={{ color: 'var(--blue)' }}>Futures & Options</span></>,
            desc: "Execute trades in milliseconds with our institutional-grade terminal. Built for speed, precision, and profit.",
            img: "assets/desktop_mockup.png",
            color: 'var(--blue)',
            features: ["Direct TradingView Charts", "Option Chain Analytics", "Instant Pledge Margin"]
        };
        if (mode === 'INVESTOR') return {
            tag: "For Long-Term Investors",
            title: <>Build Generational <br /><span style={{ color: 'var(--green)' }}>Wealth Simpler</span></>,
            desc: "Invest in Stocks, SIPs, IPOs, and Bonds with zero commotion. Smart layout for smarter decisions.",
            img: "assets/hero_mockup.png",
            color: 'var(--green)',
            features: ["0% Brokerage on Delivery", "Smart Stock Baskets", "Automated SIPs"]
        };
        return { // MTF
            tag: "Margin Trading Facility",
            title: <>Get 4x Leverage <br /><span style={{ color: '#ffb300' }}>Pay Later</span></>,
            desc: "Don't let funds limit your potential. Buy stocks with up to 4x leverage and hold them for as long as you want.",
            img: "assets/phone_mockup.png",
            color: '#ffb300',
            features: ["Lowest Interest Rates", "700+ Stocks Available", "Hold Forever"]
        };
    }, [mode]);

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
                    <button className="landing-btn" style={{ padding: '10px 24px', fontSize: '13px', borderRadius: '8px', boxShadow: 'none' }} onClick={() => onStart('SIGNUP')}>Open Account</button>
                </div>
            </div>

            <div className="landing-section hero-section">
                <div key={mode} className="hero-content fade-in" style={{ textAlign: 'left' }}>
                    <div className="hero-toggle">
                        <div className={`hero-tab ${mode === 'TRADER' ? 'active' : ''}`} onClick={() => setMode('TRADER')}>Super Traders</div>
                        <div className={`hero-tab ${mode === 'INVESTOR' ? 'active' : ''}`} onClick={() => setMode('INVESTOR')}>Investors</div>
                        <div className={`hero-tab ${mode === 'MTF' ? 'active' : ''}`} onClick={() => setMode('MTF')}>MTF</div>
                    </div>

                    <div style={{ textTransform: 'uppercase', color: content.color, fontWeight: '800', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>{content.tag}</div>
                    <h1 style={{ fontSize: '72px' }}>{content.title}</h1>
                    <p style={{ maxWidth: '500px', margin: '0 0 40px 0', textAlign: 'left', fontSize: '18px' }}>{content.desc}</p>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {content.features.map((f, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', fontWeight: '500' }}>
                                <i className="fas fa-check-circle" style={{ color: content.color }}></i> {f}
                            </li>
                        ))}
                    </ul>

                    <div className="input-bar" style={{ margin: '0 0 32px 0' }}>
                        <input type="text" placeholder="Enter mobile number" value={mobile} onChange={e => setMobile(e.target.value)} />
                        <button className="landing-btn" onClick={() => onStart('SIGNUP')} style={{ background: content.color }}>Get Started</button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div style={{ position: 'relative' }}>
                        <img key={mode} src={content.img} className="hero-img fade-in" alt="Platform Mockup" style={{ maxHeight: '600px', objectFit: 'contain' }} />
                        <div style={{ position: 'absolute', bottom: -40, right: -40, background: 'rgba(20,20,20,0.9)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '8px' }}>Market Status</div>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--green)' }}>Live & Active</div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }}></div>
                                <span style={{ fontSize: '12px', color: '#fff' }}>NSE & BSE Connected</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="landing-section" style={{ background: '#050608' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                    <div>
                        <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px' }}>Technology <span style={{ color: 'var(--blue)' }}>First</span></h2>
                        <p style={{ color: 'var(--text-light)', maxWidth: '500px' }}>We don't just provide a platform; we provide an edge. Engineered for those who refuse to settle for lag.</p>
                    </div>
                    <button className="nav-item" onClick={() => onStart('SIGNUP')}>Create Account <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i></button>
                </div>

                <div className="stock-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', overflow: 'visible' }}>
                    {[
                        { icon: 'fa-bolt', title: 'Flash Trade', desc: 'Buy/Sell options in a single click from the chart.' },
                        { icon: 'fa-wifi', title: 'Nivarya WiFi', desc: 'Sync your mobile and web charts instantly.' },
                        { icon: 'fa-layer-group', title: 'Basket Orders', desc: 'Execute multi-leg strategies in one go.' },
                        { icon: 'fa-chart-pie', title: 'Portfolio Analytics', desc: 'Deep dive into your P&L with X-ray vision.' },
                        { icon: 'fa-robot', title: 'Algo Ready', desc: 'Connect your Python strategies via free API.' },
                        { icon: 'fa-shield-alt', title: 'Secure & Safe', desc: '2FA protection and bank-grade encryption.' }
                    ].map((item, idx) => (
                        <div key={idx} className="feature-card">
                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(55, 125, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                <i className={`fas ${item.icon}`} style={{ fontSize: '20px', color: 'var(--blue)' }}></i>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="landing-section" style={{ paddingTop: '100px', paddingBottom: '140px' }}>
                <div style={{ display: 'flex', gap: '80px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <img src="assets/phone_mockup.png" style={{ width: '100%', borderRadius: '30px', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }} alt="Mobile App" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ textTransform: 'uppercase', color: 'var(--green)', fontWeight: '800', fontSize: '12px', letterSpacing: '2px', marginBottom: '24px' }}>On The Go</div>
                        <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '24px', lineHeight: '1.1' }}>Trade Everywhere.<br />Miss Nothing.</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
                            Experience the full power of the desktop terminal on your mobile browser. Fully responsive, lightning fast, and no downloads required.
                        </p>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <button className="landing-btn" style={{ background: '#fff', color: '#000', padding: '16px 32px' }} onClick={() => onStart('SIGNUP')}>Launch Web App</button>
                            <div style={{ color: 'var(--text-light)', fontSize: '13px' }}>
                                <i className="fas fa-info-circle" style={{ marginRight: '6px' }}></i>
                                Native Apps Coming Soon
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="landing-section" style={{ borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '40px', justifyContent: 'center' }}>
                    {['PRIVACY', 'TERMS', 'RISK', 'REFUND'].map(type => (
                        <span key={type} onClick={() => onStart(type)} style={{ fontSize: '13px', color: 'var(--text-light)', cursor: 'pointer', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {type === 'PRIVACY' ? 'Privacy Policy' : type === 'TERMS' ? 'Terms & Conditions' : type === 'RISK' ? 'Risk Disclosure' : 'Refund Policy'}
                        </span>
                    ))}
                </div>
                <div className="disclosure-text" style={{ fontSize: '12px', color: 'var(--text-light)', opacity: 0.5, textAlign: 'center', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                    © 2026 Nivarya Setu Financial Services. All rights reserved. <br />
                    Investments in the securities market are subject to market risks. Read all the related documents carefully before investing. Brokerage will not exceed the SEBI prescribed limit.
                </div>
            </div>

            <div className="sticky-footer-bar">
                <div style={{ fontSize: '14px', fontWeight: '700' }}>Open Demat Account <span style={{ color: 'var(--green)' }}>FREE</span></div>
                <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
                <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>Join Serious Traders</div>
                <button className="landing-btn" style={{ padding: '8px 24px', fontSize: '13px', height: 'auto', borderRadius: '100px' }} onClick={() => onStart('SIGNUP')}>Start Now</button>
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
        <div className="auth-split-container">
            <div className="auth-info-side">
                <div className="auth-info-content">
                    <div style={{ color: 'var(--blue)', fontWeight: '800', letterSpacing: '2px', marginBottom: '20px' }}>NIVARYA SETU</div>
                    <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '24px', lineHeight: '1.2' }}>
                        Welcome to the <br /> <span style={{ color: '#fff' }}>Future of Trading</span>
                    </h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
                        Access institutional-grade tools, real-time analytics, and zero-brokerage delivery trades. Trusted by serious traders.
                    </p>
                    <div className="auth-feature-list">
                        <div className="auth-feature-item">
                            <div className="auth-feature-icon"><i className="fas fa-bolt"></i></div>
                            <div>
                                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Lightning Execution</h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Low latency trade execution for the fastest market entry.</p>
                            </div>
                        </div>
                        <div className="auth-feature-item">
                            <div className="auth-feature-icon"><i className="fas fa-shield-alt"></i></div>
                            <div>
                                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>Bank-Grade Security</h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>256-bit encryption and 2FA protection for your funds.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="auth-form-side">
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <button className="nav-item" onClick={onBack} style={{ marginBottom: '32px', paddingLeft: 0 }}><i className="fas fa-arrow-left"></i> Back to Home</button>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>{type === 'LOGIN' ? 'Welcome Back' : 'Create Account'}</h2>
                    <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>{type === 'LOGIN' ? 'Enter your credentials to access your terminal.' : 'Start your financial journey in seconds.'}</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div><label className="badge" style={{ marginBottom: '8px', display: 'block' }}>Email</label><input className="search-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ paddingLeft: '15px' }} /></div>
                        <div><label className="badge" style={{ marginBottom: '8px', display: 'block' }}>Password</label><input className="search-input" type="password" value={pass} onChange={e => setPass(e.target.value)} required style={{ paddingLeft: '15px' }} /></div>
                        <button className="landing-btn" disabled={loading} style={{ width: '100%', borderRadius: '12px' }}>{loading ? 'Processing...' : (type === 'LOGIN' ? 'Login to Terminal' : 'Create Free Account')}</button>
                    </form>
                    <div style={{ margin: '24px 0', textAlign: 'center', color: 'var(--text-light)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Or continue with</div>
                    <button className="landing-btn" onClick={handleGoogleLogin} style={{ width: '100%', background: 'var(--bg-card)', color: '#fff', border: '1px solid var(--border)', borderRadius: '12px' }}><i className="fab fa-google"></i> Google Login</button>
                </div>
            </div>
        </div>
    );
};

const LegalPage = ({ type, onBack }) => {
    const policies = {
        PRIVACY: {
            title: "Privacy Policy",
            updated: "Jan 1, 2026",
            content: (
                <>
                    <p>At Nivarya Setu, we prioritize the trust you place in us when sharing your personal and financial data. This policy outlines our improved standards for data protection.</p>

                    <h3>1. Information Collection</h3>
                    <p>We collect information necessary to provide our trading services, including basic KYC details (Name, PAN, Aadhaar), financial history, and device telemetry for security purposes.</p>

                    <h3>2. Data Usage</h3>
                    <p>Your data is used solely for:</p>
                    <ul>
                        <li>Executing trades on exchanges (NSE/BSE).</li>
                        <li>Compliance with SEBI and PMLA regulations.</li>
                        <li>Improving platform performance and stability.</li>
                    </ul>

                    <h3>3. Data Security</h3>
                    <p>We employ military-grade AES-256 encryption for data at rest and TLS 1.3 for data in transit. We do not sell your personal data to third parties.</p>
                </>
            )
        },
        TERMS: {
            title: "Terms & Conditions",
            updated: "Jan 1, 2026",
            content: (
                <>
                    <p>Welcome to Nivarya Setu. By accessing our platform, you agree to be bound by these terms. If you do not agree, strictly do not use our services.</p>

                    <h3>1. Eligibility</h3>
                    <p>You must be an Indian resident, 18 years or older, with a valid PAN and bank account to open a Demat account.</p>

                    <h3>2. Acceptable Use</h3>
                    <p>You agree not to use the platform for any unlawful activities, including money laundering or market manipulation. Algo-trading APIs must be used in compliance with exchange guidelines.</p>

                    <h3>3. Limitation of Liability</h3>
                    <p>Nivarya Setu is a technology provider. We are not liable for losses due to market volatility, technical failures (isp/exchange side), or user error.</p>
                </>
            )
        },
        RISK: {
            title: "Risk Disclosure",
            updated: "Jan 1, 2026",
            content: (
                <>
                    <div style={{ background: 'rgba(235, 91, 60, 0.1)', borderLeft: '4px solid var(--red)', padding: '16px', marginBottom: '24px' }}>
                        <strong>WARNING:</strong> Investments in the securities market are subject to market risks. Read all the related documents carefully before investing.
                    </div>

                    <h3>1. Market Risk</h3>
                    <p>The value of securities can fluctuate significantly. Past performance is not indicative of future results.</p>

                    <h3>2. Derivatives Risk (F&O)</h3>
                    <p>Derivatives are leveraged products. A small price movement can lead to the complete loss of your capital. 9 out of 10 individual traders in equity Future and Options Segment incurred net losses.</p>

                    <h3>3. Technology Risk</h3>
                    <p>While we strive for 99.9% uptime, internet-based trading is subject to connection failures. We recommend maintaining backup modes of trading (Call & Trade).</p>
                </>
            )
        },
        REFUND: {
            title: "Refund Policy",
            updated: "Jan 1, 2026",
            content: (
                <>
                    <p>Nivarya Setu aims for transparency in billing. This policy clarifies our refund structure.</p>

                    <h3>1. Account Opening Fees</h3>
                    <p>If applicable, account opening fees are non-refundable once the KYC process has been initiated with the KRAs/Exchanges.</p>

                    <h3>2. Brokerage & Taxes</h3>
                    <p>Brokerage charged on executed trades is non-refundable. STT, GST, and Stamp Duty are collected on behalf of the government and cannot be refunded.</p>

                    <h3>3. Software Subscriptions</h3>
                    <p>Pro-rata refunds are available for annual software subscriptions if cancelled within 7 days of purchase. No refunds for monthly plans.</p>
                </>
            )
        }
    };

    const doc = policies[type] || { title: "Legal", content: "Information not found." };

    return (
        <div style={{ minHeight: '100vh', background: '#000', padding: '60px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <button className="nav-item" onClick={onBack} style={{ paddingLeft: 0, color: 'var(--text-light)' }}>
                        <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Back to Home
                    </button>
                    <div style={{ fontSize: '12px', color: 'var(--text-light)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '100px' }}>
                        Legal Compliance
                    </div>
                </div>

                <div className="fade-in" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '24px', padding: '60px', position: 'relative', overflow: 'hidden' }}>
                    {/* Decorative Background */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 208, 156, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

                    <div style={{ marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '30px' }}>
                        <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px' }}>{doc.title}</h1>
                        <div style={{ color: 'var(--text-light)', fontSize: '14px' }}>Last Updated: {doc.updated || 'Jan 1, 2026'}</div>
                    </div>

                    <div className="legal-content" style={{ fontSize: '16px', lineHeight: '1.8', color: '#ccc' }}>
                        {doc.content}
                    </div>

                    <div style={{ marginTop: '60px', paddingTop: '30px', borderTop: '1px solid var(--border)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                            <i className="fas fa-shield-alt" style={{ color: 'var(--green)' }}></i>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                            Nivarya Setu Financial Services · SEBI Reg. No. INZ0001234567
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .legal-content h3 { font-size: 20px; font-weight: 700; margin: 40px 0 16px 0; color: #fff; }
                .legal-content p { margin-bottom: 16px; }
                .legal-content ul { padding-left: 20px; margin-bottom: 16px; }
                .legal-content li { marginBottom: 8px; }
            `}</style>
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
                            <button className="landing-btn" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '8px' }} onClick={() => addToast('success', 'Order Placed', `Request for ${item.name} sent.`)}>Invest</button>
                        </div>
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
                        <label className="badge" style={{ marginBottom: '12px', display: 'block', width: 'fit-content' }}>QUANTITY (SHARES)</label>
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
                        <button className="landing-btn" style={{ flex: 1, background: isBuy ? 'var(--green)' : 'var(--red)', color: isBuy ? '#000' : '#fff' }} onClick={() => onSubmit({ qty, type: 'MARKET', price })}>Place {type} Order</button>
                        <button className="nav-item" onClick={onClose} style={{ padding: '20px' }}>Dismiss</button>
                    </div>
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
        } catch (e) { }
    };
    useEffect(() => { window.scrollTo(0, 0); }, [view]);

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
                    <div style={{ color: 'var(--green)', fontWeight: '800', fontSize: '15px' }}>₹{(portfolio.funds || 0).toLocaleString()}</div>
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
                        <div className="search-area">
                            <i className="fas fa-search" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '40px', color: 'var(--text-light)', opacity: 0.5 }}></i>
                            <input className="search-input" placeholder="Search instrument..." />
                        </div>
                        <div className="stock-list custom-scroll">
                            {WATCHLIST_DATA.EQUITY.map(w => (
                                <div key={w.id} className={`stock-item ${symbol === w.id ? 'active' : ''}`} onClick={() => setSymbol(w.id)}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{w.n}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '2px' }}>{w.id}</div>
                                    </div>
                                    <Sparkline color={qtys[w.id]?.change >= 0 ? 'var(--green)' : 'var(--red)'} />
                                    <div className="price-info">
                                        <div className={`price-val ${qtys[w.id]?.change >= 0 ? 'text-up' : 'text-down'}`}>₹{qtys[w.id]?.price || w.def}</div>
                                        <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '2px' }}>{qtys[w.id]?.change >= 0 ? '+' : ''}{qtys[w.id]?.change || '0.00'}%</div>
                                    </div>
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
                    {['HOLDINGS', 'POSITIONS', 'ORDERS'].includes(tab) && (
                        <div style={{ padding: '60px', height: '100%', overflow: 'auto' }}>
                            <h1 style={{ fontSize: '32px', marginBottom: '40px', fontWeight: '800' }}>{tab}</h1>
                            <div style={{ background: 'var(--bg-panel)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                            <th style={{ padding: '20px 30px', textAlign: 'left', fontSize: '11px', color: 'var(--text-light)' }}>INSTRUMENT</th>
                                            <th style={{ padding: '20px 30px', textAlign: 'left', fontSize: '11px', color: 'var(--text-light)' }}>QTY</th>
                                            <th style={{ padding: '20px 30px', textAlign: 'left', fontSize: '11px', color: 'var(--text-light)' }}>AVG PRICE</th>
                                            <th style={{ padding: '20px 30px', textAlign: 'right', fontSize: '11px', color: 'var(--text-light)' }}>P&L (UNREALIZED)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(portfolio[tab.toLowerCase()] || []).length === 0 ? (
                                            <tr><td colSpan="4"><EmptyState icon="fa-box-open" text={`No ${tab.toLowerCase()} found.`} /></td></tr>
                                        ) : (
                                            (portfolio[tab.toLowerCase()] || []).map((p, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                                    <td style={{ padding: '20px 30px', fontWeight: '700' }}>{p.symbol}</td>
                                                    <td style={{ padding: '20px 30px' }}>{p.qty}</td>
                                                    <td style={{ padding: '20px 30px', fontFamily: 'var(--font-mono)' }}>₹{p.avg}</td>
                                                    <td style={{ padding: '20px 30px', textAlign: 'right', fontWeight: '800', fontFamily: 'var(--font-mono)' }} className={p.pnl >= 0 ? 'text-up' : 'text-down'}>
                                                        {p.pnl >= 0 ? '+' : ''}{p.pnl.toLocaleString()}
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
