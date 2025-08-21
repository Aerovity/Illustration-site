import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, DM_Sans } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Bobe Florian - Artiste Illustrateur",
  description: "Portfolio et services d'illustration de Bobe Florian - Commissions, Coaching, Print Shop",
  icons: {
    icon: '/favicon.ico?v=1',
  },
  openGraph: {
    title: "Bobe Florian - Artiste Illustrateur",
    description: "Portfolio et services d'illustration de Bobe Florian - Commissions, Coaching, Print Shop",
    images: ['/bg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bobe Florian - Artiste Illustrateur",
    description: "Portfolio et services d'illustration de Bobe Florian - Commissions, Coaching, Print Shop",
    images: ['/bg.png'],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable} dark`}>
      <body className="antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="gj7foIzTJQ7kspG3hKkI4";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
            `,
          }}
        />
      </body>
    </html>
  )
}
