import { useState } from "react";
import { useListServices, useCreateService } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Cpu, ArrowRight, Activity, Plus } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import { useWallet } from "@/hooks/use-wallet";
import { useLang } from "@/lib/i18n";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Market() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: services, isLoading } = useListServices();
  const { address } = useWallet();
  const { t } = useLang();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const createMutation = useCreateService({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/services"] });
        setIsModalOpen(false);
      },
    },
  });

  const filteredServices =
    services?.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMutation.mutate({
      data: {
        ownerAddress: address || "0x0000000000000000000000000000000000000000",
        name: fd.get("name") as string,
        description: fd.get("description") as string,
        endpoint: fd.get("endpoint") as string,
        price: fd.get("price") as string,
        currency: "USDT",
        stakeRequired: fd.get("stakeRequired") as string,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-3">{t("market_title")}</h1>
          <p className="text-zinc-400 max-w-2xl text-lg">{t("market_desc")}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={t("market_search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-medium transition-all">
                <Plus className="w-5 h-5" />
                {t("market_list_service")}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  {t("market_modal_title")}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">{t("market_service_name")}</label>
                  <input
                    required
                    name="name"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder={t("market_service_name_ph")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">{t("market_description")}</label>
                  <textarea
                    required
                    name="description"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none min-h-[100px]"
                    placeholder={t("market_description_ph")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">{t("market_endpoint")}</label>
                  <input
                    required
                    name="endpoint"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder={t("market_endpoint_ph")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">{t("market_price")}</label>
                    <input
                      required
                      name="price"
                      type="number"
                      step="0.0001"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none"
                      placeholder="0.05"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">{t("market_stake")}</label>
                    <input
                      required
                      name="stakeRequired"
                      type="number"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white focus:ring-2 focus:ring-primary/50 outline-none"
                      placeholder="1000"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full mt-6 px-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 transition-all"
                >
                  {createMutation.isPending ? t("market_submitting") : t("market_submit")}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 rounded-2xl bg-secondary/30 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="py-24 text-center glass-panel rounded-3xl border-dashed">
          <Cpu className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{t("market_no_agents")}</h3>
          <p className="text-zinc-500">{t("market_no_agents_desc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group relative flex flex-col glass-panel rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 overflow-hidden"
              >
                {/* Status Indicator */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {t("market_active")}
                  </div>
                </div>

                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 mb-5">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-2 mb-6 flex-1">{service.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-white/5">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1">{t("market_price_per_call")}</p>
                    <p className="text-lg font-semibold text-white flex items-baseline gap-1">
                      {service.price}{" "}
                      <span className="text-xs text-zinc-500 font-normal">{service.currency}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1">{t("market_success_rate")}</p>
                    <p className="text-lg font-semibold text-white flex items-center gap-1">
                      <Activity className="w-4 h-4 text-green-400" />
                      {service.successRate}%
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center justify-between bg-black/20 rounded-lg p-3 border border-white/5">
                    <span className="text-xs text-zinc-500">{t("market_provider")}</span>
                    <span className="text-xs font-mono text-zinc-300">{formatAddress(service.ownerAddress)}</span>
                  </div>
                </div>

                <Link
                  href={`/playground?serviceId=${service.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-primary hover:text-primary-foreground border border-white/10 hover:border-transparent font-semibold transition-all"
                >
                  {t("market_get_quote")} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
