# Windows Explorer Frontend

A modern web application built with Vue 3 and TypeScript, designed to provide an intuitive file management interface with a familiar Windows Explorer-like experience.

## Project Overview

This frontend application is part of a comprehensive file management system that offers:

- Intuitive navigation through file structures
- Modern responsive design with clean UI components
- Type-safe development with TypeScript integration
- Efficient build process and development workflow

## Technology Stack

### Core Framework

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Typed superset of JavaScript for enhanced developer experience
- **Vite** - Fast build tool and development server

### State Management & Routing

- **Pinia** - Intuitive state management for Vue applications
- **Vue Router** - Official routing library for Vue applications

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
- **FontAwesome** - Icon library for consistent visual elements
- **Custom Design System** - Windows-inspired color palette and typography

### Development Tools

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatter for consistent style
- **Oxlint** - Fast linter for additional code quality checks

### Testing

- **Vitest** - Fast unit testing framework
- **Cypress** - End-to-end testing framework
- **Vue Test Utils** - Official testing utilities for Vue components

### HTTP & Data

- **Axios** - Promise-based HTTP client for API communication

## Architecture

The project follows a clean architecture pattern with clear separation of concerns:

### Presentation Layer

- Vue components for user interface
- Component composition and reusability
- Responsive design implementation

### Application Layer

- Business logic orchestration
- State management with Pinia stores
- Action and computed property organization

### Domain Layer

- Core business entities and value objects
- Business rules and validation logic
- Interface definitions for services and repositories
- Use case implementations

### Shared Layer

- Common utilities and helper functions
- Type definitions and interfaces
- Cross-cutting concerns (logging, error handling)
- Dependency injection container

## Development Practices

- **Component-based Architecture** - Modular and maintainable code structure
- **Type Safety** - Comprehensive TypeScript integration throughout the application
- **Clean Code Principles** - Readable, maintainable, and well-documented code
- **Testing Strategy** - Comprehensive unit and integration test coverage
- **Performance Optimization** - Efficient build process and runtime performance
- **Code Quality** - Automated linting and formatting for consistent standards

## Key Features

- **File System Navigation** - Intuitive folder browsing and file management
- **Responsive Design** - Optimized for various screen sizes and devices
- **Modern UI/UX** - Clean, professional interface inspired by Windows Explorer
- **Real-time Updates** - Dynamic content loading and state synchronization
- **Error Handling** - Comprehensive error management and user feedback
- **Accessibility** - WCAG compliant design and keyboard navigation support

## Project Setup

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Type-Check, Compile and Minify for Production

```sh
bun run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
bun test:unit
```

```sh
bun run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun lint
```