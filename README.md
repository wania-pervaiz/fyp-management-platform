# FYP Management Platform

## 1. Project Overview

The FYP Management Platform is a web application designed to help students organize and manage their Final Year Projects. It provides features for project creation, team coordination, supervisor interaction, task management, milestone tracking, document organization, meetings, feedback, and progress monitoring. It also includes an AI Project Assistant that provides project-related guidance.

## 2. Features

- Student and supervisor login interfaces
- Project creation and management
- Team member and supervisor invitation workflow
- Task creation and tracking
- Milestone management
- Project document management
- Meetings and feedback
- Project progress tracking
- AI Project Assistant
- Responsive user interface

## 3. Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- Google Gemini and Groq provider packages
- Vitest
- React Testing Library
- Playwright
- Browser Local Storage

## 4. Getting Started

### Prerequisites

Install Node.js and npm on your computer.

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Open the project directory:

   ```bash
   cd fyp-management-platform
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the project root if the AI API route requires environment variables. Add the required API key and configuration values using the names expected by the application.

   **Important:** Never commit API keys or other secrets to GitHub.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the application in your browser:

   http://localhost:3000

The application should now be available locally.

## 5. Available Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint |
| `npm run test` | Runs Vitest tests and generates a coverage report |
| `npm run e2e` | Runs Playwright end-to-end tests |

To run the production version locally, first execute `npm run build`, then run `npm run start`.

## 6. Project Architecture

The application uses Next.js for routing and rendering, React and TypeScript for the user interface, and Tailwind CSS for styling.

Main project areas include:

- `app/` — Application pages, layouts, and API routes.
- `app/api/chat/` — API endpoint for the AI Project Assistant.
- `lib/` — Shared utilities and project data management.
- `components/` — Reusable UI components, if present.
- `public/` — Static assets, if present.
- `.env.local` — Local environment variables.

The project uses a modular structure to separate page interfaces, API functionality, shared utilities, and reusable components.

## 7. Data Storage

The application uses browser Local Storage to save project-related data through its client-side data management utilities.

- Data is stored in the browser where the application is being used.
- Saved data can remain available after refreshing or reopening the browser.
- Data is not automatically synchronized between different users, browsers, or devices.
- Clearing the browser's site data may remove locally saved information.
- Local Storage does not provide shared database access or server-side data persistence.

This storage approach is suitable for a demonstration or prototype. A production multi-user system would require a shared database, server-side data handling, and appropriate authentication and authorization.

## 8. AI Integration

The application includes an AI Project Assistant designed to help users with project-related questions and guidance.

### Purpose

The assistant provides useful responses to project-related requests rather than simply echoing the user's input.

### Implementation

The chat interface sends messages to the application's AI API route. The route uses the AI SDK and a configured model provider to generate responses.

The project includes Google Gemini and Groq provider packages. The provider and model actually configured in the API route determine which service is used at runtime.

### Prompt Purpose

The assistant uses its configured instructions and the user's message to generate a relevant response. These instructions guide the assistant toward project-related support.

### Limitations

- AI-generated answers may be incorrect or incomplete.
- Unclear questions may result in less relevant responses.
- Availability depends on the configured provider, API credentials, model access, and usage limits.
- Network errors or provider outages may prevent responses.
- Important suggestions should be reviewed before being used in project decisions.

## 9. Testing and Coverage

The project uses Vitest and React Testing Library for unit and component testing, and Playwright for end-to-end testing.

### Run Unit Tests and Coverage

```bash
npm run test
```

This command runs Vitest and generates a coverage report.

### Run End-to-End Tests

```bash
npm run e2e
```

This command runs the configured Playwright tests.

### Code Quality Check

```bash
npm run lint
```

### Testing Requirements

Before submission:

- Confirm that the tests pass.
- Verify that component coverage is at least 50%.
- Save the test results and coverage report as evidence.
- Confirm that the main user workflows work correctly.

Report the actual final results rather than assuming that previous test results still apply.

## 10. Performance and Accessibility

A local Lighthouse audit achieved the following scores in one run:

| Category | Score |
|---|---:|
| Performance | 88 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Lighthouse scores can vary between runs because of browser conditions, caching, and resource loading. Final results should be recorded after deployment.

### Accessibility Improvement

During the accessibility audit, text contrast was reviewed and text colors were adjusted to improve readability.

### Accessibility Verification

The deployed application should be checked using WAVE or axe. Review reported errors and contrast issues, address confirmed problems, and verify the applicable WCAG Level AA requirements.

A Lighthouse Accessibility score of 100 is useful evidence, but it does not guarantee that every accessibility requirement has been satisfied.

## 11. Deployment Checklist

### Before Deployment

- [ ] Confirm that `npm run build` completes successfully.
- [ ] Run `npm run test` and verify component coverage.
- [ ] Run `npm run e2e`.
- [ ] Run `npm run lint`.
- [ ] Configure the required environment variables on the hosting platform.
- [ ] Verify the AI API route and provider configuration.
- [ ] Ensure API keys and other secrets are not committed to GitHub.
- [ ] Confirm that the application is ready for production.

### After Deployment

- [ ] Open the live website and check that it loads correctly.
- [ ] Test navigation and the main application pages.
- [ ] Test project creation and other important workflows.
- [ ] Test the AI Project Assistant and its error handling.
- [ ] Confirm that Local Storage works as expected.
- [ ] Run Lighthouse on the deployed URL.
- [ ] Check accessibility with WAVE or axe.
- [ ] Save screenshots of the final test and audit results.

## 12. Error Handling and Monitoring

Check the hosting platform's deployment logs when the application fails to start or an API request returns an error.

For AI-related failures, verify the API credentials, configured model, provider availability, and server logs. The application should communicate failures clearly instead of leaving users without feedback.

After deployment, test the important user workflows and monitor errors reported by the hosting platform.

## 13. Rollback Plan

If a new deployment introduces a serious problem:

1. Open the hosting platform's deployment dashboard.
2. Identify the last known working deployment.
3. Use the platform's rollback or redeployment option, if available.
4. Verify that the restored version loads and its main features work.
5. Investigate the problem and test the fix before deploying again.

Keep the previous working version available whenever possible so that a faulty release can be reversed quickly.

## 14. Live Demo

**Live URL:** Add the deployed website URL after deployment.

## 15. GitHub Repository

**Repository URL:** Add your GitHub repository URL.

## 16. Reflection

Building this project helped me understand how to organize a multi-page application, connect an AI feature, test application behavior, and evaluate performance and accessibility. The audits also showed that a successful build and a working interface do not automatically guarantee good performance or accessibility.

One important lesson was to verify the application using tests and audit tools instead of relying only on how it looks in the browser. Further improvements include strengthening shared data persistence and authentication, refining error handling, and continuing to test the deployed application.