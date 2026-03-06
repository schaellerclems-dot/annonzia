import { useState } from "react";

const FREE_LIMIT = 3;

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "9",
    limit: "30 générations/mois",
    perks: ["30 générations par mois", "Toutes les plateformes", "Mots-clés SEO", "Prix suggéré IA"],
    gumroadUrl: "https://votre-lien-gumroad-starter.com",
    accent: "#ff6b35",
  },
  {
    id: "pro",
    name: "Pro",
    price: "19",
    limit: "Illimité",
    tag: "Populaire",
    perks: ["Générations illimitées", "Toutes les plateformes", "SEO avancé", "Prix suggéré IA", "Nouvelles plateformes en avant-première", "Support prioritaire"],
    gumroadUrl: "https://votre-lien-gumroad-pro.com",
    accent: "#ff6b35",
  },
];

const PLATFORMS = [
  { id: "leboncoin", label: "Leboncoin", icon: "🏠", color: "#f97316" },
  { id: "vinted", label: "Vinted", icon: "👗", color: "#06b6d4" },
  { id: "etsy", label: "Etsy", icon: "🎨", color: "#f59e0b" },
  { id: "amazon", label: "Amazon", icon: "📦", color: "#84cc16" },
];

const PLATFORM_TIPS = {
  leboncoin: "annonce locale, ton direct et honnête, prix négociable",
  vinted: "style décontracté, état du vêtement, mesures, marque mise en avant",
  etsy: "angle artisanal et unique, storytelling, mots-clés SEO anglais/français",
  amazon: "bullet points, caractéristiques techniques, bénéfices client",
};

function PaywallModal({ onClose }) {
  const [selected, setSelected] = useState("pro");
  const plan = PLANS.find((p) => p.id === selected);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"rgba(15,10,5,0.7)", backdropFilter:"blur(20px)" }}>
      <style>{`
        @keyframes modalIn { from{opacity:0;transform:translateY(30px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        .pw-wrap { background:#fff; border-radius:28px; padding:40px 36px; max-width:460px; width:100%; animation:modalIn 0.4s cubic-bezier(0.16,1,0.3,1); position:relative; box-shadow:0 40px 80px rgba(0,0,0,0.15); }
        .pw-close { position:absolute; top:20px; right:20px; background:#f5f0eb; border:none; width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:14px; color:#999; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
        .pw-close:hover { background:#ebe5df; color:#333; }
        .plan-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:24px 0; }
        .plan-card { border-radius:16px; padding:20px 16px; cursor:pointer; border:2px solid transparent; transition:all 0.25s; position:relative; background:#faf7f4; }
        .plan-card:hover { border-color:#ffd4c2; }
        .plan-card.sel { border-color:#ff6b35; background:#fff5f0; }
        .plan-tag-badge { position:absolute; top:-10px; left:50%; transform:translateX(-50%); background:#ff6b35; color:#fff; font-size:10px; font-weight:700; letter-spacing:0.08em; padding:3px 12px; border-radius:20px; white-space:nowrap; font-family:'Plus Jakarta Sans',sans-serif; }
        .plan-name { font-family:'Fraunces',serif; font-size:18px; font-weight:700; color:#1a1008; margin-bottom:4px; }
        .plan-price { font-family:'Fraunces',serif; font-size:32px; font-weight:700; color:#ff6b35; line-height:1; }
        .plan-price span { font-size:13px; color:#aaa; font-family:'Plus Jakarta Sans',sans-serif; font-weight:400; }
        .plan-limit { font-size:11px; color:#ff6b35; font-family:'Plus Jakarta Sans',sans-serif; margin-top:6px; font-weight:600; }
        .perk-list { list-style:none; margin:16px 0 24px; display:flex; flex-direction:column; gap:9px; }
        .perk-item { display:flex; align-items:center; gap:10px; font-size:13px; color:#5a4a3a; font-family:'Plus Jakarta Sans',sans-serif; }
        .perk-dot { width:18px; height:18px; border-radius:50%; background:#fff5f0; border:1.5px solid #ff6b35; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:9px; color:#ff6b35; }
        .pw-cta { display:block; width:100%; padding:16px; background:linear-gradient(135deg,#ff6b35,#ff4500); color:#fff; border:none; border-radius:14px; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700; cursor:pointer; text-decoration:none; text-align:center; transition:all 0.2s; box-shadow:0 8px 24px rgba(255,107,53,0.35); }
        .pw-cta:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(255,107,53,0.45); }
        .pw-note { text-align:center; margin-top:12px; font-size:11px; color:#bbb; font-family:'Plus Jakarta Sans',sans-serif; }
      `}</style>
      <div className="pw-wrap">
        <button className="pw-close" onClick={onClose}>✕</button>
        <div style={{ textAlign:"center", marginBottom:4 }}>
          <div style={{ fontSize:44, marginBottom:12 }}>✨</div>
          <p style={{ fontFamily:"'Fraunces',serif", fontSize:26, fontWeight:700, color:"#1a1008", lineHeight:1.2 }}>
            Passez à la vitesse<br /><span style={{ color:"#ff6b35" }}>supérieure</span>
          </p>
          <p style={{ fontSize:13, color:"#8a7a6a", marginTop:8, fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1.6 }}>
            Vos 3 générations gratuites sont épuisées.<br />Choisissez votre plan pour continuer.
          </p>
        </div>
        <div className="plan-grid">
          {PLANS.map((p) => (
            <div key={p.id} className={`plan-card ${selected === p.id ? "sel" : ""}`} onClick={() => setSelected(p.id)}>
              {p.tag && <span className="plan-tag-badge">{p.tag}</span>}
              <p className="plan-name">{p.name}</p>
              <p className="plan-price">{p.price}€<span>/mois</span></p>
              <p className="plan-limit">{p.limit}</p>
            </div>
          ))}
        </div>
        <ul className="perk-list">
          {plan.perks.map((perk, i) => (
            <li key={i} className="perk-item">
              <span className="perk-dot">✓</span> {perk}
            </li>
          ))}
        </ul>
        <a href={plan.gumroadUrl} target="_blank" rel="noopener noreferrer" className="pw-cta">
          Commencer avec {plan.name} — {plan.price}€/mois
        </a>
        <p className="pw-note">Paiement sécurisé · Résiliable à tout moment</p>
      </div>
    </div>
  );
}

export default function Annonzia() {
  const [platform, setPlatform] = useState("leboncoin");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [usedCount, setUsedCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [focused, setFocused] = useState(false);

  const remaining = FREE_LIMIT - usedCount;
  const isLocked = usedCount >= FREE_LIMIT;

  const generate = async () => {
    if (!description.trim()) return;
    if (isLocked) { setShowPaywall(true); return; }
    setLoading(true); setResult(null); setError(null);

    const platformLabel = PLATFORMS.find((p) => p.id === platform)?.label;
    const tips = PLATFORM_TIPS[platform];
    const prompt = `Tu es un expert en copywriting et vente en ligne. 
Génère une annonce optimisée pour ${platformLabel} à partir de cette description brute : "${description}"
Consignes spécifiques pour ${platformLabel} : ${tips}
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks :
{"titre":"...","description":"...","mots_cles":["...","...","...","...","..."],"prix_suggere":"..."}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:prompt }] }),
      });
      const data = await res.json();
      const text = data.content?.map((b) => b.text||"").join("");
      setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
      setUsedCount((c) => c + 1);
    } catch { setError("Une erreur est survenue. Réessayez."); }
    setLoading(false);
  };

  const copyAll = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.titre}\n\n${result.description}\n\nMots-clés : ${result.mots_cles.join(", ")}\n\nPrix suggéré : ${result.prix_suggere}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const currentPlatform = PLATFORMS.find((p) => p.id === platform);

  return (
    <div style={{ minHeight:"100vh", background:"#fdf8f3", fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#1a1008", position:"relative", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }

        /* Mesh background */
        .mesh {
          position:fixed; inset:0; pointer-events:none; z-index:0;
          background: 
            radial-gradient(ellipse 800px 600px at 10% 20%, rgba(255,107,53,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 600px 500px at 90% 80%, rgba(255,180,100,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 400px 400px at 50% 50%, rgba(255,200,150,0.04) 0%, transparent 60%);
        }

        .container { position:relative; z-index:1; max-width:680px; margin:0 auto; padding:56px 24px 100px; }

        /* Header */
        .header { margin-bottom:52px; }
        .logo-pill {
          display:inline-flex; align-items:center; gap:8px;
          background:#fff; border:1px solid #f0e8e0;
          border-radius:100px; padding:7px 16px 7px 10px;
          margin-bottom:28px;
          box-shadow: 0 2px 12px rgba(255,107,53,0.08);
        }
        .logo-icon { width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#ff6b35,#ff4500); display:flex; align-items:center; justify-content:center; font-size:14px; }
        .logo-text { font-size:13px; font-weight:700; color:#1a1008; letter-spacing:-0.01em; }
        .logo-badge { background:#fff5f0; color:#ff6b35; font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px; letter-spacing:0.06em; }

        h1 { font-family:'Fraunces',serif; font-size:clamp(40px,8vw,72px); font-weight:900; line-height:0.95; letter-spacing:-0.03em; color:#1a1008; }
        h1 em { font-style:italic; color:#ff6b35; }
        .tagline { margin-top:18px; font-size:16px; color:#8a7a6a; line-height:1.6; font-weight:400; max-width:480px; }

        /* Platform selector */
        .section-label { font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#c4b4a4; margin-bottom:12px; display:block; }
        .platforms { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:16px; }
        .p-btn {
          background:#fff; border:1.5px solid #f0e8e0; border-radius:14px;
          padding:14px 8px; cursor:pointer; transition:all 0.22s;
          display:flex; flex-direction:column; align-items:center; gap:7px;
          font-family:'Plus Jakarta Sans',sans-serif; color:#8a7a6a; font-size:11px; font-weight:600;
          box-shadow:0 1px 4px rgba(0,0,0,0.04);
        }
        .p-btn:hover { border-color:#ffd4c2; transform:translateY(-1px); box-shadow:0 4px 12px rgba(255,107,53,0.1); }
        .p-btn.active { border-color:#ff6b35; background:#fff5f0; color:#ff6b35; box-shadow:0 4px 16px rgba(255,107,53,0.15); transform:translateY(-2px); }
        .p-icon { font-size:22px; }

        /* Textarea card */
        .input-card {
          background:#fff; border-radius:20px; padding:20px;
          border:1.5px solid #f0e8e0; margin-bottom:16px;
          transition:all 0.25s;
          box-shadow:0 2px 8px rgba(0,0,0,0.04);
        }
        .input-card.focused { border-color:#ffb894; box-shadow:0 4px 24px rgba(255,107,53,0.1); }
        textarea {
          width:100%; background:transparent; border:none; outline:none;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#1a1008;
          line-height:1.75; resize:none; letter-spacing:0.01em;
        }
        textarea::placeholder { color:#d4c4b4; }
        .char-hint { font-size:11px; color:#d4c4b4; margin-top:8px; text-align:right; }

        /* Counter */
        .counter {
          display:flex; align-items:center; gap:12px; margin-bottom:14px;
          background:#fff; border-radius:14px; padding:12px 18px;
          border:1.5px solid #f0e8e0;
        }
        .dots { display:flex; gap:5px; }
        .dot { width:9px; height:9px; border-radius:50%; transition:all 0.4s; }
        .dot-on { background:#ff6b35; box-shadow:0 0 6px rgba(255,107,53,0.5); }
        .dot-off { background:#f0e8e0; }
        .counter-text { flex:1; font-size:12px; font-weight:600; color:#8a7a6a; }
        .up-btn { font-size:12px; color:#ff6b35; font-weight:700; background:none; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; padding:5px 10px; background:#fff5f0; border-radius:8px; transition:all 0.2s; }
        .up-btn:hover { background:#ffe8dc; }

        /* Generate button */
        .gen-btn {
          width:100%; padding:18px; border:none; border-radius:16px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700;
          cursor:pointer; transition:all 0.25s; position:relative; overflow:hidden;
          letter-spacing:0.01em;
        }
        .gen-btn.free {
          background:linear-gradient(135deg,#ff6b35 0%,#ff4500 100%);
          color:#fff; box-shadow:0 8px 24px rgba(255,107,53,0.35);
        }
        .gen-btn.free:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 32px rgba(255,107,53,0.45); }
        .gen-btn.locked { background:#f5f0eb; color:#c4b4a4; cursor:pointer; }
        .gen-btn.locked:hover { background:#ede8e2; }
        .gen-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none !important; }
        .shimmer {
          position:absolute; inset:0;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation:shimmer 1.5s infinite;
        }
        @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }

        /* Result */
        .result-wrap { margin-top:20px; animation:slideUp 0.45s cubic-bezier(0.16,1,0.3,1); }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .result-card { background:#fff; border-radius:20px; padding:28px; border:1.5px solid #f0e8e0; box-shadow:0 4px 20px rgba(0,0,0,0.06); margin-bottom:10px; }

        .r-eyebrow { font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#d4c4b4; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
        .r-eyebrow::after { content:''; flex:1; height:1px; background:#f0e8e0; }

        .r-title { font-family:'Fraunces',serif; font-size:22px; font-weight:700; color:#1a1008; line-height:1.3; margin-bottom:20px; }
        .r-desc { font-size:14px; color:#5a4a3a; line-height:1.8; }

        .tags-row { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
        .tag { background:#fff5f0; color:#ff6b35; border-radius:8px; padding:5px 12px; font-size:12px; font-weight:600; border:1px solid #ffe0d0; }

        .price-chip {
          display:inline-flex; align-items:center; gap:8px;
          background:linear-gradient(135deg,#f0fdf4,#dcfce7); color:#16a34a;
          border-radius:10px; padding:10px 16px; font-size:15px; font-weight:700;
          border:1px solid #bbf7d0; margin-top:6px;
        }

        .section-divider { height:1px; background:#f5f0eb; margin:20px 0; }

        .copy-btn {
          width:100%; padding:14px; background:#faf7f4; color:#5a4a3a;
          border:1.5px solid #f0e8e0; border-radius:12px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700;
          cursor:pointer; transition:all 0.2s; margin-top:12px; letter-spacing:0.02em;
        }
        .copy-btn:hover { background:#f5f0eb; border-color:#e8ddd5; }
        .copy-btn.ok { background:#f0fdf4; border-color:#bbf7d0; color:#16a34a; }

        .error-msg { background:#fff5f5; border:1px solid #fecaca; color:#dc2626; border-radius:12px; padding:12px 16px; font-size:13px; margin-top:12px; text-align:center; }

        /* Footer */
        .footer { text-align:center; margin-top:56px; }
        .footer-logo { font-family:'Fraunces',serif; font-size:18px; font-weight:700; color:#d4c4b4; margin-bottom:6px; }
        .footer-sub { font-size:11px; color:#d4c4b4; letter-spacing:0.06em; }
      `}</style>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
      <div className="mesh" />

      <div className="container">

        {/* Header */}
        <div className="header">
          <div className="logo-pill">
            <div className="logo-icon">✦</div>
            <span className="logo-text">Annonzia</span>
            <span className="logo-badge">BETA</span>
          </div>
          <h1>Vos annonces,<br /><em>réinventées</em></h1>
          <p className="tagline">
            Transformez une description brute en annonce vendeuse et optimisée — en moins de 10 secondes, propulsée par l'IA.
          </p>
        </div>

        {/* Platform */}
        <span className="section-label">01 — Plateforme cible</span>
        <div className="platforms">
          {PLATFORMS.map((p) => (
            <button key={p.id} className={`p-btn ${platform === p.id ? "active" : ""}`} onClick={() => setPlatform(p.id)}>
              <span className="p-icon">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <span className="section-label">02 — Décrivez votre produit</span>
        <div className={`input-card ${focused ? "focused" : ""}`}>
          <textarea
            rows={5}
            placeholder={`Décrivez votre produit pour ${currentPlatform?.label}...\nEx : veste Levi's taille M, bleu, portée 5 fois, légères traces sur la manche...`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <p className="char-hint">{description.length} caractères</p>
        </div>

        {/* Counter */}
        <div className="counter">
          <div className="dots">
            {Array.from({ length: FREE_LIMIT }).map((_, i) => (
              <div key={i} className={`dot ${i < usedCount ? "dot-on" : "dot-off"}`} />
            ))}
          </div>
          <span className="counter-text">
            {remaining > 0 ? `${remaining} génération${remaining > 1 ? "s" : ""} gratuite${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}` : "Limite atteinte"}
          </span>
          <button className="up-btn" onClick={() => setShowPaywall(true)}>Passer Pro ↗</button>
        </div>

        {/* Button */}
        <button
          className={`gen-btn ${isLocked ? "locked" : "free"}`}
          onClick={generate}
          disabled={loading || (!isLocked && !description.trim())}
        >
          {loading && <span className="shimmer" />}
          {loading ? "Génération en cours..." : isLocked ? "🔒 Débloquer l'accès illimité" : "✦ Générer mon annonce"}
        </button>

        {error && <div className="error-msg">{error}</div>}

        {/* Result */}
        {result && (
          <div className="result-wrap">
            <div className="result-card">
              <p className="r-eyebrow">Titre de l'annonce</p>
              <p className="r-title">{result.titre}</p>

              <p className="r-eyebrow">Description</p>
              <p className="r-desc">{result.description}</p>

              <div className="section-divider" />

              <p className="r-eyebrow">Mots-clés SEO</p>
              <div className="tags-row">
                {result.mots_cles?.map((k, i) => <span key={i} className="tag"># {k}</span>)}
              </div>

              <div className="section-divider" />

              <p className="r-eyebrow">Prix suggéré</p>
              <span className="price-chip">💶 {result.prix_suggere}</span>

              <button className={`copy-btn ${copied ? "ok" : ""}`} onClick={copyAll}>
                {copied ? "✓ Annonce copiée dans le presse-papier !" : "Copier l'annonce complète"}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <p className="footer-logo">Annonzia</p>
          <p className="footer-sub">Propulsé par Claude · Fait en France 🇫🇷</p>
        </div>
      </div>
    </div>
  );
}
