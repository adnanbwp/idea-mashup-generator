# Known Issues & Bugs

This file tracks known issues, bugs, and technical debt in the project.

## Critical Issues

### 🔴 CI/Deployment Race Condition
**Status:** Open  
**Priority:** Critical  
**Discovered:** 2025-07-26  

**Issue:** Vercel production deployments run in parallel with GitHub Actions CI, completing before all CI workflow jobs finish. This creates a risk of deploying unverified code to production.

**Impact:** 
- Failed CI tests don't prevent production deployment
- Broken code can reach production users
- Violates deployment best practices

**Evidence:**
- GitHub Actions CI workflow runs comprehensive tests (unit, lint, type-check, build, E2E)
- Vercel deployments API shows production deployments occurring simultaneously with failed CI runs
- Recent workflow runs show multiple failures while Vercel deployments continue

**Recommended Fix:**
1. Disable automatic deployments in Vercel dashboard
2. Add deployment step to CI workflow after all tests pass:
   ```yaml
   deploy:
     runs-on: ubuntu-latest
     needs: [test, e2e]
     if: github.ref == 'refs/heads/main'
     steps:
       - name: Deploy to Vercel
         run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
   ```

---

## Resolved Issues

### ✅ E2E Test Navigation Button Strict Mode Violation  
**Status:** Fixed  
**Priority:** High  
**Discovered:** 2025-07-26  
**Fixed:** 2025-07-26 (commit adbe73b)

**Issue:** E2E test "should show navigation between pages" was failing with strict mode violations because it couldn't find navigation buttons using `getByRole('button')` selectors.

**Root Cause:**
- Test expected buttons with roles 'Generate' and 'Saved Ideas'
- Actual implementation uses Next.js Link components wrapping Button components
- Links have the accessible role, not the wrapped buttons
- Navigation timing wasn't properly handled in tests

**Fix:** 
- Changed selectors from `getByRole('button', { name: '...' })` to `getByRole('link', { name: '...' })`
- Added `waitForURL()` calls to handle navigation timing properly
- Tests now pass across all browsers (Chromium, Firefox, WebKit)

### ✅ E2E Test Authentication State Handling
**Status:** Fixed  
**Priority:** Medium  
**Discovered:** 2025-07-26  
**Fixed:** 2025-07-26 (commit f7ae153)

**Issue:** E2E test for saved ideas page was failing because it expected exact text "You haven't saved any ideas yet" but the component shows different messages based on authentication state.

**Root Cause:**
- Component shows "Please sign in to view your saved ideas" when unauthenticated
- Component shows "You haven't saved any ideas yet. Generate some ideas to get started!" when authenticated but no ideas
- E2E tests run without authentication setup

**Fix:** Updated test to use Playwright's `.or()` method to check for either message, making it robust for both states.

---

## Technical Debt

### Authentication in E2E Tests
**Priority:** Low  
**Issue:** E2E tests don't set up authentication, limiting test coverage of authenticated user flows.

**Recommendation:** Add authentication setup to E2E tests to test complete user workflows.

---

## How to Report Issues

1. Add new issues to this file under appropriate priority section
2. Include: Status, Priority, Discovery date, Impact, Root cause, Recommended fix
3. Move to "Resolved Issues" section when fixed
4. Reference commit hashes for fixes