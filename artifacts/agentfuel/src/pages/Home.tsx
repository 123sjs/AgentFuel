import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Database, Shield, Zap, Layers, BookOpen } from "lucide-react";
import { useLang } from "@/lib/i18n";
import logoSrc from "@assets/ChatGPT_Image_2026年3月22日_19_49_35_1774180652811.png";

/* ─── Hero layered background ──────────────────────────────────── */
function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Layer 1: deep dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#06070A] via-[#0A0F1A] to-[#06070A]" />

      {/* Layer 2: hex grid — extremely faint, slow drift */}
      {/* opacity controlled by .af-hex-wrap (mobile overrides to 0.02) */}
      <div className="af-hex-wrap absolute inset-0" style={{ opacity: 0.045 }}>
        <div className="af-hex-drift af-hex-bg absolute inset-0 scale-110" />
      </div>

      {/* Layer 3: energy lines — opacity controlled by .af-energy-wrap (mobile → 0.04) */}
      <div className="af-energy-wrap absolute inset-0" style={{ opacity: 0.12 }}>
        {/* Rotation wrapper: rotate the container, animate translate inside */}
        <div className="absolute inset-0 overflow-hidden" style={{ transform: "rotate(-14deg) scale(1.6)" }}>
          {/* Gold energy line */}
          <div
            className="af-energy-gold absolute left-0 right-0 h-[1px]"
            style={{
              top: "38%",
              background: "linear-gradient(90deg, transparent 0%, #F3BA2F 40%, #F3BA2F 60%, transparent 100%)",
            }}
          />
          {/* Blue energy line — reversed direction via af-energy-blue */}
          <div
            className="af-energy-blue absolute left-0 right-0 h-[1px]"
            style={{
              top: "62%",
              background: "linear-gradient(90deg, transparent 0%, #3B82F6 40%, #3B82F6 60%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* Layer 4: radial vignette — pulls focus to center */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-transparent to-[#06070A]/70" />
    </div>
  );
}

/* ─── Flow panel (Hero right side) ─────────────────────────────── */
function FlowPanel() {
  const { t } = useLang();

  return (
    <div className="relative rounded-2xl border border-[#1E293B] bg-[#06070A]/95 overflow-hidden font-mono text-sm shadow-2xl shadow-black/70">

      {/* Scan line — sweeps across top periodically */}
      <div className="absolute inset-x-0 top-0 h-[1px] overflow-hidden pointer-events-none z-10">
        <div
          className="af-scan h-full w-full"
          style={{ background: "linear-gradient(90deg, transparent 0%, #F3BA2F 50%, transparent 100%)" }}
        />
      </div>

      {/* Title bar with logo mark */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E293B] bg-white/[0.02]">
        <img src={logoSrc} alt="" className="h-5 w-5 object-contain" draggable={false} />
        <span className="text-[11px] text-zinc-400 font-sans tracking-wide">AgentFuel Protocol</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 af-breathe" />
          <span className="text-[10px] text-zinc-600 font-sans">LIVE</span>
        </div>
      </div>

      {/* Step 1 — Request */}
      <div className="px-5 py-4 border-b border-[#1E293B]/50">
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2.5">
          {t("home2_panel_req")}
        </p>
        <p className="text-zinc-300">
          <span className="text-[#F3BA2F] font-semibold">POST</span>
          {" "}/api/quote
        </p>
        <p className="text-zinc-600 text-xs mt-1.5">
          serviceId: <span className="text-zinc-400">"defi-sentiment-v1"</span>
        </p>
        <p className="text-zinc-600 text-xs">
          input: <span className="text-zinc-400">{'{ prompt: "Analyze BTC" }'}</span>
        </p>
      </div>

      {/* Step 2 — Payment */}
      <div className="px-5 py-4 border-b border-[#1E293B]/50">
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2.5">
          {t("home2_panel_pay")}
        </p>
        <span className="text-green-400 text-[11px] font-semibold px-1.5 py-0.5 rounded bg-green-500/8 border border-green-500/20">
          200 OK
        </span>
        <p className="text-zinc-600 text-xs mt-2">
          price: <span className="text-zinc-300">0.05 USDT</span>
        </p>
        <p className="text-zinc-600 text-xs">
          stakeRequired: <span className="text-zinc-300">1000 FUEL</span>
        </p>
        <p className="text-zinc-600 text-xs">
          X-Payment-Header:{" "}
          <span className="text-[#F3BA2F]">0x7f3a...d9c1</span>
        </p>
      </div>

      {/* Step 3 — Receipt */}
      <div className="px-5 py-4">
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2.5">
          {t("home2_panel_receipt")}
        </p>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0" />
          <span className="text-zinc-200">{t("home2_panel_receipt_ok")}</span>
        </div>
        <p className="text-zinc-600 text-xs mt-1.5">{t("home2_panel_receipt_sub")}</p>
      </div>

      {/* Blue bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/25 to-transparent" />
    </div>
  );
}

/* ─── Capability tags ─────────────────────────────────────────── */
function CapabilityTags() {
  const { t } = useLang();
  const tags = [
    t("home2_tag_bsc"),
    t("home2_tag_ppc"),
    t("home2_tag_staking"),
    t("home2_tag_receipts"),
  ];
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-14">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 rounded-full border border-[#1E293B] bg-white/[0.03] text-[11px] font-medium text-zinc-500 tracking-widest uppercase"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/* ─── How it Works ────────────────────────────────────────────── */
function HowItWorks() {
  const { t } = useLang();
  const steps = [
    { icon: Database, titleKey: "home2_step1_title" as const, descKey: "home2_step1_desc" as const },
    { icon: Shield,   titleKey: "home2_step2_title" as const, descKey: "home2_step2_desc" as const },
    { icon: Zap,      titleKey: "home2_step3_title" as const, descKey: "home2_step3_desc" as const },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h2 className="text-2xl font-bold text-white mb-10 tracking-tight">
        {t("home2_how_title")}
      </h2>

      {/* Step connector — desktop only */}
      <div className="hidden md:flex items-center mb-0 px-8">
        {steps.map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="w-5 h-5 rounded-full border border-[#F3BA2F]/40 bg-[#06070A] flex items-center justify-center shrink-0">
              <span className="text-[9px] font-mono text-[#F3BA2F]/60">{String(i + 1).padStart(2, "0")}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-[1px] bg-gradient-to-r from-[#F3BA2F]/30 to-[#F3BA2F]/5 mx-0" />
            )}
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1E293B]/40 rounded-2xl overflow-hidden border border-[#1E293B]">
        {steps.map(({ icon: Icon, titleKey, descKey }, idx) => (
          <motion.div
            key={titleKey}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-[#06070A] p-8 flex flex-col gap-4 group hover:bg-[#0A0F1A] transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F3BA2F]/8 border border-[#F3BA2F]/15 flex items-center justify-center group-hover:bg-[#F3BA2F]/12 transition-colors">
              <Icon className="w-5 h-5 text-[#F3BA2F]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{t(titleKey)}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{t(descKey)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Why AgentFuel ───────────────────────────────────────────── */
function WhySection() {
  const { t } = useLang();
  const cards = [
    { icon: Layers,   titleKey: "home2_why1_title" as const, descKey: "home2_why1_desc" as const },
    { icon: Shield,   titleKey: "home2_why2_title" as const, descKey: "home2_why2_desc" as const },
    { icon: BookOpen, titleKey: "home2_why3_title" as const, descKey: "home2_why3_desc" as const },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <h2 className="text-2xl font-bold text-white mb-10 tracking-tight">
        {t("home2_why_title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(({ icon: Icon, titleKey, descKey }, idx) => (
          <motion.div
            key={titleKey}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="relative rounded-2xl border border-[#1E293B] bg-[#06070A]/70 p-7 flex flex-col gap-4 overflow-hidden group hover:border-[#F3BA2F]/20 transition-colors duration-300"
          >
            {/* Gold bottom accent line */}
            <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#F3BA2F]/25 to-transparent" />

            <div className="w-9 h-9 rounded-lg bg-[#F3BA2F]/8 border border-[#F3BA2F]/15 flex items-center justify-center group-hover:bg-[#F3BA2F]/12 transition-colors">
              <Icon className="w-4 h-4 text-[#F3BA2F]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">{t(titleKey)}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{t(descKey)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── CTA block ───────────────────────────────────────────────── */
function CTABlock() {
  const { t } = useLang();
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div className="relative rounded-2xl border border-[#1E293B] bg-[#06070A]/80 px-8 py-14 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        {/* Animated glow layer */}
        <div
          className="af-cta-glow absolute inset-0 pointer-events-none rounded-2xl"
          style={{ background: "radial-gradient(ellipse at 30% 50%, #F3BA2F10, transparent 70%)" }}
        />
        {/* Sweep line (gold) */}
        <div className="absolute inset-x-0 top-0 h-[1px] overflow-hidden pointer-events-none">
          <div
            className="af-energy-gold h-full w-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, #F3BA2F 50%, transparent 100%)",
              opacity: 0.5,
            }}
          />
        </div>
        {/* Right blue accent */}
        <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#3B82F6]/20 to-transparent" />

        <p className="relative text-xl md:text-2xl font-bold text-white max-w-xl leading-snug tracking-tight">
          {t("home2_cta_title")}
        </p>

        <div className="relative flex items-center gap-3 shrink-0">
          <Link
            href="/services"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F3BA2F] text-[#06070A] font-bold text-sm hover:bg-[#F3BA2F]/90 transition-colors"
          >
            {t("home2_cta_launch")} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-xl border border-[#1E293B] bg-white/[0.03] text-zinc-300 font-medium text-sm hover:bg-white/[0.06] hover:text-white hover:border-[#F3BA2F]/20 transition-all"
          >
            {t("home2_cta_dashboard")}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Home page ───────────────────────────────────────────────── */
export default function Home() {
  const { t } = useLang();

  return (
    <div className="flex flex-col items-center">

      {/* Hero */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <HeroBackground />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* BSC badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E293B] bg-white/[0.03] text-[11px] font-medium text-zinc-400 mb-8 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 af-breathe" />
              BSC Testnet
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.08] mb-5">
              {t("home2_hero_title")}
            </h1>

            <p className="text-base text-zinc-400 leading-relaxed max-w-lg mb-8">
              {t("home2_hero_sub")}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/services"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F3BA2F] text-[#06070A] font-bold text-sm hover:bg-[#F3BA2F]/90 transition-colors"
              >
                {t("home2_cta_launch")} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/playground"
                className="px-6 py-2.5 rounded-xl border border-[#1E293B] bg-white/[0.03] text-zinc-300 font-medium text-sm hover:bg-white/[0.06] hover:text-white transition-all"
              >
                {t("nav_developers")}
              </Link>
            </div>
          </motion.div>

          {/* Right — flow panel */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <FlowPanel />
          </motion.div>
        </div>

        {/* Capability tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CapabilityTags />
        </motion.div>
      </section>

      {/* Divider */}
      <div className="w-full border-t border-[#1E293B]" />

      {/* How it works */}
      <HowItWorks />

      {/* Divider */}
      <div className="w-full border-t border-[#1E293B]" />

      {/* Why AgentFuel */}
      <WhySection />

      {/* CTA */}
      <CTABlock />
    </div>
  );
}
