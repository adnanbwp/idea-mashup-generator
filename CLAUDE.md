# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Idea Mashup Generator (IMG)** - A modern, production-ready web application that generates unique business ideas by combining personas, problems, technologies, formats, and business models. The goal is to build a minimalist, cloud-native app following test-driven development principles.

## Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with SSR
- **TailwindCSS + Radix UI** - Clean, modern UI components
- **Framer Motion** - Lightweight animations
- **React Query** - API data caching
- **Testing**: Jest, React Testing Library, Playwright

### Backend
- **NestJS (TypeScript)** - Structured backend with dependency injection
- **Prisma ORM** - Database schema and migrations
- **REST API** (GraphQL optional for future)
- **Testing**: Jest + Supertest

### Database & Auth
- **Supabase (Postgres)** - Realtime database with row-level security and authentication

### Infrastructure
- **Frontend**: Vercel hosting
- **Backend**: Fly.io or Render
- **Database/Auth**: Supabase
- **CI/CD**: GitHub Actions (build, lint, test, deploy)

## Development Commands

*To be added once project is initialized*

## Core Features (V1.0)

1. **Idea Generator** - Combines random elements to create structured business ideas
2. **Idea Management** - Save, tag, and rate generated ideas
3. **Search & Filter** - Filter ideas by score or tags
4. **Export** - Export ideas to Markdown/CSV formats
5. **Authentication** - Email/OAuth login via Supabase

## Testing Strategy

- **TDD-first approach** - All core logic covered with unit tests before implementation
- **Frontend**: React Testing Library + Playwright for E2E flows
- **Backend**: Jest + Supertest for API endpoints
- **CI Integration**: Tests must pass before merging PRs

## Architecture Principles

- Modular, scalable code structure
- Test-driven development
- Clean separation of concerns
- Row-level security for multi-user data
- Sub-1s response times for idea generation