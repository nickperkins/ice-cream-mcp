
/**
 * MCP Server implementation for the Ice Cream Topping Recommender.
 *
 * - Exposes a single tool for recommending ice cream toppings based on flavour.
 * - Uses the low-level Server class from the MCP SDK for explicit capability control.
 * - Handles tool registration, input validation, and error handling.
 *
 * @module src/server/McpServer
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Minimal tool registry for a single-tool server
/**
 * Tool class for recommending ice cream toppings based on a selected flavour.
 * Implements the MCP tool interface expected by the server.
 */
class IceCreamToppingRecommenderTool {
  /**
   * Returns the tool's unique name.
   */
  getName() {
    return "ice_cream_topping_recommender";
  }
  /**
   * Returns a human-readable description of the tool.
   */
  getDescription() {
    return "Recommends the best ice cream toppings based on your selected flavour.";
  }
  /**
   * Returns the Zod schema for input validation.
   */
  getInputSchema() {
    return z.object({
      flavour: z.enum(["vanilla", "strawberry", "chocolate"]).describe(
        "Choose a flavour: vanilla, strawberry, or chocolate."
      ),
    });
  }
  /**
   * Executes the tool logic and returns a response object.
   * If 'flavour' is missing, requests it via elicitation.
   * @param args - The input arguments, expected to match the schema.
   * @param elicitInput - Optional function for elicitation (injected by the server).
   */
  async execute(args: any, elicitInput?: (params: { message: string, requestedSchema: any }) => Promise<any>) {
    let { flavour } = args || {};
    // If flavour is missing, use elicitation
    if (!flavour && elicitInput) {
      // Use a direct, minimal JSON schema (pf-mcp style)
      const jsonSchema = {
        type: "object",
        properties: {
          flavour: {
            type: "string",
            enum: ["vanilla", "strawberry", "chocolate"],
            description: "Choose a flavour: vanilla, strawberry, or chocolate."
          }
        },
        required: ["flavour"]
      };
      const result = await elicitInput({
        message: "Which ice cream flavour do you want toppings for? (vanilla, strawberry, or chocolate)",
        requestedSchema: jsonSchema,
      });
      if (result && result.action === "accept" && result.content?.flavour) {
        flavour = result.content.flavour;
      } else {
        return {
          content: [
            { type: "text", text: "❌ Cancelled by user or no flavour selected." }
          ],
          isError: true
        };
      }
    }
    let toppings: string[];
    switch (flavour) {
      case "vanilla":
        toppings = ["caramel sauce", "rainbow sprinkles", "crushed cookies"];
        break;
      case "strawberry":
        toppings = ["white chocolate chips", "fresh berries", "whipped cream"];
        break;
      case "chocolate":
        toppings = ["chopped nuts", "marshmallows", "hot fudge"];
        break;
      default:
        return {
          content: [
            { type: "text", text: "❌ Unknown flavour." }
          ],
          isError: true
        };
    }
    return {
      content: [
        {
          type: "text",
          text: `🍦 For ${flavour} ice cream, the best toppings are: ${toppings.join(", ")}.`,
        },
      ],
    };
  }
}

/**
 * Main MCP Server class for the ice cream topping recommender.
 * Handles tool registration, request routing, and error handling.
 */
export class IceCreamMcpServer {
  private server: Server;
  private tool: IceCreamToppingRecommenderTool;

  /**
   * Initializes the server, registers the tool, and sets up handlers.
   */
  constructor() {
    this.server = new Server(
      {
        name: "ice-cream-topping-recommender",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
          elicitation: {},
        },
      }
    );
    this.tool = new IceCreamToppingRecommenderTool();
    this.setupHandlers();
    this.setupErrorHandling();
  }

  /**
   * Sets up MCP protocol handlers for tool listing and execution.
   */
  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: this.tool.getName(),
            description: this.tool.getDescription(),
            inputSchema: this.tool.getInputSchema(),
          },
        ],
      };
    });
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;
        if (name !== this.tool.getName()) {
          throw new Error(`Unknown tool: ${name}`);
        }
        // Provide an elicitation function to the tool
        const elicitInput = async (params: { message: string, requestedSchema: any }) => {
          return await (this.server as any).elicitInput(params);
        };
        return await this.tool.execute(args, elicitInput);
      } catch (error) {
        return this.handleToolError(error, request.params.name);
      }
    });
  }

  /**
   * Formats and logs tool execution errors for MCP responses.
   */
  private handleToolError(error: unknown, toolName: string) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Tool ${toolName} failed:`, error);
    return {
      content: [
        {
          type: "text",
          text: `❌ Error in ${toolName}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }

  /**
   * Sets up global error handling for the server process.
   */
  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("Server error:", error);
    };
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      process.exit(1);
    });
  }

  /**
   * Starts the MCP server and connects to the stdio transport.
   */
  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    try {
      await this.server.connect(transport);
      console.error("✅ Ice Cream MCP Server started successfully");
      console.error(`🔧 Available tool: ${this.tool.getName()}`);
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  }
}
