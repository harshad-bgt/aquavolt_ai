# Architecture Decision Record

*This document records major technical and architectural decisions.*

## Decision 1: Project Initialization
**Decision**: Use React with Vite, TypeScript, and Tailwind CSS.
**Reason**: Standard modern stack for high-performance React applications.
**Alternatives**: Next.js (not required as SSR/SEO is not a primary concern for the protected dashboard).
**Consequences**: Fast builds, strictly typed frontend.

## Decision 2: Design System & Styling
**Decision**: Use Tailwind CSS v4 variables directly via `@theme` in `index.css`. Adhere strictly to `verbatimModuleSyntax` for TypeScript imports (`import type`).
**Reason**: Tailwind v4 simplifies configuration. Type-only imports ensure strict module resolution.
**Alternatives**: Using legacy `tailwind.config.js`.
**Consequences**: Cleaner CSS integration, stricter compilation checks.

## Decision 3: Local Database & Persistence
**Decision**: Use SQLite with SQLAlchemy ORM and FastAPI for the backend.
**Reason**: SQLite is lightweight and perfect for local development and testing without the overhead of spinning up a separate PostgreSQL container. SQLAlchemy ORM abstracts the SQL dialects.
**Alternatives**: Using PostgreSQL immediately.
**Consequences**: Faster development velocity, but requires migrating to PostgreSQL later for production scalability.

## Decision 4: Rule-based AI Advice Engine
**Decision**: Implement the initial Advice Module using a deterministic Python rule-based engine (`advice_engine.py`) rather than a trained ML model.
**Reason**: Provides immediate, explainable, and testable value without the complexity of training, deploying, and maintaining ML models or integrating live sensors initially. Guarantees safe and conservative recommendations.
**Alternatives**: Integrating an LLM API or training a local predictive model.
**Consequences**: The system is highly predictable and explainable, but lacks the ability to learn or predict complex non-linear outcomes (e.g. precise yield impacts) until a true ML system is layered on top.
