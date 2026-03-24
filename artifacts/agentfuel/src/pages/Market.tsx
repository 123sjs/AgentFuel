import { useState, useMemo } from "react";
import { useListServices, useCreateService } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Cpu, ArrowRight, Activity, Plus,
  ChevronDown, Server, Layers, Zap,
  AlertCircle, CheckCircle2, Info, Lock,
} from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { useWallet } from "@/hooks/use-wallet";
import { useLang } from "@/lib/i18n";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

/* ─── Types ─────────────────────────────────────────────────────── */
type StatusFilter = "all" | "active" | "inactive";

/* ─── Sub-components ────────────────────────────────────────────── */

function ComingSoonBadge() {
  const { t } = useLang();
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border border-zinc-700/60 text-zinc-600 bg-zinc-900/60 select-none">
      {t("dash_coming_soon")}
    </span>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-[#1E293B] bg-[#06070A]/70 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#F3BA2F]/40 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0A0F1A]">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
    </div>
  );
}

/* ─── Empty state ────────────────────────────────────────────────── */
function EmptyState({ isFiltered, t }: { isFiltered: boolean; t: (k: any) => string }) {
  if (isFiltered) {
    return (
      <div className="py-20 text-center rounded-2xl border border-[#1E293B] bg-[#06070A]/40">
        <Search className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
        <h3 className="text-base font-semibold text-zinc-400 mb-2">{t("market_no_agents")}</h3>
        <p className="text-sm text-zinc-600">{t("market_no_agents_desc")}</p>
      </div>
    );
  }

  const steps = [
    { num: "01", icon: Layers,  title: t("market_step1_title"), desc: t("market_step1_desc") },
    { num: "02", icon: Server,  title: t("market_step2_title"), desc: t("market_step2_desc") },
    { num: "03", icon: Plus,    title: t("market_step3_title"), desc: t("market_step3_desc") },
    { num: "04", icon: Zap,     title: t("market_step4_title"), desc: t("market_step4_desc") },
  ];

  return (
    <div className="space-y-8">
      <div className="py-14 text-center rounded-2xl border border-[#1E293B] bg-[#06070A]/60">
        <div className="w-14 h-14 rounded-2xl border border-[#1E293B] bg-[#0A0F1A] flex items-center justify-center mx-auto mb-5">
          <Cpu className="w-7 h-7 text-zinc-600" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{t("market_no_services_title")}</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          {t("market_no_services_desc")}
        </p>
      </div>

      <div>
        <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">{t("market_how_title")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map(({ num, icon: Icon, title, desc }) => (
            <div key={num} className="rounded-xl border border-[#1E293B] bg-[#06070A]/40 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-zinc-600">{num}</span>
                <Icon className="w-4 h-4 text-zinc-600" />
              </div>
              <p className="text-sm font-semibold text-zinc-300 mb-1">{title}</p>
              <p className="text-xs text-zinc-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Service Card ───────────────────────────────────────────────── */
function ServiceCard({ service, idx, t }: { service: any; idx: number; t: (k: any) => string }) {
  const isActive = service.active === true;

  /* successRate: stored as basis points (10000 = 100.00%).
     Only meaningful when there have been actual calls. */
  const successRateDisplay =
    service.totalCalls === 0
      ? "--"
      : `${(service.successRate / 100).toFixed(1)}%`;

  /* avgLatency: 0 means not yet measured */
  const latencyDisplay =
    service.avgLatency === 0 ? "--" : `${service.avgLatency}ms`;

  /* stakeRequired: "0" means no stake set; trim trailing decimal zeros */
  const stakeDisplay =
    !service.stakeRequired || service.stakeRequired === "0"
      ? "--"
      : `${parseFloat(service.stakeRequired)} FUEL`;

  return (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, delay: idx * 0.04 }}
      className="group relative flex flex-col rounded-2xl border border-[#1E293B] bg-[#06070A]/70 hover:border-[#F3BA2F]/20 transition-all duration-300 overflow-hidden"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F3BA2F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl border border-[#1E293B] bg-[#0A0F1A] flex items-center justify-center shrink-0">
            <Cpu className="w-4.5 h-4.5 text-[#F3BA2F]" />
          </div>
          {isActive ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-green-500/20 bg-green-500/8 text-[10px] text-green-400 font-medium shrink-0">
              <span className="w-1 h-1 rounded-full bg-green-400" />
              {t("market_active")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-zinc-700/40 bg-zinc-900/40 text-[10px] text-zinc-500 font-medium shrink-0">
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              Inactive
            </span>
          )}
        </div>

        {/* Name + Description */}
        <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#F3BA2F] transition-colors line-clamp-1">
          {service.name}
        </h3>
        <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {service.description}
        </p>

        {/* Endpoint — plain text, no external link */}
        <div className="mb-4 px-3 py-2 rounded-lg border border-[#1E293B] bg-black/20 flex items-center gap-2">
          <Server className="w-3 h-3 text-zinc-600 shrink-0" />
          <span
            className="font-mono text-[10px] text-zinc-500 truncate"
            title={service.endpoint}
          >
            {service.endpoint}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCell label={t("market_price_per_call")} value={String(parseFloat(service.price))} unit={service.currency} />
          <StatCell label="Stake Required" value={stakeDisplay} />
          <StatCell label={t("market_success_rate")} value={successRateDisplay} />
          <StatCell label="Total Calls" value={String(service.totalCalls)} />
        </div>

        {/* Provider row */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-[#1E293B] bg-black/20 mb-4">
          <span className="text-[10px] text-zinc-600">{t("market_provider")}</span>
          <span className="font-mono text-[10px] text-zinc-400">
            {formatAddress(service.ownerAddress)}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/playground?serviceId=${service.id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#1E293B] bg-white/3 text-xs font-semibold text-zinc-300 hover:bg-[#F3BA2F] hover:text-[#06070A] hover:border-transparent transition-all"
        >
          {t("market_get_quote")} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

function StatCell({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div>
      <p className="text-[10px] text-zinc-600 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-zinc-200">
        {value}
        {unit && value !== "--" && (
          <span className="text-[10px] text-zinc-600 font-normal ml-1">{unit}</span>
        )}
      </p>
    </div>
  );
}

/* ─── Field hint ─────────────────────────────────────────────────── */
function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] text-zinc-600 leading-relaxed flex items-start gap-1 mt-0.5">
      <Info className="w-2.5 h-2.5 shrink-0 mt-0.5 text-zinc-700" />
      <span>{children}</span>
    </p>
  );
}

/* ─── Section label ──────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-1 pb-0.5">
      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{children}</span>
      <div className="flex-1 h-px bg-[#1E293B]" />
    </div>
  );
}

/* ─── List Service Modal ─────────────────────────────────────────── */
function ListServiceModal({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  isSuccess,
  mutationError,
  t,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  isSuccess: boolean;
  mutationError: unknown;
  t: (k: any) => string;
}) {
  const { lang } = useLang();
  const { isConnected, isCorrectNetwork } = useWallet();

  const inputClass =
    "w-full px-3.5 py-2.5 bg-[#06070A] border border-[#1E293B] rounded-xl text-white text-sm focus:ring-1 focus:ring-[#F3BA2F]/40 focus:border-[#F3BA2F]/40 outline-none transition-all placeholder:text-zinc-600";

  const errorMessage = mutationError
    ? (mutationError as any)?.message ?? "Submission failed. Please try again."
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-[#0A0F1A] border-[#1E293B] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">
            {t("market_modal_title")}
          </DialogTitle>
        </DialogHeader>

        {/* ── Success state ── */}
        {isSuccess ? (
          <div className="py-8 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">
                {lang === "zh" ? "上架已提交成功" : "Listing submitted successfully"}
              </p>
              <p className="text-xs text-zinc-500 max-w-xs">
                {lang === "zh"
                  ? "服务上架已提交成功，刷新后会出现在服务列表中。"
                  : "Service listing submitted successfully. It will appear in the registry after refresh."}
              </p>
            </div>
            <div className="w-full rounded-xl border border-[#1E293B] bg-black/20 px-4 py-3 text-left space-y-1.5">
              <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">What's next</p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                {lang === "zh"
                  ? "服务条目已提交至 AgentFuel 注册表。链上结算与 FUEL 自动质押仍在完善中，提交不代表链上部署或支付已开通。"
                  : "Your service entry has been submitted to the AgentFuel registry. Onchain settlement and automatic FUEL staking are being integrated — this submission does not constitute a BSC deployment or activate payment settlement."}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 mt-1">

            {/* ── Notice ── */}
            <div className="flex gap-2.5 p-3 rounded-xl border border-[#1E293B] bg-[#06070A]/60">
              <div className="shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5 text-zinc-600" />
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                {lang === "zh"
                  ? "上架服务将创建一条注册表条目，当前已支持服务上架。链上结算与 FUEL 自动质押仍在完善中，提交不等于链上部署。"
                  : "Listing creates a registry entry. Onchain settlement and automatic FUEL staking are being integrated — submitting is not a deployment to BSC."}
              </p>
            </div>

            {/* ── Network notice (shown immediately when network is wrong) ── */}
            {isConnected && !isCorrectNetwork && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300 leading-relaxed">{t("mkt_network_notice")}</p>
              </div>
            )}

            {/* ── Basic Info ── */}
            <SectionLabel>{t("market_section_basic")}</SectionLabel>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{t("market_service_name")}</label>
              <input
                required
                name="name"
                className={inputClass}
                placeholder={t("market_service_name_ph")}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{t("market_description")}</label>
              <textarea
                required
                name="description"
                className={`${inputClass} min-h-[80px] resize-none`}
                placeholder={t("market_description_ph")}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{t("market_endpoint")}</label>
              <input
                required
                name="endpoint"
                className={inputClass}
                placeholder="https://api.example.com/v1/agent"
              />
              <FieldHint>
                HTTPS URL of your agent's callable API endpoint. Must be publicly reachable.
              </FieldHint>
            </div>

            {/* ── Pricing & Network ── */}
            <SectionLabel>{t("market_section_pricing")}</SectionLabel>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">{t("market_price")}</label>
                <input
                  required
                  name="price"
                  type="number"
                  step="0.0001"
                  min="0"
                  className={inputClass}
                  placeholder="0.05"
                />
                <FieldHint>{t("market_price_hint")}</FieldHint>
              </div>

              {/* Currency — read-only, FUEL testnet token */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">
                  {t("market_payment_token")}
                </label>
                <div className={`${inputClass} flex items-center gap-2 cursor-default opacity-70`}>
                  <Lock className="w-3 h-3 text-zinc-600 shrink-0" />
                  <span className="text-zinc-400">FUEL</span>
                </div>
                <FieldHint>{t("market_token_hint")}</FieldHint>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{t("market_stake")}</label>
              <input
                required
                name="stakeRequired"
                type="number"
                min="0"
                className={inputClass}
                placeholder="1000"
              />
              <FieldHint>{t("market_stake_hint")}</FieldHint>
            </div>

            {/* ── Inline error ── */}
            {errorMessage && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400">{errorMessage}</p>
              </div>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-[#F3BA2F] text-[#06070A] font-bold text-sm rounded-xl hover:bg-[#F3BA2F]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isPending ? (
                <><span className="w-3.5 h-3.5 border-2 border-[#06070A]/30 border-t-[#06070A] rounded-full animate-spin" /> {t("market_submitting")}</>
              ) : (
                t("market_submit")
              )}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main page ──────────────────────────────────────────────────── */
export default function Market() {
  const [searchTerm, setSearchTerm]     = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tokenFilter, setTokenFilter]   = useState("all");
  const [isModalOpen, setIsModalOpen]   = useState(false);

  const { data: services, isLoading } = useListServices();
  const { address } = useWallet();
  const { t } = useLang();
  const queryClient = useQueryClient();

  const createMutation = useCreateService({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      },
    },
  });

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    /* Reset mutation state when the modal is closed */
    if (!open) createMutation.reset();
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMutation.mutate({
      data: {
        ownerAddress: address || "0x0000000000000000000000000000000000000000",
        name:         fd.get("name")          as string,
        description:  fd.get("description")   as string,
        endpoint:     fd.get("endpoint")      as string,
        price:        fd.get("price")         as string,
        currency:     "FUEL",
        stakeRequired: fd.get("stakeRequired") as string,
      },
    });
  };

  /* Dynamic token list built from real data */
  const tokenOptions = useMemo(() => {
    const unique = [...new Set(services?.map((s) => s.currency).filter(Boolean))];
    return [
      { label: t("market_all_tokens"), value: "all" },
      ...unique.map((c) => ({ label: c, value: c })),
    ];
  }, [services, t]);

  /* Filtering — all based on real fields */
  const filteredServices = useMemo(() => {
    return (services ?? []).filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? s.active === true
          : s.active === false;
      const matchToken =
        tokenFilter === "all" ? true : s.currency === tokenFilter;
      return matchSearch && matchStatus && matchToken;
    });
  }, [services, searchTerm, statusFilter, tokenFilter]);

  const isFiltered = searchTerm !== "" || statusFilter !== "all" || tokenFilter !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
            {t("market_title")}
          </h1>
          <p className="text-sm text-zinc-500">
            Discover agent-powered services, APIs and MCP endpoints on BSC.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Explore Pricing — not yet implemented */}
          <button
            disabled
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#1E293B] bg-white/2 text-sm text-zinc-600 cursor-not-allowed"
            title="Pricing tiers are not yet available"
          >
            {t("market_explore_pricing")}
            <ComingSoonBadge />
          </button>

          {/* List Service — functional (calls real API) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#F3BA2F]/30 bg-[#F3BA2F]/8 text-sm text-[#F3BA2F] hover:bg-[#F3BA2F]/15 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t("market_list_service")}
          </button>
        </div>
      </div>

      {/* ── Search + Filter bar ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
          <input
            type="text"
            placeholder={t("market_search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#1E293B] bg-[#06070A]/70 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#F3BA2F]/40 transition-all"
          />
        </div>

        {/* Status filter — based on service.active (real field) */}
        <FilterSelect
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as StatusFilter)}
          options={[
            { label: t("market_all_status"),      value: "all" },
            { label: t("market_active"),            value: "active" },
            { label: t("market_filter_inactive"), value: "inactive" },
          ]}
        />

        {/* Token filter — dynamically built from real data */}
        <FilterSelect
          value={tokenFilter}
          onChange={setTokenFilter}
          options={tokenOptions}
        />

        {/* Result count */}
        {!isLoading && services != null && (
          <span className="text-xs text-zinc-600 ml-auto shrink-0">
            {filteredServices.length} / {services.length} {t("market_count_unit")}
          </span>
        )}
      </div>

      {/* ── Service list ─────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl border border-[#1E293B] bg-[#06070A]/40 animate-pulse"
            />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <EmptyState isFiltered={isFiltered} t={t} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, idx) => (
              <ServiceCard key={service.id} service={service} idx={idx} t={t} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      {!isLoading && (
        <div className="rounded-2xl border border-[#1E293B] bg-[#06070A]/50 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Ready to list your service?
            </h3>
            <p className="text-sm text-zinc-500">
              Register your AI agent endpoint and start earning per API call.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F3BA2F] text-[#06070A] font-bold text-sm hover:bg-[#F3BA2F]/90 transition-colors shrink-0"
          >
            {t("market_list_service")} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── List Service Modal ───────────────────────────────────── */}
      <ListServiceModal
        isOpen={isModalOpen}
        onOpenChange={handleModalOpenChange}
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
        isSuccess={createMutation.isSuccess}
        mutationError={createMutation.error}
        t={t}
      />
    </div>
  );
}
