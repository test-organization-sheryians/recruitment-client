# 👥 Team Workflow

## 🔄 Development Process

1. Pick a story from Clickup
2. Create a feature branch: feature/<name>
3. Build inside /features/<feature>
4. Push → Create PR → Request review

---

## 📂 Folder Structure

bash
src/
├── app/ # Next.js routes
├── components/ui/ # Global reusable UI (buttons, modals)
├── features/
│ ├── auth/ # Example feature
│ │ ├── components/
│ │ ├── services/
│ │ ├── hooks/
│ │ └── types.ts
│ └── resume/
├── lib/ # Axios instance, constants, utils
├── hooks/ # Shared custom hooks
└── styles/ # Global CSS & 



### Detailed Folder Structure

bash

src/
  app/                   # Next.js app directory (routing, layouts, pages)
    (marketing)/         # Route groups (for landing pages, blogs, etc.)
    (dashboard)/         # Route groups (protected app areas)
    api/                 # API routes (if using Next API routes)
    layout.tsx           # Root layout
    page.tsx             # Root page

  components/            # Shared reusable UI components
    ui/                  # Wrapper for shadcn/ui components (customized versions)
    common/              # App-wide shared components (Navbar, Footer, Sidebar)
    forms/               # Form-related components (FormInput, FormSelect, etc.)
    icons/               # Custom icons
    charts/              # Chart components (if using recharts/d3)

  features/              # Feature-based architecture (recommended for scaling)
    auth/                # Auth related (login, register, reset password)
      components/
      hooks/
      services/
    resume/              # Example feature (resume builder)
      components/
      hooks/
      services/

  hooks/                 # Global reusable hooks (e.g., useMediaQuery)
  lib/                   # Utilities, API clients, constants
    utils.ts
    axios.ts
    constants.ts
  store/                 # Zustand/Redux or other global state management
  types/                 # TypeScript types/interfaces
  styles/                # Global styles (tailwind, CSS vars, theme)
  config/                # App config (env, constants, feature flags)
  middleware.ts          # Auth, logging, etc.

public/                  # Static assets (images, fonts, icons)


---

## 🎯 Best Practices

- Use *shadcn/ui* for consistency
- Keep *UI logic separate* from API calls
- *Type safety first* → avoid any
- Use React Query for all async data
- Write docstrings for exported functions/components
- Dark mode support mandatory for all components