# Product Requirements Document (PRD) – Idea Mashup Generator (IMG)

---

## 1. Overview

**Product Name:** Idea Mashup Generator (IMG)  
**Purpose:** Generate unique, structured business ideas by combining personas, problems, technologies, formats, and business models.  
**Goal:** Build a modern, production-ready, cloud-native web app with a minimalist UX, test-driven development, and scalable architecture.

---

## 2. Objectives

- Deliver a V1 web app with robust architecture and clean UI.  
- Use TDD to ensure reliability and production readiness.  
- Implement iterative releases following the roadmap.  
- Integrate Supabase for database and authentication.  
- Use GitHub version control + CI/CD pipelines with automated tests.  
- Maintain modular, scalable code architecture for future iterations.

---

## 3. Users and Use Cases

**Primary Users:**  
Entrepreneurs, product managers, and innovators.

**Key Use Cases:**  
- Generate new ideas with structured mashups.  
- Save and manage ideas.  
- Simple filtering and organization.

---

## 4. Functional Requirements – V1 (MVP)

### Core Idea Generator  
- Combines random elements (personas, problems, technologies, business models).  
- Outputs ideas with basic structured templates.

### Basic Idea Management  
- Save and delete generated ideas.  
- Simple list view of saved ideas.

### Authentication  
- Email signup/login only (via Supabase Auth).

### UX  
- Minimalist design with 2 core screens (idea generation, saved ideas).

### Backend  
- Next.js API routes with REST endpoints.  
- Direct Supabase client integration.

### Testing  
- Unit tests for API routes and generation logic.  
- Integration tests for database operations.  
- E2E tests for core user flows.

---

## 5. Non-Functional Requirements

- **Performance:**  
  - 95th percentile response time < 800ms  
  - 99.5% uptime SLA  
  - Error rate < 1% for API calls  
- **Scalability:** Architecture supports migration to microservices at 1000+ DAU.  
- **Security:**  
  - Supabase row-level security for multi-user data  
  - Rate limiting: 100 requests/minute per user  
  - Data retention: 2 years for inactive accounts  
- **Maintainability:** Code follows TDD with 80%+ test coverage.  
- **Version Control:** GitHub with PR reviews, feature branching, and CI.  
- **Monitoring:** Error tracking, performance metrics, and user analytics.

---

## 6. Tech Stack

### Full-Stack Framework  
- Next.js 14 (App Router) – React framework with SSR and API routes.  
- TailwindCSS + Radix UI – Clean, modern UI components.  
- React Hook Form + Zod – Form validation and type safety.  
- SWR – Lightweight data fetching and caching.  
- Testing: Jest, React Testing Library, Playwright.

### Backend Integration  
- Next.js API routes – REST endpoints.  
- Supabase Client – Direct database and auth integration.  
- TypeScript – Full type safety across frontend and API.

### Database & Authentication  
- Supabase (Postgres) – Realtime DB, row-level security, and auth.

### Infrastructure  
- Hosting: Vercel (unified frontend and API deployment).  
- Database/Auth: Supabase.  
- CI/CD: GitHub Actions (build, lint, test, deploy).  
- Monitoring: Vercel Analytics + Sentry for error tracking.

---

## 7. Data Architecture

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas table
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generation elements (personas, problems, technologies, business models)
CREATE TABLE generation_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'persona', 'problem', 'technology', 'business_model'
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on ideas table
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Users can only access their own ideas
CREATE POLICY "Users can view their own ideas" ON ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas" ON ideas
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 8. API Specifications

### Core Endpoints

```typescript
// Generate a new idea
POST /api/ideas/generate
Response: {
  id: string;
  content: {
    persona: string;
    problem: string;
    technology: string;
    businessModel: string;
    generatedAt: string;
  };
}

// Get user's saved ideas
GET /api/ideas
Query params: ?limit=20&offset=0
Response: {
  ideas: Array<{
    id: string;
    content: object;
    created_at: string;
  }>;
  total: number;
}

// Save an idea
POST /api/ideas
Body: {
  content: object;
}
Response: {
  id: string;
  message: string;
}

// Delete an idea
DELETE /api/ideas/:id
Response: {
  message: string;
}

// User authentication
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/signout
```

### Error Handling

```typescript
// Standard error response format
{
  error: {
    code: string;
    message: string;
    details?: object;
  };
  timestamp: string;
}

// Common error codes
- AUTH_REQUIRED: 401
- FORBIDDEN: 403
- NOT_FOUND: 404
- RATE_LIMITED: 429
- SERVER_ERROR: 500
```

---

## 9. Security & Compliance

### Data Privacy
- **GDPR Compliance**: Users can request data export and deletion
- **Data Retention**: User data deleted after 2 years of inactivity
- **Minimal Data Collection**: Only email and generated ideas stored

### Security Measures
- **Authentication**: Supabase Auth with email verification
- **Authorization**: Row-level security for all user data
- **Rate Limiting**: 100 requests per minute per user
- **Input Validation**: All API inputs validated with Zod schemas
- **Content Security**: Basic XSS protection with Content Security Policy

### Monitoring & Compliance
- **Error Tracking**: Sentry integration for error monitoring
- **Performance**: Vercel Analytics for performance metrics
- **Audit Logs**: Database-level logging for compliance

---

## 10. Iterative Roadmap

### Release 1.0 (V1.0) - MVP  
- Basic idea generator (no scoring).  
- Save/delete ideas functionality.  
- Email authentication with Supabase.  
- Simple dashboard (Generate + Saved Ideas list).  
- TDD foundation with 80%+ test coverage.  
- GitHub Actions CI/CD pipeline.

### Release 1.1 (V1.1) - Enhanced Features  
- Idea scoring and rating system.  
- Tags and basic filtering.  
- OAuth authentication (Google, GitHub).  
- Export functionality (Markdown/CSV).  
- Advanced search capabilities.

### Release 2.0 (V2.0)  
- Trend integration (RSS/Product Hunt/Reddit).  
- User feedback loop to adjust scoring weights.  
- Export packs (one-pagers, Lean Canvas).

### Release 3.0 (V3.0)  
- User personalisation (interest-based bias).  
- Analytics dashboard (history, top ideas).  
- Pairwise idea ranking.

### Release 4.0 (V4.0)  
- Team collaboration (shared libraries, voting).  
- Advanced exports (pitch deck slides).  
- API integrations with Notion/Trello.
## 11. Testing Strategy

### Test Coverage Requirements
- **Minimum Coverage:** 80% for all code
- **Critical Path Coverage:** 95% for core business logic
- **Integration Coverage:** All API endpoints and database operations

### Testing Layers

#### Unit Tests
- **Framework:** Jest + React Testing Library
- **Scope:** Component logic, utility functions, API route handlers
- **Mocking:** External dependencies (Supabase, external APIs)

#### Integration Tests
- **Framework:** Jest with Supabase test database
- **Scope:** API routes with database operations
- **Data:** Test fixtures and factories for consistent test data

#### End-to-End Tests
- **Framework:** Playwright
- **Scope:** Critical user journeys (signup, generate idea, save idea)
- **Environment:** Staging environment with test data

#### Performance Tests
- **Tool:** Artillery.js for load testing
- **Targets:** API response times under load
- **Thresholds:** 95th percentile < 800ms with 100 concurrent users

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
on: [push, pull_request]
jobs:
  test:
    - Run unit tests with coverage
    - Run integration tests
    - Run linting and type checking
    - Performance regression tests
  e2e:
    - Deploy to preview environment
    - Run Playwright tests
    - Generate test reports
  deploy:
    - Deploy to production (main branch only)
    - Run smoke tests post-deployment
```

### Test Data Management
- **Development:** Seeded test data for consistent development
- **Testing:** Factory functions for generating test scenarios
- **Staging:** Anonymized production-like data
- **Production:** Real user data with privacy protection


