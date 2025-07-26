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

```bash
# Development
npm run dev          # Start development server
npm run build        # Build production bundle
npm run start        # Start production server

# Testing
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests with Playwright
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Database
npm run seed         # Seed database with sample data
```

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

### E2E Testing Best Practices

**Playwright Selector Strategy:**
```typescript
// ✅ Preferred: Use semantic selectors
page.getByRole('button', { name: 'Generate' })
page.getByRole('heading', { name: 'Saved Ideas' })
page.getByPlaceholder('Enter your email')

// ✅ Good: Specific text with context
page.getByText('You haven\'t saved any ideas yet. Generate some ideas to get started!')

// ❌ Avoid: Generic text that may match multiple elements
page.getByText('Generate')  // Could match buttons, headings, descriptions
```

**Authentication State Handling:**
```typescript
// Handle both authenticated and unauthenticated states
const authError = page.getByText('Please sign in to view your saved ideas')
const emptyState = page.getByText("You haven't saved any ideas yet. Generate some ideas to get started!")
await expect(authError.or(emptyState)).toBeVisible()
```

**Test Organization:**
- Each test should be independent and not rely on previous test state
- Use descriptive test names that explain the expected behavior
- Mock API responses for consistent, fast tests
- Clean up any state changes after tests complete

**Common Pitfalls to Avoid:**
- **Strict mode violations**: Multiple elements matching the same selector
- **Authentication assumptions**: Tests should handle both auth states
- **Exact text matching**: UI text may change, use partial matches or roles
- **Timing issues**: Use proper waits with `toBeVisible()` instead of fixed delays

## Architecture Principles

- Modular, scalable code structure
- Test-driven development
- Clean separation of concerns
- Row-level security for multi-user data
- Sub-1s response times for idea generation

## Git Workflow & Development Process

### Feature Branch Workflow

**NEVER commit directly to `main`.** All changes must go through feature branches and pull requests.

#### 1. Starting New Work
```bash
# Ensure you're on latest main
git checkout main
git pull origin main

# Create feature branch with descriptive name
git checkout -b feature/description    # New features
git checkout -b fix/bug-description    # Bug fixes  
git checkout -b chore/task-description # Maintenance tasks

# Examples:
git checkout -b feature/oauth-login
git checkout -b fix/e2e-test-failures
git checkout -b chore/update-dependencies
```

#### 2. Making Changes
```bash
# Make your changes, test locally
npm test                    # Run unit tests
npm run test:e2e           # Run E2E tests (optional locally)
npm run lint               # Check code style
npm run type-check         # Verify TypeScript

# Commit changes using conventional commits
git add .
git commit -m "feat: add OAuth login integration"
git commit -m "fix: resolve E2E test authentication issues" 
git commit -m "chore: upgrade dependencies to latest versions"
```

#### 3. Commit Message Format
Use **Conventional Commits** for consistency:
```
<type>[optional scope]: <description>

Types:
- feat: new feature
- fix: bug fix
- docs: documentation changes
- style: code formatting (no logic changes)
- refactor: code restructuring (no functionality changes)
- test: adding or updating tests
- chore: maintenance tasks
```

#### 4. Submitting Changes
```bash
# Push feature branch
git push -u origin feature/your-branch-name

# Create Pull Request via GitHub UI
# - Add descriptive title and description
# - Request review from team members
# - Ensure CI passes before merging
# - Use "Squash and merge" for clean history
```

#### 5. After Merge
```bash
# Clean up local branches
git checkout main
git pull origin main
git branch -d feature/your-branch-name
```

### Branch Protection Rules

The `main` branch should be protected with:
- Require pull request reviews (minimum 1 reviewer)
- Require status checks to pass (CI must be green)
- Dismiss stale reviews when new commits are pushed
- Restrict direct pushes (force all changes through PRs)

### Pre-commit Checks

Before creating a PR, ensure:
1. **All tests pass**: `npm test` (unit tests are mandatory)
2. **Code is properly linted**: `npm run lint`
3. **TypeScript compiles**: `npm run type-check`
4. **Build succeeds**: `npm run build`
5. **E2E tests** (optional locally): `npm run test:e2e` 
   - E2E tests run automatically in CI
   - Install Playwright browsers locally: `npx playwright install`
6. **Local manual testing** for UI changes

## Development Best Practices

- **Test-Driven Development**: Write tests before implementing features
- **Small, atomic commits**: Each commit should represent one logical change
- **Meaningful commit messages**: Follow conventional commit format
- **Code reviews**: All code must be reviewed before merging
- **CI/CD compliance**: All checks must pass before deployment