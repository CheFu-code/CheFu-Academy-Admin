# CheFu Academy Admin Web

CheFu Academy Admin Web is the internal dashboard for managing courses, users, subscriptions, and content operations across the CheFu Academy ecosystem. It is built to be reliable, secure, and fast, with a focus on clean workflows for administrators, content teams, and support staff.

This repository contains the web app that powers administrative tasks such as course creation, enrollment oversight, subscription management, and support workflows.

## Table of Contents

- Overview
- Key Capabilities
- Tech Stack
- Project Structure
- Getting Started
- Configuration
- Scripts
- Deployment
- Quality and Conventions
- Troubleshooting
- Security
- License

## Overview

CheFu Academy is a technology-driven educational platform focused on creating reliable, secure, and scalable digital products that solve real-world problems. Our mission is to build high-quality software that simplifies complexity, improves productivity, and enables individuals and businesses to grow through technology.

The admin web app supports that mission by providing a centralized, role-based interface for operational tasks. It is designed for:

- Curriculum teams managing course catalogs and content updates
- Support teams handling user inquiries
- Growth teams monitoring subscriptions and plan changes
- Admins managing access and permissions

## Key Capabilities

- **Course Management**: Create, edit, publish, and organize courses and modules.
- **User Administration**: Manage user accounts, roles, and access.
- **Subscription & Plans**: Track Free/Pro plans and account status.
- **Support Operations**: View inquiries and assist learners.
- **Auditability**: Clear visibility into changes and actions.
- **Responsive UI**: Mobile-first interface built with Tailwind CSS.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Authentication & Database**: Firebase
- **Drag & Drop**: @dnd-kit

## Project Structure

This is a high-level view of the repository. The exact structure may vary as the project evolves.

- `app/` Next.js App Router routes and layouts
- `components/` Shared UI components
- `lib/` Utilities, helpers, and shared logic
- `public/` Static assets
- `styles/` Global styles and Tailwind config

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js 18.18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd admin-web
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open `http://localhost:3000` in your browser.

## Configuration

This project uses Firebase for authentication and data. Environment variables are expected to be provided via `.env.local`.

Typical environment variables may include:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Create a `.env.local` file at the project root and add values from your Firebase project settings.

## Scripts

Common scripts you may use:

- `npm run dev` Start the development server
- `npm run build` Build for production
- `npm run start` Start the production server
- `npm run lint` Run lint checks

## Deployment

You can deploy this app anywhere that supports Next.js. Recommended options include Vercel or your existing infrastructure with Node.js support.

At minimum, ensure:

- Environment variables are configured
- Node.js runtime is available
- The app is built using `npm run build`

## Quality and Conventions

- TypeScript is used throughout for type safety
- Components are expected to be reusable and accessible
- Use Tailwind utility classes for consistent styling
- Keep server and client boundaries clear in the App Router

## Troubleshooting

If you run into issues:

- Ensure Node.js is v18+
- Reinstall dependencies with `npm install`
- Check that `.env.local` values are correct
- Clear Next.js cache by deleting `.next/`

## Security

This project uses Firebase Authentication. Ensure admin-only routes are protected and keep sensitive keys out of source control.

## License

This project is proprietary software. All rights reserved.
