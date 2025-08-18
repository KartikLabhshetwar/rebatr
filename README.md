# Rebatr - AI Debate Arena

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/kartik-labhshetwars-projects/v0-ai-debate-arena)

**Where AI models forge arguments and battle for intellectual supremacy.**

Rebatr is a sophisticated web application that orchestrates live debates between different AI models. Watch as GPT-4, Claude, Llama, and other leading AI models engage in structured arguments on any topic you choose.

## Rebatr Demo

##  Features

### **Core Functionality**
- **Live AI Debates**: Real-time arguments between different AI models
- **Dynamic Model Selection**: Choose from 100+ AI models via OpenRouter API
- **Intelligent Scoring**: Advanced algorithm analyzes logic, evidence, and persuasiveness
- **Auto Mode**: Hands-off debates that run automatically
- **Export Results**: Save debate transcripts as PDF or text files

### **Advanced Features**
- **Smart Routing**: Automatic debate flow management with strategic prompting
- **Real-time Analytics**: Live scoring and performance metrics
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Keyboard Shortcuts**: Power user controls for efficient navigation
- **Error Recovery**: Robust retry logic and graceful failure handling

### **User Experience**
- **Modern UI**: Clean, accessible interface built with Radix UI components
- **Dark/Light Themes**: Automatic theme switching based on system preferences
- **Animations**: Smooth transitions and victory celebrations with confetti
- **Loading States**: Comprehensive feedback during AI generation
- **Mobile-First**: Fully responsive design that works everywhere

## Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **OpenRouter API** - Access to 100+ AI models
- **Edge Runtime** - Fast, global API responses

### **Architecture**
- **Component-Driven** - Modular, reusable UI components
- **Custom Hooks** - Shared state management logic
- **Type Safety** - Full TypeScript coverage
- **Error Boundaries** - Graceful error handling

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rebatr.git
   cd rebatr
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Usage

1. **Enter your OpenRouter API key** - Required for accessing AI models
2. **Choose a debate topic** - Select from suggestions or enter your own
3. **Select AI models** - Pick two models to debate (Pro vs Con positions)
4. **Watch the debate unfold** - Enable auto mode or control manually
5. **Analyze results** - View scores, export transcripts, and celebrate winners

## Architecture

### Project Structure
```
rebatr/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── debate/        # Debate generation endpoint
│   │   ├── models/        # Dynamic model fetching
│   │   └── validate-key/  # API key validation
│   ├── debate/            # Debate page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components (Radix)
│   ├── debate-arena.tsx  # Main orchestrator
│   ├── debate-setup.tsx  # Model selection
│   └── debate-display.tsx # Live debate interface
├── hooks/                # Custom React hooks
│   ├── use-api-key.ts   # API key management
│   └── use-models.ts    # Dynamic model loading
├── lib/                  # Core business logic
│   ├── debate-engine.ts # Debate orchestration
│   ├── openrouter.ts   # API client
│   └── scoring-engine.ts # Intelligent scoring
└── types/               # TypeScript definitions
    └── debate.ts        # Core types
```

### Key Components

#### **DebateEngine** (`lib/debate-engine.ts`)
- Orchestrates the entire debate flow
- Generates context-aware prompts for each round
- Manages debate phases (opening, development, rebuttal, closing)

#### **ScoringEngine** (`lib/scoring-engine.ts`)
- Analyzes arguments across multiple criteria
- Calculates real-time scores and determines winners
- Provides detailed feedback on argument quality

#### **Dynamic Model Loading** (`hooks/use-models.ts`)
- Fetches latest models from OpenRouter API
- Categorizes models by pricing tier
- Provides fallback models if API fails

### Model Configuration
Models are dynamically loaded from OpenRouter API and automatically categorized:
- **Free Tier**: No cost or very low cost models
- **Standard Tier**: Mid-range pricing models  
- **Premium Tier**: High-performance, higher-cost models

## Use Cases

### **Education**
- Classroom debates on historical topics
- Philosophy and ethics discussions
- Literature analysis and interpretation

### **Business**
- Product decision making
- Strategy discussions
- Market analysis debates

### **Research**
- AI model comparison and evaluation
- Argument quality assessment
- Debate methodology research

### **Entertainment**
- Fun debates on pop culture topics
- Creative writing prompts
- AI personality exploration

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- TypeScript for all new code
- ESLint + Prettier for formatting
- Component-driven architecture
- Comprehensive error handling

## Performance

- **First Load**: < 2s on 3G networks
- **Debate Generation**: 2-5s per argument
- **Real-time Scoring**: < 100ms analysis

## Security & Privacy

- **API Keys**: Stored locally in browser, never sent to our servers
- **Data Privacy**: No debate data is stored permanently
- **Rate Limiting**: Built-in protection against API abuse
- **Error Handling**: Secure error messages without sensitive data exposure

### Manual Deployment
```bash
pnpm build
pnpm start
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ by developers who believe in the power of AI discourse</p>
  <p><strong>⭐ Star this repo if you found it useful!</strong></p>
</div>