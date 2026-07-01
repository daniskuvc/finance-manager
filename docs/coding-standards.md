# Coding Standards

## Purpose

These standards define how future code should be written once implementation begins. They are intended to keep the project consistent, reviewable, and easy to maintain.

## General Principles

- Prefer clear, direct code over clever abstractions.
- Keep each module focused on one responsibility.
- Use English for names, comments, and documentation.
- Avoid business logic in platform adapters.
- Keep side effects explicit and close to integration boundaries.

## File Organization

- Place domain rules in `src/core`.
- Place use-case orchestration in `src/services`.
- Place persistence contracts and implementations in `src/repositories`.
- Place reusable helpers in `src/shared`.
- Place HTML, CSS, and browser JavaScript under `src/ui`.

## Naming

- Use descriptive names that match the finance domain.
- Use kebab-case for Markdown documentation files.
- Use lower-case folder names.
- Avoid vague names such as `utils` unless the file has a narrow, documented purpose.

## Testing Expectations

Tests should be added with the behavior they verify. Future test coverage should prioritize domain rules, service orchestration, and mapping between Apps Script data and domain models.

## Google Apps Script Constraints

Google Apps Script quotas, authorization scopes, runtime limits, and deployment behavior should be considered before adding integrations. Platform-specific calls should be isolated so the core application remains testable.

## Documentation Expectations

Architecture decisions, persistence assumptions, and workflow changes should be documented near the code they affect or in the relevant file under `docs/`.
