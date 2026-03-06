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
  },
  {
    id: "pro",
    name: "Pro",
    price: "19",
    limit: "Illimité",
    tag: "Populaire",
    perks: ["Générations illimitées", "Toutes les plateformes", "SEO avancé", "Prix suggéré IA", "Nouvelles plateformes en avant-première", "Support prioritaire"],
    gumroadUrl: "https://votre-lien-gumroad-pro.com",
  },
];

const PLATFORMS = [
  { id: "leboncoin", label: "Leboncoin", icon: "🏠" },
  { id: "vinted", label: "Vinted", icon: "👗" },
  { id: "etsy", label: "Etsy", icon: "🎨" },
  { id: "amazon", label: "Amazon", icon: "📦" },
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
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"rgba(15,10,5,0.7)" }}>
      <div style={{ background:"#fff", borderRadius:28, padding:"40px 36px", maxWidth:460, width:"100%", position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:20, right:20, background:"#f5f0eb", border:"none", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:14 }}>✕</button>
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:44, marginBottom:12 }}>✨</div>
          <p style={{ fontSize:24, fontWeight:700, color:"#1a1008" }}>Passez à la vitesse <span style={{ color:"#ff6b35" }}>supérieure</span></p>
          <p style={{ fontSize:13, color:"#8a7a6a", marginTop:8 }}>Vos 3 générations gratuites sont épuisées.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, margin:"24px 0" }}>
          {PLANS.map((p) => (
            <div key={p.id} onClick={() => setSelected(p.id)} style={{ borderRadius:16, padding:"20px 16px", cursor:"pointer", border: selected === p.id ? "2px solid #ff6b35" : "2px solid transparent", background: selected === p.id ? "#fff5f0" : "#faf7f4", position:"relative" }}>
              {p.tag && <span style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:"#ff6b35", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 12px", borderRadius:20, whiteSpace:"nowrap" }}>{p.tag}</span>}
              <p style={{ fontSize:18, fontWeight:700 }}>{p.name}</p>
              <p style={{ fontSize:32, fontWeight:700, color:"#ff6b35" }}>{p.price}€<span style={{ fontSize:13, color:"#aaa", fontWeight:400 }}>/mois</span></p>
              <p style={{ fontSize:11, color:"#ff6b35", marginTop:6, fontWeight:600 }}>{p.limit}</p>
            </div>
          ))}
        </div>
        <ul style={{ listStyle:"none", margin:"16px 0 24px", display:"flex", flexDirection:"column", gap:9 }}>
          {plan.perks.map((perk, i) => (
            <li key={i} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:"#5a4a3a" }}>
              <span style={{ color:"#ff6b35" }}>✓</span> {perk}
            </li>
          ))}
        </ul>
        <a href={plan.gumroadUrl} target="_blank" rel="noopener noreferrer" style={{ display:"block", width:"100%", padding:16, background:"linear-gradient(135deg,#ff6b35,#ff4500)", color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", textDecoration:"none", textAlign:"center" }}>
          Commencer avec {plan.name} — {plan.price}€/mois
        </a>
        <p style={{ textAlign:"center", marginTop:12, fontSize:11, color:"#bbb" }}>Paiement sécurisé · Résiliable à tout moment</p>
      </div>
    </div>
  );
}

export default function App() {
  const [platform, setPlatform] = useState("leboncoin");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [usedCount, setUsedCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  const remaining = FREE_LIMIT - usedCount;
  const isLocked = usedCount >= FREE_LIMIT;

  const generate = async () => {
    if (!description.trim()) return;
    if (isLocked) { setShowPaywall(true); return; }
    setLoading(true);
    setResult(null);
    setError(null);

    const platformLabel = PLATFORMS.find((p) => p.id === platform)?.label;
    const tips = PLATFORM_TIPS[platform];
    const prompt = `Tu es un expert en copywriting et vente en ligne. 
Génère une annonce optimisée pour ${platformLabel} à partir de cette description brute : "${description}"
Consignes spécifiques pour ${platformLabel} : ${tips}
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks :
{"titre":"...","description":"...","mots_cles":["...","...","...","...","..."],"prix_suggere":"..."}`;

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError("Erreur API : " + data.error.message);
        setLoading(false);
        return;
      }
      const text = data.content?.map((b) => b.text || "").join("");
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
      setUsedCount((c) => c + 1);
    } catch (e) {
      setError("Une erreur est survenue : " + e.message);
    }
    setLoading(false);
  };

  const copyAll = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.titre}\n\n${result.description}\n\nMots-clés : ${result.mots_cles.join(", ")}\n\nPrix suggéré : ${result.prix_suggere}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentPlatform = PLATFORMS.find((p) => p.id === platform);

  return (
    <div style={{ minHeight:"100vh", background:"#fdf8f3", fontFamily:"sans-serif", color:"#1a1008" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        .p-btn { background:#fff; border:1.5px solid #f0e8e0; border-radius:14px; padding:14px 8px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:7px; font-size:11px; font-weight:600; color:#8a7a6a; transition:all 0.2s; }
        .p-btn.active { border-color:#ff6b35; background:#fff5f0; color:#ff6b35; }
        .p-btn:hover { border-color:#ffd4c2; }
        textarea { width:100%; background:transparent; border:none; outline:none; font-size:14px; color:#1a1008; line-height:1.75; resize:none; font-family:inherit; }
        textarea::placeholder { color:#d4c4b4; }
      `}</style>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      <div style={{ maxWidth:680, margin:"0 auto", padding:"56px 24px 100px" }}>

        {/* Header */}
        <div style={{ marginBottom:52 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#fff", border:"1px solid #f0e8e0", borderRadius:100, padding:"7px 16px 7px 10px", marginBottom:28 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b35,#ff4500)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>✦</div>
            <span style={{ fontSize:13, fontWeight:700 }}>Annonzia</span>
            <span style={{ background:"#fff5f0", color:"#ff6b35", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>BETA</span>
          </div>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(40px,8vw,72px)", fontWeight:900, lineHeight:0.95, letterSpacing:"-0.03em" }}>
            Vos annonces,<br /><em style={{ fontStyle:"italic", color:"#ff6b35" }}>réinventées</em>
          </h1>
          <p style={{ marginTop:18, fontSize:16, color:"#8a7a6a", lineHeight:1.6 }}>
            Transformez une description brute en annonce vendeuse — en 10 secondes.
          </p>
        </div>

        {/* Plateformes */}
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#c4b4a4", marginBottom:12 }}>01 — Plateforme cible</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:24 }}>
          {PLATFORMS.map((p) => (
            <button key={p.id} className={`p-btn ${platform === p.id ? "active" : ""}`} onClick={() => setPlatform(p.id)}>
              <span style={{ fontSize:22 }}>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#c4b4a4", marginBottom:12 }}>02 — Décrivez votre produit</p>
        <div style={{ background:"#fff", borderRadius:20, padding:20, border:"1.5px solid #f0e8e0", marginBottom:16 }}>
          <textarea
            rows={5}
            placeholder={`Décrivez votre produit pour ${currentPlatform?.label}...\nEx : veste Levi's taille M, bleu, portée 5 fois...`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p style={{ fontSize:11, color:"#d4c4b4", marginTop:8, textAlign:"right" }}>{description.length} caractères</p>
        </div>

        {/* Compteur */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, background:"#fff", borderRadius:14, padding:"12px 18px", border:"1.5px solid #f0e8e0" }}>
          <div style={{ display:"flex", gap:5 }}>
            {Array.from({ length: FREE_LIMIT }).map((_, i) => (
              <div key={i} style={{ width:9, height:9, borderRadius:"50%", background: i < usedCount ? "#ff6b35" : "#f0e8e0" }} />
            ))}
          </div>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:"#8a7a6a" }}>
            {remaining > 0 ? `${remaining} génération${remaining > 1 ? "s" : ""} gratuite${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}` : "Limite atteinte"}
          </span>
          <button onClick={() => setShowPaywall(true)} style={{ fontSize:12, color:"#ff6b35", fontWeight:700, background:"#fff5f0", border:"none", cursor:"pointer", padding:"5px 10px", borderRadius:8 }}>Passer Pro ↗</button>
        </div>

        {/* Bouton générer */}
        <button
          onClick={generate}
          disabled={loading || (!isLocked && !description.trim())}
          style={{ width:"100%", padding:18, border:"none", borderRadius:16, fontSize:15, fontWeight:700, cursor: loading ? "not-allowed" : "pointer", background: isLocked ? "#f5f0eb" : "linear-gradient(135deg,#ff6b35,#ff4500)", color: isLocked ? "#c4b4a4" : "#fff", opacity: loading ? 0.7 : 1, fontFamily:"inherit" }}
        >
          {loading ? "Génération en cours..." : isLocked ? "🔒 Débloquer l'accès illimité" : "✦ Générer mon annonce"}
        </button>

        {error && <div style={{ background:"#fff5f5", border:"1px solid #fecaca", color:"#dc2626", borderRadius:12, padding:"12px 16px", fontSize:13, marginTop:12, textAlign:"center" }}>{error}</div>}

        {/* Résultat */}
        {result && (
          <div style={{ marginTop:20, background:"#fff", borderRadius:20, padding:28, border:"1.5px solid #f0e8e0" }}>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#d4c4b4", marginBottom:10 }}>Titre</p>
            <p style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:700, color:"#1a1008", lineHeight:1.3, marginBottom:20 }}>{result.titre}</p>

            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#d4c4b4", marginBottom:10 }}>Description</p>
            <p style={{ fontSize:14, color:"#5a4a3a", lineHeight:1.8 }}>{result.description}</p>

            <hr style={{ border:"none", borderTop:"1px solid #f5f0eb", margin:"20px 0" }} />

            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#d4c4b4", marginBottom:10 }}>Mots-clés SEO</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {result.mots_cles?.map((k, i) => (
                <span key={i} style={{ background:"#fff5f0", color:"#ff6b35", borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:600, border:"1px solid #ffe0d0" }}># {k}</span>
              ))}
            </div>

            <hr style={{ border:"none", borderTop:"1px solid #f5f0eb", margin:"20px 0" }} />

            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#d4c4b4", marginBottom:10 }}>Prix suggéré</p>
            <span style={{ display:"inline-flex", background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", color:"#16a34a", borderRadius:10, padding:"10px 16px", fontSize:15, fontWeight:700, border:"1px solid #bbf7d0" }}>💶 {result.prix_suggere}</span>

            <button
              onClick={copyAll}
              style={{ width:"100%", padding:14, background: copied ? "#f0fdf4" : "#faf7f4", color: copied ? "#16a34a" : "#5a4a3a", border: copied ? "1.5px solid #bbf7d0" : "1.5px solid #f0e8e0", borderRadius:12, fontSize:13, fontWeight:700, cursor:"pointer", marginTop:16, fontFamily:"inherit" }}
            >
              {copied ? "✓ Annonce copiée !" : "Copier l'annonce complète"}
            </button>
          </div>
        )}

        <div style={{ textAlign:"center", marginTop:56 }}>
          <p style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:"#d4c4b4", marginBottom:6 }}>Annonzia</p>
          <p style={{ fontSize:11, color:"#d4c4b4" }}>Propulsé par Claude · Fait en France 🇫🇷</p>
        </div>
      </div>
    </div>
  );
}
