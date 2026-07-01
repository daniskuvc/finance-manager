# Architecture

## Purpose

This document describes the intended architecture for Finance Manager. It is a placeholder for review and will evolve as the domain model, persistence strategy, and user workflows become clearer.

## Architectural Style

Finance Manager will follow Clean Architecture. Core business rules should remain independent from Google Apps Script APIs, spreadsheet structures, UI rendering, and deployment concerns.

## Planned Layers

### Core

The core layer will contain domain concepts, rules, and validations. It should not import platform-specific APIs or make assumptions about storage.

### Services

The services layer will coordinate application use cases. Services may depend on repository contracts and domain objects, but should avoid direct Google Apps Script calls.

### Repositories

The repositories layer will define persistence boundaries. Concrete storage implementation details will be added after the database and spreadsheet design is approved.

### Shared

The shared layer will contain cross-cutting utilities and constants that are truly reusable across layers. Shared code should remain small and intentional.

### UI

The UI layer will contain HTML, CSS, and browser-side JavaScript assets for future Google Apps Script HTML service screens.

## Dependency Direction

Dependencies should point inward toward the domain. Outer layers may know about inner layers, but core modules should not know about services, repositories, UI, or Apps Script APIs.

## Review Notes

- Repository interfaces should be designed after the database model is approved.
- Google Apps Script entry points should remain thin wrappers.
- Data mapping should happen at architecture boundaries.
- Test strategy should be revisited before business behavior is implemented.
