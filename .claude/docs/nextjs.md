# Next.js App Router Architecture Guidelines

### Production-Grade Patterns for Mid-to-Large Applications (2025–2026)

> **Scope:** App Router only. These guidelines assume you already have
> React architecture guidelines covering components, hooks, state,
> TypeScript, API service patterns, forms, validation, and testing. This
> document does not repeat that guidance — it focuses exclusively on
> Next.js-specific decisions and production concerns.

## Table of Contents

1.  [<u>Recommended Responsibility
    Map</u>](#1-recommended-responsibility-map)

2.  [<u>App Router Architecture</u>](#2-app-router-architecture)

3.  [<u>Server/Client Boundary
    Architecture</u>](#3-serverclient-boundary-architecture)

4.  [<u>Data Fetching Architecture</u>](#4-data-fetching-architecture)

5.  [<u>Server Action Architecture</u>](#5-server-action-architecture)

6.  [<u>Route Handler Architecture</u>](#6-route-handler-architecture)

7.  [<u>Middleware Architecture</u>](#7-middleware-architecture)

8.  [<u>Authentication & Authorization
    Architecture</u>](#8-authentication--authorization-architecture)

9.  [<u>SEO Architecture</u>](#9-seo-architecture)

10. [<u>Performance & Caching
    Architecture</u>](#10-performance--caching-architecture)

11. [<u>Deployment Architecture</u>](#11-deployment-architecture)

12. [<u>Security Considerations</u>](#12-security-considerations)

13. [<u>Recommended Folder
    Structures</u>](#13-recommended-folder-structures)

14. [<u>Naming Conventions</u>](#14-naming-conventions)

15. [<u>Good Examples</u>](#15-good-examples)

16. [<u>Bad Examples /
    Anti-Patterns</u>](#16-bad-examples--anti-patterns)

17. [<u>Usually Acceptable</u>](#17-usually-acceptable)

18. [<u>Usually Dangerous</u>](#18-usually-dangerous)

19. [<u>Depends on Project Scale</u>](#19-depends-on-project-scale)

20. [<u>What Experienced Next.js Teams Commonly Do in Real Production
    Systems</u>](#20-what-experienced-nextjs-teams-commonly-do-in-real-production-systems)

## 1. Recommended Responsibility Map

| **Layer** | **Technology** | **Responsibilities** |
|:---|:---|:---|
| **Middleware** | middleware.ts | Auth checks, redirects, locale detection, A/B header injection |
| **Server Components** | RSC in app/ | Data fetching, page composition, SEO, no interactivity |
| **Client Components** | "use client" | UI state, event handlers, browser APIs, real-time updates |
| **Server Actions** | "use server" | Form mutations, database writes, revalidation, file uploads |
| **Route Handlers** | app/api/ | Webhooks, OAuth callbacks, external API proxies, binary responses |
| **Data Layer** | server/db/ or lib/db/ | Queries, ORM, transactions — server only |
| **Services** | server/services/ | Business logic, third-party integrations — server only |
| **Shared Lib** | lib/ | Utilities, validators, constants, shared types — isomorphic |

## 2. App Router Architecture

### Directory Roles

app/

├── (marketing)/ \# Route group — no URL segment

│ ├── page.tsx \# /

│ ├── about/page.tsx \# /about

│ └── layout.tsx \# Shared marketing shell

├── (dashboard)/

│ ├── dashboard/page.tsx \# /dashboard

│ ├── settings/

│ │ ├── page.tsx \# /settings

│ │ └── billing/page.tsx \# /settings/billing

│ └── layout.tsx \# Auth-gated dashboard shell

├── api/ \# Route handlers

│ └── webhooks/stripe/route.ts

├── auth/

│ ├── login/page.tsx

│ └── callback/route.ts

├── layout.tsx \# Root layout — HTML/body, providers

├── not-found.tsx \# Global 404

├── error.tsx \# Global error boundary

└── global-error.tsx \# Root layout error boundary

### Layouts vs Templates

**Use layouts** for persistent shells that maintain state across
navigations (sidebars, nav, providers). Layouts do not remount on
navigation.

**Use templates** when you explicitly need a fresh component instance on
every navigation — e.g., page-transition animations, per-page analytics
tracking, resetting scroll state.

// app/(dashboard)/template.tsx

// Remounts on every navigation within the group

export default function DashboardTemplate({ children }: { children:
React.ReactNode }) {

return \<PageTransition\>{children}\</PageTransition\>

}

### Route Groups

Route groups (name) organize the codebase without affecting URLs. Use
them to:

- Apply different layouts to different sections

- Co-locate related routes

- Apply middleware-level logic selectively (via matcher)

app/

├── (public)/ \# No auth required, public layout

├── (auth)/ \# Auth-required, dashboard layout

└── (admin)/ \# Admin-only, admin layout with permission checks

### Parallel Routes

Use parallel routes for complex UI where multiple independent sections
load at different speeds and need to be independently streamed.

app/

└── dashboard/

├── @analytics/

│ ├── page.tsx

│ └── loading.tsx

├── @notifications/

│ ├── page.tsx

│ └── loading.tsx

├── layout.tsx \# Receives { children, analytics, notifications }

└── page.tsx

**Real use cases:** dashboards with independent data panels,
side-by-side comparisons, inbox/detail patterns.

### Intercepting Routes

Use intercepting routes for modal patterns where the full page should be
accessible via direct URL, but when navigated to from within the app it
renders as a modal overlay.

app/

└── photos/

├── \[id\]/

│ └── page.tsx \# Full page: /photos/123

├── (.)photos/\[id\]/

│ └── page.tsx \# Modal when navigated from gallery

└── page.tsx \# Gallery

### Special Files Summary

| **File** | **Purpose** |
|:---|:---|
| page.tsx | Defines a route — makes the segment publicly accessible |
| layout.tsx | Persistent shell, wraps children, maintains state |
| template.tsx | Fresh shell per navigation |
| loading.tsx | Instant loading UI (Suspense boundary wrapper) |
| error.tsx | Error boundary for the segment |
| not-found.tsx | Renders when notFound() is called |
| route.ts | Route Handler (API endpoint) |
| default.tsx | Fallback for parallel routes when no match |
| opengraph-image.tsx | Dynamic OG image generation |
| sitemap.ts | Dynamic sitemap |
| robots.ts | Dynamic robots.txt |
| icon.tsx | Dynamic favicon |

### Metadata Files

Prefer static files when possible:

app/

├── favicon.ico

├── apple-icon.png

├── opengraph-image.png \# Static — served as-is

└── opengraph-image.tsx \# Dynamic — generated at request time (costs
compute)

## 3. Server/Client Boundary Architecture

### Mental Model

The boundary is a one-way gate: Server → Client. Data flows from server
to client via props. Code flows from client back to server via Server
Actions.

Server Territory │ Client Territory

──────────────────────────────┼──────────────────────

Layouts (default) │ Interactive UI

Page components (default) │ Event handlers

Data fetching │ useState / useEffect

Database access │ Browser APIs

Secret access │ Real-time subscriptions

Heavy computation │ Third-party UI SDKs

### What Belongs on the Server

- Database queries and ORM calls

- Auth token validation

- API calls to third-party services (hides keys)

- Sensitive business logic

- Heavy data transformations

- All secret environment variables

### What Belongs on the Client

- onClick, onChange, onSubmit handlers

- useState, useReducer, useEffect

- window, document, localStorage, navigator

- Real-time sockets/subscriptions

- Third-party UI libraries (date pickers, charts with interactivity)

- Drag-and-drop, canvas, audio/video APIs

### Placing the Boundary Correctly

Push the "use client" boundary as far down the tree as possible. The
default is Server; you opt into client explicitly.

// ✅ GOOD — only the interactive part is a client component

// app/(dashboard)/settings/page.tsx (Server Component)

import { getUser } from "@/server/queries/users"

import { UserProfileForm } from "@/features/settings/UserProfileForm" //
"use client"

export default async function SettingsPage() {

const user = await getUser()

return (

\<div\>

\<h1\>Settings\</h1\>

\<UserProfileForm defaultValues={user} /\> {/\* Pass serializable data
\*/}

\</div\>

)

}

// ❌ BAD — entire page becomes client because one thing needs
interactivity

"use client"

import { useState, useEffect } from "react"

export default function SettingsPage() {

const \[user, setUser\] = useState(null)

useEffect(() =\> {

fetch("/api/user").then(r =\> r.json()).then(setUser)

}, \[\])

// ...

}

### Passing Server Data to Client Components

Only serializable data can cross the server/client boundary: strings,
numbers, booleans, plain objects, arrays, Date (serialized as string),
null, undefined. Never pass class instances, functions, Promises (except
via use()).

// ✅ Correct: pass serializable props

\<ClientChart data={chartData} /\>

// ❌ Wrong: Prisma model instances often have non-serializable
internals

\<ClientChart data={prismaResult} /\> // Serialize first: select only
what you need

### Browser-Only Code

Handle browser-only code with dynamic imports or deferred
initialization:

// Dynamic import with ssr: false for browser-only components

const ReactQuill = dynamic(() =\> import("react-quill"), { ssr: false })

// Or guard at runtime

const isClient = typeof window !== "undefined"

### Hydration Issues

Hydration errors occur when server-rendered HTML doesn't match what the
client renders. Common causes:

1.  **Rendering timestamps or random IDs** — use stable seeds or useId()

2.  **Browser-only checks in render** — use useEffect or
    suppressHydrationWarning (last resort)

3.  **Conditional rendering on window** — gate with useEffect, not
    inline checks

4.  **Third-party scripts modifying the DOM** — use \<Script\> component
    with correct strategy

// ❌ Causes hydration mismatch

function Component() {

return \<span\>{new Date().toLocaleDateString()}\</span\>

}

// ✅ No mismatch

function Component({ date }: { date: string }) {

return \<span\>{date}\</span\> // date comes from server as stable
string

}

## 4. Data Fetching Architecture

### Server-Side Fetching (Default)

Fetch data in Server Components directly. No API route round-trip
needed.

// app/(dashboard)/analytics/page.tsx

import { db } from "@/server/db"

import { AnalyticsDashboard } from
"@/features/analytics/AnalyticsDashboard"

export default async function AnalyticsPage() {

// Parallel fetching — both queries run simultaneously

const \[metrics, topPages\] = await Promise.all(\[

db.query.metrics.findMany({ limit: 30 }),

db.query.pageViews.findMany({ orderBy: { views: "desc" }, limit: 10 }),

\])

return \<AnalyticsDashboard metrics={metrics} topPages={topPages} /\>

}

### Request Memoization

In a single request, calling the same fetch() URL or the same function
multiple times returns the cached result. This enables you to fetch data
where you need it without prop-drilling, without worrying about
duplicate requests.

// These two components both call getUser() — only ONE DB query runs per
request

// lib/queries/user.ts

import { cache } from "react"

export const getUser = cache(async (id: string) =\> {

return db.query.users.findFirst({ where: eq(users.id, id) })

})

// Both components can call getUser(id) safely — React deduplicates

Use React.cache() for database queries (not fetch-based), since fetch
memoization is built-in.

### Fetch Caching and Revalidation

// Static — cached indefinitely until manually revalidated

const data = await fetch("https://api.example.com/config", {

cache: "force-cache"

})

// Revalidate every 60 seconds (ISR-equivalent)

const data = await fetch("https://api.example.com/posts", {

next: { revalidate: 60 }

})

// Always dynamic — never cached

const data = await fetch("https://api.example.com/user", {

cache: "no-store"

})

// Tag-based revalidation — revalidate on demand

const data = await fetch("https://api.example.com/posts", {

next: { tags: \["posts"\] }

})

// Later, in a Server Action or Route Handler:

import { revalidateTag } from "next/cache"

revalidateTag("posts")

### Dynamic vs Static Rendering

A route becomes **dynamic** when it uses:

- cookies(), headers(), searchParams

- cache: "no-store" fetches

- noStore() from next/cache

Everything else is **static** (or ISR with revalidate).

**Opt into dynamic explicitly, not accidentally:**

// Forces dynamic rendering — be intentional

import { unstable_noStore as noStore } from "next/cache"

export default async function Page() {

noStore() // Explicit, searchable, intentional

const data = await getPersonalizedContent()

return \<div\>{/\* ... \*/}\</div\>

}

### Streaming and Suspense

Stream expensive data with Suspense boundaries. The page shell renders
immediately; slow parts stream in as they resolve.

// app/(dashboard)/page.tsx

import { Suspense } from "react"

import { RevenueCard } from "./RevenueCard"

import { ActivityFeed } from "./ActivityFeed"

import { Skeleton } from "@/components/ui/Skeleton"

export default function DashboardPage() {

return (

\<div className="grid grid-cols-2 gap-4"\>

{/\* Fast — renders immediately \*/}

\<WelcomeBanner /\>

{/\* Slow — streams in independently \*/}

\<Suspense fallback={\<Skeleton className="h-40" /\>}\>

\<RevenueCard /\> {/\* Fetches data internally \*/}

\</Suspense\>

\<Suspense fallback={\<Skeleton className="h-64" /\>}\>

\<ActivityFeed /\> {/\* Fetches data internally \*/}

\</Suspense\>

\</div\>

)

}

### Client-Side Fetching

Use client-side fetching for:

- Data that changes frequently (real-time, user-triggered refresh)

- Data dependent on client state (user input, browser position)

- After-mount personalization

Use your existing data-fetching library (SWR, React Query) for client
fetching. Don't roll your own.

### Data Fetching Anti-Patterns

// ❌ Waterfall: each awaits the previous

const user = await getUser(id)

const posts = await getPostsByUser(user.id) // waits for user

const comments = await getComments(posts\[0\].id) // waits for posts

// ✅ Parallelize independent queries

const \[user, allPosts\] = await Promise.all(\[getUser(id),
getAllPosts()\])

// ❌ Fetching in a loop (N+1 problem)

const posts = await getPosts()

const postsWithAuthors = await Promise.all(

posts.map(p =\> getUser(p.authorId)) // N queries

)

// ✅ Batch query

const posts = await db.query.posts.findMany({

with: { author: true } // JOIN at DB level

})

## 5. Server Action Architecture

### What Server Actions Are

Server Actions are async functions that run on the server, callable from
both Server Components and Client Components. They replace most
mutation-oriented API routes.

// actions/posts.ts

"use server"

import { revalidatePath, revalidateTag } from "next/cache"

import { redirect } from "next/navigation"

import { db } from "@/server/db"

import { getSession } from "@/server/auth"

import { createPostSchema } from "@/lib/validators/posts"

export async function createPost(formData: FormData) {

// 1. Auth check — always first

const session = await getSession()

if (!session) throw new Error("Unauthorized")

// 2. Validate

const parsed = createPostSchema.safeParse({

title: formData.get("title"),

content: formData.get("content"),

})

if (!parsed.success) {

return { error: parsed.error.flatten().fieldErrors }

}

// 3. Authorization — can this user do this specific thing?

const canCreate = await checkPermission(session.user.id, "posts:create")

if (!canCreate) throw new Error("Forbidden")

// 4. Mutate

const post = await db.insert(posts).values({

...parsed.data,

authorId: session.user.id,

}).returning()

// 5. Revalidate affected caches

revalidateTag("posts")

revalidatePath("/posts")

// 6. Redirect (optional)

redirect(\`/posts/\${post\[0\].id}\`)

}

### Server Action Error Handling

Return errors as values for expected/validation errors. Throw for
unexpected errors.

// lib/types/actions.ts

export type ActionResult\<T = void\> =

\| { success: true; data: T }

\| { success: false; error: string; fieldErrors?: Record\<string,
string\[\]\> }

// actions/users.ts

"use server"

export async function updateProfile(

formData: FormData

): Promise\<ActionResult\<{ id: string }\>\> {

try {

const session = await getSession()

if (!session) return { success: false, error: "Unauthorized" }

const parsed = profileSchema.safeParse(Object.fromEntries(formData))

if (!parsed.success) {

return {

success: false,

error: "Validation failed",

fieldErrors: parsed.error.flatten().fieldErrors,

}

}

const updated = await db.update(users)...

return { success: true, data: { id: updated.id } }

} catch (err) {

// Log unexpected error

logger.error("updateProfile failed", { err })

return { success: false, error: "Something went wrong" }

}

}

### useActionState (formerly useFormState)

"use client"

import { useActionState } from "react"

import { createPost } from "@/actions/posts"

export function CreatePostForm() {

const \[state, formAction, isPending\] = useActionState(createPost,
null)

return (

\<form action={formAction}\>

\<input name="title" /\>

{state?.fieldErrors?.title && (

\<p className="text-red-500"\>{state.fieldErrors.title\[0\]}\</p\>

)}

\<button disabled={isPending} type="submit"\>

{isPending ? "Creating..." : "Create Post"}

\</button\>

\</form\>

)

}

### When Server Actions vs Route Handlers

| **Use Server Actions**         | **Use Route Handlers**      |
|:-------------------------------|:----------------------------|
| Form submissions               | Webhooks from third parties |
| CRUD mutations                 | OAuth callbacks             |
| File uploads from forms        | Binary/streaming responses  |
| Revalidating cache             | External API proxy          |
| Progressive enhancement needed | Mobile app API consumers    |
| Tight coupling to Next.js app  | Cross-domain API consumers  |

### Transactions in Server Actions

"use server"

import { db } from "@/server/db"

export async function transferCredits(fromId: string, toId: string,
amount: number) {

await db.transaction(async (tx) =\> {

await tx.update(accounts)

.set({ credits: sql\`\${accounts.credits} - \${amount}\` })

.where(eq(accounts.id, fromId))

await tx.update(accounts)

.set({ credits: sql\`\${accounts.credits} + \${amount}\` })

.where(eq(accounts.id, toId))

await tx.insert(transactions).values({

fromId, toId, amount, createdAt: new Date()

})

})

revalidateTag("accounts")

}

## 6. Route Handler Architecture

### When Route Handlers Are Appropriate

app/api/

├── webhooks/

│ ├── stripe/route.ts \# Stripe webhook — must be raw body, external
caller

│ └── github/route.ts \# GitHub webhook

├── auth/

│ ├── callback/route.ts \# OAuth callback redirect handler

│ └── signout/route.ts \# POST signout if needed outside forms

├── uploads/route.ts \# Presigned URL generation, file proxying

└── og/route.tsx \# Dynamic OG image generation

### Route Handler Structure

// app/api/webhooks/stripe/route.ts

import { headers } from "next/headers"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {

const body = await request.text() // Raw body for signature verification

const signature = headers().get("stripe-signature")!

let event: Stripe.Event

try {

event = stripe.webhooks.constructEvent(

body,

signature,

process.env.STRIPE_WEBHOOK_SECRET!

)

} catch {

return Response.json({ error: "Invalid signature" }, { status: 400 })

}

switch (event.type) {

case "checkout.session.completed":

await handleCheckoutComplete(event.data.object)

break

// ...

}

return Response.json({ received: true })

}

### BFF Pattern (Backend for Frontend)

Route handlers work well as a BFF layer to aggregate and transform data
from multiple third-party services, especially when the client needs to
poll or the client is not a Next.js app.

// app/api/dashboard-summary/route.ts

export async function GET(request: Request) {

const session = await getSession()

if (!session) return Response.json({ error: "Unauthorized" }, { status:
401 })

// Aggregate from multiple services

const \[analytics, crm, billing\] = await Promise.all(\[

analyticsService.getSummary(session.org.id),

crmService.getStats(session.org.id),

billingService.getStatus(session.org.id),

\])

return Response.json({ analytics, crm, billing })

}

### Route Handler Anti-Patterns

// ❌ Using a Route Handler for mutations that Server Actions handle
better

// app/api/update-profile/route.ts

export async function POST(request: Request) {

const body = await request.json()

// ... update user

}

// ✅ This should be a Server Action instead — no API route needed

// ❌ No auth check

export async function GET() {

const allUsers = await db.query.users.findMany()

return Response.json(allUsers)

}

// ✅ Always check auth in Route Handlers

export async function GET() {

const session = await getSession()

if (!session) return Response.json({ error: "Unauthorized" }, { status:
401 })

// ...

}

## 7. Middleware Architecture

### What Middleware Should Do

Middleware runs on the **edge runtime** before every request that
matches the matcher. Keep it fast and stateless.

// middleware.ts

import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

const { pathname } = request.nextUrl

// 1. Auth gate

const token = request.cookies.get("session")?.value

if (!token && pathname.startsWith("/dashboard")) {

return NextResponse.redirect(new URL("/login", request.url))

}

// 2. Locale detection

const locale = detectLocale(request)

if (!pathname.startsWith(\`/\${locale}\`)) {

return NextResponse.redirect(new URL(\`/\${locale}\${pathname}\`,
request.url))

}

// 3. Response header injection (security headers, A/B experiments)

const response = NextResponse.next()

response.headers.set("X-Content-Type-Options", "nosniff")

return response

}

export const config = {

matcher: \[

"/((?!\_next/static\|\_next/image\|favicon.ico\|api/webhooks).\*)",

\],

}

### Middleware Limitations

- **Cannot access the Node.js runtime** — no fs, no heavy npm packages,
  no Prisma

- **Cannot run long operations** — it's on the critical path for every
  request

- **JWT verification is fine, database checks are not** — validate token
  cryptographically; don't query a DB

- **Session validation must be stateless** — use JWT or edge-compatible
  session libraries

### Middleware Anti-Patterns

// ❌ Database query in middleware — kills performance

export async function middleware(request: NextRequest) {

const user = await db.query.users.findFirst(...) // WRONG — no Node.js
runtime

}

// ❌ Complex business logic in middleware

// Middleware should redirect/rewrite/set headers, not process data

// ❌ No matcher — runs on every request including static files

export const config = {} // Missing matcher

## 8. Authentication & Authorization Architecture

### Session Architecture

Use cookie-based sessions. JWTs stored in httpOnly cookies are the
standard pattern for Next.js SSR apps. Do not store auth state in
client-side storage.

// server/auth/session.ts

import { SignJWT, jwtVerify } from "jose"

import { cookies } from "next/headers"

const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET)

export async function createSession(userId: string, role: string) {

const token = await new SignJWT({ userId, role })

.setProtectedHeader({ alg: "HS256" })

.setIssuedAt()

.setExpirationTime("7d")

.sign(secretKey)

cookies().set("session", token, {

httpOnly: true,

secure: process.env.NODE_ENV === "production",

sameSite: "lax",

maxAge: 60 \* 60 \* 24 \* 7,

path: "/",

})

}

export async function getSession() {

const token = cookies().get("session")?.value

if (!token) return null

try {

const { payload } = await jwtVerify(token, secretKey)

return payload as { userId: string; role: string }

} catch {

return null

}

}

### Auth in Server Components

// app/(dashboard)/layout.tsx

import { getSession } from "@/server/auth/session"

import { redirect } from "next/navigation"

export default async function DashboardLayout({

children,

}: {

children: React.ReactNode

}) {

const session = await getSession()

if (!session) redirect("/login")

return (

\<div\>

\<Sidebar userId={session.userId} /\>

\<main\>{children}\</main\>

\</div\>

)

}

### Auth State Hydration

Hydrate auth state for client components without an extra fetch:

// app/layout.tsx

import { getSession } from "@/server/auth/session"

export default async function RootLayout({ children }) {

const session = await getSession()

return (

\<html\>

\<body\>

\<SessionProvider session={session}\> {/\* Client context \*/}

{children}

\</SessionProvider\>

\</body\>

\</html\>

)

}

### Role-Based Access Control

// server/auth/permissions.ts

export type Permission =

\| "posts:read" \| "posts:write" \| "posts:delete"

\| "users:manage" \| "billing:manage"

const rolePermissions: Record\<string, Permission\[\]\> = {

viewer: \["posts:read"\],

editor: \["posts:read", "posts:write"\],

admin: \["posts:read", "posts:write", "posts:delete", "users:manage"\],

}

export function hasPermission(role: string, permission: Permission):
boolean {

return rolePermissions\[role\]?.includes(permission) ?? false

}

// In a Server Action:

export async function deletePost(postId: string) {

const session = await getSession()

if (!session) throw new Error("Unauthorized")

if (!hasPermission(session.role, "posts:delete")) throw new
Error("Forbidden")

// ...

}

### Layer-by-Layer Auth Defense

Middleware → Broad auth gates (is the user logged in at all?)

Layout → Section-level access (is the user in the right org/role?)

Page → Resource-level checks (can the user see this specific item?)

Server Action → Mutation authorization (can the user change this?)

Route Handler → API-level auth (token check + permission check)

Never rely on a single layer. Defense in depth.

## 9. SEO Architecture

### Static Metadata

// app/about/page.tsx

import type { Metadata } from "next"

export const metadata: Metadata = {

title: "About Us — Acme Inc",

description: "Learn about the team behind Acme Inc.",

alternates: {

canonical: "https://acme.com/about",

},

openGraph: {

title: "About Us",

description: "Learn about the team behind Acme Inc.",

url: "https://acme.com/about",

siteName: "Acme Inc",

type: "website",

},

}

### Dynamic Metadata

// app/blog/\[slug\]/page.tsx

import type { Metadata } from "next"

import { getPost } from "@/server/queries/posts"

export async function generateMetadata({

params,

}: {

params: { slug: string }

}): Promise\<Metadata\> {

const post = await getPost(params.slug)

if (!post) return { title: "Not Found" }

return {

title: \`\${post.title} — Acme Blog\`,

description: post.excerpt,

alternates: { canonical: \`https://acme.com/blog/\${params.slug}\` },

openGraph: {

title: post.title,

description: post.excerpt,

type: "article",

publishedTime: post.publishedAt.toISOString(),

images: \[{ url: post.ogImage, width: 1200, height: 630 }\],

},

}

}

Note: generateMetadata and the page component share request memoization
— the same getPost call is deduplicated.

### Metadata Inheritance

Root layout metadata sets defaults; child pages override specific
fields. Use metadataBase in root layout:

// app/layout.tsx

export const metadata: Metadata = {

metadataBase: new URL("https://acme.com"), // Required for relative OG
image URLs

title: {

default: "Acme Inc",

template: "%s — Acme Inc", // Children set: title: "About Us" → "About
Us — Acme Inc"

},

description: "The platform for modern teams",

}

### Structured Data

// components/seo/ArticleStructuredData.tsx

export function ArticleStructuredData({ post }: { post: Post }) {

const schema = {

"@context": "https://schema.org",

"@type": "Article",

headline: post.title,

datePublished: post.publishedAt.toISOString(),

author: { "@type": "Person", name: post.author.name },

}

return (

\<script

type="application/ld+json"

dangerouslySetInnerHTML={{ \_\_html: JSON.stringify(schema) }}

/\>

)

}

### Sitemap

// app/sitemap.ts

import type { MetadataRoute } from "next"

import { db } from "@/server/db"

export default async function sitemap():
Promise\<MetadataRoute.Sitemap\> {

const posts = await db.query.posts.findMany({

where: eq(posts.published, true),

columns: { slug: true, updatedAt: true },

})

return \[

{ url: "https://acme.com", changeFrequency: "weekly", priority: 1 },

{ url: "https://acme.com/about", changeFrequency: "monthly", priority:
0.8 },

...posts.map(post =\> ({

url: \`https://acme.com/blog/\${post.slug}\`,

lastModified: post.updatedAt,

changeFrequency: "weekly" as const,

priority: 0.7,

})),

\]

}

### SEO Anti-Patterns

- Rendering page content only after a useEffect fetch — crawlers may not
  wait

- Missing canonical on paginated/filtered pages

- Dynamic \<title\> set only in useEffect — not seen by crawlers

- OG images \> 8MB — many scrapers reject them

- noindex left on staging URLs that get indexed

- Multiple H1s per page

## 10. Performance & Caching Architecture

### Next.js Cache Layers

Request → CDN Edge Cache

→ Full Route Cache (static HTML + RSC payload)

→ Router Cache (client-side in-memory, per navigation)

→ Data Cache (fetch() results, persistent across requests)

→ Request Memoization (per-request, in-memory, deduplication only)

### Data Cache Strategies

// Immutable static data — cache forever

const config = await fetch("/api/config", { cache: "force-cache" })

// Time-based revalidation — good for blog posts, product listings

const posts = await fetch("/api/posts", { next: { revalidate: 3600 } })

// On-demand revalidation — good for user-generated content

const post = await fetch(\`/api/posts/\${id}\`, { next: { tags:
\[\`post-\${id}\`\] } })

// Never cache — user-specific, real-time data

const cart = await fetch("/api/cart", { cache: "no-store" })

### Tag-Based Invalidation

Design your cache tags to be granular and composable:

// Tagging strategy

fetch(\`/api/posts/\${id}\`, { next: { tags: \[\`post:\${id}\`,
"posts"\] } })

fetch(\`/api/users/\${id}\`, { next: { tags: \[\`user:\${id}\`,
"users"\] } })

// Invalidate a single post

revalidateTag(\`post:\${id}\`)

// Invalidate all posts (e.g., after bulk import)

revalidateTag("posts")

### Full Route Cache

Static routes are cached as HTML + RSC payload at build time or first
request. To opt out:

// Force dynamic rendering for this route

export const dynamic = "force-dynamic"

// Or use dynamic data:

export const revalidate = 60 // ISR: rebuild every 60s

### Router Cache (Client-Side)

Next.js caches visited routes in memory for the duration of the session.
This means navigating back is instant but stale data may appear. Control
this with:

// After a mutation, invalidate the router cache

import { useRouter } from "next/navigation"

const router = useRouter()

router.refresh() // Re-fetches current route server-side, preserves
client state

### Image Optimization

import Image from "next/image"

// Always specify width/height or use fill layout

\<Image

src="/hero.jpg"

alt="Hero image"

width={1200}

height={630}

priority // LCP images: skip lazy loading

sizes="(max-width: 768px) 100vw, 50vw"

/\>

// Remote images: configure domains in next.config.ts

// images: { remotePatterns: \[{ hostname: "cdn.acme.com" }\] }

### Font Optimization

// app/layout.tsx

import { Inter, JetBrains_Mono } from "next/font/google"

const inter = Inter({

subsets: \["latin"\],

variable: "--font-inter",

display: "swap",

})

const mono = JetBrains_Mono({

subsets: \["latin"\],

variable: "--font-mono",

display: "swap",

})

export default function RootLayout({ children }) {

return (

\<html className={\`\${inter.variable} \${mono.variable}\`}\>

\<body className="font-sans"\>{children}\</body\>

\</html\>

)

}

### Bundle Optimization

// next.config.ts

const config: NextConfig = {

experimental: {

optimizePackageImports: \[

"lucide-react", // Tree-shake icon libraries

"@radix-ui/react-\*",

\],

},

}

// Lazy-load heavy components

const HeavyChart = dynamic(() =\>
import("@/components/charts/HeavyChart"), {

loading: () =\> \<ChartSkeleton /\>,

})

### Partial Prerendering (PPR)

PPR renders static shells instantly from CDN while streaming in dynamic
holes. Opt in experimentally:

// next.config.ts

experimental: { ppr: true }

// page.tsx — the static shell renders from cache; Suspense boundaries
stream

export default function ProductPage({ params }) {

return (

\<div\>

\<StaticProductShell params={params} /\> {/\* From static cache \*/}

\<Suspense fallback={\<PriceSkeleton /\>}\>

\<DynamicPrice productId={params.id} /\> {/\* Streamed \*/}

\</Suspense\>

\</div\>

)

}

### Core Web Vitals Checklist

- **LCP:** priority on above-the-fold images, preload critical fonts,
  avoid render-blocking resources

- **CLS:** Set explicit width/height on images and media, avoid
  inserting content above existing content

- **INP:** Minimize JS bundle, defer non-critical scripts, use
  useTransition for non-urgent state updates

- **TTFB:** Use CDN, enable PPR or ISR for cacheable routes

## 11. Deployment Architecture

### Vercel (Recommended for Most Teams)

// next.config.ts — Vercel-specific optimizations

const config: NextConfig = {

images: {

remotePatterns: \[

{ protocol: "https", hostname: "\*\*.acme.com" },

\],

},

// Edge functions for middleware

// ISR for static routes

// Automatic image optimization

}

Environment variable strategy on Vercel:

- **Preview:** staging DB, test API keys

- **Production:** production DB, live API keys

- Use Vercel's integration secrets (not stored in repo)

### Docker Deployment

\# Dockerfile — standalone output mode

FROM node:20-alpine AS base

FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/standalone ./

COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD \["node", "server.js"\]

// next.config.ts — required for standalone Docker output

const config: NextConfig = {

output: "standalone",

}

### Runtime Selection

// Default: Node.js runtime — full Node.js APIs, heavier cold starts

// Use for: Server Actions, database connections, file system access

// Edge runtime — fast, global distribution, limited APIs

// Use for: Middleware, lightweight Route Handlers, no Node.js
dependencies

export const runtime = "edge"

// Don't use edge runtime if you need:

// - Prisma / most ORMs (no Node.js binary support)

// - File system access

// - Native Node.js modules

### Environment Variable Architecture

\# .env.local (never commit)

DATABASE_URL=postgresql://...

AUTH_SECRET=...

STRIPE_SECRET_KEY=sk_test\_...

\# .env (committed — public non-secrets)

NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test\_...

\# .env.production (committed — public production values)

NEXT_PUBLIC_APP_URL=https://acme.com

**Rules:**

- NEXT_PUBLIC\_ prefix → available in browser bundle — never use for
  secrets

- All other process.env.\* → server only

- Validate env vars at startup with a schema (e.g., zod)

// lib/env.ts — fail fast if misconfigured

import { z } from "zod"

const envSchema = z.object({

DATABASE_URL: z.string().url(),

AUTH_SECRET: z.string().min(32),

STRIPE_SECRET_KEY: z.string().startsWith("sk\_"),

NEXT_PUBLIC_APP_URL: z.string().url(),

})

export const env = envSchema.parse(process.env)

## 12. Security Considerations

### Secret Isolation

// ✅ Server-only import — throws at build if imported in client code

import "server-only"

export async function getAdminData() {

// This file will never appear in the client bundle

}

### CSRF

Server Actions have built-in CSRF protection (Origin header validation).
For Route Handlers that accept mutations, validate the Origin or use a
CSRF token:

// app/api/some-mutation/route.ts

export async function POST(request: Request) {

const origin = request.headers.get("origin")

if (origin !== process.env.NEXT_PUBLIC_APP_URL) {

return Response.json({ error: "Forbidden" }, { status: 403 })

}

// ...

}

### Security Headers

// next.config.ts

const securityHeaders = \[

{ key: "X-Content-Type-Options", value: "nosniff" },

{ key: "X-Frame-Options", value: "SAMEORIGIN" },

{ key: "X-XSS-Protection", value: "1; mode=block" },

{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

{

key: "Content-Security-Policy",

value: \[

"default-src 'self'",

"script-src 'self' 'unsafe-inline' https://js.stripe.com", // Customize

"style-src 'self' 'unsafe-inline'",

"img-src 'self' data: https://\*\*.acme.com",

"connect-src 'self' https://api.acme.com",

\].join("; "),

},

{ key: "Strict-Transport-Security", value: "max-age=63072000;
includeSubDomains; preload" },

\]

const config: NextConfig = {

headers: async () =\> \[

{ source: "/(.\*)", headers: securityHeaders },

\],

}

### Input Validation

Always validate user input on the server — never trust the client:

// ✅ Validate in Server Actions

"use server"

import { z } from "zod"

const schema = z.object({

email: z.string().email().max(255),

message: z.string().min(10).max(10000),

})

export async function submitContact(formData: FormData) {

const result = schema.safeParse(Object.fromEntries(formData))

if (!result.success) return { error: result.error.flatten() }

// ...

}

### XSS

- Next.js escapes JSX output by default

- dangerouslySetInnerHTML requires sanitization: use DOMPurify on the
  client or sanitize-html on the server

- Never inject user content into \<script\> tags or
  href="javascript:..."

### Route Handler Security

// Always: auth + method check + content-type + input validation

export async function POST(request: Request) {

const session = await getSession()

if (!session) return Response.json({ error: "Unauthorized" }, { status:
401 })

const contentType = request.headers.get("content-type")

if (!contentType?.includes("application/json")) {

return Response.json({ error: "Invalid content type" }, { status: 415 })

}

const body = await request.json().catch(() =\> null)

if (!body) return Response.json({ error: "Invalid body" }, { status: 400
})

const parsed = schema.safeParse(body)

if (!parsed.success) {

return Response.json({ error: parsed.error.flatten() }, { status: 422 })

}

// ...

}

## 13. Recommended Folder Structures

### Mid-Size Application

my-app/

├── app/

│ ├── (marketing)/

│ │ ├── page.tsx

│ │ ├── about/page.tsx

│ │ └── layout.tsx

│ ├── (dashboard)/

│ │ ├── dashboard/

│ │ │ ├── page.tsx

│ │ │ └── loading.tsx

│ │ ├── settings/

│ │ │ └── page.tsx

│ │ └── layout.tsx

│ ├── api/

│ │ └── webhooks/stripe/route.ts

│ ├── auth/

│ │ ├── login/page.tsx

│ │ └── callback/route.ts

│ ├── layout.tsx

│ ├── not-found.tsx

│ └── error.tsx

│

├── components/

│ ├── ui/ \# Primitive/shared UI: Button, Input, Modal

│ └── layout/ \# Shell components: Sidebar, Navbar, Footer

│

├── features/ \# Domain-scoped UI and logic

│ ├── auth/

│ │ ├── LoginForm.tsx

│ │ └── SessionProvider.tsx

│ ├── posts/

│ │ ├── PostCard.tsx

│ │ ├── PostEditor.tsx

│ │ └── PostList.tsx

│ └── billing/

│ └── UpgradeBanner.tsx

│

├── actions/ \# Server Actions ("use server")

│ ├── posts.ts

│ ├── users.ts

│ └── billing.ts

│

├── server/ \# Server-only code (never imported by client)

│ ├── db/

│ │ ├── index.ts \# DB client singleton

│ │ └── schema.ts \# Drizzle/Prisma schema

│ ├── queries/ \# DB query functions

│ │ ├── posts.ts

│ │ └── users.ts

│ ├── services/ \# Third-party integrations

│ │ ├── stripe.ts

│ │ └── email.ts

│ └── auth/

│ ├── session.ts

│ └── permissions.ts

│

├── lib/ \# Isomorphic utilities (safe for both server and client)

│ ├── env.ts \# Validated env vars

│ ├── utils.ts \# String/date/format utilities

│ ├── validators/ \# Zod schemas (shared between client and server)

│ │ └── posts.ts

│ └── constants.ts

│

├── types/ \# Shared TypeScript types

│ ├── api.ts

│ └── models.ts

│

├── middleware.ts

├── next.config.ts

└── tailwind.config.ts

### What Each Directory Does (and Doesn't)

**app/**

- Contains only Next.js routing files: page.tsx, layout.tsx, route.ts,
  special files

- Should be thin — orchestrate, don't implement

- Do NOT put complex business logic, large components, or shared
  utilities here

**components/**

- Reusable UI components with no domain knowledge

- ui/ — primitives like Button, Input, Badge, Modal

- layout/ — app shell pieces

- Do NOT put feature-specific components here

**features/**

- Domain-scoped components and hooks co-located by feature

- A feature folder can have its own components, hooks, and types

- Do NOT put server-only code here (queries, services)

**actions/**

- Only "use server" files

- One file per domain: posts.ts, users.ts, billing.ts

- Do NOT put queries inline here — call server/queries/ instead

**server/**

- Strictly server-only — add import "server-only" at top of sensitive
  files

- All DB access lives here

- All third-party service clients live here

- Do NOT import from features/ or components/ here

**lib/**

- Pure utilities, validators, constants that are safe for both server
  and client

- Do NOT put DB queries, API calls, or secret access here

**middleware.ts**

- Only authentication guards, redirects, header injection, locale
  detection

- Do NOT run DB queries or heavy logic here

## 14. Naming Conventions

| **Item** | **Convention** | **Example** |
|:---|:---|:---|
| Page components | PascalCase default export | export default function DashboardPage() |
| Layout components | PascalCase default export | export default function DashboardLayout() |
| Route Handlers | Named exports by HTTP method | export async function GET() {} |
| Server Actions | camelCase named exports | export async function createPost() |
| Feature components | PascalCase | PostEditor.tsx |
| Hooks | useCamelCase | usePostEditor.ts |
| Server query files | camelCase | server/queries/posts.ts |
| DB schema files | singular noun | schema/post.ts, schema/user.ts |
| Types | PascalCase | type PostWithAuthor = ... |
| Env vars | SCREAMING_SNAKE_CASE | DATABASE_URL, NEXT_PUBLIC_APP_URL |
| Route groups | (kebab-case) | (dashboard-admin)/ |
| Cache tags | noun:id or noun | "post:123", "posts" |

## 15. Good Examples

### Pattern: Composing a Dashboard Page

// app/(dashboard)/dashboard/page.tsx

import { Suspense } from "react"

import { getSession } from "@/server/auth/session"

import { redirect } from "next/navigation"

import { StatsGrid } from "@/features/dashboard/StatsGrid"

import { RecentActivity } from "@/features/dashboard/RecentActivity"

import { QuickActions } from "@/features/dashboard/QuickActions"

import { StatsSkeleton, ActivitySkeleton } from
"@/components/ui/Skeletons"

export default async function DashboardPage() {

const session = await getSession()

if (!session) redirect("/login")

return (

\<div className="space-y-6"\>

\<h1 className="text-2xl font-bold"\>Dashboard\</h1\>

\<Suspense fallback={\<StatsSkeleton /\>}\>

\<StatsGrid userId={session.userId} /\>

\</Suspense\>

\<div className="grid grid-cols-3 gap-4"\>

\<div className="col-span-2"\>

\<Suspense fallback={\<ActivitySkeleton /\>}\>

\<RecentActivity userId={session.userId} /\>

\</Suspense\>

\</div\>

\<QuickActions /\> {/\* Static, no suspense needed \*/}

\</div\>

\</div\>

)

}

### Pattern: Server Action with Optimistic UI

// features/posts/LikeButton.tsx

"use client"

import { useOptimistic, useTransition } from "react"

import { toggleLike } from "@/actions/posts"

export function LikeButton({ postId, initialLiked, initialCount }:
Props) {

const \[optimisticLiked, setOptimisticLiked\] =
useOptimistic(initialLiked)

const \[optimisticCount, setOptimisticCount\] =
useOptimistic(initialCount)

const \[isPending, startTransition\] = useTransition()

function handleLike() {

startTransition(async () =\> {

setOptimisticLiked(!optimisticLiked)

setOptimisticCount(c =\> optimisticLiked ? c - 1 : c + 1)

await toggleLike(postId)

})

}

return (

\<button onClick={handleLike} disabled={isPending}\>

{optimisticLiked ? "❤️" : "🤍"} {optimisticCount}

\</button\>

)

}

## 16. Bad Examples / Anti-Patterns

### Anti-Pattern: Unnecessary Client Component Cascade

// ❌ BAD — "use client" at the top of a composition component

// forces ALL children to be client components too

"use client"

import { Header } from "./Header"

import { Sidebar } from "./Sidebar"

import { UserProfile } from "./UserProfile"

export default function DashboardLayout({ children }) {

return (

\<div\>

\<Header /\>

\<Sidebar /\>

\<main\>{children}\</main\>

\<UserProfile /\> {/\* Only this one actually needed interactivity \*/}

\</div\>

)

}

// ✅ GOOD — only the interactive leaf is a client component

// DashboardLayout stays a Server Component

### Anti-Pattern: Fetch Waterfall

// ❌ Sequential — 3 DB round trips on the critical path

export default async function Page({ params }) {

const user = await getUser(params.id)

const posts = await getPostsByUser(user.id)

const stats = await getStatsForUser(user.id)

// ...

}

// ✅ Parallel

export default async function Page({ params }) {

const \[user, posts, stats\] = await Promise.all(\[

getUser(params.id),

getPostsByUser(params.id),

getStatsForUser(params.id),

\])

}

### Anti-Pattern: Leaking Server-Only Code

// ❌ components/UserCard.tsx (client component)

import { db } from "@/server/db" // This will be bundled into the
client! Error at runtime.

// ✅ Fetch data in a Server Component, pass as props to client
component

// app/page.tsx (Server Component)

const user = await db.query.users.findFirst(...)

return \<UserCard user={user} /\> // UserCard is a simple client
component with no DB access

### Anti-Pattern: Dynamic Route as Static

// ❌ Fetching user-specific data but not opting into dynamic rendering

export default async function Page() {

// This will cache the FIRST user's data for everyone!

const user = await db.query.users.findFirst({ where: ... })

}

// ✅ Opt into dynamic rendering explicitly

export const dynamic = "force-dynamic"

// OR use cookies()/headers() which auto-opts into dynamic

### Anti-Pattern: Server Action Without Auth

// ❌ No auth — any user can delete any post

"use server"

export async function deletePost(postId: string) {

await db.delete(posts).where(eq(posts.id, postId))

}

// ✅ Auth + ownership check

"use server"

export async function deletePost(postId: string) {

const session = await getSession()

if (!session) throw new Error("Unauthorized")

const post = await db.query.posts.findFirst({ where: eq(posts.id,
postId) })

if (!post \|\| post.authorId !== session.userId) throw new
Error("Forbidden")

await db.delete(posts).where(eq(posts.id, postId))

revalidatePath("/posts")

}

## 17. Usually Acceptable

- **Route Handlers for auth callbacks** — OAuth flows often require
  redirects and cookie-setting that work better in Route Handlers than
  Server Actions

- **useEffect for analytics/tracking** — fire-and-forget on mount

- **Client-side fetching for dashboards with frequent updates** — SWR
  with polling is fine for near-real-time data

- **"use client" on large page sections** — when 80% of the section is
  interactive, wrapping the whole thing is reasonable

- **Mixing App Router and Pages Router** — valid incremental migration
  strategy

- **dynamic = "force-dynamic" on auth-required pages** — safe default if
  you're unsure about caching

## 18. Usually Dangerous

- **Database queries in middleware** — blocks every request; use JWT
  instead

- **dangerouslySetInnerHTML with user content** — sanitize first, always

- **Storing auth tokens in localStorage** — use httpOnly cookies

- **Trusting params or searchParams as-is** — always validate and cast
  to expected types

- **Exposing internal error messages to clients** — log internally,
  return generic errors

- **revalidateTag in a Server Action without auth** — anyone who can
  trigger the action can bust your cache

- **cache: "force-cache" on user-specific data** — caches one user's
  data for everyone

- **"use server" files that aren't in actions/** — easy to accidentally
  import server-only logic into client bundles

- **Calling Server Actions directly in useEffect** — Server Actions
  aren't designed for polling; use Route Handlers or SWR

## 19. Depends on Project Scale

| **Decision** | **Small Teams** | **Large Teams** |
|:---|:---|:---|
| actions/ folder vs inline "use server" | Inline OK | Dedicated folder required |
| Auth library (NextAuth vs custom) | NextAuth v5 | Custom + existing infra (SSO) |
| ORM | Prisma (ergonomics) | Drizzle (performance + migrations) |
| Monorepo | Not needed | Turborepo for shared packages |
| Feature folder granularity | Coarse (features/dashboard/) | Fine (features/dashboard/analytics/) |
| PPR | Experiment | Evaluate carefully (build complexity) |
| Edge runtime | Middleware only | Expanded for global APIs |
| Separate API service | Not needed | When mobile apps need the same API |
| Observability | Vercel built-in | OpenTelemetry + Datadog/Grafana |

## 20. What Experienced Next.js Teams Commonly Do in Real Production Systems

1.  **Thin app/ directory** — Pages and layouts are orchestrators only.
    No business logic, no inline queries. All data goes through
    server/queries/.

2.  **server/ is sacred** — Everything in server/ has import
    "server-only" at the top. This prevents accidental client bundle
    inclusion and is caught at build time.

3.  **Server Actions for all forms** — No separate API route for form
    submissions. Server Actions + useActionState is the standard
    pattern.

4.  **Zod schemas in lib/validators/** — Schemas are shared between
    client (for immediate validation feedback) and server (for
    authoritative validation in actions). Never trust client-only
    validation.

5.  **Parallel fetching everywhere** — Promise.all() for all independent
    queries. Waterfalls are treated as bugs.

6.  **Granular Suspense** — Suspense boundaries around slow data, not
    entire pages. Fast data renders immediately.

7.  **revalidateTag over revalidatePath** — Tag-based invalidation is
    surgical. Path invalidation is broad and can hit unintended routes.

8.  **Defense-in-depth auth** — Auth checked in middleware (broad gate),
    layout (section gate), and Server Action (mutation gate). Never rely
    on a single check.

9.  **Validated environment variables** — lib/env.ts with Zod. App fails
    fast at startup if misconfigured. No process.env.FOO! assertions
    scattered everywhere.

10. **output: "standalone" for Docker** — Self-contained build artifact
    with only what's needed for production. Combined with multi-stage
    Dockerfile.

11. **Error boundaries per route segment** — Each major route has its
    own error.tsx so an error in one section doesn't take down the whole
    app.

12. **ISR by default for public content** — Blog posts, product pages,
    marketing pages all use revalidate. Only auth-required pages use
    force-dynamic.

13. **next/image everywhere, always** — Images outside of next/image are
    treated as technical debt. Always specify sizes for responsive
    images.

14. **Feature flagging through headers or cookies** — Middleware reads
    the flag, sets a header, Server Components read the header. No
    client-side flag evaluation for critical paths.

15. **Monitoring with OpenTelemetry** — instrumentation.ts (Next.js 15+)
    sets up tracing. Route Handler and Server Action errors reported to
    Datadog/Sentry. Never silently swallow errors.

*Last updated: June 2026. Targets Next.js 15.x with App Router, React
19.*
