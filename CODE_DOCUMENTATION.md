# GreenBid RFP App - Code Documentation Summary

This document is your quick reference for understanding the app structure and preparing for database integration.

## Key Facts

✅ **100% UI Complete** - All pages and workflows are built and functional with mock data
✅ **Clean Architecture** - Routes separated by role (buyer/supplier), components organized by feature
✅ **Mock Data Ready** - All data is in `/lib/mock-*.ts` files - easy to replace with API calls
✅ **Types Defined** - Full TypeScript types in `/types/` - can be used as DB schema reference
✅ **No Auth Yet** - Currently using mock user - add Auth.js or similar for production

## Quick Start for Gemini Integration

When you copy this ZIP and ask Gemini to add a database:

1. **Start with ARCHITECTURE.md** - Gives complete system overview
2. **Review DATABASE_INTEGRATION.md** - Step-by-step integration guide
3. **Check /types/*.ts** - Your database schema source of truth
4. **Look at /lib/mock-*.ts** - Current data structure and how to replace with API

## File Organization

```
✅ CLEAN SEPARATION:
   /app/buyer/*       - All buyer pages (RFP creation, evaluation, etc.)
   /app/supplier/*    - All supplier pages (browse RFPs, submit, etc.)
   /components/       - Shared UI components (used by both)
   /lib/              - Utilities and mock data
   /types/            - TypeScript definitions
```

## Most Important Files to Understand

### For Database Integration:
1. **ARCHITECTURE.md** - Read this first (complete system map)
2. **DATABASE_INTEGRATION.md** - Step-by-step backend integration guide
3. **/types/rfp.ts** - RFP, Evaluation, Criteria types
4. **/lib/mock-rfp-lifecycle.ts** - Mock evaluation data structure

### For Understanding UI Flows:
1. **EvaluationTab.tsx** - Most complex component (scoring and ranking)
2. **/app/buyer/tenders/[id]/manage** - Tender management page
3. **DashboardShell.tsx** - Layout and navigation

### For Understanding Data:
1. **/types/index.ts** - All type exports
2. **/lib/mock-rfp-lifecycle.ts** - Evaluation and scoring data
3. **/lib/mock-suppliers.ts** - Supplier data

## The 5 RFP Lifecycle Stages

Buyers follow this workflow (all built and working):

1. **Template** - Select/customize RFP template with criteria
2. **Recipients** - Choose suppliers to send to
3. **Submissions** - View incoming responses (supplier submissions)
4. **Evaluation** - Score responses using table-based form + compare/rank view
5. **Award** - Make final decision and notify supplier

See `/components/rfp/lifecycle/` for the UI components.

## Key Design Decisions (Copy with as-is to Gemini)

1. **Transposed Comparison Table** (Option A)
   - Criteria as rows, suppliers as columns
   - Fits on screen without horizontal scroll
   - Best scores highlighted in green
   
2. **Expandable Supplier Header** (Evaluate Tab)
   - Shows selected supplier as main heading
   - Click to expand and see all suppliers
   - Shows completion status and weighted score

3. **Fixed-Size Settings Modal**
   - 1000px × 680px to prevent resizing
   - Fits all content including Company section with 2-column grid

4. **Mock Data Centralized**
   - All in `/lib/mock-*.ts`
   - Easy to replace with API calls
   - No embedded data in components

## What Still Needs to Be Done

1. **Database Setup** - Create tables for all types
2. **Authentication** - Add login/signup with role separation
3. **API Routes** - Create `/app/api/*` endpoints
4. **Error Handling** - Add error boundaries and validation
5. **Loading States** - Add skeletons/spinners while fetching

## Structure is Already Perfect For

- Replacing mock data with API calls
- Adding authentication and authorization
- Scaling to multiple users and organizations
- Adding real-time features (WebSockets for chat/notifications)
- Mobile responsiveness (Tailwind is already mobile-first)

## When Asking Gemini to Integrate Database

Say something like:

> "I have a complete Next.js 16 RFP platform that's 100% UI-complete with mock data. I need you to:
> 
> 1. Create a Supabase database schema based on the types in /types/
> 2. Create API routes in /app/api/ to replace the mock data in /lib/mock-*.ts
> 3. Add authentication and route protection
> 4. Update components to fetch from the API instead of mock files
> 
> The app has two main user roles: buyers and suppliers (routes separated by /buyer/* and /supplier/*).
> Start with the RFP evaluation system - that's the most complex part.
> 
> Here's the architecture document: [ARCHITECTURE.md]"

## Testing After Integration

1. Create user account as buyer
2. Create an RFP with criteria
3. Send to supplier
4. Login as supplier and view RFP
5. Submit response
6. Login back as buyer and evaluate
7. Test scoring and comparison table
8. Make award decision
9. Verify notifications sent to supplier

## File Size & Complexity

- Total TypeScript files: ~80
- Total lines of code: ~30,000+
- Largest component: EvaluationTab.tsx (~800 lines, but well-commented)
- All components use React hooks and Tailwind CSS
- No complex state management (could add Redux/Zustand later)

## One Final Note

The current codebase is **production-ready UI** but **development-mode data**. Everything from routes to components to types is production-quality and well-organized. You're just replacing the data layer (mock → database) and adding authentication.

The buyer and supplier routes are **already properly separated**. Don't restructure them - this is exactly what you want.

---

**Ready to share with Gemini?** → Zip the entire project and add ARCHITECTURE.md + DATABASE_INTEGRATION.md to this README
