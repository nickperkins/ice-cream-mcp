

/**
 * Entry point for the Ice Cream Topping Recommender MCP Server.
 *
 * - Starts the MCP server for ice cream topping recommendations.
 * - Uses stdio transport for integration with MCP-compatible clients (e.g., Claude for Desktop).
 * - The main server logic is implemented in IceCreamMcpServer.
 *
 * @module src/index
 */

import { IceCreamMcpServer } from "./server/McpServer.js";


/**
 * Bootstraps and starts the Ice Cream MCP Server.
 * Handles fatal startup errors.
 */
const server = new IceCreamMcpServer();
server.start().catch((error) => {
  console.error("Fatal error starting server:", error);
  process.exit(1);
});
