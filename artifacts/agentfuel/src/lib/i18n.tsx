import { createContext, useContext, useState, useCallback } from "react";

export type Lang = "en" | "zh";

export const translations = {
  en: {
    // Nav
    nav_market: "Market",
    nav_dashboard: "Dashboard",
    nav_playground: "Playground",
    nav_product: "Product",
    nav_developers: "Developers",
    nav_docs: "Docs",
    nav_launch: "Launch App",
    connect_wallet: "Connect Wallet",
    connecting: "Connecting...",
    disconnect: "Disconnect",

    // Home (legacy keys — kept for safety)
    home_badge: "BSC Testnet",
    home_hero_title: "The Native Commerce Layer for",
    home_hero_highlight: "AI Agents",
    home_hero_desc:
      "AgentFuel provides a pay-per-call commerce layer for AI agents and API services on the Binance Smart Chain.",
    home_explore: "Explore Market",
    home_provider: "Provider Dashboard",
    home_viz_title: "Decentralized Intelligence",
    home_viz_desc:
      "Agents discovering, negotiating, and paying each other autonomously using FUEL tokens.",
    home_feature_market_title: "Service Market",
    home_feature_market_desc:
      "Discover and connect with specialized AI agents offering APIs, data processing, and complex reasoning.",
    home_feature_dashboard_title: "Provider Dashboard",
    home_feature_dashboard_desc:
      "Register your agent, set FUEL stake requirements, track earnings, and monitor service performance.",
    home_feature_playground_title: "Developer Playground",
    home_feature_playground_desc:
      "Test service quote flows, inspect quote results, and review API responses.",

    // Home v2 — new sections
    home2_hero_title: "Pay-per-call Commerce Layer for AI Agents on BSC",
    home2_hero_sub:
      "AgentFuel provides listing, quoting, and settlement infrastructure for AI agents, APIs, and MCP services on BSC.",
    home2_tag_bsc: "BSC Testnet",
    home2_tag_ppc: "Pay-per-call",
    home2_tag_staking: "FUEL Staking",
    home2_tag_receipts: "Verifiable Receipts",
    home2_panel_req: "① Request",
    home2_panel_pay: "② Quote",
    home2_panel_receipt: "③ Receipt",
    home2_panel_receipt_ok: "Receipt generated",
    home2_panel_receipt_sub: "Structured · Inspectable",
    home2_how_title: "How AgentFuel Works",
    home2_step1_title: "Register Service",
    home2_step1_desc: "Publish your API endpoint to the AgentFuel service registry.",
    home2_step2_title: "Set Stake Requirement",
    home2_step2_desc:
      "Set a FUEL stake requirement field in your listing. Onchain enforcement is being integrated.",
    home2_step3_title: "Earn Per Call",
    home2_step3_desc:
      "Callers obtain a quote and pay per request. Receipt recording is being integrated.",
    home2_why_title: "Why AgentFuel",
    home2_why1_title: "BSC-native Settlement",
    home2_why1_desc:
      "Payments settle directly on Binance Smart Chain. No bridges, no middleware.",
    home2_why2_title: "FUEL Stake Requirement",
    home2_why2_desc:
      "Providers set a FUEL stake requirement in their listings. Onchain staking enforcement is being integrated.",
    home2_why3_title: "Verifiable Execution Receipts",
    home2_why3_desc:
      "Every call generates a structured receipt. Onchain storage and auditability are being integrated.",
    home2_cta_title:
      "Launch your agent service. Listing and quoting are available now.",
    home2_cta_launch: "Launch App",
    home2_cta_dashboard: "View Dashboard",
    footer_desc: "Pay-per-call commerce infrastructure for AI agents on BSC.",
    footer_docs: "Docs",
    footer_github: "GitHub",
    footer_contracts: "Testnet Contracts",
    footer_coming_soon: "coming soon",
    footer_copy: "AgentFuel. Built on BSC.",

    // Market
    market_title: "Service Market",
    market_desc:
      "Discover and integrate AI agents and API services. Get quotes and pay per call.",
    market_search: "Search agents...",
    market_list_service: "List Service",
    market_no_agents: "No agents found",
    market_no_agents_desc:
      "Try adjusting your search terms or be the first to list a service.",
    market_active: "Active",
    market_price_per_call: "Price per call",
    market_success_rate: "Success Rate",
    market_provider: "Provider",
    market_get_quote: "Get Quote",
    market_modal_title: "List New AI Service",
    market_service_name: "Service Name",
    market_service_name_ph: "e.g. DeFi Sentiment Analyzer",
    market_description: "Description",
    market_description_ph: "Describe what your agent does...",
    market_endpoint: "API Endpoint",
    market_endpoint_ph: "https://api.yourdomain.com/v1/agent",
    market_price: "Price per Call (USDT)",
    market_stake: "Required Stake (FUEL)",
    market_submit: "List Service",
    market_submitting: "Listing...",

    // Dashboard — existing keys
    dash_title: "Provider Dashboard",
    dash_connect_desc:
      "Connect your wallet to manage your AI agents, view earnings, and monitor service performance.",
    dash_become_title: "Become a Provider",
    dash_become_desc:
      "Register your wallet on the AgentFuel network to start earning from your AI services.",
    dash_register: "Initialize Provider Profile",
    dash_registering: "Registering...",
    dash_overview: "Provider Overview",
    dash_status: "Status",
    dash_operational: "Operational",
    dash_staked: "Staked FUEL",
    dash_earnings: "Total Earnings",
    dash_reputation: "Reputation Score",
    dash_calls: "Total Calls Served",
    dash_chart_title: "Revenue & Traffic",
    dash_chart_desc: "Performance over the last 7 days",
    dash_receipts_title: "Recent Call Receipts",
    dash_receipt_id: "Receipt ID",
    dash_payer: "Payer",
    dash_amount: "Amount",
    dash_latency: "Latency",
    dash_status_col: "Status",
    dash_time: "Time",
    dash_loading: "Loading receipts...",
    dash_no_calls: "No calls recorded yet.",
    dash_success: "Success",
    dash_failed: "Failed",

    // Dashboard — new keys (v2 UI upgrade)
    dash_subtitle: "Manage services, stake requirements, and receipts on BSC.",
    dash_register_service: "Register Service",
    dash_stake_fuel: "Stake FUEL",
    dash_active_services: "Active Services",
    dash_preview_banner:
      "Example data — connect wallet and register a service to see live data",
    dash_preview_label: "Preview",
    dash_provider_status_title: "Provider Status",
    dash_wallet_status: "Wallet Status",
    dash_network: "Network",
    dash_provider_tier: "Provider Tier",
    dash_verification: "Verification",
    dash_last_activity: "Last Activity",
    dash_connected_status: "Connected",
    dash_not_connected_status: "Not Connected",
    dash_basic_tier: "Basic",
    dash_unverified: "Unverified",
    dash_fuel_contract: "FUEL Contract",
    dash_service_registry: "Service Registry",
    dash_col_service: "Service",
    dash_col_endpoint: "Endpoint",
    dash_col_price: "Price",
    dash_col_token: "Token",
    dash_col_stake: "Stake Required",
    dash_col_service_status: "Status",
    dash_col_service_name: "Service",
    dash_onboarding_title: "Get Started",
    dash_step1_label: "Connect Wallet",
    dash_step1_desc: "Connect your wallet to the AgentFuel network.",
    dash_step2_label: "Register Service",
    dash_step2_desc: "Publish your first AI service endpoint to the registry.",
    dash_step3_label: "Set Stake Requirement",
    dash_step3_desc:
      "Set a FUEL stake requirement field in your listing. Onchain enforcement is being integrated.",
    dash_step4_label: "Record Receipts",
    dash_step4_desc:
      "Call receipts are generated per request. Onchain recording is being integrated.",
    dash_registered: "Registered",
    dash_col_tx_hash: "Tx Hash",
    dash_col_payer: "Payer",

    // Playground
    play_title: "API Playground",
    play_desc:
      "Test service quote flows and inspect API responses.",
    play_configure: "Configure Request",
    play_select: "Select Service Agent",
    play_select_ph: "-- Select an Agent --",
    play_payload: "JSON Payload",
    play_wallet_prompt: "Connect wallet to continue",
    play_submit: "Request Quote & Call",
    play_submitting: "Negotiating Quote...",
    play_result: "Execution Result",
    play_empty:
      "Submit a request to see the quote result and API response.",
    play_proving: "Generating cryptographic proof...",
    play_failed: "Request Failed",
    play_quote_label: "Cryptographic Quote",
    play_payment: "Payment Required",
    play_stake_limit: "Provider Stake Limit",
    play_header: "X-Payment-Header",
    play_err_invalid: "Invalid request — serviceId is required and must be a numeric ID.",
    play_err_not_found: "Service not found — it may have been removed from the registry.",
    play_err_inactive: "This service is not currently accepting quotes.",

    // Network state
    net_wrong_network: "Wrong network",
    net_banner_prefix: "Current network:",
    net_banner_suffix: "· Switch to BSC Testnet to use on-chain features",
    mkt_network_notice: "Network is not BSC Testnet. On-chain features unavailable. Form submission still works.",
    play_wrong_network_notice: "Wallet connected, but network is not BSC Testnet. Quotes can still be requested. On-chain execution is unavailable.",

    // Playground — extended
    play_subtitle: "Quote, inspect and simulate agent-powered service execution.",
    play_service_not_found: "Service Not Found",
    play_service_not_found_desc: "The service ID in this URL does not match any available service. It may have been removed or the link may be incorrect.",
    play_back_to_services: "Back to Services",
    play_no_service_title: "No Service Selected",
    play_no_service_desc: "Select a service from the market to begin quoting and inspecting agent-powered service execution.",
    play_browse_services: "Browse Services",
    play_service_inactive: "Inactive",
    play_summary_desc: "Description",
    play_summary_endpoint: "Endpoint",
    play_summary_price: "Price per Call",
    play_summary_stake: "Stake Required",
    play_configure_hint: "Select a service and provide a JSON input payload.",
    play_quote_ready_badge: "Quote ready",
    play_result_hint: "Quote results will appear here.",
    play_payment_header_label: "Payment Header",
    play_payment_header_note: "Quote API response field — not a payment proof",
    play_pipeline_title: "Execution Pipeline",
    play_stage1_label: "Quote ready",
    play_stage1_desc: "Quote received from the AgentFuel API. Price and payment header are available.",
    play_stage2_label: "Execution not run",
    play_stage2_desc: "Service call requires confirmed payment to execute. No request has been sent to the provider.",
    play_stage3_label: "Settlement not started",
    play_stage3_desc: "Onchain payment settlement is being integrated. No funds have been transferred.",
    play_stage4_label: "Receipt not recorded",
    play_stage4_desc: "Receipts will be stored onchain per call after settlement is live.",

    // Market — extended
    market_no_services_title: "No services listed yet",
    market_no_services_desc: "Be among the first providers to register an AI service on AgentFuel.",
    market_how_title: "How it works",
    market_step1_title: "Connect Wallet",
    market_step1_desc: "Link your BSC wallet to identify as an agent or provider.",
    market_step2_title: "Prepare Your Endpoint",
    market_step2_desc: "Have your API endpoint URL and metadata ready for submission.",
    market_step3_title: "List Your Service",
    market_step3_desc: "Submit your service to the registry via the List Service form.",
    market_step4_title: "Earn Per Call",
    market_step4_desc: "Agents call your service and you receive payment per request.",
    market_section_basic: "Basic Info",
    market_section_pricing: "Pricing & Network",
    market_payment_token: "Payment Token",
    market_price_hint: "Amount charged per API call.",
    market_token_hint: "BSC Testnet FUEL token used for testing.",
    market_stake_hint: "FUEL amount shown as the listing requirement. Onchain stake enforcement is being integrated — this field is display-only for now.",
    market_explore_pricing: "Explore Pricing",
    market_all_tokens: "All Tokens",
    market_all_status: "All Status",
    market_filter_inactive: "Inactive",
    market_count_unit: "services",

    // Dashboard — extended
    dash_explore_services: "Explore Services",
    dash_inactive: "Inactive",
    dash_testnet: "Testnet",
  },

  zh: {
    // Nav
    nav_market: "服务市场",
    nav_dashboard: "仪表盘",
    nav_playground: "测试台",
    nav_product: "产品",
    nav_developers: "开发者",
    nav_docs: "文档",
    nav_launch: "立即使用",
    connect_wallet: "连接钱包",
    connecting: "连接中...",
    disconnect: "断开连接",

    // Home (legacy keys — kept for safety)
    home_badge: "BSC 测试网",
    home_hero_title: "面向",
    home_hero_highlight: "AI Agent",
    home_hero_desc:
      "AgentFuel 为币安智能链上的 AI Agent 与 API 服务提供按次付费商业基础设施。",
    home_explore: "探索市场",
    home_provider: "服务商仪表盘",
    home_viz_title: "去中心化智能",
    home_viz_desc: "Agent 通过 FUEL 代币自主发现、协商并相互支付。",
    home_feature_market_title: "服务市场",
    home_feature_market_desc:
      "发现并连接提供 API、数据处理和复杂推理的专业 AI Agent。",
    home_feature_dashboard_title: "服务商仪表盘",
    home_feature_dashboard_desc:
      "注册 Agent、设置 FUEL 质押要求字段、追踪收益并监控服务绩效。",
    home_feature_playground_title: "开发者测试台",
    home_feature_playground_desc:
      "测试服务报价流程，检查报价结果并查看 API 响应。",

    // Home v2 — new sections
    home2_hero_title: "BSC 上 AI Agent 的按次付费商业基础设施",
    home2_hero_sub:
      "AgentFuel 为 BSC 上的 AI Agent、API 与 MCP 服务提供上架、报价与结算基础设施。",
    home2_tag_bsc: "BSC 测试网",
    home2_tag_ppc: "按次付费",
    home2_tag_staking: "FUEL 质押",
    home2_tag_receipts: "可验证收据",
    home2_panel_req: "① 请求",
    home2_panel_pay: "② 报价",
    home2_panel_receipt: "③ 收据",
    home2_panel_receipt_ok: "收据已生成",
    home2_panel_receipt_sub: "结构化 · 可检查",
    home2_how_title: "AgentFuel 如何运作",
    home2_step1_title: "注册服务",
    home2_step1_desc: "将 API 端点发布到 AgentFuel 服务注册表。",
    home2_step2_title: "设置质押要求",
    home2_step2_desc:
      "在服务上架信息中设置 FUEL 质押要求字段，链上强制执行仍在完善中。",
    home2_step3_title: "按次收益",
    home2_step3_desc:
      "调用方获取报价后按次付费，收据记录功能仍在完善中。",
    home2_why_title: "为什么选择 AgentFuel",
    home2_why1_title: "BSC 原生结算",
    home2_why1_desc: "支付直接在币安智能链上结算，无需跨链桥接，无中间件。",
    home2_why2_title: "FUEL 质押要求字段",
    home2_why2_desc:
      "服务商在上架信息中设置 FUEL 质押要求字段，链上质押强制执行仍在完善中。",
    home2_why3_title: "可验证执行收据",
    home2_why3_desc:
      "每次调用生成结构化收据，链上存储与审计功能仍在完善中。",
    home2_cta_title: "立即上线你的 Agent 服务，上架与报价功能现已可用。",
    home2_cta_launch: "立即上线",
    home2_cta_dashboard: "查看仪表盘",
    footer_desc: "BSC 上 AI Agent 的按次付费商业基础设施。",
    footer_docs: "文档",
    footer_github: "GitHub",
    footer_contracts: "测试网合约",
    footer_coming_soon: "即将上线",
    footer_copy: "AgentFuel，构建于 BSC。",

    // Market
    market_title: "服务市场",
    market_desc: "发现并接入 AI Agent 与 API 服务，获取报价并按次付费。",
    market_search: "搜索 Agent...",
    market_list_service: "上架服务",
    market_no_agents: "未找到 Agent",
    market_no_agents_desc: "尝试调整搜索词，或率先上架一个服务。",
    market_active: "运行中",
    market_price_per_call: "每次调用费",
    market_success_rate: "成功率",
    market_provider: "服务商",
    market_get_quote: "获取报价",
    market_modal_title: "上架新 AI 服务",
    market_service_name: "服务名称",
    market_service_name_ph: "例：DeFi 情绪分析 Agent",
    market_description: "描述",
    market_description_ph: "描述您的 Agent 功能...",
    market_endpoint: "API 端点",
    market_endpoint_ph: "https://api.yourdomain.com/v1/agent",
    market_price: "每次调用价格 (USDT)",
    market_stake: "所需质押量 (FUEL)",
    market_submit: "上架服务",
    market_submitting: "上架中...",

    // Dashboard — existing keys
    dash_title: "服务商仪表盘",
    dash_connect_desc:
      "连接钱包以管理 AI Agent、查看收益并监控服务绩效。",
    dash_become_title: "成为服务商",
    dash_become_desc:
      "在 AgentFuel 网络注册您的钱包，开始从 AI 服务中获益。",
    dash_register: "初始化服务商档案",
    dash_registering: "注册中...",
    dash_overview: "服务商概览",
    dash_status: "状态",
    dash_operational: "正常运行",
    dash_staked: "质押 FUEL",
    dash_earnings: "总收益",
    dash_reputation: "信誉分",
    dash_calls: "总调用次数",
    dash_chart_title: "收益与流量",
    dash_chart_desc: "过去 7 天的绩效",
    dash_receipts_title: "近期调用收据",
    dash_receipt_id: "收据编号",
    dash_payer: "付款方",
    dash_amount: "金额",
    dash_latency: "延迟",
    dash_status_col: "状态",
    dash_time: "时间",
    dash_loading: "加载收据中...",
    dash_no_calls: "暂无调用记录。",
    dash_success: "成功",
    dash_failed: "失败",

    // Dashboard — new keys (v2 UI upgrade)
    dash_subtitle: "管理 BSC 上的服务、质押要求字段与收据。",
    dash_register_service: "注册服务",
    dash_stake_fuel: "质押 FUEL",
    dash_active_services: "活跃服务",
    dash_preview_banner:
      "示例数据 — 连接钱包并注册服务后查看真实数据",
    dash_preview_label: "预览",
    dash_provider_status_title: "服务商状态",
    dash_wallet_status: "钱包状态",
    dash_network: "网络",
    dash_provider_tier: "服务商等级",
    dash_verification: "验证状态",
    dash_last_activity: "最近活动",
    dash_connected_status: "已连接",
    dash_not_connected_status: "未连接",
    dash_basic_tier: "基础版",
    dash_unverified: "未验证",
    dash_fuel_contract: "FUEL 合约",
    dash_service_registry: "服务注册表",
    dash_col_service: "服务",
    dash_col_endpoint: "端点",
    dash_col_price: "价格",
    dash_col_token: "代币",
    dash_col_stake: "所需质押",
    dash_col_service_status: "状态",
    dash_col_service_name: "服务名称",
    dash_onboarding_title: "快速开始",
    dash_step1_label: "连接钱包",
    dash_step1_desc: "将钱包连接到 AgentFuel 网络。",
    dash_step2_label: "注册服务",
    dash_step2_desc: "将您的第一个 AI 服务端点发布到注册表。",
    dash_step3_label: "设置质押要求",
    dash_step3_desc:
      "在服务上架信息中设置 FUEL 质押要求字段，链上强制执行仍在完善中。",
    dash_step4_label: "记录收据",
    dash_step4_desc:
      "每次调用后生成结构化收据，链上记录功能仍在完善中。",
    dash_registered: "注册时间",
    dash_col_tx_hash: "交易哈希",
    dash_col_payer: "付款方",

    // Playground
    play_title: "API 测试台",
    play_desc: "测试服务报价流程，检查报价结果并查看 API 响应。",
    play_configure: "配置请求",
    play_select: "选择 Agent 服务",
    play_select_ph: "-- 请选择 Agent --",
    play_payload: "JSON 载荷",
    play_wallet_prompt: "连接钱包以继续",
    play_submit: "请求报价并调用",
    play_submitting: "协商报价中...",
    play_result: "执行结果",
    play_empty: "提交请求后查看报价结果和 API 响应。",
    play_proving: "生成加密证明中...",
    play_failed: "请求失败",
    play_quote_label: "加密报价",
    play_payment: "应付金额",
    play_stake_limit: "服务商质押上限",
    play_header: "X-Payment-Header",
    play_err_invalid: "请求无效 — serviceId 必须为数字格式的服务 ID。",
    play_err_not_found: "服务不存在 — 该服务可能已从注册表中移除。",
    play_err_inactive: "该服务当前不接受报价请求。",

    // Network state
    net_wrong_network: "网络不匹配",
    net_banner_prefix: "当前网络：",
    net_banner_suffix: "· 请切换到 BSC Testnet 以使用链上相关功能",
    mkt_network_notice: "当前网络非 BSC Testnet，链上功能暂不可用。表单信息仍可提交。",
    play_wrong_network_notice: "已连接钱包，但当前网络非 BSC Testnet。Quote 请求可继续，链上执行功能暂不可用。",

    // Playground — extended
    play_subtitle: "报价、检查并模拟 Agent 驱动的服务执行流程。",
    play_service_not_found: "服务未找到",
    play_service_not_found_desc: "此链接中的服务 ID 与可用服务不符，可能已被移除或链接有误。",
    play_back_to_services: "返回服务列表",
    play_no_service_title: "未选择服务",
    play_no_service_desc: "请从服务市场选择一个服务，开始报价和检查 Agent 驱动的服务执行流程。",
    play_browse_services: "浏览服务",
    play_service_inactive: "停用中",
    play_summary_desc: "描述",
    play_summary_endpoint: "端点",
    play_summary_price: "每次调用价格",
    play_summary_stake: "所需质押",
    play_configure_hint: "选择服务并提供 JSON 输入载荷。",
    play_quote_ready_badge: "报价已就绪",
    play_result_hint: "报价结果将在此显示。",
    play_payment_header_label: "支付头字段",
    play_payment_header_note: "报价 API 响应字段 — 非支付证明",
    play_pipeline_title: "执行流水线",
    play_stage1_label: "报价已就绪",
    play_stage1_desc: "已从 AgentFuel API 获取报价，价格和支付头字段可用。",
    play_stage2_label: "服务未执行",
    play_stage2_desc: "服务调用需确认支付后执行，暂未向服务商发送请求。",
    play_stage3_label: "结算未开始",
    play_stage3_desc: "链上支付结算仍在完善中，尚未发生资金转移。",
    play_stage4_label: "收据未记录",
    play_stage4_desc: "结算上线后，每次调用的收据将存储至链上。",

    // Market — extended
    market_no_services_title: "暂无服务上架",
    market_no_services_desc: "成为首批在 AgentFuel 注册 AI 服务的提供方。",
    market_how_title: "如何运作",
    market_step1_title: "连接钱包",
    market_step1_desc: "连接 BSC 钱包以标识为 Agent 或服务提供方。",
    market_step2_title: "准备 API 端点",
    market_step2_desc: "准备好 API 端点 URL 和相关元数据以备提交。",
    market_step3_title: "上架服务",
    market_step3_desc: "通过上架服务表单将服务提交至注册表。",
    market_step4_title: "按次收益",
    market_step4_desc: "Agent 调用您的服务后，您将按次获得收益。",
    market_section_basic: "基本信息",
    market_section_pricing: "定价与网络",
    market_payment_token: "支付代币",
    market_price_hint: "每次 API 调用收取的费用。",
    market_token_hint: "用于测试的 BSC 测试网 FUEL 代币。",
    market_stake_hint: "上架信息中显示的 FUEL 质押要求，链上质押强制执行仍在完善中，当前为展示字段。",
    market_explore_pricing: "查看定价",
    market_all_tokens: "全部代币",
    market_all_status: "全部状态",
    market_filter_inactive: "已停用",
    market_count_unit: "个服务",

    // Dashboard — extended
    dash_explore_services: "探索服务",
    dash_inactive: "已停用",
    dash_testnet: "测试网",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LangContextValue {
  lang: Lang;
  t: (key: TranslationKey) => string;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("af_lang");
    return (saved === "zh" ? "zh" : "en") as Lang;
  });

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "zh" : "en";
      localStorage.setItem("af_lang", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] as string,
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
