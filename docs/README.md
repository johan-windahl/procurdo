# Procurdo Documentation

Welcome to the Procurdo documentation! This directory contains all technical documentation for the project.

## 📚 Documentation Structure

### Migration Guides

Documentation related to major structural changes and migrations.

- [Monorepo Migration](./migration/monorepo-migration.md) - Complete guide to the monorepo restructure
- [.gitignore Update](./migration/gitignore-update.md) - Changes to .gitignore for monorepo

### Deployment Guides

Instructions for deploying and configuring the application.

- [Vercel Deployment Guide](./deployment/vercel-deployment-guide.md) - Complete Vercel deployment instructions
- [Vercel Edge Runtime Fix](./deployment/vercel-edge-runtime-fix.md) - Quick fix for Clerk Edge Runtime issues

### Architecture

Documentation about the system architecture and design decisions.

- Coming soon...

## 🚀 Quick Links

### For Developers

- [Root README](../README.md) - Project overview and quick start
- [AGENTS.md](../AGENTS.md) - Development rules and guidelines

### Common Tasks

**Setting up the project:**

```bash
pnpm install
```

**Running development server:**

```bash
pnpm dev
```

**Building for production:**

```bash
pnpm build
```

**Database operations:**

```bash
pnpm db:gen      # Generate migration
pnpm db:migrate  # Run migrations
pnpm db:studio   # Open Drizzle Studio
```

## 📝 Contributing to Documentation

When adding new documentation:

1. **Choose the right folder:**

   - `migration/` - Migration guides, structural changes
   - `deployment/` - Deployment and hosting guides
   - `architecture/` - Architecture decisions, system design

2. **Use descriptive filenames:**

   - Use lowercase with dashes: `my-feature-guide.md`
   - Be specific: `vercel-edge-runtime-fix.md` not `fix.md`

3. **Follow the template:**

   - Start with a clear title (# Title)
   - Include a brief overview
   - Use headings for structure (##, ###)
   - Add code examples with syntax highlighting
   - Include troubleshooting sections when relevant

4. **Update this index:**
   - Add your new document to the appropriate section above

## 🔍 Finding Documentation

- **Migration issues?** → Check `migration/`
- **Deployment problems?** → Check `deployment/`
- **Architecture questions?** → Check `architecture/`
- **Development workflow?** → Check `AGENTS.md`
- **Quick start?** → Check root `README.md`

## 📖 Documentation Standards

### Code Examples

Always use proper syntax highlighting:

````markdown
```typescript
// Your TypeScript code here
```

```bash
# Your shell commands here
```
````

### File Paths

Reference files relative to the repository root:

- ✅ `apps/web/package.json`
- ❌ `./package.json` (ambiguous)

### Commands

Show commands with their working directory:

```bash
# From repository root
cd /path/to/procurdo
pnpm install
```

### Links

Use relative links for internal documentation:

- ✅ `[Migration Guide](./migration/monorepo-migration.md)`
- ❌ `[Migration Guide](https://github.com/...)`

## 🆘 Need Help?

If you can't find what you're looking for:

1. Check the [root README](../README.md)
2. Check [AGENTS.md](../AGENTS.md) for development guidelines
3. Search through existing documentation
4. Create an issue or ask the team

## 📅 Documentation Updates

This documentation is actively maintained. Last major update: October 2025 (Monorepo Migration)
