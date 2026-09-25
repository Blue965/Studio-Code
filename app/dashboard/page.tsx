"use client"

import { useState } from "react"
import { Activity, ArrowUpRight, Bot, CheckCircle2, ChevronRight, CircleHelp, Code2, Command, Download, ExternalLink, FileCode2, FolderOpen, GitBranch, Globe2, LayoutDashboard, MessageSquare, MoreHorizontal, Play, Puzzle, Rocket, Settings2, ShieldCheck, Terminal, Wifi, Zap } from "lucide-react"
const providers = ["DeepSeek", "ChatGPT", "Gemini", "Kimi", "GLM", "Qwen", "Arena", "Meta AI"]
const activity = [
  { title: "Bridge connecté", detail: "localhost:34872 · prêt", time: "À l’instant", icon: Wifi, tone: "green" },
  { title: "Session DeepSeek démarrée", detail: "Agent Roblox Studio actif", time: "Il y a 2 min", icon: Bot, tone: "blue" },
  { title: "Extension détectée", detail: "Chrome · ZeroScript 1.5.8", time: "Il y a 8 min", icon: Puzzle, tone: "purple" },
]

export default function Home() {
  const [activeProvider, setActiveProvider] = useState("DeepSeek")
  const [connected, setConnected] = useState(true)

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Code2 /></div><div><strong>Studio Code</strong><span>developer workspace</span></div></div>
        <nav className="side-nav" aria-label="Navigation principale">
          <p className="nav-label">Workspace</p>
          <a className="nav-item active" href="#overview"><LayoutDashboard /> Vue d’ensemble</a>
          <a className="nav-item" href="#sessions"><MessageSquare /> Sessions <span className="nav-count">2</span></a>
          <a className="nav-item" href="#activity"><Activity /> Activité</a>
          <p className="nav-label">Configuration</p>
          <a className="nav-item" href="#providers"><Bot /> Fournisseurs IA</a>
          <a className="nav-item" href="#extension"><Puzzle /> Extension navigateur</a>
          <a className="nav-item" href="#settings"><Settings2 /> Paramètres</a>
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><CircleHelp /><div><strong>Besoin d’aide ?</strong><span>Consulter le guide de démarrage</span></div><ChevronRight /></div><div className="profile"><div className="avatar">JD</div><div><strong>John Developer</strong><span>Compte local</span></div><MoreHorizontal /></div></div>
      </aside>

      <section className="content" id="overview">
        <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><ChevronRight /><strong>Vue d’ensemble</strong></div><div className="top-actions"><span className="status-pill"><span className="status-dot" /> Tous les systèmes opérationnels</span><button className="icon-button" aria-label="Paramètres"><Settings2 /></button><button className="primary-button"><Rocket /> Nouveau projet</button></div></header>
        <div className="page-body">
          <div className="welcome-row"><div><p className="eyebrow">Mardi 25 septembre 2026</p><h1>Bonjour, John<span>.</span></h1><p className="subtitle">Pilotez votre environnement de développement Roblox depuis un seul espace.</p></div><button className="outline-button"><Download /> Télécharger la dernière version</button></div>

          <div className="hero-card"><div className="hero-copy"><div className="hero-icon"><Zap /></div><div><p className="eyebrow accent">Prêt à construire</p><h2>Votre Studio Code est connecté.</h2><p>Le bridge local et l’extension navigateur sont opérationnels. Lancez une session IA pour commencer à créer.</p><div className="hero-actions"><button className="primary-button" onClick={() => setConnected(!connected)}><Play /> {connected ? "Lancer une session" : "Reconnecter le bridge"}</button><a href="#activity" className="text-link">Voir l’activité <ArrowUpRight /></a></div></div></div><div className="hero-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-core"><Code2 /></div><span className="orbit-chip chip-one">Luau</span><span className="orbit-chip chip-two">MCP</span><span className="orbit-chip chip-three">AI</span></div></div>

          <div className="section-heading"><div><p className="eyebrow">Infrastructure</p><h2>État du système</h2></div><a className="text-link" href="#settings">Gérer la configuration <ArrowUpRight /></a></div>
          <div className="metric-grid"><Metric icon={Terminal} label="Bridge local" value={connected ? "Connecté" : "Hors ligne"} note="Port 34872" tone={connected ? "green" : "red"} /><Metric icon={Puzzle} label="Extension" value="Installée" note="Version 1.5.8" tone="purple" /><Metric icon={ShieldCheck} label="Roblox Studio" value="En attente" note="Ouvrir un projet" tone="amber" /><Metric icon={Globe2} label="Providers actifs" value="8" note="Tous disponibles" tone="blue" /></div>

          <div className="lower-grid"><section className="panel" id="sessions"><div className="panel-header"><div><p className="eyebrow">En cours</p><h2>Sessions récentes</h2></div><button className="icon-button"><MoreHorizontal /></button></div><div className="session-row"><div className="session-logo"><Bot /></div><div className="session-info"><strong>Roblox Builder — DeepSeek</strong><span>Dernière activité il y a 2 minutes</span></div><span className="live-badge"><span /> Active</span><ChevronRight /></div><div className="session-row muted-row"><div className="session-logo gray"><MessageSquare /></div><div className="session-info"><strong>Prototype obby — ChatGPT</strong><span>Session terminée hier à 18:42</span></div><span className="ended-badge">Terminée</span><ChevronRight /></div><button className="panel-link">Voir toutes les sessions <ArrowUpRight /></button></section>
            <section className="panel" id="providers"><div className="panel-header"><div><p className="eyebrow">Compatible avec</p><h2>Fournisseurs IA</h2></div><button className="icon-button"><MoreHorizontal /></button></div><div className="provider-list">{providers.slice(0, 5).map((provider, index) => <button key={provider} className={`provider-item ${activeProvider === provider ? "selected" : ""}`} onClick={() => setActiveProvider(provider)}><span className={`provider-dot p-${index}`} />{provider}<span className="provider-state">{activeProvider === provider ? "Sélectionné" : "Disponible"}</span></button>)}</div><button className="panel-link">Gérer les fournisseurs <ArrowUpRight /></button></section></div>

          <section className="panel activity-panel" id="activity"><div className="panel-header"><div><p className="eyebrow">Journal système</p><h2>Activité récente</h2></div><button className="outline-button small">Actualiser</button></div><div className="activity-list">{activity.map(({ title, detail, time, icon: Icon, tone }) => <div className="activity-item" key={title}><div className={`activity-icon ${tone}`}><Icon /></div><div className="activity-copy"><strong>{title}</strong><span>{detail}</span></div><time>{time}</time></div>)}</div></section>
          <footer><span>Studio Code v1.5.8</span><span className="footer-links"><a href="#documentation">Documentation</a><a href="#github"><GitBranch /> GitHub</a><a href="#status"><span className="status-dot" /> Status</a></span></footer>
        </div>
      </section>
    </main>
  )
}

function Metric({ icon: Icon, label, value, note, tone }: { icon: typeof Terminal; label: string; value: string; note: string; tone: string }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}><Icon /></div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div> }
