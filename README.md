# Greydata Floating Chatbot

A beautiful, customizable floating chat widget for conversational AI agents, designed specifically for Greydata's conversational AI platform.

## Features

- 🚀 Easy to integrate into any web application
- 🎨 Customizable appearance to match your brand
- 💬 Real-time messaging with WebSocket support
- 🛠️ Built with React and TypeScript
- 🎯 Shadow DOM for style isolation

## Installation

```bash
# Using npm
npm install @greydata/floating-chatbot
```

## Usage

### Basic Usage

```jsx
import { FloatingChatWidget } from '@greydata/floating-chatbot';

function App() {
  return (
    <FloatingChatWidget
      apiUrl="https://your-api-url.com"
      conversationalAgentId="your-agent-id"
      token="your-jwt-token"
      botName="AI Assistant"
    />
  );
}
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `apiUrl` | `string` | Yes | - | The base URL of your API |
| `conversationalAgentId` | `string` | Yes | - | The ID of the conversational agent |
| `token` | `string` | No | - | JWT token for authentication |
| `sessionId` | `string` | No | Auto-generated | Unique session ID for the chat |
| `asAgent` | `boolean` | No | `false` | Whether the user is an agent |
| `position` | `string` | No | `'bottom-right'` | Position of the chat widget (`'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`) |
| `primaryColor` | `string` | No | `'#10b981'` | Primary color for the widget |
| `botName` | `string` | No | `'AI Assistant'` | Name of the bot |


## Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/floating-chatbot.git
   cd floating-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```


3. Build for production:
   ```bash
   npm run build
   ```

## Support

For support, please open an issue on our [GitHub repository](https://github.com/yourusername/floating-chatbot) or contact our support team at luciano@greydata.ca.

---

Made with ❤️ by [Greydata](https://greydata.ai)
