# AgentFuel - BSC Agent Payment Layer

## Overview

AgentFuel is a BSC-native pay-per-call commerce layer for AI agents. It provides service registry, FUEL staking, quote API, and receipt registry functionality.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/agentfuel)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM (lib/db)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Smart Contracts**: Solidity + Hardhat (BSC Testnet/Mainnet)
- **Token**: FUEL (ERC-20, staking/penalty/routing weight)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── agentfuel/        # React+Vite frontend (preview at /)
│   └── api-server/       # Express API server (at /api)
├── contracts/            # Solidity smart contracts
│   ├── FuelToken.sol     # FUEL ERC-20 token
│   ├── FuelStaking.sol   # Staking/slashing logic
│   ├── ServiceRegistry.sol # On-chain service registry
│   └── ReceiptRegistry.sol # On-chain call receipts
├── lib/
│   ├── api-spec/         # OpenAPI spec + Orval codegen config
│   ├── api-client-react/ # Generated React Query hooks
│   ├── api-zod/          # Generated Zod schemas from OpenAPI
│   └── db/               # Drizzle ORM schema + DB connection
│       └── src/schema/
│           ├── providers.ts
│           ├── services.ts
│           └── receipts.ts
├── scripts/              # Utility scripts (seed, deploy)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Frontend Pages

- `/` - Home landing page with links to Service Market, Dashboard, Playground
- `/services` - Service Market: browse pay-per-call AI agent services
- `/dashboard` - Provider Dashboard: staking stats, earnings, reputation
- `/playground` - Playground: test API quote calls interactively

## API Endpoints

All at `/api`:
- `GET /healthz` - Health check
- `GET /services` - List active services
- `GET /services/:id` - Get service by ID
- `POST /services` - Register new service
- `GET /providers` - List providers
- `GET /providers/:address` - Get provider by wallet address
- `POST /providers` - Register provider
- `POST /quote` - Request quote for a service call
- `GET /receipts` - List call receipts (filter by payer/provider/serviceId)

## Database Tables

- `providers` - Wallet addresses, staked FUEL, reputation, earnings
- `services` - Registered agent/API/MCP services with pricing
- `receipts` - Per-call payment receipts

## Smart Contracts (BSC)

- `FuelToken.sol` - ERC-20 FUEL token (1B supply)
- `FuelStaking.sol` - Stake/unstake/slash FUEL
- `ServiceRegistry.sol` - On-chain service registration
- `ReceiptRegistry.sol` - Immutable call receipt recording

## Development Commands

```bash
pnpm --filter @workspace/db run push          # Push DB schema
pnpm --filter @workspace/scripts run seed     # Seed sample data
pnpm --filter @workspace/api-spec run codegen # Regenerate API client
```

## Environment Variables Required

- `DATABASE_URL` - Auto-provided by Replit
- `BSC_RPC_URL` - BSC node URL (testnet or mainnet)
- `PRIVATE_KEY` - Deployer wallet private key
- `NEXT_PUBLIC_CHAIN_ID` - 97 (testnet) or 56 (mainnet)

## Next Tasks

1. Add wallet connect for BSC (wagmi + viem)
2. Add provider service registration form
3. Connect receipt creation flow after paid call
4. Integrate ServiceRegistry contract writes
5. Add FUEL staking UI
