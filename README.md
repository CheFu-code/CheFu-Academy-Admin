# CheFu Academy Admin Web

CheFu Academy Admin Web is the internal operations console used to run administrative workflows across the CheFu Academy platform. This application centralizes account operations, content administration, reporting visibility, and platform security controls in one place.

The goal of this project is practical: give internal teams one reliable interface to operate the product safely at scale.

## Table of Contents

- Project Purpose
- What This App Does
- Security Strength (Detailed)
- Architecture Overview
- Tech Stack
- Repository Structure
- Environment Configuration
- Local Development
- Scripts and Commands
- Firebase Functions (WebAuthn)
- Authentication Flows
- Deployment Model
- Observability and Operations
- Troubleshooting
- Security Hardening Checklist
- Contribution Guidelines
- License

## Project Purpose

CheFu Academy serves learners through a digital platform that requires consistent operations, clear controls, and secure identity management. The admin web application exists to support those internal responsibilities by giving trusted operators access to workflows such as:

- account lifecycle management
- course and content administration
- subscription and membership oversight
- security and identity operations
- support and diagnostics workflows

This repository is focused on an admin-first experience, not public marketing pages.

## What This App Does

Current capabilities include:

- role-oriented admin interface built with Next.js App Router
- multiple sign-in methods (email/password, social providers, and passkeys)
- passkey enrollment and passwordless passkey sign-in
- optional TOTP-based MFA support in Firebase project configuration
- Firebase-backed data model and auth integration
- Firebase Cloud Function endpoint for WebAuthn ceremonies
- modern component-driven UI with TypeScript

## Security Strength (Detailed)

Security is one of the strongest areas of this codebase. The platform combines Firebase identity controls with WebAuthn passkeys and server-side verification logic.

### 1) Phishing-Resistant Passkeys

The app supports passkey enrollment and sign-in via WebAuthn (`@simplewebauthn/browser` on the client and `@simplewebauthn/server` in Cloud Functions).

Why this is strong:

- passkeys are bound to origin and relying party constraints
- private keys stay on user devices/authenticators
- credential assertions are challenge-based and cannot be replayed as static secrets
- passkey UX can reduce password reuse and credential stuffing risk

Relevant files:

- `lib/passkeys.ts`
- `functions/src/webauthn.ts`
- `app/(auth)/login/page.tsx`
- `app/settings/_components/UI/SecurityTabUI.tsx`

### 2) Server-Side Verification for Registration and Authentication

WebAuthn ceremonies are never trusted purely on the client. The Cloud Function verifies both registration and authentication responses before granting success.

Strength indicators:

- challenge generated server-side and stored in Firestore
- challenge required on verification (registration/authentication)
- RP ID and expected origin are checked during verification
- verification failure prevents credential acceptance or token issuance

### 3) Origin and CORS Allowlisting

The WebAuthn API enforces an origin allowlist (production domain and localhost development origin).

Strength indicators:

- explicit allowed-origin checks before processing operations
- CORS policy denies non-approved origins
- reduces cross-origin abuse opportunities

### 4) Credential Replay Protection

On successful authentication, the authenticator counter is updated and persisted.

Strength indicators:

- stored counter is compared and advanced by verification flow
- replayed or cloned assertions become easier to detect
- aligns with recommended WebAuthn anti-replay handling

### 5) Enrollment Authorization Checks

Passkey enrollment operations require a Firebase ID token bearer header and enforce UID match.

Strength indicators:

- only authenticated users can enroll credentials
- token UID mismatch is rejected (`forbidden`)
- prevents user A from enrolling passkeys on user B

### 6) Secure Token Issuance after Verified Passkey Authentication

After a successful `authn-verify`, the backend mints a Firebase custom token and returns it to the client, which then signs in with Firebase Auth.

Strength indicators:

- token issuance depends on successful cryptographic assertion verification
- clean bridge from WebAuthn verification to Firebase session establishment
- centralizes trust decision on backend

### 7) MFA Readiness (TOTP)

The project includes service scripts for enabling TOTP MFA at Firebase project level.

Strength indicators:

- MFA can be enforced at identity layer
- codebase includes MFA handling paths in auth service
- supports progressive hardening for privileged accounts

Relevant files:

- `services/enable-totp-mfa.ts`
- `services/authService.ts`

### Security Posture Summary

Overall, the current implementation is above baseline for many admin dashboards because it includes:

- phishing-resistant authentication support
- backend verification of cryptographic ceremonies
- origin constraints + CORS restrictions
- replay protection via credential counters
- identity token checks for enrollment actions
- optional MFA expansion path

This is a strong foundation for an internal admin console.

## Architecture Overview

High-level architecture:

1. `Next.js` admin app handles UI, route rendering, and auth-triggering actions.
2. Firebase Client SDK handles user sessions, Firestore access, storage, and function calls.
3. Firebase Cloud Functions host WebAuthn server verification endpoint (`webauthnApi`).
4. Firestore stores passkey metadata and user-linked credential state.
5. Firebase Hosting rewrite routes `/firebase-web-authn-api` to the function.

Request flow for passkey sign-in:

1. Client requests auth options from `webauthnApi`.
2. Browser runs WebAuthn assertion ceremony.
3. Client sends assertion response for verification.
4. Function verifies assertion and mints Firebase custom token.
5. Client signs in via `signInWithCustomToken`.

## Tech Stack

Core framework and runtime:

- Next.js `15.5.8` (App Router)
- React `19.1.0`
- TypeScript `5.x`

UI and state utilities:

- Tailwind CSS `4.x`
- Radix UI primitives
- Sonner for notifications
- React Hook Form + Zod support

Identity and backend:

- Firebase (Auth, Firestore, Storage, Functions)
- Firebase Admin SDK in Cloud Functions
- `@simplewebauthn/browser` + `@simplewebauthn/server`

## Repository Structure

Top-level paths (high-value folders):

- `app/` App Router pages, route groups, and feature screens
- `components/` shared reusable UI components
- `lib/` shared utilities including Firebase and passkey client logic
- `services/` auth and workflow services used in client app
- `functions/` Firebase Cloud Functions TypeScript project
- `public/` static assets
- `hooks/` custom React hooks
- `helpers/` helper modules

Security-relevant paths:

- `lib/passkeys.ts` client passkey flow
- `functions/src/webauthn.ts` WebAuthn backend verification
- `app/settings/_components/UI/SecurityTabUI.tsx` security settings UI

## Environment Configuration

Create `.env.local` in project root for web app configuration.

Typical client variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

Function/runtime variables to consider:

- `RP_NAME` (WebAuthn relying party display name)
- `RP_ID` (optional WebAuthn relying party ID override)

Service script variable:

- `FIREBASE_SERVICE_ACCOUNT` (JSON string used by admin scripts like `enable-totp-mfa.ts`)

## Local Development

### Prerequisites

- Node.js `18.18+` (project root)
- npm
- Firebase project configured for Auth/Firestore/Functions/Hosting

Note: `functions/package.json` targets Node `22` for Cloud Functions runtime.

### Install Dependencies

```bash
npm install
```

Install function dependencies if needed:

```bash
cd functions
npm install
```

### Run Web App

```bash
npm run dev
```

App URL:

- `http://localhost:3000`

### Run Functions Locally (Optional)

From `functions/`:

```bash
npm run build
npm run serve
```

## Scripts and Commands

Root scripts (`package.json`):

- `npm run dev` start Next.js dev server with Turbopack
- `npm run build` production build
- `npm run start` run production server
- `npm run lint` lint project
- `npm run enable:totp` enable TOTP MFA via tsx service script
- `npm run enable` alternate command for enabling TOTP MFA

Functions scripts (`functions/package.json`):

- `npm run lint` lint functions source
- `npm run build` compile TypeScript
- `npm run serve` run local emulator for functions
- `npm run deploy` deploy functions
- `npm run logs` tail function logs

## Firebase Functions (WebAuthn)

The function exported is `webauthnApi` and supports operation-based requests:

- `reg-options`
- `reg-verify`
- `authn-options`
- `authn-verify`

Hosting rewrite (`firebase.json`):

- source: `/firebase-web-authn-api`
- target: `webauthnApi`

This keeps production requests same-origin while preserving local dev function access patterns.

## Authentication Flows

### Email and Social Login

The app supports email/password and social providers (Google/Facebook), with user persistence behavior handled in `services/authService.ts`.

### Passkey Enrollment

- authenticated user requests registration options
- browser creates credential via WebAuthn API
- backend verifies attestation response
- credential metadata stored per user document

### Passkey Sign-In

- user provides identifier (email/UID)
- backend returns challenge + allowCredentials
- browser creates assertion response
- backend verifies response and mints custom token
- Firebase sign-in completes session creation

### MFA Handling

- TOTP-related enablement script exists
- auth service includes handling for MFA-required login scenarios

## Deployment Model

Expected deployment path:

1. deploy Cloud Functions (`webauthnApi`)
2. deploy Hosting rewrite + static hosting artifacts
3. deploy Next.js app according to selected infrastructure path

Minimum production requirements:

- valid environment variables in deployment target
- correct WebAuthn origins and RP settings
- Firebase Auth providers configured
- Firestore rules aligned with admin use-cases

## Observability and Operations

Operational checks to run regularly:

- review Cloud Function logs for `webauthnApi`
- monitor auth failures (especially repeated passkey verification failures)
- track credential enrollment rates for admin users
- audit role assignment and privileged account activity

## Troubleshooting

Common issues and fixes:

1. Passkey prompt opens but verification fails.
- check origin exactly matches allowlist in `functions/src/webauthn.ts`
- confirm RP ID/host alignment

2. `no-passkeys-enrolled` during sign-in.
- user has not completed passkey enrollment yet
- sign in with another provider, then enroll from security settings

3. `auth-required` on registration operations.
- ensure user is actively authenticated in Firebase
- verify ID token is attached in Authorization header

4. Local dev cannot reach WebAuthn endpoint.
- verify function URL fallback logic in `lib/passkeys.ts`
- confirm `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is set for local function URL generation

5. Build/lint failures in functions.
- run install and build inside `functions/`
- ensure Node version compatibility

## Security Hardening Checklist

Use this checklist for production hardening and periodic reviews:

- restrict origin allowlist to required domains only
- validate RP ID is explicitly configured for production
- enforce MFA for all privileged/admin users
- review Firestore security rules for least privilege
- add automated tests for WebAuthn operation handlers
- implement alerting for abnormal auth failure spikes
- rotate and protect service account credentials
- perform regular dependency vulnerability audits

## Contribution Guidelines

Engineering expectations:

- keep changes TypeScript-safe
- preserve clear separation between client and function trust boundaries
- avoid introducing auth logic that bypasses backend verification paths
- keep security-impacting changes documented in pull requests

Before shipping major auth/security changes:

- run lint/build in root and `functions/`
- verify passkey registration and sign-in paths in staging
- verify fallback login paths (email/social) still work

## License

Proprietary software. All rights reserved.
