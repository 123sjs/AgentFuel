import { Link } from "wouter";
import { useLang } from "@/lib/i18n";
import {
  BookOpen, Layers, Search, FileText, Shield,
  Terminal, CheckCircle2, Circle, ArrowRight,
  ChevronDown, ChevronUp, Server, Zap,
} from "lucide-react";
import { useState } from "react";

/* ─── tiny helpers ───────────────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-white mb-1 tracking-tight">{children}</h2>
  );
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-zinc-500 mb-6">{children}</p>;
}

function Tag({ children, green }: { children: React.ReactNode; green?: boolean }) {
  return green ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-green-500/20 bg-green-500/8 text-green-400">
      <CheckCircle2 className="w-2.5 h-2.5" /> {children}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-zinc-700/40 bg-zinc-900/40 text-zinc-500">
      <Circle className="w-2.5 h-2.5" /> {children}
    </span>
  );
}

/* ─── FAQ accordion item ─────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1E293B] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
        type="button"
      >
        <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-zinc-600 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-zinc-600 shrink-0" />
        }
      </button>
      {open && (
        <p className="text-sm text-zinc-500 pb-4 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

/* ─── main page ──────────────────────────────────────────────────── */
export default function Docs() {
  const { lang } = useLang();
  const zh = lang === "zh";

  /* ── bilingual content ── */
  const copy = {
    pageTitle:     zh ? "文档 / 产品概览" : "Docs / Overview",
    pageSubtitle:  zh
      ? "了解 AgentFuel 是什么、当前支持什么，以及如何开始使用。"
      : "Learn what AgentFuel is, what it supports today, and how to get started.",

    /* Section 1 */
    s1Title:   zh ? "AgentFuel 是什么" : "What is AgentFuel",
    s1Tag:     zh ? "产品概览" : "Product Overview",
    s1One:     zh
      ? "AgentFuel 是面向 BSC 的 AI Agent 按次调用商务层。"
      : "AgentFuel is a pay-per-call commerce layer for AI agents, built for BSC.",
    s1Body:    zh
      ? "AgentFuel 为 AI Agent、API 和 MCP 服务提供统一的上架、报价与结算基础设施。服务提供方可以将自己的 API 接入注册表，调用方通过标准报价流程获取价格，未来将通过链上结算完成支付，所有调用记录最终可在链上审计。"
      : "AgentFuel provides unified listing, quoting, and settlement infrastructure for AI agents, APIs, and MCP services. Providers register their endpoints in the service registry. Callers obtain prices through a standard quote flow. Onchain payment settlement and auditable call receipts are being integrated.",

    /* Section 2 */
    s2Title:   zh ? "核心能力" : "Core Capabilities",
    s2Sub:     zh ? "当前产品的五项核心模块说明。" : "The five core modules of the current product.",
    caps: [
      {
        icon: Layers,
        title: zh ? "服务上架" : "Service Listing",
        desc: zh
          ? "服务提供方将 API 端点、价格与 FUEL 质押要求提交至 AgentFuel 服务注册表，生成可发现的服务条目。"
          : "Providers submit an API endpoint, price, and FUEL stake requirement to the AgentFuel registry, creating a discoverable service entry.",
      },
      {
        icon: Search,
        title: zh ? "服务发现" : "Service Discovery",
        desc: zh
          ? "调用方可在服务市场中按名称、状态与支付代币浏览和筛选服务。"
          : "Callers browse and filter services in the market by name, status, and payment token.",
      },
      {
        icon: FileText,
        title: zh ? "报价请求" : "Quote Request",
        desc: zh
          ? "调用方向 AgentFuel API 提交报价请求，返回价格、当前流程中的默认报价代币与支付头字段。"
          : "Callers submit a quote request to the AgentFuel API and receive price, the default quote token in the current flow, and a payment header field.",
      },
      {
        icon: Shield,
        title: zh ? "服务上架中的 FUEL 质押要求字段" : "FUEL Stake Requirement Field in Listings",
        desc: zh
          ? "服务上架时可设置 FUEL 质押要求字段，该字段显示在服务卡片中。链上质押强制执行仍在完善中。"
          : "Providers set a stakeRequired field at listing time. The value is displayed on service cards. Onchain stake enforcement is being integrated.",
      },
      {
        icon: Terminal,
        title: zh ? "开发者 Playground" : "Developer Playground",
        desc: zh
          ? "开发者可在 Playground 页面选择服务、提交 JSON 输入并获取报价，检查报价结果与支付头字段。"
          : "Developers can select a service, submit a JSON payload, and receive a quote — inspecting price, stake requirement, and the payment header field.",
      },
    ],

    /* Section 3 */
    s3Title:     zh ? "当前产品状态" : "Current Product Status",
    s3Sub:       zh ? "以下是已支持功能与仍在完善功能的准确说明。" : "An accurate breakdown of what is available and what is being integrated.",
    s3NowLabel:  zh ? "当前已支持" : "Available Now",
    s3IntLabel:  zh ? "仍在完善中" : "Being Integrated",
    s3Now: zh ? [
      "服务上架（注册表 API）",
      "服务市场浏览与筛选",
      "报价请求与价格返回",
      "当前流程中的默认报价代币显示",
      "服务上架中的 FUEL 质押要求字段",
      "开发者 Playground 报价模拟",
    ] : [
      "Service listing via registry API",
      "Service market browsing and filtering",
      "Quote request and price response",
      "Default quote token display in current flow",
      "FUEL stake requirement field in listings",
      "Developer Playground for quote inspection",
    ],
    s3Int: zh ? [
      "链上支付结算",
      "链上调用收据存储",
      "FUEL 质押链上执行",
      "报价后自动执行服务并结算",
    ] : [
      "Onchain payment settlement",
      "Onchain call receipt recording",
      "Onchain FUEL staking enforcement",
      "Automated pay-per-call execution after quote",
    ],

    /* Section 4 */
    s4Title: zh ? "工作流程" : "How It Works",
    s4Sub:   zh ? "四步说明 AgentFuel 的基本流程。" : "Four steps explaining the AgentFuel flow.",
    steps: [
      {
        num: "01",
        icon: Layers,
        title: zh ? "上架服务" : "List a Service",
        desc: zh
          ? "服务提供方通过 List Service 表单提交端点、价格和 FUEL 质押要求，生成注册表条目。"
          : "Providers submit an endpoint, price, and FUEL stake requirement via the List Service form to create a registry entry.",
        tag: zh ? "当前已支持" : "Available now",
        tagGreen: true,
      },
      {
        num: "02",
        icon: Search,
        title: zh ? "在市场发现服务" : "Discover in Market",
        desc: zh
          ? "调用方在服务市场中浏览可用服务，查看端点、价格和提供方信息。"
          : "Callers browse available services in the market, viewing endpoint, price, and provider information.",
        tag: zh ? "当前已支持" : "Available now",
        tagGreen: true,
      },
      {
        num: "03",
        icon: FileText,
        title: zh ? "请求报价" : "Request a Quote",
        desc: zh
          ? "调用方向 AgentFuel API 提交报价请求，返回价格与支付头字段供后续结算使用。"
          : "Callers submit a quote request to the AgentFuel API, receiving price and a payment header field for use in settlement.",
        tag: zh ? "当前已支持" : "Available now",
        tagGreen: true,
      },
      {
        num: "04",
        icon: Zap,
        title: zh ? "结算与收据" : "Settlement & Receipts",
        desc: zh
          ? "链上支付结算与可验证调用收据正在完善中。报价头字段将用于未来的链上结算流程。"
          : "Onchain payment settlement and verifiable call receipts are being integrated. The payment header field will be used in the future onchain settlement flow.",
        tag: zh ? "完善中" : "Integrating",
        tagGreen: false,
      },
    ],

    /* Section 5 */
    s5Title:     zh ? "开始使用" : "Getting Started",
    s5Sub:       zh ? "面向服务提供方和服务调用方的使用路径。" : "Paths for service providers and integrators.",
    provTitle:   zh ? "服务提供方" : "For Providers",
    provSteps: zh ? [
      "连接 BSC 钱包",
      "准备 API 端点（必须可公开访问）",
      "通过 List Service 表单提交服务，填写名称、描述、端点、价格和 FUEL 质押要求字段",
      "服务上架后出现在服务市场中",
    ] : [
      "Connect a BSC wallet",
      "Prepare your API endpoint (must be publicly reachable)",
      "Submit your service via the List Service form: name, description, endpoint, price, and FUEL stake requirement field",
      "Your service entry appears in the market after submission",
    ],
    intTitle:    zh ? "服务调用方 / 集成方" : "For Integrators",
    intSteps: zh ? [
      "在服务市场中浏览可用服务",
      "通过 Playground 提交报价请求，获取价格与支付头字段",
      "检查报价结果和支付头字段",
      "链上结算接入后，可通过支付头完成按次调用支付",
    ] : [
      "Browse available services in the market",
      "Submit a quote request via the Playground: select a service and provide a JSON payload",
      "Inspect the price and payment header field in the quote response",
      "Once onchain settlement is integrated, use the payment header to complete per-call payment",
    ],

    /* Section 6 — FAQ */
    s6Title: zh ? "常见问题" : "FAQ",
    s6Sub:   zh ? "关于当前产品状态的准确说明。" : "Accurate answers about the current product state.",
    faqs: [
      {
        q: zh ? "AgentFuel 已在 BSC 上线了吗？" : "Is AgentFuel live on BSC?",
        a: zh
          ? "AgentFuel 面向 BSC 构建。当前产品已支持服务上架与报价流程。链上支付结算与链上收据仍在完善中。"
          : "AgentFuel is built for BSC. Service listing and the quote flow are available in the current product. Onchain payment settlement and receipt recording are being integrated.",
      },
      {
        q: zh ? "上架服务等于链上部署吗？" : "Does listing a service mean onchain deployment?",
        a: zh
          ? "不是。上架服务会在 AgentFuel 注册表中创建一条条目，不会触发任何 BSC 链上交易。"
          : "No. Listing creates a registry entry in AgentFuel. No BSC transaction is triggered at listing time.",
      },
      {
        q: zh ? "调用收据已经在链上记录了吗？" : "Are call receipts recorded onchain yet?",
        a: zh
          ? "在当前产品流程中，还没有。收据数据模型已就位，链上存储仍在完善中。"
          : "Not in the current product flow. The receipt data model is in place; onchain storage is being integrated.",
      },
      {
        q: zh ? "FUEL 质押目前是否在链上强制执行？" : "Is FUEL staking enforced onchain today?",
        a: zh
          ? "当前产品流程中尚未实现。stakeRequired 字段当前显示在服务上架信息中，链上强制执行仍在完善中。"
          : "Not in the current product flow. The stakeRequired field is displayed in listings. Onchain enforcement is being integrated.",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* ── Page header ────────────────────────────────────────────── */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#1E293B] bg-[#06070A]/80 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-5">
          <BookOpen className="w-3 h-3" /> {copy.pageTitle}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
          {copy.s1One}
        </h1>
        <p className="text-base text-zinc-500 max-w-2xl leading-relaxed">{copy.s1Body}</p>
      </div>

      {/* ── Core Capabilities ──────────────────────────────────────── */}
      <section>
        <SectionTitle>{copy.s2Title}</SectionTitle>
        <SectionSubtitle>{copy.s2Sub}</SectionSubtitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {copy.caps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-[#1E293B] bg-[#06070A]/60 p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg border border-[#1E293B] bg-[#0A0F1A] flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#F3BA2F]" />
                </div>
                <p className="text-sm font-semibold text-white">{title}</p>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Current Product Status ─────────────────────────────────── */}
      <section>
        <SectionTitle>{copy.s3Title}</SectionTitle>
        <SectionSubtitle>{copy.s3Sub}</SectionSubtitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Available now */}
          <div className="rounded-xl border border-green-500/15 bg-green-500/4 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest">{copy.s3NowLabel}</span>
            </div>
            <ul className="space-y-2.5">
              {copy.s3Now.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-green-500/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Being integrated */}
          <div className="rounded-xl border border-[#1E293B] bg-[#06070A]/40 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Circle className="w-4 h-4 text-zinc-600" />
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{copy.s3IntLabel}</span>
            </div>
            <ul className="space-y-2.5">
              {copy.s3Int.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-zinc-600 leading-relaxed">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section>
        <SectionTitle>{copy.s4Title}</SectionTitle>
        <SectionSubtitle>{copy.s4Sub}</SectionSubtitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {copy.steps.map(({ num, icon: Icon, title, desc, tag, tagGreen }) => (
            <div key={num} className="rounded-xl border border-[#1E293B] bg-[#06070A]/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-zinc-600">{num}</span>
                <Tag green={tagGreen}>{tag}</Tag>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-3.5 h-3.5 text-zinc-500" />
                <p className="text-sm font-semibold text-white">{title}</p>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Getting Started ────────────────────────────────────────── */}
      <section>
        <SectionTitle>{copy.s5Title}</SectionTitle>
        <SectionSubtitle>{copy.s5Sub}</SectionSubtitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* For Providers */}
          <div className="rounded-xl border border-[#1E293B] bg-[#06070A]/60 p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <Server className="w-4 h-4 text-[#F3BA2F]" />
              <p className="text-sm font-bold text-white">{copy.provTitle}</p>
            </div>
            <ol className="space-y-3">
              {copy.provSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-zinc-600 mt-0.5 shrink-0 w-4">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* For Integrators */}
          <div className="rounded-xl border border-[#1E293B] bg-[#06070A]/60 p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <Terminal className="w-4 h-4 text-[#3B82F6]" />
              <p className="text-sm font-bold text-white">{copy.intTitle}</p>
            </div>
            <ol className="space-y-3">
              {copy.intSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-zinc-600 mt-0.5 shrink-0 w-4">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>{copy.s6Title}</SectionTitle>
        <SectionSubtitle>{copy.s6Sub}</SectionSubtitle>
        <div className="rounded-xl border border-[#1E293B] bg-[#06070A]/60 px-5 divide-y divide-[#1E293B]/60">
          {copy.faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#1E293B] bg-[#06070A]/70 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-base font-bold text-white mb-1">
            {zh ? "准备好开始了吗？" : "Ready to get started?"}
          </p>
          <p className="text-sm text-zinc-500">
            {zh
              ? "在服务市场中发现可用服务，或在 Dashboard 管理你的提供方档案。"
              : "Discover available services in the market or manage your provider profile in the Dashboard."}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
          <Link
            href="/services"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F3BA2F] text-[#06070A] font-bold text-sm hover:bg-[#F3BA2F]/90 transition-colors"
          >
            {zh ? "浏览服务" : "Explore Services"} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1E293B] bg-white/3 text-sm text-zinc-300 hover:bg-white/6 transition-colors"
          >
            {zh ? "打开 Dashboard" : "Open Dashboard"}
          </Link>
        </div>
      </section>

    </div>
  );
}
