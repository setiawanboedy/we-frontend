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

{
  "success": true,
  "data": [
    {
      "id": "cmev8322i0000ycrb3qz9i89f",
      "name": "Documents",
      "path": "/Documents",
      "parentId": null,
      "size": null,
      "createdAt": "2025-08-28T09:49:53.850Z",
      "updatedAt": "2025-08-28T09:49:53.850Z",
      "children": [
        {
          "id": "cmev8322p0006ycrb261qmgce",
          "name": "Archive",
          "path": "/Documents/Archive",
          "parentId": "cmev8322i0000ycrb3qz9i89f",
          "size": null,
          "createdAt": "2025-08-28T09:49:53.858Z",
          "updatedAt": "2025-08-28T09:49:53.858Z",
          "children": []
        },
        {
          "id": "cmev8322p0004ycrbdh8pv3vg",
          "name": "Personal",
          "path": "/Documents/Personal",
          "parentId": "cmev8322i0000ycrb3qz9i89f",
          "size": null,
          "createdAt": "2025-08-28T09:49:53.858Z",
          "updatedAt": "2025-08-28T09:49:53.858Z",
          "children": []
        },
        {
          "id": "cmev8322p0005ycrbngulr7oa",
          "name": "Work",
          "path": "/Documents/Work",
          "parentId": "cmev8322i0000ycrb3qz9i89f",
          "size": null,
          "createdAt": "2025-08-28T09:49:53.858Z",
          "updatedAt": "2025-08-28T09:49:53.858Z",
          "children": []
        }
      ]
    },
    {
      "id": "cmev8322n0002ycrbuersu7uq",
      "name": "Downloads",
      "path": "/Downloads",
      "parentId": null,
      "size": null,
      "createdAt": "2025-08-28T09:49:53.855Z",
      "updatedAt": "2025-08-28T09:49:53.855Z",
      "children": []
    },
    {
      "id": "cmev8322l0001ycrbmpdsiemc",
      "name": "Pictures",
      "path": "/Pictures",
      "parentId": null,
      "size": null,
      "createdAt": "2025-08-28T09:49:53.854Z",
      "updatedAt": "2025-08-28T09:49:53.854Z",
      "children": [
        {
          "id": "cmev8322s0008ycrbkfm3uhfy",
          "name": "Family",
          "path": "/Pictures/Family",
          "parentId": "cmev8322l0001ycrbmpdsiemc",
          "size": null,
          "createdAt": "2025-08-28T09:49:53.861Z",
          "updatedAt": "2025-08-28T09:49:53.861Z",
          "children": []
        },
        {
          "id": "cmev8utdw0024ycrboq6tlror",
          "name": "New Folder",
          "path": "/Pictures/New Folder",
          "parentId": "cmev8322l0001ycrbmpdsiemc",
          "size": null,
          "createdAt": "2025-08-28T10:11:28.965Z",
          "updatedAt": "2025-08-28T10:11:28.965Z",
          "children": []
        },
        {
          "id": "cmev8uu260026ycrb5v3tld02",
          "name": "New Folder-copy",
          "path": "/Pictures/New Folder-copy",
          "parentId": "cmev8322l0001ycrbmpdsiemc",
          "size": null,
          "createdAt": "2025-08-28T10:11:29.838Z",
          "updatedAt": "2025-08-28T10:11:29.838Z",
          "children": []
        },
        {
          "id": "cmev8322s0009ycrbu0ajnrq6",
          "name": "Screenshots",
          "path": "/Pictures/Screenshots",
          "parentId": "cmev8322l0001ycrbmpdsiemc",
          "size": null,
          "createdAt": "2025-08-28T09:49:53.861Z",
          "updatedAt": "2025-08-28T09:49:53.861Z",
          "children": []
        },
        {
          "id": "cmev8322s0007ycrb4lbk2lqb",
          "name": "Vacation",
          "path": "/Pictures/Vacation",
          "parentId": "cmev8322l0001ycrbmpdsiemc",
          "size": null,
          "createdAt": "2025-08-28T09:49:53.861Z",
          "updatedAt": "2025-08-28T09:49:53.861Z",
          "children": []
        }
      ]
    },
    {
      "id": "cmev8322o0003ycrbnzlanbn2",
      "name": "Projects",
      "path": "/Projects",
      "parentId": null,
      "size": null,
      "createdAt": "2025-08-28T09:49:53.856Z",
      "updatedAt": "2025-08-28T09:49:53.856Z",
      "children": [
        {
          "id": "cmev8322x000fycrb8lsa418h",
          "name": "Data Science",
          "path": "/Projects/Data Science",
          "parentId": "cmev8322o0003ycrbnzlanbn2",
          "size": null,
          "createdAt": "2025-08-28T09:49:53.866Z",
          "updatedAt": "2025-08-28T09:49:53.866Z",
          "children": []
        },
        {
          "id": "cmev8322w000dycrbbhpvs8gs",
          "name": "Mobile Apps",
          "path": "/Projects/Mobile Apps",
          "parentId": "cmev8322o0003ycrbnzlanbn2",
          "size": null,
          "createdAt": "2025-08-28T09:49:53.864Z",
          "updatedAt": "2025-08-28T09:49:53.864Z",
          "children": [
            {
              "id": "cmev8322y000jycrbm7vctkwy",
              "name": "Flutter",
              "path": "/Projects/Mobile Apps/Flutter",
              "parentId": "cmev8322w000dycrbbhpvs8gs",
              "size": null,
              "createdAt": "2025-08-28T09:49:53.867Z",
              "updatedAt": "2025-08-28T09:49:53.867Z",
              "children": []
            },
            {
              "id": "cmev8322y000kycrbe7bj94d7",
              "name": "React Native",
              "path": "/Projects/Mobile Apps/React Native",
              "parentId": "cmev8322w000dycrbbhpvs8gs",
              "size": null,
              "createdAt": "2025-08-28T09:49:53.867Z",
              "updatedAt": "2025-08-28T09:49:53.867Z",
              "children": []
            }
          ]
        },
        {
          "id": "cmev8322u000bycrbbf53xgvo",
          "name": "Web Development",
          "path": "/Projects/Web Development",
          "parentId": "cmev8322o0003ycrbnzlanbn2",
          "size": null,
          "createdAt": "2025-08-28T09:49:53.863Z",
          "updatedAt": "2025-08-28T09:49:53.863Z",
          "children": [
            {
              "id": "cmev8322y000iycrb7hx93zce",
              "name": "Node.js APIs",
              "path": "/Projects/Web Development/Node.js APIs",
              "parentId": "cmev8322u000bycrbbf53xgvo",
              "size": null,
              "createdAt": "2025-08-28T09:49:53.867Z",
              "updatedAt": "2025-08-28T09:49:53.867Z",
              "children": []
            },
            {
              "id": "cmev8322y000gycrbzond998t",
              "name": "React Projects",
              "path": "/Projects/Web Development/React Projects",
              "parentId": "cmev8322u000bycrbbf53xgvo",
              "size": null,
              "createdAt": "2025-08-28T09:49:53.867Z",
              "updatedAt": "2025-08-28T09:49:53.867Z",
              "children": []
            },
            {
              "id": "cmev8322y000hycrbgxjribet",
              "name": "Vue Projects",
              "path": "/Projects/Web Development/Vue Projects",
              "parentId": "cmev8322u000bycrbbf53xgvo",
              "size": null,
              "createdAt": "2025-08-28T09:49:53.867Z",
              "updatedAt": "2025-08-28T09:49:53.867Z",
              "children": []
            }
          ]
        }
      ]
    }
  ],
  "message": "Folder retrieved successfully"
}