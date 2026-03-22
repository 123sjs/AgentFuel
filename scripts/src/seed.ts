import { db } from "@workspace/db";
import { servicesTable, providersTable } from "@workspace/db/schema";

async function seed() {
  console.log("Seeding database...");

  await db.insert(providersTable).values([
    {
      address: "0x1234567890abcdef1234567890abcdef12345678",
      stakedFuel: "50000",
      reputationScore: 9500,
      slashCount: 0,
      totalEarnings: "1234.56",
    },
    {
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      stakedFuel: "25000",
      reputationScore: 9200,
      slashCount: 1,
      totalEarnings: "567.89",
    },
  ]).onConflictDoNothing();

  await db.insert(servicesTable).values([
    {
      ownerAddress: "0x1234567890abcdef1234567890abcdef12345678",
      name: "Summarize Agent",
      description: "Summarizes text content on-demand. Fast, accurate, pay-per-call.",
      endpoint: "https://api.example.com/summarize",
      price: "0.10",
      currency: "USDT",
      stakeRequired: "1000",
      successRate: 9920,
      avgLatency: 820,
      totalCalls: 4231,
    },
    {
      ownerAddress: "0x1234567890abcdef1234567890abcdef12345678",
      name: "Research Agent",
      description: "Performs rapid research and returns structured results. Pay per query.",
      endpoint: "https://api.example.com/research",
      price: "0.25",
      currency: "USDT",
      stakeRequired: "2500",
      successRate: 9760,
      avgLatency: 2100,
      totalCalls: 1832,
    },
    {
      ownerAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      name: "Code Review Agent",
      description: "AI code review for pull requests and snippets. Instant security and quality analysis.",
      endpoint: "https://api.example.com/code-review",
      price: "0.50",
      currency: "USDT",
      stakeRequired: "5000",
      successRate: 9850,
      avgLatency: 3200,
      totalCalls: 892,
    },
    {
      ownerAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      name: "Translation MCP",
      description: "Multi-language translation service via MCP protocol. Supports 50+ languages.",
      endpoint: "https://api.example.com/translate",
      price: "0.05",
      currency: "USDT",
      stakeRequired: "500",
      successRate: 9990,
      avgLatency: 450,
      totalCalls: 12847,
    },
  ]).onConflictDoNothing();

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
