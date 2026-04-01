import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Wallet,
  Lock,
  TrendingUp,
  Server,
  Clock3,
  Zap,
  Globe,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";


/* =========================
   MOCK DATA
========================= */
const payoutTable = [
  { minutes: 15, payout: 45 },
  { minutes: 30, payout: 89 },
  { minutes: 45, payout: 132 },
  { minutes: 60, payout: 176 },
  { minutes: 90, payout: 249 },
  { minutes: 120, payout: 325 },
];

const chartData = [
  { day: "Po", price: 150 },
  { day: "Út", price: 162 },
  { day: "St", price: 171 },
  { day: "Čt", price: 165 },
  { day: "Pá", price: 184 },
  { day: "So", price: 191 },
  { day: "Ne", price: 182 },
];

const marketOffers = [
  {
    id: 1,
    status: "Aktivní",
    price: 189,
    title: "EU VPS time - stabilní výkon",
    seller: "rootx",
    rating: "98.2 %",
    uptime: "99.4 %",
  },
  {
    id: 2,
    status: "Ověřeno",
    price: 212,
    title: "High uptime VPS slot",
    seller: "darknode",
    rating: "97.1 %",
    uptime: "99.8 %",
  },
  {
    id: 3,
    status: "Nové",
    price: 165,
    title: "Budget VPS runtime",
    seller: "syscz",
    rating: "95.4 %",
    uptime: "98.9 %",
  },
];

/* =========================
   SIMPLE UI COMPONENTS
========================= */
function Button({ children, className = "", ...props }) {
  return (
    <button className={`btn ${className}`} {...props}>
      {children}
    </button>
  );
}

function Input({ className = "", ...props }) {
  return <input className={`input ${className}`} {...props} />;
}

function Badge({ children, className = "" }) {
  return <span className={`badge ${className}`}>{children}</span>;
}

function Card({ children, className = "", ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

function StatCard({ icon, title, value, sub }) {
  return (
    <Card className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        <Badge>{sub}</Badge>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
    </Card>
  );
}

/* =========================
   REGISTER MODAL
========================= */
function RegisterModal({ open, onClose }) {
  const [registerForm, setRegisterForm] = useState({
    login: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegisterChange = (e) => {
    setRegisterForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://haxtrade-bbec4-default-rtdb.europe-west1.firebasedatabase.app/registrations.jsonnp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: registerForm.login,
          email: registerForm.email,
          createdAt: new Date().toISOString()
        }),
      });

      if (!res.ok) {
        throw new Error("Odeslání selhalo");
      }

      setMessage("Údaje byly odeslány.");
      setRegisterForm({
        login: "",
        email: "",
      });
    } catch (error) {
      setMessage(error.message || "Chyba při odeslání.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="section-eyebrow">Registrace</div>
            <h2>Vytvořit účet</h2>
          </div>
          <button className="icon-close" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <p className="modal-text">
          Zaregistrujte se pro přístup do HaxaTrade marketplace.
        </p>

        <form className="credentials-form" onSubmit={handleRegister}>
          <div>
            <label>Login</label>
            <Input
              name="login"
              placeholder="např. haxar123"
              value={registerForm.login}
              onChange={handleRegisterChange}
              required
            />
          </div>

          <div>
            <label>Email</label>
            <Input
              type="email"
              name="email"
              placeholder="vas@email.cz"
              value={registerForm.email}
              onChange={handleRegisterChange}
              required
            />
          </div>

          <div>
            <label>Heslo</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={registerForm.password}
              onChange={handleRegisterChange}
              required
            />
          </div>

          {message && <div className="register-message">{message}</div>}

          <Button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Probíhá registrace..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}

/* =========================
   MAIN APP
========================= */
export default function App() {
  const [form, setForm] = useState({
    ip: "",
    port: "",
    username: "",
    password: "",
    minutes: "60",
  });

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [hasTriggeredPopup, setHasTriggeredPopup] = useState(false);

  const selectedMinutes = Number(form.minutes || 0);

  const estimatedPayout = useMemo(() => {
    const exact = payoutTable.find((x) => x.minutes === selectedMinutes);
    return exact ? exact.payout : 0;
  }, [selectedMinutes]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Credentials byly vloženy.\nOdhadovaná výkupní cena: ${estimatedPayout} Kč`
    );
  };

  /* =========================================
     POPUP po prvním kliknutí kamkoliv
  ========================================= */
  useEffect(() => {
    const handleFirstClick = () => {
      if (!hasTriggeredPopup) {
        setShowRegisterModal(true);
        setHasTriggeredPopup(true);
      }
    };

    document.addEventListener("click", handleFirstClick);

    return () => {
      document.removeEventListener("click", handleFirstClick);
    };
  }, [hasTriggeredPopup]);

  return (
    <div className="app-shell">
      <RegisterModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />

      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-grid" />

      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-logo">HX</div>
          <div>
            <div className="brand-title">HaxaTrade</div>
            <div className="brand-sub">VPS time marketplace</div>
          </div>
        </div>

        <nav className="topnav">
          <a href="#trh">Trh</a>
          <a href="#vykup">Výkup</a>
          <a href="#statistiky">Statistiky</a>
          <a href="#bezpecnost">Bezpečnost</a>
        </nav>

        <Button onClick={() => setShowRegisterModal(true)}>Přihlásit se</Button>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-left">
            <Badge className="hero-badge">Fialovo-černo-bílý marketplace</Badge>

            <h1 className="hero-title">
              Nakupujte a prodávejte svůj VPS time na haxagonu rychle a
              přehledně
            </h1>

            <p className="hero-text">
              Přehledná platforma pro výkup a prodej dostupného VPS času.
              Vložte získané credentials, okamžitě uvidíte výkupní cenu a
              nabídněte svůj VPS time na trhu v Kč.
            </p>

            <div className="hero-actions">
              <Button>
                Začít prodávat <ArrowRight size={16} />
              </Button>
              <Button className="btn-secondary">Prohlédnout nabídky</Button>
            </div>

            <div className="hero-features">
              <div className="hero-feature">
                <CheckCircle2 size={18} />
                <span>Rychlý výkup</span>
              </div>
              <div className="hero-feature">
                <Shield size={18} />
                <span>Ověřené nabídky</span>
              </div>
              <div className="hero-feature">
                <Wallet size={18} />
                <span>Vyplácení v Kč</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <Card className="credentials-card" id="vykup">
              <div className="section-head">
                <div>
                  <div className="section-eyebrow">Vložit credentials</div>
                  <h2>Získat peníze za VPS</h2>
                </div>
                <Badge>Bezpečný submit</Badge>
              </div>

              <form className="credentials-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div>
                    <label>IP adresa</label>
                    <Input
                      name="ip"
                      placeholder="185.xxx.xxx.xxx"
                      value={form.ip}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>Port</label>
                    <Input
                      name="port"
                      placeholder="22"
                      value={form.port}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>Uživatel</label>
                    <Input
                      name="username"
                      placeholder="root"
                      value={form.username}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>Heslo</label>
                    <Input
                      type="password"
                      name="password"
                      placeholder="••••••••••"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label>Funkční čas VPS</label>
                  <select
                    className="input"
                    name="minutes"
                    value={form.minutes}
                    onChange={handleChange}
                  >
                    {payoutTable.map((row) => (
                      <option key={row.minutes} value={row.minutes}>
                        {row.minutes} minut
                      </option>
                    ))}
                  </select>
                </div>

                <div className="estimate-box">
                  <div>
                    <div className="estimate-label">Odhadovaná výkupní cena</div>
                    <div className="estimate-value">{estimatedPayout} Kč</div>
                  </div>
                  <div className="estimate-icon">
                    <Wallet size={20} />
                  </div>
                </div>

                <Button type="submit" className="submit-btn">
                  Odeslat credentials a získat peníze
                </Button>

                <div className="safe-note">
                  <Lock size={16} />
                  <span>
                    Údaje slouží pouze pro ověření a výkup VPS time.
                  </span>
                </div>
              </form>
            </Card>
          </div>
        </section>

        <section className="stats-grid" id="statistiky">
          <StatCard
            icon={<TrendingUp size={18} />}
            title="Průměrná cena trhu"
            value="182 Kč"
            sub="+12.4 %"
          />
          <StatCard
            icon={<Server size={18} />}
            title="Aktivní nabídky"
            value="248"
            sub="live"
          />
          <StatCard
            icon={<Clock3 size={18} />}
            title="Prodáno dnes"
            value="731 h"
            sub="24 h"
          />
          <StatCard
            icon={<Zap size={18} />}
            title="Rychlost výkupu"
            value="< 2 min"
            sub="instant"
          />
        </section>

        <section className="content-grid">
          <Card className="left-panel">
            <div className="section-head">
              <div>
                <div className="section-eyebrow">Výkupní tabulka</div>
                <h2>Kolik dostaneš za funkční VPS</h2>
              </div>
              <Badge>Kč</Badge>
            </div>

            <div className="table-wrap">
              <table className="price-table">
                <thead>
                  <tr>
                    <th>Funkční čas</th>
                    <th>Výkupní cena</th>
                    <th>Likvidita</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutTable.map((row) => (
                    <tr key={row.minutes}>
                      <td>{row.minutes} minut</td>
                      <td>{row.payout} Kč</td>
                      <td>
                        <span className="liquidity-pill">Vysoká</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="right-panel">
            <div className="section-head">
              <div>
                <div className="section-eyebrow">Cenový trend</div>
                <h2>Vývoj tržní ceny VPS time</h2>
              </div>
              <Badge>7 dní</Badge>
            </div>

            <div className="chart-box">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="purpleFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.45)" />
                  <YAxis stroke="rgba(255,255,255,0.45)" />
                  <Tooltip
                    contentStyle={{
                      background: "#0b0b12",
                      border: "1px solid rgba(168,85,247,0.25)",
                      borderRadius: "14px",
                      color: "white",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#a855f7"
                    fill="url(#purpleFill)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <section className="market-section" id="trh">
          <div className="section-head market-head">
            <div>
              <div className="section-eyebrow">Marketplace</div>
              <h2>Aktuální nabídky VPS time</h2>
            </div>
            <Button className="btn-secondary">Zobrazit vše</Button>
          </div>

          <div className="offers-grid">
            {marketOffers.map((offer) => (
              <Card key={offer.id} className="offer-card">
                <div className="offer-top">
                  <Badge>{offer.status}</Badge>
                  <div className="offer-price">{offer.price} Kč</div>
                </div>

                <h3>{offer.title}</h3>

                <div className="offer-meta">
                  <div>
                    <span>Prodejce</span>
                    <strong>{offer.seller}</strong>
                  </div>
                  <div>
                    <span>Úspěšnost</span>
                    <strong>{offer.rating}</strong>
                  </div>
                  <div>
                    <span>Dostupnost</span>
                    <strong>{offer.uptime}</strong>
                  </div>
                </div>

                <Button className="buy-btn">Koupit VPS time</Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="security-grid" id="bezpecnost">
          <Card>
            <div className="security-item">
              <div className="icon-box">
                <Shield size={18} />
              </div>
              <div>
                <h3>Ověřené nabídky</h3>
                <p>
                  Každý VPS time lze před publikací validovat a zařadit do trhu.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="security-item">
              <div className="icon-box">
                <Lock size={18} />
              </div>
              <div>
                <h3>Bezpečné zpracování</h3>
                <p>
                  Credentials se používají pouze pro kontrolu funkčnosti a výkup.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="security-item">
              <div className="icon-box">
                <Globe size={18} />
              </div>
              <div>
                <h3>Moderní přehledné prostředí</h3>
                <p>
                  Tmavý cyber styl pro rychlý přehled trhu, cen i aktivních VPS.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, sans-serif;
          background: #050508;
          color: white;
        }

        .app-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at top left, rgba(168,85,247,0.18), transparent 30%),
            radial-gradient(circle at bottom right, rgba(255,255,255,0.04), transparent 35%),
            #050508;
        }

        .bg-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(100px);
          opacity: 0.18;
          pointer-events: none;
        }

        .bg-orb-1 {
          width: 280px;
          height: 280px;
          background: #a855f7;
          top: 80px;
          left: -80px;
        }

        .bg-orb-2 {
          width: 300px;
          height: 300px;
          background: #7c3aed;
          bottom: 40px;
          right: -60px;
        }

        .bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 90%);
          pointer-events: none;
        }

        .topbar,
        .container {
          position: relative;
          z-index: 2;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
        }

        .brand-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-logo {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: linear-gradient(135deg, #a855f7, #7c3aed);
          font-weight: 800;
        }

        .brand-title {
          font-size: 18px;
          font-weight: 800;
        }

        .brand-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
        }

        .topnav {
          display: flex;
          gap: 20px;
        }

        .topnav a {
          color: rgba(255,255,255,0.72);
          text-decoration: none;
          font-size: 14px;
        }

        .container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 28px;
          align-items: center;
          margin-bottom: 28px;
        }

        .hero-title {
          font-size: 48px;
          line-height: 1.05;
          margin: 16px 0;
          max-width: 760px;
        }

        .hero-text {
          color: rgba(255,255,255,0.72);
          font-size: 16px;
          line-height: 1.7;
          max-width: 650px;
        }

        .hero-actions,
        .hero-features {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .hero-feature {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.82);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 10px 14px;
          border-radius: 999px;
        }

        .card {
          background: rgba(12,12,18,0.82);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.25);
          backdrop-filter: blur(14px);
        }

        .credentials-card {
          padding: 28px;
        }

        .section-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
        }

        .section-eyebrow {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #c084fc;
          margin-bottom: 8px;
        }

        .section-head h2 {
          margin: 0;
          font-size: 26px;
        }

        .credentials-form,
        .form-grid {
          display: grid;
          gap: 16px;
        }

        .form-grid {
          grid-template-columns: 1fr 1fr;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255,255,255,0.82);
        }

        .input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          border-radius: 14px;
          padding: 14px 16px;
          outline: none;
        }

        .input:focus {
          border-color: rgba(168,85,247,0.7);
          box-shadow: 0 0 0 4px rgba(168,85,247,0.12);
        }

        .btn {
          border: none;
          background: linear-gradient(135deg, #a855f7, #7c3aed);
          color: white;
          padding: 13px 18px;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 700;
          background: rgba(168,85,247,0.12);
          color: #d8b4fe;
          border: 1px solid rgba(168,85,247,0.24);
        }

        .estimate-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px;
          border-radius: 18px;
          background: rgba(168,85,247,0.08);
          border: 1px solid rgba(168,85,247,0.16);
        }

        .estimate-label {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
        }

        .estimate-value {
          font-size: 28px;
          font-weight: 800;
          margin-top: 4px;
        }

        .estimate-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(255,255,255,0.06);
        }

        .safe-note {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.62);
          font-size: 13px;
        }

        .stats-grid,
        .content-grid,
        .offers-grid,
        .security-grid {
          display: grid;
          gap: 20px;
          margin-top: 28px;
        }

        .stats-grid {
          grid-template-columns: repeat(4, 1fr);
        }

        .content-grid {
          grid-template-columns: 1.05fr 0.95fr;
        }

        .offers-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        .security-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        .stat-top,
        .offer-top,
        .security-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-icon,
        .icon-box {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: rgba(168,85,247,0.12);
          color: #d8b4fe;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          margin-top: 16px;
        }

        .stat-title {
          margin-top: 6px;
          color: rgba(255,255,255,0.68);
        }

        .table-wrap {
          overflow-x: auto;
        }

        .price-table {
          width: 100%;
          border-collapse: collapse;
        }

        .price-table th,
        .price-table td {
          text-align: left;
          padding: 14px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .liquidity-pill {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(34,197,94,0.12);
          color: #86efac;
          font-size: 12px;
          font-weight: 700;
        }

        .chart-box {
          padding-top: 12px;
        }

        .market-head {
          margin-top: 8px;
        }

        .offer-card h3 {
          margin-top: 16px;
          margin-bottom: 18px;
        }

        .offer-price {
          font-size: 22px;
          font-weight: 800;
        }

        .offer-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }

        .offer-meta span {
          display: block;
          color: rgba(255,255,255,0.55);
          font-size: 12px;
          margin-bottom: 4px;
        }

        .buy-btn,
        .submit-btn {
          width: 100%;
          justify-content: center;
        }

        .security-item {
          gap: 16px;
          align-items: flex-start;
          justify-content: flex-start;
        }

        .security-item h3 {
          margin: 0 0 8px;
        }

        .security-item p {
          margin: 0;
          color: rgba(255,255,255,0.68);
          line-height: 1.65;
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .modal-card {
          width: 100%;
          max-width: 480px;
          background: rgba(12,12,18,0.98);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 30px 100px rgba(0,0,0,0.5);
        }

        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 10px;
        }

        .modal-text {
          color: rgba(255,255,255,0.68);
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .icon-close {
          width: 38px;
          height: 38px;
          border: none;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .register-message {
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(168,85,247,0.08);
          border: 1px solid rgba(168,85,247,0.16);
          color: #e9d5ff;
          font-size: 14px;
        }

        @media (max-width: 1100px) {
          .hero,
          .content-grid,
          .stats-grid,
          .offers-grid,
          .security-grid {
            grid-template-columns: 1fr;
          }

          .topnav {
            display: none;
          }
        }

        @media (max-width: 720px) {
          .hero-title {
            font-size: 34px;
          }

          .form-grid,
          .offer-meta {
            grid-template-columns: 1fr;
          }

          .topbar {
            padding: 20px;
          }

          .container {
            padding: 28px 16px 60px;
          }
        }
      `}</style>
    </div>
  );
}