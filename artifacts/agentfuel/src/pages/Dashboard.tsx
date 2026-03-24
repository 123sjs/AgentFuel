import { Link } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import {
  useListProviders,
  useCreateProvider,
  useListReceipts,
  useListServices,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ShieldCheck, Coins, CheckCircle2, AlertCircle,
  TrendingUp, Wallet, Database, Server, Activity,
  ArrowRight, Info, ChevronRight, ExternalLink,
} from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

/* ─── Constants ────────────────────────────────────────────────── */
const FUEL_SHORT    = "0x3e9f…ffff";
const FUEL_CONTRACT = "0x3e9fc4f2acf5d6f7815cb9f38b2c69576088ffff";

/* ─── Helpers ───────────────────────────────────────────────────── */
/**
 * Returns true ONLY when val is a finite numeric string equal to zero.
 * null / undefined / empty / NaN / non-numeric strings → false.
 */
function isZeroNumericString(val: string | null | undefined): boolean {
  if (val == null || val.trim() === "") return false;
  const n = Number(val);
  if (!Number.isFinite(n)) return false;
  return n === 0;
}

/* ─── Shared sub-components ────────────────────────────────────── */

/** Small pill badge for Preview / Coming soon labels */
function PillBadge({
  label,
  variant = "preview",
}: {
  label: string;
  variant?: "preview" | "soon";
}) {
  const cls =
    variant === "soon"
      ? "border-zinc-700/60 text-zinc-600 bg-zinc-900/60"
      : "border-zinc-700 text-zinc-500 bg-zinc-900/60";
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border select-none ${cls}`}
    >
      {label}
    </span>
  );
}

/** Section-level banner shown when table only has preview rows */
function PreviewBanner({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1E293B] bg-[#F3BA2F]/5 text-xs text-[#F3BA2F]/70">
      <Info className="w-3.5 h-3.5 shrink-0" />
      {text}
    </div>
  );
}

/* ─── State: Not connected ──────────────────────────────────────── */
function NotConnectedView({
  connect,
  t,
}: {
  connect: () => void;
  t: (k: any) => string;
}) {
  const previewStats = [
    { label: t("dash_staked"),          icon: Coins,       color: "text-[#F3BA2F]" },
    { label: t("dash_reputation"),      icon: ShieldCheck,  color: "text-blue-400" },
    { label: t("dash_active_services"), icon: Server,       color: "text-purple-400" },
    { label: t("dash_earnings"),        icon: TrendingUp,   color: "text-green-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">{t("dash_title")}</h1>
        <p className="text-sm text-zinc-500">{t("dash_subtitle")}</p>
      </div>

      {/* Connect card */}
      <div className="relative rounded-2xl border border-[#1E293B] bg-[#06070A]/80 p-10 mb-8 overflow-hidden flex flex-col items-center text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl border border-[#1E293B] bg-[#0A0F1A] flex items-center justify-center mb-6">
          <Wallet className="w-7 h-7 text-zinc-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-3">{t("connect_wallet")}</h2>
        <p className="text-sm text-zinc-500 mb-8 leading-relaxed max-w-sm">{t("dash_connect_desc")}</p>
        <button
          onClick={connect}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F3BA2F] text-[#06070A] font-bold text-sm hover:bg-[#F3BA2F]/90 transition-colors"
        >
          {t("connect_wallet")} <ArrowRight className="w-4 h-4" />
        </button>
        <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#F3BA2F]/20 to-transparent" />
      </div>

      {/* Preview stat hints — dimmed, non-interactive */}
      <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-3 text-center">
        {t("dash_preview_label")} — {t("dash_preview_banner")}
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-35 pointer-events-none select-none">
        {previewStats.map(({ label, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-[#1E293B] bg-[#06070A]/60 p-5">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs text-zinc-500">{label}</p>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-zinc-600">--</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── State: Registration needed ────────────────────────────────── */
function RegistrationView({
  address,
  isPending,
  onRegister,
  t,
}: {
  address: string;
  isPending: boolean;
  onRegister: () => void;
  t: (k: any) => string;
}) {
  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <div className="relative rounded-2xl border border-[#1E293B] bg-[#06070A]/80 p-10 text-center overflow-hidden">
        <div className="w-14 h-14 rounded-2xl border border-[#F3BA2F]/20 bg-[#F3BA2F]/8 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-7 h-7 text-[#F3BA2F]" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#1E293B] bg-white/3 text-[10px] text-zinc-500 tracking-widest uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          BSC Testnet
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">{t("dash_become_title")}</h2>
        <p className="text-sm text-zinc-500 mb-2 leading-relaxed">
          {t("dash_become_desc").replace("{address}", formatAddress(address))}
        </p>
        <p className="font-mono text-xs text-zinc-600 mb-8 truncate">{address}</p>
        <button
          onClick={onRegister}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F3BA2F] text-[#06070A] font-bold text-sm hover:bg-[#F3BA2F]/90 disabled:opacity-50 transition-all"
        >
          {isPending ? t("dash_registering") : t("dash_register")}
        </button>
        <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#F3BA2F]/20 to-transparent" />
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────── */
export default function Dashboard() {
  const { address, isConnected, isCorrectNetwork, networkName, connect } = useWallet();
  const { t } = useLang();

  const { data: providers, isLoading: providersLoading } = useListProviders();
  const { data: allServices } = useListServices();
  const { data: receipts, isLoading: receiptsLoading } = useListReceipts(
    address ? { provider: address } : undefined
  );
  const queryClient = useQueryClient();

  const createMutation = useCreateProvider({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/providers"] });
      },
    },
  });

  const myProvider = providers?.find(
    (p) => p.address.toLowerCase() === address?.toLowerCase()
  );
  const needsRegistration = isConnected && !providersLoading && !myProvider;

  const handleRegister = () => {
    if (address) createMutation.mutate({ data: { address } });
  };

  /* ── Not connected ── */
  if (!isConnected) {
    return <NotConnectedView connect={connect} t={t} />;
  }

  /* ── Needs registration ── */
  if (needsRegistration) {
    return (
      <RegistrationView
        address={address!}
        isPending={createMutation.isPending}
        onRegister={handleRegister}
        t={t}
      />
    );
  }

  /* ── Full dashboard ── */

  // Real services owned by this provider (filter by ownerAddress)
  const myServices =
    allServices?.filter(
      (s) => s.ownerAddress?.toLowerCase() === address?.toLowerCase()
    ) ?? [];
  const hasRealServices = myServices.length > 0;

  // Real receipts
  const hasReceipts = receipts && receipts.length > 0;

  // Active services count — from real API only
  const activeServicesCount = hasRealServices
    ? myServices.filter((s) => s.active).length
    : null;

  /* Stat cards:
     - value: real API data or "--" (never estimated)
     - unit: only shown when value is real */
  const stakedFuelDisplay =
    myProvider?.stakedFuel != null && !isZeroNumericString(myProvider.stakedFuel)
      ? myProvider.stakedFuel
      : "--";

  const totalEarningsDisplay =
    myProvider?.totalEarnings != null && !isZeroNumericString(myProvider.totalEarnings)
      ? myProvider.totalEarnings
      : "--";

  const statCards = [
    {
      labelKey: "dash_staked" as const,
      value: stakedFuelDisplay,
      unit: stakedFuelDisplay !== "--" ? "FUEL" : "",
      icon: Coins,
      accentColor: "#F3BA2F",
      iconClass: "text-[#F3BA2F]",
    },
    {
      labelKey: "dash_reputation" as const,
      value: myProvider?.reputationScore != null
        ? String(myProvider.reputationScore)
        : "--",
      unit: myProvider?.reputationScore != null ? "/ 100" : "",
      icon: ShieldCheck,
      accentColor: "#3B82F6",
      iconClass: "text-blue-400",
    },
    {
      labelKey: "dash_active_services" as const,
      value: allServices == null ? "--" : String(activeServicesCount ?? 0),
      unit: "",
      icon: Server,
      accentColor: "#a855f7",
      iconClass: "text-purple-400",
    },
    {
      labelKey: "dash_earnings" as const,
      value: totalEarningsDisplay,
      unit: "",
      icon: TrendingUp,
      accentColor: "#22c55e",
      iconClass: "text-green-400",
    },
  ];

  /* Preview service rows (only shown when no real services exist) */
  const previewServices = [
    {
      name: "DeFi Sentiment Agent",
      endpoint: "api.example.com/v1/sentiment",
      price: "0.05 USDT",
      token: "FUEL",
      stake: "1,000 FUEL",
    },
    {
      name: "On-Chain Price Oracle",
      endpoint: "api.example.com/v1/oracle",
      price: "0.02 USDT",
      token: "FUEL",
      stake: "500 FUEL",
    },
  ];

  /* Preview receipt rows (only shown when no real receipts exist) */
  const previewReceipts = [
    { id: "EX-001", payer: "0x1a2b…ef34", token: "USDT", amount: "0.05", txHash: null as string | null },
    { id: "EX-002", payer: "0x5c6d…ab78", token: "USDT", amount: "0.02", txHash: null as string | null },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">{t("dash_title")}</h1>
          <p className="text-sm text-zinc-500">{t("dash_subtitle")}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Link
            href="/services"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#1E293B] bg-white/3 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all"
          >
            {t("dash_explore_services")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Stake FUEL — not yet functional */}
          <button
            disabled
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#1E293B] bg-white/2 text-sm text-zinc-600 cursor-not-allowed"
            title="FUEL staking is not yet available"
          >
            {t("dash_stake_fuel")}
            <PillBadge label={t("footer_coming_soon")} variant="soon" />
          </button>
        </div>
      </div>

      {/* ── Network mismatch banner ──────────────────────────────── */}
      {isConnected && !isCorrectNetwork && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-xs text-yellow-300">
          <Info className="w-3.5 h-3.5 shrink-0 text-yellow-400" />
          <span>
            {`${t("net_banner_prefix")} ${networkName} ${t("net_banner_suffix")}`}
          </span>
        </div>
      )}

      {/* ── Stat cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ labelKey, value, unit, icon: Icon, accentColor, iconClass }, idx) => (
          <motion.div
            key={labelKey}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            className="rounded-2xl border border-[#1E293B] bg-[#06070A]/70 p-5 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs text-zinc-500">{t(labelKey)}</p>
              <Icon className={`w-4 h-4 ${iconClass}`} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
              {unit && <span className="text-xs text-zinc-600">{unit}</span>}
            </div>
            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[1px] opacity-15"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
            />
          </motion.div>
        ))}
      </div>

      {/* ── Provider Status ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-[#1E293B] bg-[#06070A]/70 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{t("dash_provider_status_title")}</h3>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 af-breathe" />
            <span className="text-xs text-zinc-500">{t("dash_operational")}</span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
          {/* Real data rows */}
          <StatusRow
            label={t("dash_wallet_status")}
            value={formatAddress(address!)}
            badge={
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                {t("dash_connected_status")}
              </span>
            }
          />
          <StatusRow
            label={t("dash_network")}
            value={networkName ?? "--"}
            badge={
              isCorrectNetwork ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">
                  {t("dash_testnet")}
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
                  {t("net_wrong_network")}
                </span>
              )
            }
          />
          <StatusRow
            label={t("dash_fuel_contract")}
            value={FUEL_SHORT}
            badge={
              <a
                href={`https://testnet.bscscan.com/token/${FUEL_CONTRACT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-300 transition-colors"
                title="View on BSCScan Testnet"
              >
                <ExternalLink className="w-3 h-3 text-zinc-600" />
              </a>
            }
          />
          {/* Preview-only fields — clearly labeled */}
          <StatusRow
            label={t("dash_provider_tier")}
            value="--"
            badge={<PillBadge label={t("footer_coming_soon")} variant="soon" />}
          />
          <StatusRow
            label={t("dash_verification")}
            value="--"
            badge={<PillBadge label={t("footer_coming_soon")} variant="soon" />}
          />
          <StatusRow
            label={t("dash_registered")}
            value={
              myProvider?.createdAt
                ? new Date(myProvider.createdAt).toLocaleDateString()
                : "--"
            }
            badge={null}
          />
        </div>
      </motion.div>

      {/* ── Service Registry ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-2xl border border-[#1E293B] bg-[#06070A]/70 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{t("dash_service_registry")}</h3>
          <Link
            href="/services"
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-[#F3BA2F] transition-colors"
          >
            {t("dash_register_service")} <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Banner only when showing preview rows */}
        {!hasRealServices && <PreviewBanner text={t("dash_preview_banner")} />}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/20 text-zinc-600 font-medium border-b border-[#1E293B]">
              <tr>
                <th className="px-5 py-3">{t("dash_col_service")}</th>
                <th className="px-5 py-3 hidden md:table-cell">{t("dash_col_endpoint")}</th>
                <th className="px-5 py-3">{t("dash_col_price")}</th>
                <th className="px-5 py-3 hidden lg:table-cell">{t("dash_col_token")}</th>
                <th className="px-5 py-3 hidden lg:table-cell">{t("dash_col_stake")}</th>
                <th className="px-5 py-3">{t("dash_col_service_status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {hasRealServices ? (
                /* ── Real service rows (no preview mixing) ── */
                myServices.map((svc) => (
                  <tr key={svc.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5 text-zinc-200 font-medium">{svc.name}</td>
                    <td className="px-5 py-3.5 text-zinc-500 font-mono hidden md:table-cell truncate max-w-[180px]">
                      {svc.endpoint}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-300">
                      {svc.price} {svc.currency || "USDT"}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 font-mono hidden lg:table-cell">
                      {svc.currency || "--"}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 hidden lg:table-cell">
                      {isZeroNumericString(svc.stakeRequired) ? "--" : `${svc.stakeRequired} FUEL`}
                    </td>
                    <td className="px-5 py-3.5">
                      {svc.active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-medium border border-green-500/20">
                          <span className="w-1 h-1 rounded-full bg-green-400" />
                          {t("market_active")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-700/30 text-zinc-500 text-[10px] font-medium border border-zinc-700/40">
                          {t("dash_inactive")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                /* ── Preview rows (only when no real services) ── */
                previewServices.map((svc) => (
                  <tr key={svc.name} className="opacity-50 italic">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <PillBadge label={t("dash_preview_label")} />
                        <span className="text-zinc-400 not-italic font-mono text-[11px]">{svc.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600 font-mono hidden md:table-cell">{svc.endpoint}</td>
                    <td className="px-5 py-3.5 text-zinc-600">{svc.price}</td>
                    <td className="px-5 py-3.5 text-zinc-700 font-mono hidden lg:table-cell">{svc.token}</td>
                    <td className="px-5 py-3.5 text-zinc-700 hidden lg:table-cell">{svc.stake}</td>
                    <td className="px-5 py-3.5">
                      <PillBadge label={t("dash_preview_label")} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Recent Receipts ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-2xl border border-[#1E293B] bg-[#06070A]/70 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#1E293B]">
          <h3 className="text-sm font-semibold text-white">{t("dash_receipts_title")}</h3>
        </div>

        {/* Banner only when showing preview rows */}
        {!receiptsLoading && !hasReceipts && (
          <PreviewBanner text={t("dash_preview_banner")} />
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/20 text-zinc-600 font-medium border-b border-[#1E293B]">
              <tr>
                <th className="px-5 py-3">{t("dash_receipt_id")}</th>
                <th className="px-5 py-3 hidden md:table-cell">{t("dash_col_payer")}</th>
                <th className="px-5 py-3">{t("dash_col_token")}</th>
                <th className="px-5 py-3">{t("dash_amount")}</th>
                <th className="px-5 py-3">{t("dash_status_col")}</th>
                <th className="px-5 py-3 hidden sm:table-cell">{t("dash_time")}</th>
                <th className="px-5 py-3 hidden lg:table-cell">{t("dash_col_tx_hash")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {receiptsLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-zinc-600 animate-pulse">
                    {t("dash_loading")}
                  </td>
                </tr>
              ) : hasReceipts ? (
                /* ── Real receipt rows ── */
                receipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-zinc-400">#{receipt.id}</td>
                    <td className="px-5 py-3.5 text-zinc-500 font-mono hidden md:table-cell">
                      {formatAddress(receipt.payer)}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400">{receipt.token}</td>
                    <td className="px-5 py-3.5 text-white font-medium">{receipt.amount}</td>
                    <td className="px-5 py-3.5">
                      {receipt.success ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-medium border border-green-500/20">
                          <CheckCircle2 className="w-3 h-3" /> {t("dash_success")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-medium border border-red-500/20">
                          <AlertCircle className="w-3 h-3" /> {t("dash_failed")}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600 hidden sm:table-cell">
                      {new Date(receipt.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-zinc-600 hidden lg:table-cell">
                      {receipt.txHash ? formatAddress(receipt.txHash) : "--"}
                    </td>
                  </tr>
                ))
              ) : (
                /* ── Preview rows (only when no real receipts) ── */
                previewReceipts.map((r) => (
                  <tr key={r.id} className="opacity-50 italic">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <PillBadge label={t("dash_preview_label")} />
                        <span className="font-mono text-zinc-500 not-italic">#{r.id}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600 font-mono hidden md:table-cell">{r.payer}</td>
                    <td className="px-5 py-3.5 text-zinc-600">{r.token}</td>
                    <td className="px-5 py-3.5 text-zinc-600">{r.amount}</td>
                    <td className="px-5 py-3.5">
                      <PillBadge label={t("dash_preview_label")} />
                    </td>
                    <td className="px-5 py-3.5 text-zinc-700 hidden sm:table-cell">--</td>
                    <td className="px-5 py-3.5 text-zinc-700 font-mono hidden lg:table-cell">--</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Onboarding / Next Steps ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.52 }}
        className="rounded-2xl border border-[#1E293B] bg-[#06070A]/60 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#1E293B]">
          <h3 className="text-sm font-semibold text-white">{t("dash_onboarding_title")}</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: "01",
              labelKey: "dash_step1_label" as const,
              descKey:  "dash_step1_desc"  as const,
              icon: Wallet,
              done: true,   /* wallet is connected — this step is genuinely done */
            },
            {
              num: "02",
              labelKey: "dash_step2_label" as const,
              descKey:  "dash_step2_desc"  as const,
              icon: Database,
              done: hasRealServices,  /* true only when user has real services */
            },
            {
              num: "03",
              labelKey: "dash_step3_label" as const,
              descKey:  "dash_step3_desc"  as const,
              icon: Coins,
              done: false,  /* staking not yet functional */
            },
            {
              num: "04",
              labelKey: "dash_step4_label" as const,
              descKey:  "dash_step4_desc"  as const,
              icon: Activity,
              done: hasReceipts ?? false,  /* true only when real receipts exist */
            },
          ].map(({ num, labelKey, descKey, icon: Icon, done }) => (
            <div
              key={num}
              className={`rounded-xl border p-5 flex flex-col gap-3 ${
                done
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-[#1E293B] bg-[#0A0F1A]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-600">{num}</span>
                {done ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <Icon className="w-4 h-4 text-zinc-600" />
                )}
              </div>
              <div>
                <p className={`text-sm font-semibold mb-1 ${done ? "text-green-400" : "text-zinc-300"}`}>
                  {t(labelKey)}
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed">{t(descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}

/* ─── Helper: single row inside Provider Status card ────────────── */
function StatusRow({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-[#1E293B]/50 last:border-b-0">
      <span className="text-xs text-zinc-600 shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-300 font-mono">{value}</span>
        {badge}
      </div>
    </div>
  );
}
