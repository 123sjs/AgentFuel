import { useState, useMemo } from "react";
import { useListServices, useRequestQuote } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import {
  Terminal, Send, Shield, AlertCircle, Loader2,
  ArrowLeft, Server, Copy, Check, ChevronRight,
  CheckCircle2, Circle,
} from "lucide-react";
import { Link } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { useLang } from "@/lib/i18n";
/* ─── Copy button ────────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center w-6 h-6 rounded border border-[#1E293B] bg-white/5 hover:bg-white/10 transition-colors shrink-0"
      title="Copy to clipboard"
      type="button"
    >
      {copied
        ? <Check className="w-3 h-3 text-green-400" />
        : <Copy className="w-3 h-3 text-zinc-500" />
      }
    </button>
  );
}

/* ─── Status row ─────────────────────────────────────────────────── */
function StatusRow({
  label,
  description,
  ready,
}: {
  label: string;
  description: string;
  ready: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#1E293B]/50 last:border-b-0">
      <div className="mt-0.5 shrink-0">
        {ready
          ? <CheckCircle2 className="w-4 h-4 text-green-400" />
          : <Circle className="w-4 h-4 text-zinc-700" />
        }
      </div>
      <div>
        <p className={`text-xs font-semibold ${ready ? "text-green-400" : "text-zinc-500"}`}>
          {label}
        </p>
        <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ─── Service not found ──────────────────────────────────────────── */
function ServiceNotFound() {
  return (
    <div className="max-w-lg mx-auto py-20 text-center">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white mb-2">Service Not Found</h2>
        <p className="text-sm text-zinc-500 mb-6">
          The service ID in this URL does not match any available service.
          It may have been removed or the link may be incorrect.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F3BA2F] text-[#06070A] font-bold text-sm hover:bg-[#F3BA2F]/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
      </div>
    </div>
  );
}

/* ─── No service selected ────────────────────────────────────────── */
function NoServiceSelected() {
  return (
    <div className="max-w-lg mx-auto py-20 text-center">
      <div className="rounded-2xl border border-[#1E293B] bg-[#06070A]/60 p-10">
        <Shield className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white mb-2">No Service Selected</h2>
        <p className="text-sm text-zinc-500 mb-6">
          Select a service from the market to begin quoting and inspecting
          agent-powered service execution.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F3BA2F] text-[#06070A] font-bold text-sm hover:bg-[#F3BA2F]/90 transition-colors"
        >
          Browse Services <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────── */
export default function Playground() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialServiceId = searchParams.get("serviceId") || "";

  const [serviceId, setServiceId]       = useState(initialServiceId);
  const [inputPayload, setInputPayload] = useState("{}");
  const [jsonError, setJsonError]       = useState<string | null>(null);

  const { data: services, isLoading: servicesLoading } = useListServices();
  const { mutate: requestQuote, isPending, data: quoteResult, error, reset } = useRequestQuote();
  const { isConnected, connect } = useWallet();
  const { t } = useLang();

  /* Resolve selected service from real data */
  const selectedService = useMemo(
    () => services?.find((s) => s.id.toString() === serviceId) ?? null,
    [services, serviceId]
  );

  /* Determine URL serviceId state:
     - ""          → no serviceId in URL
     - non-empty   → has serviceId
     - services loaded + no match → invalid  */
  const urlHasServiceId = initialServiceId !== "";
  const servicesLoaded  = !servicesLoading && services != null;
  const invalidServiceId = urlHasServiceId && servicesLoaded && selectedService === null;

  const handleServiceChange = (id: string) => {
    setServiceId(id);
    reset?.();
    setJsonError(null);
  };

  const handlePayloadChange = (v: string) => {
    setInputPayload(v);
    setJsonError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId) return;
    try {
      JSON.parse(inputPayload);
    } catch {
      setJsonError("Invalid JSON — please check your input format.");
      return;
    }
    setJsonError(null);
    requestQuote({ data: { serviceId, input: JSON.parse(inputPayload) } });
  };

  const inputClass =
    "w-full px-4 py-3 bg-[#06070A] border border-[#1E293B] rounded-xl text-white text-sm focus:ring-1 focus:ring-[#F3BA2F]/40 focus:border-[#F3BA2F]/40 outline-none transition-all placeholder:text-zinc-600";

  /* ── Loading state ── */
  if (servicesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center gap-3 text-zinc-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading services…</span>
      </div>
    );
  }

  /* ── Invalid serviceId ── */
  if (invalidServiceId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PageHeader showBack />
        <ServiceNotFound />
      </div>
    );
  }

  /* ── No serviceId selected ── */
  if (!serviceId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PageHeader showBack />
        <NoServiceSelected />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* ── Page header ─────────────────────────────────────────── */}
      <PageHeader showBack />

      {/* ── Service summary card ─────────────────────────────────── */}
      {selectedService && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#1E293B] bg-[#06070A]/70 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg border border-[#1E293B] bg-[#0A0F1A] flex items-center justify-center">
                <Server className="w-3.5 h-3.5 text-[#F3BA2F]" />
              </div>
              <span className="text-sm font-bold text-white">{selectedService.name}</span>
            </div>
            {selectedService.active ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-green-500/20 bg-green-500/8 text-[10px] text-green-400 font-medium">
                <span className="w-1 h-1 rounded-full bg-green-400" /> Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-zinc-700/40 bg-zinc-900/40 text-[10px] text-zinc-500 font-medium">
                Inactive
              </span>
            )}
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCell label="Description" value={selectedService.description} mono={false} />
            {/* Endpoint: plain text only, no external link */}
            <SummaryCell
              label="Endpoint"
              value={selectedService.endpoint}
              mono
              truncate
              fullValue={selectedService.endpoint}
            />
            <SummaryCell
              label="Price per Call"
              value={`${parseFloat(selectedService.price)} ${selectedService.currency}`}
            />
            <SummaryCell
              label="Stake Required"
              value={
                !selectedService.stakeRequired || selectedService.stakeRequired === "0"
                  ? "--"
                  : `${parseFloat(selectedService.stakeRequired)} FUEL`
              }
            />
          </div>
        </motion.div>
      )}

      {/* ── Main two-column layout ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Request panel ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-[#1E293B] bg-[#06070A]/70 overflow-hidden flex flex-col"
        >
          <div className="px-6 py-4 border-b border-[#1E293B]">
            <h2 className="text-sm font-bold text-white">{t("play_configure")}</h2>
            <p className="text-xs text-zinc-600 mt-0.5">Select a service and provide a JSON input payload.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 flex flex-col flex-1">

            {/* Service selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500">{t("play_select")}</label>
              <div className="relative">
                <select
                  value={serviceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  required
                  className={`${inputClass} appearance-none pr-8`}
                >
                  <option value="" disabled className="bg-[#0A0F1A]">
                    {t("play_select_ph")}
                  </option>
                  {services?.map((s) => (
                    <option key={s.id} value={s.id.toString()} className="bg-[#0A0F1A]">
                      {s.name} — {parseFloat(s.price)} {s.currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* JSON payload input */}
            <div className="space-y-1.5 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-500">{t("play_payload")}</label>
                <span className="text-[10px] text-zinc-600 font-mono">application/json</span>
              </div>
              <textarea
                value={inputPayload}
                onChange={(e) => handlePayloadChange(e.target.value)}
                className="flex-1 min-h-[160px] px-4 py-3 font-mono text-sm bg-black/40 border border-[#1E293B] rounded-xl text-green-400 focus:ring-1 focus:ring-[#F3BA2F]/40 outline-none resize-none"
                spellCheck={false}
              />
              {/* Inline JSON error — no alert */}
              {jsonError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {jsonError}
                </p>
              )}
            </div>

            {/* Submit area */}
            {!isConnected ? (
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/8 flex flex-col items-center gap-3">
                <p className="text-xs text-amber-300 text-center">{t("play_wallet_prompt")}</p>
                <button
                  type="button"
                  onClick={connect}
                  className="px-5 py-2 bg-[#F3BA2F] text-[#06070A] font-bold text-sm rounded-xl hover:bg-[#F3BA2F]/90 transition-colors"
                >
                  {t("connect_wallet")}
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isPending || !serviceId}
                className="w-full py-3 bg-[#F3BA2F] text-[#06070A] font-bold text-sm rounded-xl hover:bg-[#F3BA2F]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t("play_submitting")}</>
                ) : (
                  <><Send className="w-4 h-4" /> {t("play_submit")}</>
                )}
              </button>
            )}
          </form>
        </motion.div>

        {/* ── Right: Result panel ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-[#1E293B] bg-[#06070A]/70 overflow-hidden flex flex-col"
        >
          <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">{t("play_result")}</h2>
            {quoteResult && (
              <span className="px-2 py-0.5 rounded text-[10px] border border-green-500/20 bg-green-500/8 text-green-400 font-medium">
                Quote ready
              </span>
            )}
            {error && (
              <span className="px-2 py-0.5 rounded text-[10px] border border-red-500/20 bg-red-500/8 text-red-400 font-medium">
                Error
              </span>
            )}
          </div>

          <div className="p-6 flex flex-col flex-1">

            {/* Empty state */}
            {!quoteResult && !error && !isPending && (
              <div className="flex-1 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-[#1E293B] bg-black/10 p-8">
                <Shield className="w-10 h-10 text-zinc-700 mb-4" />
                <p className="text-sm text-zinc-500">{t("play_empty")}</p>
                <p className="text-xs text-zinc-600 mt-1">Quote results will appear here.</p>
              </div>
            )}

            {/* Loading */}
            {isPending && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-[#F3BA2F] animate-spin" />
                <p className="text-sm text-zinc-500 animate-pulse">{t("play_proving")}</p>
              </div>
            )}

            {/* Error */}
            {error && (() => {
              const reason = (error as any)?.response?.data?.reason as string | undefined;
              const msgKey =
                reason === "invalid_request" ? "play_err_invalid"
                : reason === "not_found"     ? "play_err_not_found"
                : reason === "inactive"      ? "play_err_inactive"
                : null;
              return (
                <div className="flex-1 p-5 rounded-xl bg-red-500/5 border border-red-500/20 overflow-auto">
                  <div className="flex items-center gap-2 mb-3 text-red-400 font-bold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {msgKey ? t(msgKey) : t("play_failed")}
                  </div>
                  {!msgKey && (
                    <pre className="text-xs font-mono text-red-300 whitespace-pre-wrap">
                      {JSON.stringify(error, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })()}

            {/* Quote result — real API data only */}
            {quoteResult && (
              <div className="flex flex-col gap-5 flex-1">

                {/* Quote fields from real API */}
                <div className="rounded-xl border border-[#1E293B] bg-black/20 p-4 space-y-3">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                    {t("play_quote_label")}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <QuoteField label={t("play_payment")} value={`${quoteResult.price} ${quoteResult.token}`} />
                    <QuoteField
                      label="Stake Required"
                      value={
                        !quoteResult.stakeRequired || quoteResult.stakeRequired === "0"
                          ? "--"
                          : `${parseFloat(quoteResult.stakeRequired)} FUEL`
                      }
                    />
                  </div>

                  {/* Payment Header — technical field only, not a payment proof */}
                  <div className="col-span-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-600">Payment Header</span>
                      <CopyButton text={quoteResult.paymentHeader} />
                    </div>
                    <p className="text-[9px] text-zinc-600 italic mb-1">
                      Quote API response field — not a payment proof
                    </p>
                    <div className="px-3 py-2 rounded-lg bg-black/40 border border-[#1E293B]">
                      <span className="font-mono text-[10px] text-zinc-400 break-all">
                        {quoteResult.paymentHeader.length > 48
                          ? `${quoteResult.paymentHeader.slice(0, 48)}…`
                          : quoteResult.paymentHeader}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Execution pipeline status — 4 distinct states, clearly labeled */}
                <div className="rounded-xl border border-[#1E293B] bg-black/20 p-4">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                    Execution Pipeline
                  </p>
                  <StatusRow
                    label="Quote ready"
                    description="Quote received from the AgentFuel API. Price and payment header are available."
                    ready={true}
                  />
                  <StatusRow
                    label="Execution not run"
                    description="Service call requires confirmed payment to execute. No request has been sent to the provider."
                    ready={false}
                  />
                  <StatusRow
                    label="Settlement not started"
                    description="Onchain payment settlement is being integrated. No funds have been transferred."
                    ready={false}
                  />
                  <StatusRow
                    label="Receipt not recorded"
                    description="Receipts will be stored onchain per call after settlement is live."
                    ready={false}
                  />
                </div>

              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Page header ────────────────────────────────────────────────── */
function PageHeader({ showBack }: { showBack?: boolean }) {
  const { t } = useLang();
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1 flex items-center gap-2.5">
          <Terminal className="w-6 h-6 text-[#F3BA2F]" />
          {t("play_title")}
        </h1>
        <p className="text-sm text-zinc-500">
          Quote, inspect and simulate agent-powered service execution.
        </p>
      </div>
      {showBack && (
        <Link
          href="/services"
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Services
        </Link>
      )}
    </div>
  );
}

/* ─── Summary cell ───────────────────────────────────────────────── */
function SummaryCell({
  label,
  value,
  mono = false,
  truncate = false,
  fullValue,
}: {
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
  fullValue?: string;
}) {
  return (
    <div>
      <p className="text-[10px] text-zinc-600 mb-1">{label}</p>
      <p
        className={`text-xs font-medium text-zinc-300 ${mono ? "font-mono" : ""} ${truncate ? "truncate" : ""}`}
        title={fullValue}
      >
        {value}
      </p>
    </div>
  );
}

/* ─── Quote field ────────────────────────────────────────────────── */
function QuoteField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-zinc-600 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-white font-mono">{value}</p>
    </div>
  );
}
