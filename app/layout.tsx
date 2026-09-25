import type { Metadata } from "next"
import "./globals.css"
import "./landing.css"

export const metadata: Metadata = {
  title: "Studio Code — Developer Workspace",
  description: "Pilotez votre environnement Roblox et vos agents IA depuis Studio Code.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>
}
