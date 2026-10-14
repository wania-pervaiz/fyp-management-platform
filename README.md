# Final Year Pathway — FYP Management Platform

## 1. Project Overview

**Final Year Pathway** is an FYP Management Platform designed to help students and supervisors manage and track FYPs. Students can organize their projects, teams, tasks, milestones, documentation, and meetings, while supervisors can review project progress, provide feedback, and manage their supervision activities. The platform also includes an **AI Assistant** to support both students and supervisors with project-related guidance.

## 2. Features

- Student and supervisor dashboards
- Project creation and management
- Team member and supervisor invitations
- Task and milestone management
- Project documentation
- Meeting management
- Feedback and progress tracking
- AI Assistant for students and supervisors
- Responsive user interface

## 3. Technologies Used

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **AI Integration:** Vercel AI SDK and configured AI model provider
- **Testing Tools:** Vitest, React Testing Library, Playwright
- **Data Storage:** Browser Local Storage

## 4. Getting Started

### Prerequisites

- Node.js
- npm
- An API key for the configured AI provider

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project folder:

   ```bash
   cd fyp-management-platform
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the project root and add the environment variable required by your AI API route. For example:

   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

   Use the variable name expected by your actual code. Never upload your real API key to GitHub.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Checks code quality |
| `npm run test` | Runs the configured tests |
| `npm run e2e` | Runs end-to-end tests |

## 5. Project Structure

- `app/` — Application pages, layouts, and API routes
- `app/api/chat/` — AI Assistant API endpoint
- `components/` — Reusable UI components
- `lib/` — Shared utilities and application logic
- `public/` — Static assets
- `.env.local` — Local environment variables

## 6. AI Integration

The platform includes an AI Assistant for both students and supervisors. It uses the Vercel AI SDK to connect the application to the configured AI model provider through an API route.

The assistant is intended to help students with project planning, task organization, milestones, and documentation. It can also support supervisors with project reviews, feedback, progress discussions, and supervision-related activities.

AI-generated responses may sometimes be inaccurate or incomplete. The assistant also depends on valid API credentials, model availability, network access, and provider usage limits.

## 7. Data Storage and Limitations

The current application uses browser Local Storage for project-related data. This means saved information is stored in the browser and is not automatically synchronized across different devices or browsers.

Other limitations include:

- Clearing browser site data may remove saved information.
- The current login interfaces should not be treated as a complete production authentication system.
- Invitations may be simulated and may not send actual emails.
- AI features depend on the availability of the external AI service. If the service is temporarily unavailable, users can still add tasks and milestones manually.

Future improvements could include secure authentication, shared database storage, real email notifications, and additional error handling.

## 8. Project Links

- **Live Website:** https://fyp-management-platform.vercel.app/.
