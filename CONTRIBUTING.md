# Contributing to [Sheryians Hiring Platform](https://hire.sheryians.com/)

First off, thank you for considering contributing to our project! It's people like you who make the open-source community such an amazing place to learn, inspire, and create.

---

## 📋 How to Get Started

### 1. Fork the Repository

Click the **Fork** button at the top right of this page. This creates a copy of the project in your own GitHub account.

### 2. Clone Your Fork

Open your terminal and run:

```bash
git clone https://github.com/YOUR_USERNAME/recruitment-client.git
cd recruitment-client
```

> 🔗 **Original repository:** `https://github.com/test-organization-sheryians/recruitment-client.git`

### 3. Set Up the Environment

Since this is a **Next.js** frontend project, ensure you have **Node.js** installed.

- Install dependencies:
  ```bash
  npm install
  ```
- Create a `.env.local` file based on `.env.example`:
  ```bash
  cp .env.example .env.local
  ```
- Start the development server:
  ```bash
  npm run dev
  ```
- Open [http://localhost:3000](http://localhost:3000) in your browser to see the app running.

### 4. Create a Branch

**Never** work directly on the `main` branch. Create a new branch for your feature or fix:

```bash
git checkout -b feature/your-feature-name
```

---

## 🛠 Making Changes

- **Code Quality:** Please follow the existing coding style (Prettier/ESLint rules are included in the project). You can lint your code with:
  ```bash
  npm run lint
  ```
- **Component Structure:** Keep components modular and reusable. Place new components in the appropriate folder under `src/components/`.
- **Styling:** Follow the existing Tailwind CSS conventions used throughout the project. Avoid inline styles.
- **Commit Messages:** Use descriptive commit messages following the convention below:

  | Type | Example |
  |------|---------|
  | New feature | `feat: added job listing filter UI` |
  | Bug fix | `fix: resolved mobile navbar overflow` |
  | Styling | `style: updated candidate card layout` |
  | Documentation | `docs: updated README setup steps` |
  | Refactor | `refactor: simplified auth context logic` |

---

## 🚀 Submitting Your Changes

### 1. Run a Production Build

**Before pushing, always run the build command** to make sure your changes compile successfully with no errors:

```bash
npm run build
```

> ⚠️ **Do not push if the build fails.** Fix all build errors locally before proceeding. A broken build will cause the PR to be rejected.

### 2. Push to Your Fork

Once the build passes, push your changes:

```bash
git add .
git commit -m "Brief description of changes"
git push origin feature/your-feature-name
```

### 3. Open a Pull Request (PR)

- Go to the [original repository](https://github.com/test-organization-sheryians/recruitment-client) on GitHub.
- You will see a banner saying **"Compare & pull request."** Click it.
- Describe your changes in detail. Mention any related **Issues** (e.g., `Closes #12`).
- Attach screenshots or screen recordings if your PR includes any UI changes — this helps reviewers a lot!
- **Wait for Review:** One of our team members will review your code. We might ask for some small changes before merging!

---

## 🤝 Community Guidelines

- Be respectful to all contributors.
- Check the **Issues** tab before starting work to ensure no one else is already working on the same thing.
- When in doubt, open an **Issue** first to discuss your proposed change before writing code.
- For any UI changes, ensure the layout is tested on both **mobile and desktop** viewports before submitting.

---

## 🔗 Useful Links

| Resource | Link |
|----------|------|
| 🌐 Live Project | [hire.sheryians.com](https://hire.sheryians.com/) |
| 📦 Frontend Repo | [recruitment-client](https://github.com/test-organization-sheryians/recruitment-client) |
| ⚙️ Backend Repo | [recruitment-server](https://github.com/test-organization-sheryians/recruitment-server) |
| 🐛 Report a Bug | [Open an Issue](https://github.com/test-organization-sheryians/recruitment-client/issues) |

---

*Happy contributing! 🎉*
