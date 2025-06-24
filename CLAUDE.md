# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Open Router Connect, a NestJS-based system that integrates LangChain with OpenRouter API to connect, test, and validate various AI models. The project provides a comprehensive platform for AI model management through standardized testing and monitoring.

## Development Commands

### Package Management
Use `yarn` as the package manager:
```bash
yarn install        # Install dependencies
```

### Development
```bash
yarn run start:dev  # Start development server with hot reload
yarn run start      # Start production server
yarn run build      # Build the application
```

### Testing
```bash
yarn run test       # Run unit tests
yarn run test:watch # Run tests in watch mode
yarn run test:cov   # Run tests with coverage
yarn run test:e2e   # Run end-to-end tests
```

### Code Quality
```bash
yarn run lint       # Run ESLint with auto-fix
yarn run format     # Format code with Prettier
```

## Architecture

### Core Structure
- **Framework**: NestJS with TypeScript
- **Entry Point**: `src/main.ts` - Standard NestJS bootstrap on port 3000
- **Module Structure**: Standard NestJS modular architecture
- **Testing**: Jest for unit and e2e testing

### Key Components
- `AppModule`: Root module containing core application structure
- `AppController`: Main controller with basic HTTP endpoints
- `AppService`: Core business logic service layer

### Planned Architecture (from PRD)
The project will expand to include:
- **AI Integration**: LangChain for AI model management
- **API Integration**: OpenRouter for accessing multiple AI models
- **Logging**: Winston for structured logging
- **Model Testing**: Endpoints for validating AI model connections and responses
- **Batch Processing**: Support for testing multiple models simultaneously

### API Endpoints (Planned)
```
POST /api/models/test          # Test single model
GET  /api/models/status        # Check model connection status
POST /api/models/batch-test    # Run batch tests
```

## Environment Configuration

Required environment variables (from PRD):
- `OPENROUTER_API_KEY`: API key for OpenRouter service
- `DEFAULT_MODEL`: Default AI model for testing
- `LOG_LEVEL`: Logging level configuration
- `PORT`: Application port (defaults to 3000)

## TypeScript Configuration

- Target: ES2023
- Module: CommonJS
- Decorators enabled for NestJS
- Source maps enabled for debugging
- Strict null checks enabled

## Testing Strategy

- **Unit Tests**: `.spec.ts` files in `src/` directory
- **E2E Tests**: Located in `test/` directory
- **Coverage Target**: 80% minimum (per PRD requirements)
- **Test Environment**: Node.js with Jest

## Development Notes

- The project uses ESLint with Prettier for code formatting
- TypeScript strict mode partially enabled (strictNullChecks: true, noImplicitAny: false)
- SWC compiler for fast builds
- Source map support enabled for debugging