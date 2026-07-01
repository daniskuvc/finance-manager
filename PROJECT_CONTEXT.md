# Finance Manager Project Context

## Project Vision

Finance Manager is a Google Apps Script application intended to help track, organize, and review personal or small-team financial information from within the Google Workspace ecosystem. The project should remain maintainable as it grows by keeping business rules independent from platform-specific implementation details.

## Goals

- Establish a clear project structure for future development.
- Use Clean Architecture to separate core rules, services, repositories, shared utilities, and UI assets.
- Keep Google Apps Script integration isolated from application decisions.
- Create documentation that supports architecture review before implementation begins.
- Provide conventions that future contributors and AI assistants can follow consistently.

## Non Goals

- Do not implement business logic during this bootstrap phase.
- Do not create Google Sheets integrations or `SpreadsheetApp` code yet.
- Do not create concrete repositories, services, controllers, or UI workflows yet.
- Do not define the final database or spreadsheet schema yet.
- Do not modify local clasp, Apps Script, or package configuration files as part of this sprint.

## Tech Stack

- Runtime: Google Apps Script.
- Local development: VS Code with `clasp` synchronization.
- Documentation: Markdown.
- Architecture style: Clean Architecture with SOLID design principles.
- UI target: Google Apps Script HTML service assets when UI work begins.
- Tests: Local test structure reserved for future test tooling decisions.

## Architecture Overview

The project will be organized around a core domain that does not depend on Google Apps Script APIs. Application behavior will be introduced through services and use-case-oriented modules. External integrations, such as Google Sheets persistence, will be represented behind repository contracts and implemented only after the data model is approved.

Planned layers:

- `src/core`: domain entities, value objects, and business rules.
- `src/services`: application orchestration and use cases.
- `src/repositories`: persistence contracts and future implementations.
- `src/shared`: cross-cutting helpers, constants, and common types.
- `src/ui`: HTML, CSS, and client-side JavaScript assets.

## Repository Structure

```text
.
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── coding-standards.md
│   ├── roadmap.md
│   └── changelog.md
├── scripts/
├── src/
│   ├── core/
│   ├── repositories/
│   ├── services/
│   ├── shared/
│   └── ui/
│       ├── css/
│       ├── html/
│       └── js/
└── tests/
```

## SOLID Principles

- Single Responsibility: each module should have one clear reason to change.
- Open/Closed: behavior should be extended through new modules or implementations instead of modifying stable abstractions.
- Liskov Substitution: implementations should honor the contracts they claim to satisfy.
- Interface Segregation: contracts should stay small and focused on client needs.
- Dependency Inversion: high-level application rules should depend on abstractions, not Apps Script APIs or concrete storage details.

## Naming Conventions

- Use descriptive English names for files, folders, functions, and documentation.
- Prefer domain language over technical shortcuts.
- Keep module names aligned with their architectural role.
- Use kebab-case for Markdown files.
- Use lower-case directory names.
- Avoid abbreviations unless they are widely understood in the project context.

## Git Workflow

- Keep commits focused on a single purpose.
- Include documentation updates with related architecture or implementation changes.
- Avoid committing generated artifacts unless the project explicitly requires them.
- Review changes before synchronization with Google Apps Script.
- Do not overwrite unrelated local work.

## Branch Strategy

- `main`: stable branch for reviewed project state.
- Feature branches: short-lived branches for isolated tasks or sprint items.
- Documentation branches: acceptable for architecture-only changes.
- Pull requests or review checkpoints should be used before merging behavior that affects architecture, persistence, or user workflows.

## Coding Standards

- Keep business rules separate from platform-specific APIs.
- Prefer small modules with explicit responsibilities.
- Avoid global mutable state unless required by Google Apps Script entry points.
- Write code that is readable before it is clever.
- Add tests around meaningful behavior once implementation begins.
- Keep comments focused on intent, tradeoffs, or non-obvious constraints.

## Google Apps Script Guidelines

- Isolate Google Apps Script services such as `SpreadsheetApp`, `PropertiesService`, and `HtmlService` behind boundary modules.
- Keep Apps Script entry points thin.
- Avoid embedding business decisions directly in `.gs` handlers.
- Treat quotas, execution limits, and authorization scopes as design constraints.
- Document required scopes and deployment decisions before production use.

## AI Assistant Rules

- Do not implement business logic unless the task explicitly requests it.
- Do not modify `package.json`, `appsscript.json`, or `.clasp.json` without explicit approval.
- Preserve Clean Architecture boundaries.
- Prefer documentation and scaffolding during bootstrap tasks.
- Ask for clarification when a change would affect persistence, security, deployment, or user-facing workflows.
- Keep generated documentation in English.

## Definition of Done

- Required directories exist.
- Required documentation files exist and are written in English.
- Empty structural directories contain `.gitkeep` placeholders.
- No business logic has been added.
- No Google Apps Script implementation has been added.
- Project is ready for architecture review.

## Roadmap

- Sprint 2.1: project bootstrap and documentation.
- Sprint 2.2: architecture review and domain boundary refinement.
- Sprint 2.3: database and spreadsheet schema design.
- Sprint 2.4: repository contracts and persistence strategy.
- Sprint 2.5: service layer design.
- Sprint 2.6: UI structure and interaction review.
