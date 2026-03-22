import { Link, useLocation } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { useLang } from "@/lib/i18n";
import { cn, formatAddress } from "@/lib/utils";
import { LayoutDashboard, Menu, X, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import logoSrc from "@assets/ChatGPT_Image_2026年3月22日_19_49_35_1774180652811.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();
  const { lang, t, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/services",   labelKey: "nav_product"    as const },
    { href: "/playground", labelKey: "nav_developers" as const },
    { href: "/dashboard",  labelKey: "nav_dashboard"  as const },
  ];

  return (
    <div className="min-h-screen bg-[#06070A] text-foreground flex flex-col relative">

      {/* Navigation */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
          scrolled
            ? "bg-[#06070A]/90 backdrop-blur-xl border-[#1E293B] py-3"
            : "bg-transparent border-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src={logoSrc}
              alt="AgentFuel"
              className="h-7 w-7 object-contain"
              draggable={false}
            />
            <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-[#F3BA2F] transition-colors duration-200">
              AgentFuel
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map((item) => {
              const isActive = location.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "text-white bg-white/6"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/4"
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
            <a
              href="#"
              className="px-3.5 py-1.5 rounded-md text-sm font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/4 transition-colors duration-150 flex items-center gap-1.5"
            >
              {t("nav_docs")}
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="px-2.5 py-1 rounded border border-[#1E293B] bg-white/3 hover:bg-white/6 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-all"
              title={lang === "en" ? "切换为中文" : "Switch to English"}
            >
              {lang === "en" ? "中文" : "EN"}
            </button>

            {isConnected ? (
              <button
                onClick={disconnect}
                className="px-3 py-1.5 rounded-md border border-[#1E293B] bg-white/3 text-sm text-zinc-300 hover:text-white hover:bg-white/6 transition-all flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 af-breathe" />
                {formatAddress(address!)}
              </button>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="px-3 py-1.5 rounded-md border border-[#1E293B] bg-white/3 text-sm text-zinc-300 hover:text-white hover:bg-white/6 transition-all disabled:opacity-50"
              >
                {isConnecting ? t("connecting") : t("connect_wallet")}
              </button>
            )}

            <Link
              href="/services"
              className="px-4 py-1.5 rounded-md bg-[#F3BA2F] text-[#06070A] text-sm font-bold hover:bg-[#F3BA2F]/90 transition-colors"
            >
              {t("nav_launch")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#06070A]/97 backdrop-blur-xl pt-20 px-4 flex flex-col gap-1 md:hidden">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium",
                location.startsWith(item.href)
                  ? "bg-white/6 text-white"
                  : "text-zinc-400"
              )}
            >
              <LayoutDashboard className="w-4 h-4 opacity-40" />
              {t(item.labelKey)}
            </Link>
          ))}
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-zinc-500"
          >
            {t("nav_docs")} <ExternalLink className="w-3.5 h-3.5 opacity-50" />
          </a>

          <div className="mt-4 border-t border-[#1E293B] pt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-zinc-500">Language / 语言</span>
              <button
                onClick={toggle}
                className="px-3 py-1 rounded border border-[#1E293B] text-sm font-medium text-zinc-300"
              >
                {lang === "en" ? "中文" : "English"}
              </button>
            </div>
            {isConnected ? (
              <button
                onClick={() => { disconnect(); setMobileMenuOpen(false); }}
                className="w-full py-3.5 rounded-xl border border-[#1E293B] text-white font-medium"
              >
                {t("disconnect")} ({formatAddress(address!)})
              </button>
            ) : (
              <button
                onClick={() => { connect(); setMobileMenuOpen(false); }}
                className="w-full py-3.5 rounded-xl border border-[#1E293B] text-zinc-300 font-medium"
              >
                {t("connect_wallet")}
              </button>
            )}
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 rounded-xl bg-[#F3BA2F] text-[#06070A] font-bold text-center"
            >
              {t("nav_launch")}
            </Link>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 relative z-10 pt-[68px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <img src={logoSrc} alt="AgentFuel" className="h-6 w-6 object-contain" draggable={false} />
                <span className="font-display font-bold text-sm text-white">AgentFuel</span>
              </div>
              <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">{t("footer_desc")}</p>
            </div>

            {/* Links */}
            <div className="flex items-center gap-5">
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5">
                {t("footer_docs")} <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5">
                {t("footer_github")} <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5">
                X <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-sm text-zinc-700 flex items-center gap-1.5">
                {t("footer_contracts")}
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/4 border border-[#1E293B] text-zinc-600">
                  {t("footer_coming_soon")}
                </span>
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1E293B]/60">
            <p className="text-xs text-zinc-700">{t("footer_copy")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
