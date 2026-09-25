"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Code2, Github, Chrome, ShieldCheck, Zap } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("error") === "auth") setMessage("La connexion n’a pas pu être finalisée. Réessayez.")
  }, [])

  async function signInWithGoogle() {
    setLoading(true)
    const supabase = createClient()
    setMessage("")
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin}/auth/callback?next=/dashboard` },
    })
    if (error) {
      setMessage(error.message)
      setLoading(false)
    }
  }

  return (
    <main className="landing-shell">
      <nav className="landing-nav"><a className="brand" href="/"><span className="brand-mark"><Code2 /></span><span><strong>Studio Code</strong><small>developer workspace</small></span></a><a className="nav-login" href="#connexion">Se connecter <ArrowRight /></a></nav>
      <section className="landing-hero">
        <div className="landing-copy"><p className="eyebrow accent">L’espace de création Roblox augmenté par l’IA</p><h1>Construisez plus vite.<br /><em>Jouez avec les idées.</em></h1><p className="landing-subtitle">Studio Code réunit vos sessions IA, votre bridge local et votre extension navigateur dans une interface conçue pour créer sans friction.</p><div className="landing-actions"><a className="primary-button landing-cta" href="#connexion">Commencer gratuitement <ArrowRight /></a><a className="text-link" href="/dashboard">Voir le dashboard <ArrowRight /></a></div><div className="trust-line"><ShieldCheck /> Connexion sécurisée par Supabase Auth <span>·</span> Aucune carte bancaire</div></div>
        <div className="landing-visual"><div className="visual-glow" /><div className="visual-window"><div className="window-bar"><span /><span /><span /><b>studio-code / workspace</b></div><div className="visual-content"><div className="code-lines"><i /><i /><i /><i /><i /><i /></div><div className="visual-card"><Zap /><strong>Prêt à construire</strong><span>Votre environnement est connecté.</span><div className="visual-progress"><b /></div></div></div></div></div>
      </section>
      <section className="feature-strip"><div><Zap /><strong>Sessions IA fluides</strong><span>Travaillez avec vos providers préférés.</span></div><div><Code2 /><strong>Bridge local connecté</strong><span>De l’idée à Roblox Studio.</span></div><div><ShieldCheck /><strong>Votre espace sécurisé</strong><span>Vos projets restent sous contrôle.</span></div></section>
      <section className="login-section" id="connexion"><div className="login-card"><div className="login-icon"><Chrome /></div><p className="eyebrow accent">Votre workspace vous attend</p><h2>Connectez-vous pour continuer</h2><p>Accédez à votre dashboard Studio Code avec votre compte Google.</p><button className="google-button" onClick={signInWithGoogle} disabled={loading}><Chrome />{loading ? "Redirection…" : "Continuer avec Google"}</button>{message && <p className="auth-message" role="alert">{message}</p>}<small>En continuant, vous acceptez les conditions d’utilisation de Studio Code.</small></div></section>
      <footer className="landing-footer"><span>Studio Code v1.5.8</span><span>Conçu pour les créateurs Roblox</span><Github /></footer>
    </main>
  )
}
