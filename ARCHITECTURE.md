# GreenBid RFP Platform - Architecture Documentation

## Overview

This is a Next.js 16 web application for managing RFP (Request for Proposal) processes between Buyers and Suppliers. The app is built with TypeScript, React 19, Tailwind CSS, and shadcn/ui components.

**Key Users:**
- **Buyers**: Create RFPs, send to suppliers, evaluate responses, manage approvals
- **Suppliers**: Browse available RFPs, submit proposals, track responses

---

## Folder Structure

```
/app                          # Next.js App Router - contains all routes and pages
├── /buyer                    # Buyer-side routes and pages (authenticated buyer users)
│   ├── /rfp                  # RFP lifecycle: create, edit, preview, view
│   ├── /tenders              # Tender management and evaluation
│   ├── /suppliers            # Supplier management and directory
│   ├── /approvals            # Approval workflows
│   ├── /marketplace          # Marketplace features
│   ├── /activity             # Activity tracking
│   ├── /messages             # Messaging
│   ├── /team                 # Team management
│   ├── /library              # Document library
│   └── layout.tsx            # Buyer shell layout
└── /supplier                 # Supplier-side routes and pages (authenticated supplier users)
    ├── /rfps                 # Browse and respond to RFPs
    ├── /marketplace          # Marketplace features
    ├── /activity             # Activity tracking
    ├── /messages             # Messaging
    ├── /team                 # Team management
    ├── /library              # Document library
    └── layout.tsx            # Supplier shell layout

/components                   # Reusable React components
├── /ui                       # Base UI primitives (shadcn/ui components)
│                             # Examples: Button, Dialog, Card, Input, etc.
├── /shell                    # Layout shells used by both buyer and supplier
│   ├── DashboardShell.tsx    # Main dashboard layout wrapper
│   ├── Sidebar.tsx           # Navigation sidebar (role-aware routing)
│   ├── ShellWrapper.tsx      # High-order component for layout
│   ├── NotificationBell.tsx  # Notifications UI
│   └── ShellContext.tsx      # Shell state management (context)
├── /shared                   # Shared utility components
│   ├── PageHeader.tsx        # Page title/header component
│   ├── FilterBar.tsx         # Table filtering UI
│   └── TableWrapper.tsx      # Table layout wrapper
├── /rfp                      # RFP domain components
│   ├── /lifecycle            # RFP lifecycle stages
│   │   ├── TemplateTab.tsx   # Template selection and editing
│   │   ├── RecipientsTab.tsx # Recipient selection and sending
│   │   ├── SubmissionsTab.tsx# View incoming submissions
│   │   ├── EvaluationTab.tsx # Evaluate and rank responses (transposed comparison table)
│   │   └── AwardTab.tsx      # Award decisions and notifications
│   └── /components           # RFP sub-components
├── /suppliers                # Supplier management (buyer-specific)
│   ├── SupplierDirectory.tsx # Browse and manage suppliers
│   ├── SupplierCard.tsx      # Supplier profile card
│   └── SupplierFilters.tsx   # Filter suppliers
├── /settings                 # Settings modal (both buyer and supplier)
│   └── SettingsModal.tsx     # User and organization settings
├── /approval                 # Approval workflow components
│   ├── ApprovalRequestModal.tsx # Reusable modal for sending approvals (buyer & supplier)
│   ├── ApprovalStatus.tsx      # Display approval request details and status
│   └── ApprovalActions.tsx     # Approve/Reject buttons (used in message center)
├── /library                  # Document library components
├── /team                     # Team management components
├── /dashboard                # Dashboard components
├── /marketplace              # Marketplace components
├── /proposal                 # Proposal/response components
└── theme-provider.tsx        # Theme configuration for Tailwind

/types                        # TypeScript type definitions
├── rfp.ts                    # RFP-related types
├── supplier.ts               # Supplier-related types
├── buyer.ts                  # Buyer-related types
├── response.ts               # Response/submission types
├── evaluation.ts             # Evaluation and scoring types
├── tender.ts                 # Tender-specific types
├── user.ts                   # User/auth types
└── index.ts                  # Type exports

/lib                          # Utility functions and helpers
├── mock-rfps.ts              # Mock RFP data
├── mock-suppliers.ts         # Mock supplier data
├── mock-responses.ts         # Mock response/submission data
├── mock-evaluations.ts       # Mock evaluation and scoring data
├── mock-tenders.ts           # Mock tender data
├── utils.ts                  # General utilities (formatting, calculations)
├── auth.ts                   # Authentication logic (placeholder)
└── constants.ts              # App constants and configurations

/public                       # Static assets
├── images/
└── [other assets]

/styles                       # Global styles
└── globals.css               # Tailwind CSS + design tokens

next.config.js                # Next.js configuration
package.json                  # Dependencies and scripts
tsconfig.json                 # TypeScript configuration
tailwind.config.js            # Tailwind CSS theming (v4 inline themes)
```

---

## Data Flow

### 1. Authentication (Not fully implemented yet)
- All routes under `/buyer` and `/supplier` require authentication
- Currently using mock user context
- Types: `User`, `Role` ("buyer" | "supplier")

### 2. Mock Data Strategy
All data is currently mock data stored in `/lib/mock-*.ts` files:

```
Mock Data Files → Imported in components → Filtered/sorted in state → Displayed in UI
```

**When integrating with a database:**
1. Replace mock data imports with API calls
2. Use React Query/SWR for data fetching and caching
3. Create API routes in `/app/api/` for backend endpoints
4. Update components to fetch from `/api/*` instead of local mock files

**Current Mock Data Structure:**
- `mock-rfps.ts` - RFP documents with templates, recipients, status
- `mock-suppliers.ts` - Supplier profiles and company info
- `mock-responses.ts` - RFP responses/submissions from suppliers
- `mock-evaluations.ts` - Scoring and evaluation data
- `mock-tenders.ts` - Tender records (RFP instances)

### 3. Component Usage Patterns

#### Buyer RFP Creation Flow:
```
/buyer/rfp/create
  → RFPCreatePage
    → EvaluationTab (or other lifecycle tabs)
      → Uses mock-rfps.ts data
      → Updates state locally
      → (When DB integrated: POST /api/rfp)
```

#### Buyer RFP Evaluation Flow:
```
/buyer/tenders/[id]/manage
  → ManageRFPPage
    → EvaluationTab
      → Displays evaluations from mock-evaluations.ts
      → Allows scoring suppliers
      → Shows compare & rank view (transposed criteria table)
```

#### Supplier RFP Browse Flow:
```
/supplier/rfps
  → SupplierRFPsPage
    → Lists RFPs from mock-rfps.ts
    → Supplier can respond to RFP
    → (When DB integrated: POST /api/response)
```

---

## Key Features & Components

### 1. RFP Lifecycle (Buyer-side)

**5 Stages:**
1. **Template** - Select/customize RFP template with criteria and weights
2. **Recipients** - Choose suppliers to send RFP to
3. **Submissions** - View incoming responses from suppliers
4. **Evaluation** - Score and evaluate responses
   - Table-based scoring form with inline comments
   - Expandable supplier header showing all suppliers and completion status
   - Weighted score calculation per supplier
5. **Award** - Make final selections and notify suppliers

**Components:** `/components/rfp/lifecycle/*.tsx`

### 3. Approval Workflows (New)

**Buyer-side Approval (RFP Publication):**
- RFP must be approved by internal team members before publication
- Triggered from tender details page via "Send for Approval" button
- Uses `ApprovalRequestModal` component with fixed width and single-column layout
- Approval request sent as private message thread to approvers
- Form locks with "Waiting for Approval" badge until approval granted
- Approvers see "Approvals" tab in message center with action buttons

**Supplier-side Approval (Proposal Submission):**
- Proposal must be approved by team before submitting to client
- Triggered from RFP details page (in "under_final_review" phase)
- Smart "Progress Proposal" button navigates to incomplete sections or sends for approval
- Same `ApprovalRequestModal` component (reusable design)
- Approval notifications sent to team members in message center
- New "Approvals" tab shows approval status and history

**Message Center Integration:**
- Approval requests appear as private message threads
- Each thread includes `approvalData` metadata (approvalId, itemId, itemTitle, status)
- Approval Actions banner displays at top with status and approve/reject buttons
- Users can approve/reject directly from message center without navigating to main page
- Status updates immediately in thread and propagates to Approvals tab

**Components:** 
- `/components/approval/ApprovalRequestModal.tsx` - Reusable modal for both sides
- `/components/approval/ApprovalStatus.tsx` - Display approval details
- `/components/approval/ApprovalActions.tsx` - Message center approve/reject interface

### 4. Supplier RFP Response Workflow (New)

**Phases:**
1. **Preparation** - Complete questionnaire and upload documents
   - Smart button checks completion and navigates to incomplete tab
   - Only advances when both questionnaire and documents are complete
2. **Internal Review** - Send for team approval
   - Uses `ApprovalRequestModal` to select approvers
   - Proposal locked until approval received
3. **Submitted** - Proposal submitted to client
4. **Client Reviewing** - Client evaluating proposal
5. **Awarded/Rejected** - Final outcome

**Components:** `/app/supplier/rfps/[id]/page.tsx` with lifecycle state management

### 3. Evaluation & Scoring (Buyer-side)

**Evaluation Tab Features:**
- **Expandable Supplier Header** - Shows selected supplier as main heading, collapses when expanded to show all suppliers with progress
- **Table-based Scoring Form** - Criteria as rows, score columns
  - Inline sliders for scoring (0-10 or custom max)
  - Expandable comment boxes for notes
  - Auto-save on blur
  - Visual checkmarks for saved scores
  - Weighted score calculation: (score/maxScore) × criteriaWeight

**Compare & Rank Tab Features (NEW - Option A):**
- **Transposed Comparison Table** - Criteria as rows, suppliers as columns
  - Supplier selector to choose 2-4 suppliers to compare (defaults to top 3)
  - Best scores highlighted in green
  - Summary rows: Overall Score, Total Price, Recommendation
  - Visual progress bars for each score
  - No redundant Score Breakdown section

**Component:** `/components/rfp/lifecycle/EvaluationTab.tsx`

### 3. Tender Management (Buyer-side)

A "Tender" represents an instance of an RFP sent to specific suppliers.

**Path:** `/buyer/tenders/[id]/manage`

**Features:**
- View RFP submissions
- Evaluate responses
- Track tender status
- Award decisions

**Components:** `/components/rfp/lifecycle/*.tsx`

### 4. Supplier Directory (Buyer-side)

Browse and manage supplier contacts and profiles.

**Path:** `/buyer/suppliers`

**Components:** `/components/suppliers/*.tsx`

### 5. Settings (Both buyer and supplier)

Modal-based settings interface for:
- User profile settings
- Company/organization info
- Security and password
- Notifications preferences
- Account management

**Features:**
- Fixed size (1000px × 680px) to accommodate widest content without resizing
- Tab-based navigation (Design, Rules, Vars, Settings)
- Edit mode for editable sections

**Component:** `/components/settings/SettingsModal.tsx`

---

## Data Types

All TypeScript types are defined in `/types/*.ts`:

- **RFP** - Request for Proposal document
- **Tender** - Instance of RFP sent to specific suppliers
- **Supplier** - Supplier company profile
- **Response** - RFP response/submission from supplier
- **Evaluation** - Score and evaluation data
- **Criterion** - Individual scoring criterion with weight and rubric
- **User** - User profile and role

See `/types/index.ts` for full type exports.

---

## Design System

### Colors
- Primary: `brand-green` (#10b981)
- Neutrals: `text-primary`, `text-secondary`, `text-muted` (defined as CSS variables)
- Surfaces: `background`, `surface`, `surface-hover`

### Typography
- Headings: Uses default sans font
- Body: Uses default sans font
- Monospace: Available for technical content

### Components
All UI components use shadcn/ui with Tailwind CSS styling.

See `/styles/globals.css` for design token definitions.

---

## Integration Points (For Database Connection)

When integrating with a backend database (using Gemini or another tool):

### 1. Create API Routes (`/app/api/`)
```
/app/api
├── /rfp
│   ├── route.ts (GET all RFPs, POST create)
│   └── /[id]
│       ├── route.ts (GET, PUT, DELETE)
│       └── /responses route.ts (GET responses)
├── /suppliers route.ts (GET all suppliers)
├── /responses route.ts (POST submit response)
├── /evaluations route.ts (GET, POST evaluations)
└── /tenders route.ts (GET, POST tenders)
```

### 2. Replace Mock Data with API Calls
```typescript
// Old (in components):
import { mockRFPs } from '@/lib/mock-rfps'
const rfps = mockRFPs

// New (in components):
import { useQuery } from '@tanstack/react-query'
const { data: rfps } = useQuery({
  queryKey: ['rfps'],
  queryFn: () => fetch('/api/rfp').then(r => r.json())
})
```

### 3. Database Schema
Map the mock data structure to your database:

**Tables needed:**
- `users` - User profiles and authentication
- `rfps` - RFP documents
- `criteria` - Scoring criteria
- `suppliers` - Supplier profiles
- `tenders` - RFP instances (RFP sent to specific suppliers)
- `responses` - Supplier responses/submissions
- `evaluations` - Evaluation scores and comments
- `approvals` - Approval workflow data

### 4. Authentication
- Replace mock auth with real session management
- Use Auth.js or similar for session handling
- Add middleware to protect `/buyer` and `/supplier` routes
- Redirect to login for unauthenticated users

---

## Key Files to Update for Database Integration

1. **Mock Data Files** - Replace with API imports
   - `/lib/mock-*.ts` → API calls
   
2. **Component State** - Change from local state to server state
   - Use React Query or SWR for caching
   - Replace `useState` with `useQuery`

3. **API Endpoints** - Create new routes
   - `/app/api/rfp`, `/app/api/responses`, etc.

4. **Authentication** - Add real session management
   - Middleware for route protection
   - User role-based access control

5. **Types** - Add optional fields for server data
   - Add `id`, `createdAt`, `updatedAt` timestamps
   - Add `userId` foreign keys

---

## Running the App

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and navigate to `/buyer` or `/supplier` routes.

---

## Notes for AI/LLM Integration

**Context for Gemini or similar tools:**

1. **Routes are already separated** - `/app/buyer/*` and `/app/supplier/*` - don't need restructuring
2. **Mock data is centralized** - All in `/lib/mock-*.ts` - easy to replace with DB queries
3. **Types are defined** - All in `/types/*.ts` - use as schema reference
4. **Components are organized** - By feature/domain - each file has a clear responsibility
5. **No authentication yet** - Currently mock user - add Auth.js or similar
6. **UI is complete** - All components built - focus on data layer

**Priority for database integration:**
1. Create Supabase (or similar) tables matching the types
2. Create API routes in `/app/api/`
3. Replace mock imports with API calls
4. Add authentication middleware
5. Test all workflows end-to-end
