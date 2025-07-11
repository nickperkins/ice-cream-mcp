# Copilot Instructions for Ice Cream Topping Recommender MCP Server

<!-- For more details, see https://aka.ms/vscode-instructions-docs -->

## Project Overview

- This is a **demonstration repository** showcasing how to build MCP servers with elicitation capabilities.
- It's a minimal Model Context Protocol (MCP) server written in TypeScript that serves as a learning resource.
- The main feature is a single tool: `ice_cream_topping_recommender`, which demonstrates MCP elicitation (schema-driven user input).
- This project highlights key MCP patterns: tool registration, input validation, error handling, and interactive user prompting.
- The server is designed for integration with MCP-compatible clients (e.g., Claude for Desktop, VS Code MCP extensions).

## Architecture & Key Files

- **Entry Point:** `src/index.ts`
  - Bootstraps the MCP server and handles startup errors
  - Imports and instantiates the main `IceCreamMcpServer` class
- **Main Server:** `src/server/McpServer.ts`
  - Implements the complete MCP server using low-level `Server` class from the MCP SDK
  - Demonstrates proper tool registration, elicitation handling, and error management
  - Uses modular tool architecture with `IceCreamToppingRecommenderTool` class
- **Tool Architecture:** Tools follow a consistent pattern:
  - `getName()`: Returns unique tool identifier
  - `getDescription()`: Provides human-readable description
  - `getInputSchema()`: Defines Zod validation schema
  - `execute(args, elicitInput?)`: Main tool logic with optional elicitation support
- **Configuration:**
  - `.vscode/mcp.json`: VS Code MCP client integration configuration
  - `tsconfig.json`: TypeScript compilation settings with ESM modules
  - `package.json`: Dependencies and build scripts (Yarn preferred)

## Developer Workflows

- **Install dependencies:**
  `yarn install`
- **Build:**
  `yarn build`
- **Run (stdio mode):**
  `yarn start`
- **Debug in VS Code:**
  Use `.vscode/mcp.json` for MCP client integration.

## Project Conventions

- **Single-tool demonstration:** Only one tool is exposed to keep the example focused and educational
- **Elicitation showcase:** The primary purpose is demonstrating interactive user input via MCP elicitation
- **Type-safe validation:** All user input is validated using Zod schemas with detailed error messages
- **Stdio communication:** Uses standard input/output transport, not HTTP, for MCP client integration
- **Stateless design:** No database or persistent storage - all logic is in-memory for simplicity
- **Production patterns:** Includes proper error handling, logging, and modular architecture despite being a demo

## Integration Points

- **External SDK:**
  Uses `@modelcontextprotocol/sdk` for MCP server and transport.
- **Schema validation:**
  Uses `zod` for all input validation.
- **MCP Client Integration:**
  The server is intended to be launched by MCP-compatible clients using the stdio transport.

## Example: Tool Registration

```typescript
server.tool(
  "ice_cream_topping_recommender",
  "Recommends the best ice cream toppings based on your selected flavour.",
  { flavour: z.enum(["vanilla", "strawberry", "chocolate"]) },
  async ({ flavour }) => {
    /* ... */
  }
);
```

## Key Patterns

- Always validate input with Zod.
- Return errors as `{ content: [{ type: "text", text: "..." }], isError: true }`.
- Use descriptive tool names and input schema descriptions.
