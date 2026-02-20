# 🤝 Contributing Guide

Thanks for contributing! Please follow these guidelines so our codebase stays clean and scalable.

---

## 🔀 Branching Strategy
- main → Production (only stable, tested code)
- develop → Staging (integrated features before release)
- feature/<name> → For new features
- fix/<name> → For bug fixes

Example:

git checkout -b feature/login-page

---

## 💬 Commit Messages (Conventional Commits)
- feat: – new feature  
- fix: – bug fix  
- docs: – documentation changes  
- style: – formatting (no logic change)  
- refactor: – code refactor  
- chore: – build / CI changes  

Examples:
feat(auth): add login form
fix(ui): button alignment on mobile

---

## ✅ Pull Request Rules
- Create PRs into develop
- PR title should follow commit style
- Run lint before pushing:
npm run lint

- Small PRs (max 300 lines)
- At least *1 reviewer approval*

---

## 🧪 Testing
- Each feature should include at least 1 test
- Snapshot/UI tests for reusable components
- API hooks tested with mocked responses

---

## 🎨 Code Style
- Components: *PascalCase* filenames
- Hooks: *useSomething.ts*
- Reusable UI in src/components/ui/
- Feature-specific UI in src/features/<feature>/components/
- Never hardcode colors → use Tailwind theme tokens
- Use TypeScript strict types (no any)