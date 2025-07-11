# Ice Cream Topping Recommender MCP Server

> **🍦 A Demonstration Repository for MCP Elicitation**

This is a minimal Model Context Protocol (MCP) server that showcases how to build MCP tools with **elicitation** capabilities. It serves as a practical learning resource for developers interested in creating interactive MCP servers that can prompt users for input when needed.

## What This Demo Shows

This repository demonstrates several key MCP development patterns:

- **🔄 Elicitation (Interactive Input)**: The tool prompts users for missing parameters using schema-driven UI
- **✅ Input Validation**: Type-safe validation using Zod schemas with helpful error messages
- **🏗️ Modular Architecture**: Clean separation between server setup, tool registration, and business logic
- **🛠️ Production Patterns**: Proper error handling, logging, and TypeScript configuration
- **🔌 Client Integration**: Ready-to-use configuration for VS Code and Claude Desktop

### The Core Feature

The server exposes a single tool: `ice_cream_topping_recommender` that recommends toppings based on ice cream flavours (vanilla, strawberry, or chocolate). When you invoke the tool without specifying a flavour, it demonstrates MCP's elicitation capability by prompting you to select one.

**Example interaction:**

> 🤖 Tool called without flavour parameter
>
> 📝 Prompts: "Which ice cream flavour do you want toppings for?"
>
> 👤 User selects: "vanilla"
>
> 🍦 Response: "For vanilla ice cream, the best toppings are: caramel sauce, rainbow sprinkles, crushed cookies."

## Quick Start

1. **Install dependencies and build:**

   ```bash
   yarn install
   yarn build
   ```

2. **Run the server:**

   ```bash
   yarn start
   ```

3. **Integration with MCP clients:**
   - **VS Code**: The server auto-configures via `.vscode/mcp.json`
   - **Claude Desktop**: Add the server to your MCP configuration

## Project Structure

```text
ice-cream-mcp/
├── src/
│   ├── index.ts              # Entry point & server bootstrap
│   └── server/
│       └── McpServer.ts      # Complete MCP server implementation
├── .vscode/
│   └── mcp.json             # VS Code MCP integration
├── package.json             # Dependencies & scripts
└── tsconfig.json            # TypeScript configuration
```

## Key Learning Points

### 1. **Elicitation Pattern**

See how the tool handles missing input by prompting users with a schema-driven interface:

```typescript
if (!flavour && elicitInput) {
  const result = await elicitInput({
    message: "Which ice cream flavour do you want toppings for?",
    requestedSchema: {
      type: "object",
      properties: {
        flavour: {
          type: "string",
          enum: ["vanilla", "strawberry", "chocolate"]
        }
      }
    }
  });
}
```

### 2. **Modular Tool Architecture**

Tools follow a consistent interface pattern:

- `getName()`: Unique identifier
- `getDescription()`: Human-readable description
- `getInputSchema()`: Zod validation schema
- `execute(args, elicitInput?)`: Main logic with elicitation support

### 3. **Type Safety**

All input is validated using Zod schemas before processing, ensuring robust error handling and clear user feedback.

## Technical Details

- **Language**: TypeScript with ESM modules
- **MCP SDK**: `@modelcontextprotocol/sdk` v1.15.1
- **Validation**: Zod schemas for input validation
- **Transport**: stdio (standard input/output)
- **Integration**: VS Code MCP extension, Claude Desktop

## Blog Post

📖 **[Read the detailed blog post about this implementation →](#)**

## Next Steps

- Clone this repository to explore the code
- Modify the tool to add new flavours or different recommendation logic
- Use this as a template for building your own MCP servers with elicitation
- Check out the detailed blog post (link above) for implementation insights

---

**Perfect for**: Developers learning MCP, building interactive tools, or wanting to understand elicitation patterns.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
