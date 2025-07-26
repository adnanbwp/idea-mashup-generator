# Idea Mashup Generator (IMG)

A modern, production-ready web application that generates unique business ideas by combining personas, problems, technologies, formats, and business models. Built with Next.js 14, TypeScript, TailwindCSS, and Supabase.

## 🚀 Features

- **Idea Generation**: Combines random elements from curated lists to create structured business ideas
- **Idea Management**: Save, view, and delete generated ideas
- **Authentication**: Email-based authentication via Supabase Auth
- **Responsive Design**: Modern UI built with TailwindCSS and Radix UI components
- **Type-Safe**: Full TypeScript implementation with strict type checking
- **Test Coverage**: Comprehensive unit, integration, and E2E tests
- **Production Ready**: CI/CD pipeline, error handling, and performance optimizations

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with SSR
- **TypeScript** - Type safety and better DX
- **TailwindCSS + Radix UI** - Modern, accessible UI components
- **SWR** - Data fetching and caching

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - Database, authentication, and real-time features
- **Postgres** - Relational database with JSONB support

### Testing & Development
- **Jest** - Unit and integration testing
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing
- **GitHub Actions** - CI/CD pipeline

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd idea-mashup-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

4. **Set up the database**
   
   Run the SQL commands from `src/lib/database.sql` in your Supabase SQL editor to create the required tables and policies.

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

### Unit and Integration Tests
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

### End-to-End Tests
```bash
npm run test:e2e      # Run Playwright tests
```

### Type Checking
```bash
npm run type-check    # Check TypeScript types
```

### Linting
```bash
npm run lint          # Run ESLint
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication routes
│   │   └── ideas/         # Idea management routes
│   ├── saved/             # Saved ideas page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── idea-card.tsx     # Idea display component
│   ├── idea-generator.tsx # Idea generation component
│   ├── saved-ideas.tsx   # Saved ideas list component
│   └── navigation.tsx    # Navigation component
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── generator.ts     # Core idea generation logic
│   ├── seed-data.ts     # Seed data definitions
│   ├── supabase.ts      # Supabase client configuration
│   └── utils.ts         # General utilities
└── types/               # TypeScript type definitions
    └── index.ts
```

## 🎯 API Endpoints

### Idea Generation
- `POST /api/ideas/generate` - Generate a new random idea
- `GET /api/ideas` - Get user's saved ideas (paginated)
- `POST /api/ideas` - Save an idea
- `DELETE /api/ideas/:id` - Delete an idea

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

## 📊 Database Schema

### Tables
- **users**: User accounts (managed by Supabase Auth)
- **ideas**: Saved user ideas with JSONB content
- **generation_elements**: Categorized elements for idea generation

### Security
- Row Level Security (RLS) policies ensure users can only access their own data
- API routes include authentication middleware
- Input validation with Zod schemas

## 🚀 Deployment

The application is designed to be deployed on Vercel with Supabase:

1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set environment variables in Vercel dashboard**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

3. **Database setup**
   - Run the database schema from `src/lib/database.sql`
   - Run the seed script: `npm run seed`

## 🔧 Development Commands

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run linter
npm run test          # Run tests
npm run test:e2e      # Run E2E tests
npm run type-check    # Check TypeScript
npm run seed          # Seed database
```

## 📈 Performance

The application is optimized for performance:
- **95th percentile response time**: <800ms
- **Static generation** for marketing pages
- **SWR caching** for API responses
- **Optimized builds** with Next.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.