import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import "@usefluid/motion/theme.css";
import "../globals.css";
import { BrandProvider } from "@/components/BrandProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LangProvider } from "@/components/LangProvider";
import { PieceDialogProvider } from "@/components/PieceDialog";
import { dictionaries, isLang, langs } from "@/lib/i18n";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", preload: false });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap", preload: false });

export const dynamicParams = false;

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = dictionaries[isLang(lang) ? lang : "en"];
  return {
    title: { default: t.meta.title, template: "%s · Fluid" },
    description: t.meta.description,
    alternates: { languages: { en: "/", pt: "/pt" } },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
  ],
};

const THEME_SCRIPT = `(function(){var h=document.documentElement;function pick(){try{var t=localStorage.getItem("fluid-theme");if(t==="dark"||t==="light")return t}catch(e){}return matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}window.__fluidTheme=pick();function keep(){if(h.dataset.js!=="")h.dataset.js="";if(h.dataset.theme!==window.__fluidTheme)h.dataset.theme=window.__fluidTheme}keep();new MutationObserver(keep).observe(h,{attributes:true,attributeFilter:["data-theme","data-js"]})})()`;

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dictionaries[lang];
  return (
    <html lang={lang === "pt" ? "pt-BR" : "en"} className={`${sans.variable} ${fraunces.variable} ${grotesk.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#content">{t.skip}</a>
        <LangProvider lang={lang}>
          <BrandProvider>
            <PieceDialogProvider>
              <Header lang={lang} />
              <main id="content">{children}</main>
              <Footer lang={lang} />
            </PieceDialogProvider>
          </BrandProvider>
        </LangProvider>
      </body>
    </html>
  );
}
