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

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
bun test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
bun run build
bun test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun lint
```
=== CREATE NEW FILE DEBUG ===
FileActions.ts?t=1756375225977:52 folderId parameter: cmev8322o0003ycrbnzlanbn2
FileActions.ts?t=1756375225977:53 state.currentFolderId: cmev8322o0003ycrbnzlanbn2
FileActions.ts?t=1756375225977:54 final targetFolderId: cmev8322o0003ycrbnzlanbn2
FileActions.ts?t=1756375225977:62 uniqueName generated: New File.txt-copy
FileActions.ts?t=1756375225977:72 folderPath: 
FileActions.ts?t=1756375225977:81 final filePath: /New File.txt-copy
FileActions.ts?t=1756375225977:89 fileData to create: {name: 'New File.txt-copy', path: '/New File.txt-copy', folderId: 'cmev8322o0003ycrbnzlanbn2', size: 0, mimeType: 'text/plain'}
FileActions.ts?t=1756375225977:17 {id: 'cmev8h9rj001iycrbl9z1gmmf', name: 'New File.txt-copy', path: '/New File.txt-copy', folderId: 'cmev8322o0003ycrbnzlanbn2', size: 0, …}
FileActions.ts?t=1756375225977:51 === CREATE NEW FILE DEBUG ===
FileActions.ts?t=1756375225977:52 folderId parameter: cmev8322n0002ycrbuersu7uq
FileActions.ts?t=1756375225977:53 state.currentFolderId: cmev8322n0002ycrbuersu7uq
FileActions.ts?t=1756375225977:54 final targetFolderId: cmev8322n0002ycrbuersu7uq
FileActions.ts?t=1756375225977:62 uniqueName generated: New File.txt
FileActions.ts?t=1756375225977:72 folderPath: 
FileActions.ts?t=1756375225977:81 final filePath: /New File.txt
FileActions.ts?t=1756375225977:89 fileData to create: {name: 'New File.txt', path: '/New File.txt', folderId: 'cmev8322n0002ycrbuersu7uq', size: 0, mimeType: 'text/plain'}

=== CREATE NEW FOLDER DEBUG ===
FolderActions.ts:53 state.selectedFolderId: cmev8322o0003ycrbnzlanbn2
FolderActions.ts:54 state.folderHierarchy exists: true
FolderActions.ts:65 uniqueName generated: New Folder
FolderActions.ts:70 selectedFolderNode found: Proxy(FolderNode) {id: 'cmev8322o0003ycrbnzlanbn2', name: 'Projects', path: '/Projects', parentId: null, size: '', …}
FolderActions.ts:80 folderPath: /Projects/New Folder
FolderActions.ts:88 folderData to create: {name: 'New Folder', path: '/Projects/New Folder', parentId: 'cmev8322o0003ycrbnzlanbn2'}
FolderActions.ts:52 === CREATE NEW FOLDER DEBUG ===
FolderActions.ts:53 state.selectedFolderId: cmev8322o0003ycrbnzlanbn2
FolderActions.ts:54 state.folderHierarchy exists: true
FolderActions.ts:65 uniqueName generated: New Folder-copy
FolderActions.ts:70 selectedFolderNode found: Proxy(FolderNode) {id: 'cmev8322o0003ycrbnzlanbn2', name: 'Projects', path: '/Projects', parentId: null, size: '', …}
FolderActions.ts:80 folderPath: /Projects/New Folder-copy
FolderActions.ts:88 folderData to create: {name: 'New Folder-copy', path: '/Projects/New Folder-copy', parentId: 'cmev8322o0003ycrbnzlanbn2'}
FolderActions.ts:52 === CREATE NEW FOLDER DEBUG ===
FolderActions.ts:53 state.selectedFolderId: cmev8322l0001ycrbmpdsiemc
FolderActions.ts:54 state.folderHierarchy exists: true
FolderActions.ts:65 uniqueName generated: New Folder-copy2
FolderActions.ts:70 selectedFolderNode found: Proxy(FolderNode) {id: 'cmev8322l0001ycrbmpdsiemc', name: 'Pictures', path: '/Pictures', parentId: null, size: '', …}
FolderActions.ts:80 folderPath: /Pictures/New Folder-copy2
FolderActions.ts:88 folderData to create: {name: 'New Folder-copy2', path: '/Pictures/New Folder-copy2', parentId: 'cmev8322l0001ycrbmpdsiemc'}