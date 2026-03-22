import { useState } from "react";
import { useListServices, useRequestQuote } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Terminal, Send, Shield, AlertCircle, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useLang } from "@/lib/i18n";

export default function Playground() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialServiceId = searchParams.get("serviceId") || "";

  const [serviceId, setServiceId] = useState(initialServiceId);
  const [inputPayload, setInputPayload] = useState(
    '{\n  "prompt": "Analyze market sentiment for BTC",\n  "maxTokens": 500\n}'
  );

  const { data: services } = useListServices();
  const { mutate: requestQuote, isPending, data: quoteResult, error } = useRequestQuote();
  const { isConnected, connect } = useWallet();
  const { t } = useLang();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId) return;

    let parsedInput = {};
    try {
      parsedInput = JSON.parse(inputPayload);
    } catch {
      alert("Invalid JSON input payload");
      return;
    }

    requestQuote({ data: { serviceId, input: parsedInput } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
          <Terminal className="w-8 h-8 text-primary" />
          {t("play_title")}
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">{t("play_desc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 rounded-3xl"
        >
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
            {t("play_configure")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">{t("play_select")}</label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
              >
                <option value="" disabled>
                  {t("play_select_ph")}
                </option>
                {services?.map((s) => (
                  <option key={s.id} value={s.id.toString()}>
                    {s.name} ({s.price} {s.currency})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-300">{t("play_payload")}</label>
                <span className="text-xs text-zinc-500 font-mono">application/json</span>
              </div>
              <textarea
                value={inputPayload}
                onChange={(e) => setInputPayload(e.target.value)}
                className="w-full h-48 px-4 py-3 font-mono text-sm bg-black/50 border border-border rounded-xl text-green-400 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                spellCheck={false}
              />
            </div>

            {!isConnected ? (
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-200 flex flex-col items-center justify-center gap-3">
                <p className="text-sm">{t("play_wallet_prompt")}</p>
                <button
                  type="button"
                  onClick={connect}
                  className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors"
                >
                  {t("connect_wallet")}
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isPending || !serviceId}
                className="w-full py-4 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-zinc-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
                {isPending ? t("play_submitting") : t("play_submit")}
              </button>
            )}
          </form>
        </motion.div>

        {/* Response Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col h-full"
        >
          <div className="glass-panel p-6 rounded-3xl flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex justify-between items-center">
              {t("play_result")}
              {quoteResult && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
                  200 OK
                </span>
              )}
              {error && (
                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">
                  Error
                </span>
              )}
            </h2>

            {!quoteResult && !error && !isPending && (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 border-2 border-dashed border-white/5 rounded-xl bg-black/20 p-8">
                <Shield className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-center">{t("play_empty")}</p>
              </div>
            )}

            {isPending && (
              <div className="flex-1 flex flex-col items-center justify-center text-primary space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="animate-pulse">{t("play_proving")}</p>
              </div>
            )}

            {error && (
              <div className="flex-1 p-6 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 overflow-auto">
                <div className="flex items-center gap-2 mb-4 font-bold">
                  <AlertCircle className="w-5 h-5" />
                  {t("play_failed")}
                </div>
                <pre className="text-sm font-mono whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
              </div>
            )}

            {quoteResult && (
              <div className="flex-1 flex flex-col space-y-4">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                    {t("play_quote_label")}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-zinc-500 block mb-1">{t("play_payment")}</span>
                      <span className="text-white font-mono">
                        {quoteResult.price} {quoteResult.token}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block mb-1">{t("play_stake_limit")}</span>
                      <span className="text-white font-mono">{quoteResult.stakeRequired} FUEL</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-zinc-500 block mb-1">{t("play_header")}</span>
                      <span className="text-primary font-mono text-xs break-all block bg-black/30 p-2 rounded border border-primary/10">
                        {quoteResult.paymentHeader}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 rounded-xl bg-black/50 border border-border p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-zinc-800 text-xs px-2 py-1 rounded-bl-lg text-zinc-400 font-mono border-b border-l border-zinc-700">
                    response.json
                  </div>
                  <pre className="text-sm font-mono text-green-400 mt-6 whitespace-pre-wrap overflow-auto h-[200px]">
                    {JSON.stringify(
                      {
                        status: "success",
                        message: "Agent execution completed.",
                        data: {
                          sentiment: "Bullish",
                          confidence: 0.92,
                          sources_analyzed: 145,
                          timestamp: new Date().toISOString(),
                        },
                        receipt_id: Math.floor(Math.random() * 10000),
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
