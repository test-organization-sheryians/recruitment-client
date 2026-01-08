# Project Explanation (Beginner Friendly)

This document explains the frontend project step-by-step in very simple English. Save this file as `PROJECT_EXPLANATION.md` in the project root.

---

**1. Project Overview**

- What this project does (simple):
  - This is a job/recruitment frontend. It shows jobs, profiles, skills, and allows users to apply for jobs and manage profiles.
  - It talks to a backend (API) to get data like jobs, user info, and categories.

- Who this project is for:
  - Developers building or maintaining a recruitment app.
  - Beginners who want to learn how a real frontend app is organized.

- Real-life example:
  - A company posts job openings. A candidate opens the app, sees jobs, uploads a resume, and applies. Admins can add categories and manage users.

---

**2. Tech Stack Explanation (simple)**

- `Next.js` (React framework):
  - Why: Gives structure for pages and server-side features. It starts the app and handles routing. 
  - Simple: Think of it as React + a folder that defines pages automatically.

- `React`:
  - Why: Builds the UI as reusable pieces (components).
  - Simple: Components are like small Lego blocks that build the interface.

- `TypeScript`:
  - Why: Adds simple checks so variables and function inputs are less error-prone.
  - Simple: Like adding labels to boxes so you don't mix them up.

- `Tailwind CSS`:
  - Why: Quick styling with utility classes (small CSS helpers like `px-4`, `text-center`).
  - Simple: Instead of writing big CSS files, you add little class words to HTML.

- `Redux Toolkit` (`@reduxjs/toolkit`):
  - Why: Keeps app-wide state (like logged-in user) in one place.
  - Simple: A global box where many components can read/write shared data.

- `React Query` (`@tanstack/react-query`):
  - Why: Helps fetch and cache API data easily.
  - Simple: A smart helper to get data from the server and reuse it.

- `Axios`:
  - Why: Makes HTTP (API) requests simple.
  - Simple: A tool to send and receive data from the backend.

- `js-cookie`:
  - Why: Stores tokens or small data in the browser cookies.

- `AWS SDK` (S3 packages):
  - Why: Upload files (like resumes) to S3 if app uses it.

- Other small libs: icons (`lucide-react`), toasts (`react-hot-toast`), PDF helpers (`pdf-parse`). They solve small needs like icons, notifications, or PDF parsing.

---

**3. Folder Structure Explanation (main folders)**

Note: Most code is under `src/`.

- `src/` → main app source code
  - Purpose: Contains all code that runs the frontend.
  - Type of code: Pages, components, API helpers, styles, state, features.
  - Beginner example: `src/app` holds the app routes.

- `src/app/` → Next.js App Router
  - Purpose: Each folder inside `src/app` becomes a route (a page or group of pages).
  - Example: `src/app/(auth)/login` is the login page route.
  - Beginner example: Add `src/app/hello/page.tsx` to create `/hello` route.

- `components/` → UI building blocks
  - Purpose: Reusable UI pieces (buttons, inputs, navbar, etc.).
  - What code: Small React components used across pages.
  - Beginner example: `Button.tsx` creates a `<Button>` you can use anywhere.

- `public/` → Static assets
  - Purpose: Images, fonts, icons available to the browser directly.
  - Example: fonts are in `public/fonts/`.

- `config/` → App configuration helpers
  - Purpose: axios setup, store (Redux), route helpers.
  - Example: `config/axios/index.ts` creates an `api` object to call backend.

- `api/` (under `src/api/`) → API call functions
  - Purpose: Functions that call backend endpoints (login, get jobs...).
  - What code: small functions using `axios` to call server and return data.
  - Beginner example: `src/api/auth/login.ts` posts login data and returns response.

- `features/` → Feature-specific components and logic
  - Purpose: Larger, feature-focused code like auth forms or job apply flows.

- `lib/` → Utility helpers
  - Purpose: Small helper functions (formatters, auth helpers, file uploads).

- `redux/` → Redux slices (state)
  - Purpose: Keep global state like `auth` (who is logged in).

- `types/` → TypeScript types (shapes of objects)
  - Purpose: Define how data looks (job, profile). Helpful for TypeScript.

- `components/hoc/` → Higher-order components and providers
  - Purpose: Wrappers like `AuthProvider` or layout wrappers that add common behavior.

---

**4. File-Level Explanation (important files)**n
- `package.json` (project root)
  - What it does: Lists scripts and dependencies.
  - How it is used: Run `npm run dev` to start the app.
  - Where: [package.json](package.json)

- `next.config.ts`
  - What it does: Next.js configuration file.
  - Why needed: Configure Next features (default setup here).
  - Where: [next.config.ts](next.config.ts)

- `src/app/layout.tsx`
  - What it does: The root layout. It wraps all pages.
  - How data flows: It imports global CSS and providers like `AuthProvider` and `Wrapper`, then renders `children` (page content).
  - Why needed: Sets fonts, global providers, and HTML structure.
  - Where: [src/app/layout.tsx](src/app/layout.tsx)

- `src/app/globals.css`
  - What it does: Global CSS and Tailwind imports for the app.
  - Why needed: Styles and theme variables used by components.
  - Where: [src/app/globals.css](src/app/globals.css)

- `src/config/axios/index.ts`
  - What it does: Creates `api` (axios instance) with base URL and error handling.
  - How data flows: Components or API functions import this `api` to call backend endpoints.
  - Where: [src/config/axios/index.ts](src/config/axios/index.ts)

- `src/api/auth/login.ts`
  - What it does: Example API function — posts login data and returns the response.
  - How data flows: A login form calls this function to send the user's credentials.
  - Where: [src/api/auth/login.ts](src/api/auth/login.ts)

- `src/components/Button.tsx`
  - What it does: Simple reusable button component.
  - How it works: Accepts `children`, `className`, and other button HTML props.
  - Beginner tip: Use `<Button className="px-4">Click</Button>` in pages.
  - Where: [src/components/Button.tsx](src/components/Button.tsx)

- `src/components/Navbar.tsx`
  - What it does: Top navigation that shows user info and logout.
  - How it works: Reads user from Redux store (`state.auth.user`). If no user, it returns `null` (not shown).
  - Where: [src/components/Navbar.tsx](src/components/Navbar.tsx)

- `src/components/hoc/AuthProvider.tsx` (example)
  - What it does: Wraps children and provides authentication context or effects.
  - Why needed: Ensures every page can access auth or run auth checks.

---

**5. How the App Starts (simple flow story)**

1. You run `npm run dev` → Next.js server starts (dev mode).
2. Browser opens a route (for example `/`).
3. `src/app/layout.tsx` runs first and sets global HTML and CSS (fonts, theme).
4. `Wrapper` and `AuthProvider` inside layout mount next. They set app-wide behavior and data (like checking if the user is logged in).
5. The specific page component for the route is loaded and its components are rendered.
6. Components can call API functions (from `src/api/`) which use `config/axios` to talk to the backend.
7. Data from backend is shown in component UI.

Think of it as a story: "Layout puts a stage and lights; providers place props on the stage; the page actor performs using props and fetches data when needed." 

---

**6. Component Explanation (basics, with examples from this project)**

- What is a component?
  - A small, reusable piece of UI. Example: `Button.tsx` is a component that renders a `<button>`.

- How components are connected:
  - Parent components render child components and pass data via `props`.
  - Example: A page renders `<Navbar />` and `<Button />` inside it.

- Props (simple):
  - Values given to a component from its parent.
  - Example: `<Button className="px-4">Save</Button>` gives `className` and `children` to `Button`.

- State (only basics):
  - Data that a component keeps for itself (like `isOpen` for a modal).
  - State is local to the component unless you put it in Redux.

- Example from this project:
  - `Navbar.tsx` reads global `user` from Redux (`useSelector`) — that is shared state, so it can show the logged-in user's name.
  - `Button.tsx` uses props and returns a button element. It does not use internal state.

---

**7. Styling Explanation**

- How styling is done:
  - Tailwind CSS utilities in class names (e.g., `px-4`, `text-2xl`).
  - Global CSS in `src/app/globals.css` for theme variables and imported Tailwind.

- Where styles are written:
  - `src/app/globals.css` for global rules and variables.
  - Inline in JSX via Tailwind class names.

- How styles apply:
  - You add class names directly in JSX. Example: `<div className="bg-background text-foreground">`.
  - Theme variables (like `--color-primary`) come from `globals.css`.

---

**8. API / Data Handling (simple)**

- Where API calls are written:
  - In `src/api/` (for example `src/api/auth/login.ts`). These are small functions that return API responses.

- How the `axios` helper is used:
  - `src/config/axios/index.ts` exports an `api` instance. API functions import `api` and use `api.post`, `api.get`, etc.

- How data comes and is shown:
  - Page or component calls an API function (or uses React Query to fetch data).
  - The function returns JSON. The component puts this data into its UI (lists, text, forms).

- Example beginner flow:
  - The login form calls `login(formData)` from `src/api/auth/login.ts`.
  - If success, the response may set tokens (cookies) and update Redux `auth` slice.
  - The `Navbar` uses Redux `auth` state to show user name.

---

**9. Common Beginner Confusions (clear answers)**

- Why multiple folders?
  - Keeps code organized so it's easier to find and change things. Each folder has a clear job.

- Why not write everything in one file?
  - One file would be messy and hard to maintain. Small files are easier to read and test.

- Why components are reusable?
  - Reusing avoids repeating code. Build once, use many times.

- Why props/state needed?
  - Props pass data down from parent to child. State stores data that can change inside a component.

---

**10. How I Can Modify This Project (step-by-step)**

- How to add a new component:
  1. Create a new file in `src/components/`, e.g. `src/components/MyCard.tsx`.
  2. Export default the component:

```tsx
export default function MyCard({ title }: { title: string }) {
  return <div className="p-4 border">{title}</div>;
}
```

  3. Use it in a page: `import MyCard from '@/components/MyCard'` then `<MyCard title="Hello" />`.

- How to change UI text:
  - Find the component or page that shows that text and edit the JSX string.
  - Example: Change app title in `src/components/Navbar.tsx` where it renders `HRECT.`

- How to add a new page (route):
  1. Create folder under `src/app`, e.g. `src/app/hello`.
  2. Add `page.tsx` inside it:

```tsx
export default function Page() {
  return <h1>Hello page</h1>;
}
```

  3. Visit `http://localhost:3000/hello` in browser.

- Which file to touch for specific change:
  - Change global CSS: `src/app/globals.css`.
  - Change axios settings: `src/config/axios/index.ts`.
  - Add shared state: `redux/` slices and `config/store`.
  - Change layout (site-wide header/footer): `src/app/layout.tsx`.

---

**Quick Commands (how to run locally)**

- Install dependencies (run from project root):

```bash
npm install
```

- Start dev server:

```bash
npm run dev
```

- Build for production:

```bash
npm run build
npm start
```

These scripts come from `package.json`.

---

**Extra Tips for Beginners**

- Read `src/app/layout.tsx` to see what wraps every page.
- Look into `src/config/axios/index.ts` to see how API errors are handled.
- Search `src/api/` to find where specific server calls are made.
- Use `console.log` to inspect data when you are learning (like the `console.log(user)` in `Navbar.tsx`).

---

If you want, I can:
- Show where to change the login form step-by-step.
- Add a small example page (`/hello`) to demonstrate a full flow.

File I created: [PROJECT_EXPLANATION.md](PROJECT_EXPLANATION.md)

