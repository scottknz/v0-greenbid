# Database Integration Guide

This guide explains how to connect the GreenBid RFP app to a backend database using Gemini or another LLM.

## Current State

The app is **100% UI-complete** with mock data. All data is currently in `/lib/mock-*.ts` files:

- `mock-rfp-lifecycle.ts` - RFP responses, evaluations, criteria, rankings
- `mock-rfp.ts` - RFP documents and templates
- `mock-suppliers.ts` - Supplier profiles
- `mock-directory-suppliers.ts` - Supplier directory for search
- `mock-marketplace.ts` - Marketplace listings
- `mock-messages.ts` - Messaging data
- `mock-notifications.ts` - Notifications
- `mock-activity.ts` - Activity logs
- `mock-approvals.ts` - Approval workflows
- `mock-team.ts` - Team members
- `mock-library.ts` - Document library

## What You Need to Do

### 1. Set Up Database
Create tables matching the TypeScript types in `/types/`:

**Core Tables:**
```sql
-- Users and authentication
users
  id, email, password_hash, first_name, last_name, role ('buyer'|'supplier'), created_at

-- Organizations
organizations
  id, name, type ('buyer'|'supplier'|'both'), industry, created_at

-- RFP Management
rfps
  id, title, description, created_by (user_id), organization_id, template_data, status, created_at

criteria
  id, rfp_id, name, description, weight, max_score, rubric, order, created_at

-- Supplier Management
suppliers
  id, name, company_logo, industry, verified, rating, contact_info, created_at

-- RFP Instances (when an RFP is sent to suppliers)
tenders
  id, rfp_id, organization_id, status, created_at, sent_date

tender_recipients
  id, tender_id, supplier_id, status ('pending'|'submitted'|'declined'), created_at

-- Responses and Evaluations
responses
  id, tender_id, supplier_id, submitted_by, submitted_at, status, price_data (JSON), question_answers (JSON)

evaluations
  id, tender_id, response_id, evaluator_id, status ('draft'|'finalized'), overall_score, created_at

evaluation_scores
  id, evaluation_id, criteria_id, score, max_score, comment, is_finalized, created_at

-- Approvals
approvals
  id, tender_id, approver_id, status ('pending'|'approved'|'rejected'), notes, created_at

-- Messaging
messages
  id, sender_id, recipient_id, tender_id, content, created_at

-- Activity Log
activity
  id, organization_id, user_id, action, entity_type, entity_id, created_at

-- Library/Documents
documents
  id, organization_id, name, url, type, created_by, created_at
```

### 2. Create API Routes

Create API endpoints in `/app/api/` to replace mock data:

```
/app/api/
├── /rfp
│   ├── route.ts
│   │   GET /api/rfp - Get all RFPs for user's organization
│   │   POST /api/rfp - Create new RFP
│   ├── /[id]
│   │   GET /api/rfp/[id] - Get RFP details
│   │   PUT /api/rfp/[id] - Update RFP
│   │   DELETE /api/rfp/[id] - Delete RFP
│   ├── /[id]/criteria route.ts
│   │   GET /api/rfp/[id]/criteria - Get scoring criteria
│   ├── /[id]/tender route.ts
│   │   POST /api/rfp/[id]/tender - Create tender (send RFP to suppliers)
│   ├── /[id]/responses route.ts
│   │   GET /api/rfp/[id]/responses - Get supplier responses
│   └── /[id]/evaluations route.ts
│       GET /api/rfp/[id]/evaluations - Get evaluations
│       POST /api/rfp/[id]/evaluations - Create/update evaluation
│
├── /suppliers
│   ├── route.ts
│   │   GET /api/suppliers - Get all suppliers (for directory)
│   │   POST /api/suppliers - Create supplier
│   └── /[id] route.ts
│       GET /api/suppliers/[id] - Get supplier details
│
├── /responses
│   ├── route.ts
│   │   POST /api/responses - Submit RFP response
│   └── /[id] route.ts
│       GET /api/responses/[id] - Get response details
│
├── /approvals
│   ├── route.ts
│   │   GET /api/approvals - Get pending approvals
│   │   POST /api/approvals - Create approval request
│   └── /[id] route.ts
│       PUT /api/approvals/[id] - Approve/reject
│
├── /messages
│   ├── route.ts
│   │   GET /api/messages - Get messages
│   │   POST /api/messages - Send message
│   └── /[id] route.ts
│       GET /api/messages/[id] - Get message thread
│
└── /auth
    ├── /register route.ts - User registration
    ├── /login route.ts - User login
    ├── /logout route.ts - User logout
    └── /me route.ts - Get current user
```

### 3. Update Components to Fetch from API

**Example: Replace mock data import**

```typescript
// OLD (with mock data)
import { mockRFPs } from '@/lib/mock-rfp';

export function RFPList() {
  const [rfps] = useState(mockRFPs);
  return rfps.map(rfp => <div>{rfp.title}</div>);
}
```

```typescript
// NEW (with API)
import { useQuery } from '@tanstack/react-query';

export function RFPList() {
  const { data: rfps = [] } = useQuery({
    queryKey: ['rfps'],
    queryFn: () => fetch('/api/rfp').then(r => r.json())
  });
  return rfps.map(rfp => <div>{rfp.title}</div>);
}
```

### 4. Add Authentication

Protect routes and verify user permissions:

```typescript
// /app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const pathname = request.nextUrl.pathname;

  // Redirect unauthenticated users to login
  if (!token && (pathname.startsWith('/buyer') || pathname.startsWith('/supplier'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/buyer/:path*', '/supplier/:path*'],
};
```

### 5. Key Components to Update

**Priority Order:**

1. **EvaluationTab.tsx** - Replace mock evaluations with API calls
   - `GET /api/rfp/[id]/evaluations` - Fetch evaluations
   - `POST /api/rfp/[id]/evaluations` - Save score
   - `POST /api/rfp/[id]/evaluations/[evalId]/finalize` - Finalize evaluation

2. **RFP Lifecycle Pages** - Update all tab components
   - Template tab: `GET /api/rfp/[id]`
   - Recipients tab: `GET /api/suppliers`, `POST /api/rfp/[id]/tender`
   - Submissions tab: `GET /api/rfp/[id]/responses`
   - Award tab: `POST /api/award`

3. **Supplier RFP Browse** - List available RFPs
   - `GET /api/rfp?status=published`

4. **Supplier Directory** - List suppliers
   - `GET /api/suppliers?search=...&industry=...`

5. **Settings Modal** - Save user preferences
   - `POST /api/user/profile`
   - `POST /api/organization`

## File Structure After Integration

```
/app
├── /api                    # NEW - Backend routes
│   ├── /rfp
│   ├── /suppliers
│   ├── /responses
│   ├── /evaluations
│   ├── /auth
│   └── ...
├── /buyer
├── /supplier
└── middleware.ts           # NEW - Auth middleware

/components                 # No major changes
├── /rfp/lifecycle
│   └── EvaluationTab.tsx   # UPDATED - Use useQuery instead of mock data
└── ...

/lib
├── mock-*.ts              # KEEP or DELETE (optional reference)
└── api-client.ts          # NEW - Optional: centralized API calls

/types                      # KEEP - Types remain same structure
```

## Migration Steps

1. **Phase 1: Database + Auth**
   - Create database tables
   - Set up authentication
   - Add middleware protection

2. **Phase 2: API Routes**
   - Create `/api/rfp/*` routes
   - Create `/api/suppliers/*` routes
   - Test with Postman/Thunder Client

3. **Phase 3: Components**
   - Update EvaluationTab first (most complex)
   - Update RFP lifecycle pages
   - Update Supplier pages
   - Test end-to-end workflows

4. **Phase 4: Polish**
   - Add error handling
   - Add loading states
   - Add toast notifications
   - Remove mock data files (optional)

## Example API Response Formats

### GET /api/rfp/[id]/evaluations

```json
{
  "evaluations": [
    {
      "id": "eval-001",
      "responseId": "resp-001",
      "supplierName": "EcoSolutions Ltd",
      "percentageScore": 85,
      "status": "finalized",
      "scores": [
        {
          "id": "score-001",
          "criteriaId": "crit-001",
          "score": 9,
          "maxScore": 10,
          "comment": "Excellent environmental practices",
          "isFinalized": true
        }
      ]
    }
  ]
}
```

### POST /api/rfp/[id]/evaluations

```json
{
  "responseId": "resp-001",
  "scores": [
    {
      "criteriaId": "crit-001",
      "score": 9,
      "comment": "Excellent environmental practices"
    }
  ]
}

// Response:
{
  "id": "eval-001",
  "status": "draft",
  "message": "Scores saved successfully"
}
```

## Testing the Integration

1. **Test API Routes**
   ```bash
   curl http://localhost:3000/api/rfp
   curl -X POST http://localhost:3000/api/rfp -d '{"title":"New RFP"}'
   ```

2. **Test Components**
   - Check Network tab in DevTools to see API calls
   - Verify data displays correctly
   - Test all workflows end-to-end

3. **Test Authentication**
   - Ensure unauthenticated users redirected to login
   - Verify buyers can't access supplier routes
   - Verify suppliers can't access buyer routes

## Questions for Gemini / LLM

When providing this codebase to an LLM for database integration:

1. "This app is 100% UI-complete. I want you to create the backend API routes and database schema."
2. "Here's the TypeScript type structure in `/types`. Use these as your database schema reference."
3. "The app has mock data in `/lib/mock-*.ts`. I want you to replace these with API calls to actual endpoints."
4. "Please add authentication and route protection using Auth.js or similar."
5. "Make sure buyer and supplier routes are properly separated and protected."

## Common Gotchas

1. **CORS Issues** - Configure CORS in Next.js if backend is separate server
2. **Session Management** - Use HTTP-only cookies, not localStorage
3. **Permissions** - Always verify user belongs to organization before allowing access
4. **Weighted Scoring** - Calculation: (score/maxScore) × weight - done in frontend, but verify on backend
5. **File Uploads** - For attachments/documents, consider using cloud storage (Vercel Blob, AWS S3, etc.)

## Support

- Check ARCHITECTURE.md for detailed component descriptions
- Review TypeScript types in `/types/` for data structure
- Look at current component implementations for patterns
