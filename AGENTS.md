Core Architecture Principles

This project is built for:

High performance
Excellent SEO
Scalability
Minimal client-side JavaScript
Clean separation between server and client logic
Fast initial page loads
Maintainable component architecture

The application should prioritize server rendering and progressive enhancement wherever possible.

Server Components First (Default)

All components must be Server Components by default.

Use Server Components for:

Pages and layouts
Data fetching
Database queries
API integration
SEO-critical content
Static rendering
Dynamic server-rendered content
Authentication/session checks
Expensive computation
Caching and revalidation logic
Rule

If a component does not require browser interactivity, it must remain a Server Component.

Client Components ("use client") Rules

Use "use client" only when browser-side interactivity is required.

Valid Use Cases

Client Components are allowed for:

Form interactions
Input state management
Button click handlers
Modals and dialogs
Dropdowns and popovers
Animations
Real-time UI updates
Browser-only APIs
Complex interactive state
Strict Restrictions

Do NOT:

Add "use client" to entire pages or layouts
Convert large component trees into client components
Fetch primary page data inside useEffect
Use client components for static content
Hydrate content unnecessarily
Move server logic into the browser

Client Components should remain small, isolated, and interaction-focused.

Rendering Strategy
Prefer Server Rendering

Always prioritize:

SSR (Server-Side Rendering)
Static rendering
Streaming
Incremental rendering
Cached server responses

Avoid client-side rendering unless required for UX.

Data Fetching Rules
Preferred

Fetch data:

In Server Components
In route handlers
On the server layer
Before rendering UI
Avoid

Do NOT:

Fetch critical page data in useEffect
Render loading shells for SEO-critical pages
Depend on client hydration for initial content
Delay meaningful content until JavaScript loads
Performance Standards
JavaScript Budget

Minimize JavaScript sent to the browser.

Every client component increases:

Bundle size
Hydration cost
Main-thread work
Time to Interactive (TTI)
Guidelines
Keep client bundles small
Prefer composition over large interactive wrappers
Lazy load heavy interactive components
Avoid unnecessary React state
Avoid deep prop drilling into client components
Memoize expensive client computations only when necessary
Use caching aggressively on the server
Stream large server-rendered sections when beneficial
Navigation & Loading
Optimize for fast first paint
Ensure meaningful HTML is visible immediately
Prevent layout shifts
Use suspense boundaries strategically
Avoid blocking rendering with unnecessary client logic
SEO Requirements

SEO is a first-class priority.

Rules
All indexable content must be server-rendered
Use semantic HTML
Define metadata using generateMetadata
Ensure titles and descriptions are meaningful
Avoid hidden or delayed content rendering
Use proper heading hierarchy (h1 → h2 → h3)
Ensure pages remain functional without JavaScript where possible
Never

Do NOT:

Render SEO-critical content only on the client
Depend on hydration for metadata
Ship empty HTML shells
Hide meaningful content behind client rendering
Recommended Component Architecture
Preferred Pattern
Server Component

Responsibilities:

Fetch data
Handle server logic
Render page structure
Prepare SEO content
Pass minimal props downward
Client Component

Responsibilities:

Handle interaction only
Manage local UI state
Trigger mutations/actions
Enhance UX progressively
Scalability Guidelines
Code Organization
Keep components focused and single-purpose
Separate UI, data, and business logic
Prefer reusable server utilities
Avoid tightly coupled component trees
Use feature-based folder structures where appropriate
State Management

Prefer:

URL state
Server state
Database state
React Server Component data flow

Avoid global client state unless necessary.

Caching

Use:

Server caching
Route caching
Revalidation strategies
Request deduplication

Avoid duplicate client fetches for the same data.

Anti-Patterns (DO NOT DO THESE)
Forbidden Patterns
Adding "use client" everywhere
Turning entire pages into client components
Fetching page data in useEffect
Rendering empty shells before hydration
Blocking SSR unnecessarily
Mixing server-only logic into client components
Overusing React state for derived values
Hydrating large static sections
Using client rendering for SEO-critical pages
Project Goal

Build a fast, scalable, SEO-optimized that:

Loads instantly with server-rendered HTML
Ships minimal JavaScript
Hydrates only interactive UI
Maintains excellent Core Web Vitals
Scales cleanly as the codebase grows
Preserves strong SEO performance
Delivers smooth UX without sacrificing performance
Final Rule

If it does not require interactivity, it must be a Server Component.