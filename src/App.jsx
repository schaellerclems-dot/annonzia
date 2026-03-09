import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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

// ─── BANDEAU COOKIES ───────────────────────────────────────────
function CookieBanner({ onAccept }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:500, background:"#1a1008", color:"#fff", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
      <p style={{ fontSize:13, lineHeight:1.6, margin:0, flex:1 }}>
        🍪 Annonzia utilise uniquement des cookies techniques nécessaires au bon fonctionnement du site. Aucun cookie publicitaire n'est utilisé.
      </p>
      <button onClick={onAccept} style={{ background:"#ff6b35", color:"#fff", border:"none", borderRadius:10, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit" }}>
        J'ai compris
      </button>
    </div>
  );
}

// ─── PAGE MENTIONS LÉGALES ─────────────────────────────────────
function LegalPage({ onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:400, background:"#fdf8f3", overflow:"auto" }}>
      <div style={{ maxWidth:700, margin:"0 auto", padding:"40px 24px 80px" }}>
        <button onClick={onClose} style={{ background:"#f5f0eb", border:"none", borderRadius:10, padding:"8px 16px", cursor:"pointer", fontSize:13, fontWeight:700, marginBottom:32, fontFamily:"inherit" }}>← Retour</button>

        <h1 style={{ fontFamily:"Georgia,serif", fontSize:32, fontWeight:700, color:"#1a1008", marginBottom:8 }}>Mentions légales</h1>
        <p style={{ color:"#8a7a6a", fontSize:13, marginBottom:40 }}>Dernière mise à jour : mars 2026</p>

        {[
          { title: "Éditeur du site", content: ["Clément Schaeller", "Saint-Pierre-des-Fleurs, France", "Email : contact@annonzia.fr", "Site web : https://annonzia.fr"] },
          { title: "Hébergement", content: ["Vercel Inc.", "340 Pine Street, Suite 701", "San Francisco, CA 94104, États-Unis", "https://vercel.com"] },
          { title: "Directeur de la publication", content: ["Clément Schaeller"] },
          { title: "Propriété intellectuelle", content: ["L'ensemble du contenu de ce site (textes, images, logo, code) est la propriété exclusive de Clément Schaeller. Toute reproduction, même partielle, est interdite sans autorisation préalable."] },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:"#1a1008", marginBottom:12, paddingBottom:8, borderBottom:"1px solid #f0e8e0" }}>{s.title}</h2>
            {s.content.map((c, j) => <p key={j} style={{ fontSize:14, color:"#5a4a3a", lineHeight:1.8, margin:0 }}>{c}</p>)}
          </div>
        ))}

        <h1 style={{ fontFamily:"Georgia,serif", fontSize:32, fontWeight:700, color:"#1a1008", marginBottom:8, marginTop:48 }}>Politique de confidentialité</h1>
        <p style={{ color:"#8a7a6a", fontSize:13, marginBottom:40 }}>Dernière mise à jour : mars 2026</p>

        {[
          { title: "Responsable du traitement", content: ["Clément Schaeller — contact@annonzia.fr"] },
          { title: "Données collectées", content: ["Dans le cadre de l'utilisation d'Annonzia, nous collectons les données suivantes :", "- Adresse email (lors de l'inscription)", "- Nombre de générations effectuées", "- Date de création du compte"] },
          { title: "Finalité du traitement", content: ["Les données sont collectées pour :", "- Créer et gérer votre compte utilisateur", "- Comptabiliser vos générations gratuites", "- Vous envoyer les emails liés à votre compte (confirmation, mot de passe oublié)"] },
          { title: "Base légale", content: ["Le traitement est basé sur l'exécution du contrat (article 6.1.b du RGPD)."] },
          { title: "Conservation des données", content: ["Vos données sont conservées pendant toute la durée de votre compte, et supprimées dans les 30 jours suivant la suppression de votre compte."] },
          { title: "Sous-traitants", content: ["- Supabase (base de données, authentification) — serveurs en Europe", "- Vercel (hébergement) — États-Unis, conformité RGPD assurée", "- Resend (envoi d'emails) — conforme RGPD", "- Gumroad (paiements) — gère ses propres données de paiement"] },
          { title: "Vos droits", content: ["Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer vos droits : contact@annonzia.fr"] },
          { title: "Cookies", content: ["Annonzia utilise uniquement des cookies techniques nécessaires au fonctionnement du site (session utilisateur). Aucun cookie publicitaire ou de tracking n'est utilisé."] },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:"#1a1008", marginBottom:12, paddingBottom:8, borderBottom:"1px solid #f0e8e0" }}>{s.title}</h2>
            {s.content.map((c, j) => <p key={j} style={{ fontSize:14, color:"#5a4a3a", lineHeight:1.8, margin:0 }}>{c}</p>)}
          </div>
        ))}

        <h1 style={{ fontFamily:"Georgia,serif", fontSize:32, fontWeight:700, color:"#1a1008", marginBottom:8, marginTop:48 }}>Conditions Générales d'Utilisation</h1>
        <p style={{ color:"#8a7a6a", fontSize:13, marginBottom:40 }}>Dernière mise à jour : mars 2026</p>

        {[
          { title: "Article 1 — Objet", content: ["Les présentes CGU régissent l'utilisation du service Annonzia, accessible sur https://annonzia.fr, permettant la génération automatique d'annonces de vente en ligne grâce à l'intelligence artificielle."] },
          { title: "Article 2 — Accès au service", content: ["L'accès au service nécessite la création d'un compte avec une adresse email valide. Trois générations gratuites sont offertes à l'inscription. Au-delà, un abonnement payant est requis."] },
          { title: "Article 3 — Abonnements et tarifs", content: ["- Starter : 9€/mois — 30 générations par mois", "- Pro : 19€/mois — générations illimitées", "Les abonnements sont gérés via Gumroad et sont résiliables à tout moment."] },
          { title: "Article 4 — Utilisation du service", content: ["L'utilisateur s'engage à utiliser le service de manière légale et éthique, à ne pas générer de contenu illégal ou frauduleux, et à ne pas tenter de contourner les limitations du service."] },
          { title: "Article 5 — Responsabilité", content: ["Annonzia met à disposition un outil d'aide à la rédaction. L'utilisateur reste seul responsable du contenu des annonces publiées sur les plateformes tierces."] },
          { title: "Article 6 — Droit applicable", content: ["Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront compétents."] },
          { title: "Article 7 — Contact", content: ["Pour toute question : contact@annonzia.fr"] },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:"#1a1008", marginBottom:12, paddingBottom:8, borderBottom:"1px solid #f0e8e0" }}>{s.title}</h2>
            {s.content.map((c, j) => <p key={j} style={{ fontSize:14, color:"#5a4a3a", lineHeight:1.8, margin:0 }}>{c}</p>)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE RESET PASSWORD ───────────────────────────────────────
function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handle = async () => {
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères."); return; }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
    setTimeout(() => window.location.href = "/", 2000);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#fdf8f3", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"#fff", borderRadius:28, padding:"40px 36px", maxWidth:400, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🔐</div>
          <p style={{ fontSize:22, fontWeight:700, color:"#1a1008" }}>Nouveau mot de passe</p>
          <p style={{ fontSize:13, color:"#8a7a6a", marginTop:6 }}>Choisissez un nouveau mot de passe sécurisé</p>
        </div>
        {success ? (
          <div style={{ textAlign:"center", color:"#16a34a", fontWeight:600 }}>✓ Mot de passe modifié ! Redirection...</div>
        ) : (
          <>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <input type="password" placeholder="Nouveau mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding:"14px 16px", borderRadius:12, border:"1.5px solid #f0e8e0", fontSize:14, outline:"none", fontFamily:"inherit" }} />
              <input type="password" placeholder="Confirmer le mot de passe" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={{ padding:"14px 16px", borderRadius:12, border:"1.5px solid #f0e8e0", fontSize:14, outline:"none", fontFamily:"inherit" }} />
            </div>
            {error && <p style={{ color:"#dc2626", fontSize:12, marginTop:8, textAlign:"center" }}>{error}</p>}
            <button onClick={handle} disabled={loading} style={{ width:"100%", padding:16, background:"linear-gradient(135deg,#ff6b35,#ff4500)", color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", marginTop:16, fontFamily:"inherit", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Chargement..." : "Modifier le mot de passe"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MODALE AUTH ───────────────────────────────────────────────
function AuthModal({ onClose, onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handle = async () => {
    setLoading(true); setError(null); setSuccess(null);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth(data.user); onClose();
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess("Compte créé ! Vérifiez votre email pour confirmer.");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: "https://annonzia.fr" });
        if (error) throw error;
        setSuccess("Email envoyé ! Vérifiez votre boîte mail.");
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const titles = {
    login: { emoji: "👋", title: "Bon retour !", subtitle: "Connectez-vous pour continuer" },
    signup: { emoji: "✨", title: "Créer un compte", subtitle: "Gratuit — 3 générations offertes" },
    forgot: { emoji: "🔑", title: "Mot de passe oublié ?", subtitle: "Entrez votre email pour recevoir un lien" },
  };
  const t = titles[mode];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"rgba(15,10,5,0.7)" }}>
      <div style={{ background:"#fff", borderRadius:28, padding:"40px 36px", maxWidth:400, width:"100%", position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:20, right:20, background:"#f5f0eb", border:"none", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:14 }}>✕</button>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:36, marginBottom:12 }}>{t.emoji}</div>
          <p style={{ fontSize:22, fontWeight:700, color:"#1a1008" }}>{t.title}</p>
          <p style={{ fontSize:13, color:"#8a7a6a", marginTop:6 }}>{t.subtitle}</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <input type="email" placeholder="Votre email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding:"14px 16px", borderRadius:12, border:"1.5px solid #f0e8e0", fontSize:14, outline:"none", fontFamily:"inherit" }} />
          {mode !== "forgot" && <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding:"14px 16px", borderRadius:12, border:"1.5px solid #f0e8e0", fontSize:14, outline:"none", fontFamily:"inherit" }} />}
        </div>
        {error && <p style={{ color:"#dc2626", fontSize:12, marginTop:8, textAlign:"center" }}>{error}</p>}
        {success && <p style={{ color:"#16a34a", fontSize:12, marginTop:8, textAlign:"center" }}>{success}</p>}
        <button onClick={handle} disabled={loading} style={{ width:"100%", padding:16, background:"linear-gradient(135deg,#ff6b35,#ff4500)", color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", marginTop:16, fontFamily:"inherit", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Chargement..." : mode === "login" ? "Se connecter" : mode === "signup" ? "Créer mon compte" : "Envoyer le lien"}
        </button>
        <div style={{ textAlign:"center", marginTop:16, display:"flex", flexDirection:"column", gap:8 }}>
          {mode === "login" && (<>
            <span style={{ fontSize:13, color:"#8a7a6a" }}>Pas encore de compte ? <span onClick={() => { setMode("signup"); setError(null); setSuccess(null); }} style={{ color:"#ff6b35", fontWeight:700, cursor:"pointer" }}>S'inscrire</span></span>
            <span onClick={() => { setMode("forgot"); setError(null); setSuccess(null); }} style={{ fontSize:12, color:"#aaa", cursor:"pointer", textDecoration:"underline" }}>Mot de passe oublié ?</span>
          </>)}
          {mode === "signup" && <span style={{ fontSize:13, color:"#8a7a6a" }}>Déjà un compte ? <span onClick={() => { setMode("login"); setError(null); setSuccess(null); }} style={{ color:"#ff6b35", fontWeight:700, cursor:"pointer" }}>Se connecter</span></span>}
          {mode === "forgot" && <span onClick={() => { setMode("login"); setError(null); setSuccess(null); }} style={{ fontSize:13, color:"#ff6b35", fontWeight:700, cursor:"pointer" }}>← Retour à la connexion</span>}
        </div>
      </div>
    </div>
  );
}

// ─── MODALE PAYWALL ────────────────────────────────────────────
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
          {plan.perks.map((perk, i) => <li key={i} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:"#5a4a3a" }}><span style={{ color:"#ff6b35" }}>✓</span> {perk}</li>)}
        </ul>
        <a href={plan.gumroadUrl} target="_blank" rel="noopener noreferrer" style={{ display:"block", width:"100%", padding:16, background:"linear-gradient(135deg,#ff6b35,#ff4500)", color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", textDecoration:"none", textAlign:"center" }}>
          Commencer avec {plan.name} — {plan.price}€/mois
        </a>
        <p style={{ textAlign:"center", marginTop:12, fontSize:11, color:"#bbb" }}>Paiement sécurisé · Résiliable à tout moment</p>
      </div>
    </div>
  );
}

// ─── APP PRINCIPALE ────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [usedCount, setUsedCount] = useState(0);
  const [platform, setPlatform] = useState("leboncoin");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isResetPage, setIsResetPage] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(() => localStorage.getItem("cookies_accepted") === "true");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsResetPage(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setUser(session.user);
        setLoadingUser(false);
      });
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      setLoadingUser(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      else { setUser(null); setUsedCount(0); }
    });
  }, []);

  const loadProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) { setUsedCount(data.used_count || 0); }
    else { await supabase.from("profiles").insert({ id: userId, used_count: 0 }); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setUsedCount(0); setResult(null);
  };

  const acceptCookies = () => {
    localStorage.setItem("cookies_accepted", "true");
    setCookiesAccepted(true);
  };

  const remaining = FREE_LIMIT - usedCount;
  const isLocked = usedCount >= FREE_LIMIT;

  const generate = async () => {
    if (!description.trim()) return;
    if (!user) { setShowAuth(true); return; }
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
        headers: { "content-type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      if (data.error) { setError("Erreur API : " + data.error.message); setLoading(false); return; }
      const text = data.content?.map((b) => b.text || "").join("");
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
      const newCount = usedCount + 1;
      setUsedCount(newCount);
      await supabase.from("profiles").update({ used_count: newCount }).eq("id", user.id);
    } catch (e) { setError("Une erreur est survenue : " + e.message); }
    setLoading(false);
  };

  const copyAll = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.titre}\n\n${result.description}\n\nMots-clés : ${result.mots_cles.join(", ")}\n\nPrix suggéré : ${result.prix_suggere}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const currentPlatform = PLATFORMS.find((p) => p.id === platform);

  if (loadingUser) return <div style={{ minHeight:"100vh", background:"#fdf8f3", display:"flex", alignItems:"center", justifyContent:"center" }}><p style={{ color:"#8a7a6a", fontSize:14 }}>Chargement...</p></div>;
  if (isResetPage) return <ResetPasswordPage />;
  if (showLegal) return <LegalPage onClose={() => setShowLegal(false)} />;

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

      {!cookiesAccepted && <CookieBanner onAccept={acceptCookies} />}
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={(u) => { setUser(u); loadProfile(u.id); }} />}

      {/* Navbar */}
      <div style={{ background:"#fff", borderBottom:"1px solid #f0e8e0", padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b35,#ff4500)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>✦</div>
          <span style={{ fontSize:15, fontWeight:700 }}>Annonzia</span>
          <span style={{ background:"#fff5f0", color:"#ff6b35", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>BETA</span>
        </div>
        {user ? (
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:12, color:"#8a7a6a" }}>{user.email}</span>
            <button onClick={handleLogout} style={{ fontSize:12, color:"#8a7a6a", background:"#f5f0eb", border:"none", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontFamily:"inherit" }}>Déconnexion</button>
          </div>
        ) : (
          <button onClick={() => setShowAuth(true)} style={{ fontSize:13, fontWeight:700, color:"#ff6b35", background:"#fff5f0", border:"none", padding:"8px 16px", borderRadius:10, cursor:"pointer", fontFamily:"inherit" }}>Se connecter</button>
        )}
      </div>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"48px 24px 100px" }}>
        <div style={{ marginBottom:48 }}>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(40px,8vw,64px)", fontWeight:900, lineHeight:0.95, letterSpacing:"-0.03em" }}>
            Vos annonces,<br /><em style={{ fontStyle:"italic", color:"#ff6b35" }}>réinventées</em>
          </h1>
          <p style={{ marginTop:18, fontSize:16, color:"#8a7a6a", lineHeight:1.6 }}>Transformez une description brute en annonce vendeuse — en 10 secondes.</p>
        </div>

        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#c4b4a4", marginBottom:12 }}>01 — Plateforme cible</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:24 }}>
          {PLATFORMS.map((p) => (
            <button key={p.id} className={`p-btn ${platform === p.id ? "active" : ""}`} onClick={() => setPlatform(p.id)}>
              <span style={{ fontSize:22 }}>{p.icon}</span>{p.label}
            </button>
          ))}
        </div>

        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#c4b4a4", marginBottom:12 }}>02 — Décrivez votre produit</p>
        <div style={{ background:"#fff", borderRadius:20, padding:20, border:"1.5px solid #f0e8e0", marginBottom:16 }}>
          <textarea rows={5} placeholder={`Décrivez votre produit pour ${currentPlatform?.label}...\nEx : veste Levi's taille M, bleu, portée 5 fois...`} value={description} onChange={(e) => setDescription(e.target.value)} />
          <p style={{ fontSize:11, color:"#d4c4b4", marginTop:8, textAlign:"right" }}>{description.length} caractères</p>
        </div>

        {user && (
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, background:"#fff", borderRadius:14, padding:"12px 18px", border:"1.5px solid #f0e8e0" }}>
            <div style={{ display:"flex", gap:5 }}>
              {Array.from({ length: FREE_LIMIT }).map((_, i) => (
                <div key={i} style={{ width:9, height:9, borderRadius:"50%", background: i < usedCount ? "#ff6b35" : "#f0e8e0" }} />
              ))}
            </div>
            <span style={{ flex:1, fontSize:12, fontWeight:600, color:"#8a7a6a" }}>
              {remaining > 0 ? `${remaining} génération${remaining > 1 ? "s" : ""} gratuite${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}` : "Limite atteinte"}
            </span>
            <button onClick={() => setShowPaywall(true)} style={{ fontSize:12, color:"#ff6b35", fontWeight:700, background:"#fff5f0", border:"none", cursor:"pointer", padding:"5px 10px", borderRadius:8, fontFamily:"inherit" }}>Passer Pro ↗</button>
          </div>
        )}

        <button onClick={generate} disabled={loading || (user && !isLocked && !description.trim())} style={{ width:"100%", padding:18, border:"none", borderRadius:16, fontSize:15, fontWeight:700, cursor:"pointer", background: isLocked && user ? "#f5f0eb" : "linear-gradient(135deg,#ff6b35,#ff4500)", color: isLocked && user ? "#c4b4a4" : "#fff", opacity: loading ? 0.7 : 1, fontFamily:"inherit" }}>
          {loading ? "Génération en cours..." : !user ? "✦ Générer mon annonce (inscription gratuite)" : isLocked ? "🔒 Débloquer l'accès illimité" : "✦ Générer mon annonce"}
        </button>

        {error && <div style={{ background:"#fff5f5", border:"1px solid #fecaca", color:"#dc2626", borderRadius:12, padding:"12px 16px", fontSize:13, marginTop:12, textAlign:"center" }}>{error}</div>}

        {result && (
          <div style={{ marginTop:20, background:"#fff", borderRadius:20, padding:28, border:"1.5px solid #f0e8e0" }}>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#d4c4b4", marginBottom:10 }}>Titre</p>
            <p style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:700, color:"#1a1008", lineHeight:1.3, marginBottom:20 }}>{result.titre}</p>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#d4c4b4", marginBottom:10 }}>Description</p>
            <p style={{ fontSize:14, color:"#5a4a3a", lineHeight:1.8 }}>{result.description}</p>
            <hr style={{ border:"none", borderTop:"1px solid #f5f0eb", margin:"20px 0" }} />
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#d4c4b4", marginBottom:10 }}>Mots-clés SEO</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {result.mots_cles?.map((k, i) => <span key={i} style={{ background:"#fff5f0", color:"#ff6b35", borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:600, border:"1px solid #ffe0d0" }}># {k}</span>)}
            </div>
            <hr style={{ border:"none", borderTop:"1px solid #f5f0eb", margin:"20px 0" }} />
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#d4c4b4", marginBottom:10 }}>Prix suggéré</p>
            <span style={{ display:"inline-flex", background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", color:"#16a34a", borderRadius:10, padding:"10px 16px", fontSize:15, fontWeight:700, border:"1px solid #bbf7d0" }}>💶 {result.prix_suggere}</span>
            <button onClick={copyAll} style={{ width:"100%", padding:14, background: copied ? "#f0fdf4" : "#faf7f4", color: copied ? "#16a34a" : "#5a4a3a", border: copied ? "1.5px solid #bbf7d0" : "1.5px solid #f0e8e0", borderRadius:12, fontSize:13, fontWeight:700, cursor:"pointer", marginTop:16, fontFamily:"inherit" }}>
              {copied ? "✓ Annonce copiée !" : "Copier l'annonce complète"}
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign:"center", marginTop:56 }}>
          <p style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:"#d4c4b4", marginBottom:6 }}>Annonzia</p>
          <p style={{ fontSize:11, color:"#d4c4b4", marginBottom:12 }}>Propulsé par Claude · Fait en France 🇫🇷</p>
          <button onClick={() => setShowLegal(true)} style={{ fontSize:11, color:"#c4b4a4", background:"none", border:"none", cursor:"pointer", textDecoration:"underline", fontFamily:"inherit" }}>
            Mentions légales · CGU · Politique de confidentialité
          </button>
        </div>
      </div>
    </div>
  );
}
