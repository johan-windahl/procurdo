# .gitignore Update for Monorepo

## Changes Made

Updated `.gitignore` to properly handle the monorepo structure and removed previously tracked build artifacts.

### Key Updates

1. **Changed absolute paths to relative patterns**

   - `/node_modules` → `node_modules/` (ignores in all directories)
   - `/.next/` → `.next/` (ignores in all directories)
   - `/build` → `build/` (ignores in all directories)

2. **Added monorepo-specific ignores**

   - `packages/shared/dist/` - Compiled TypeScript output
   - `.turbo` - Turborepo cache (if you add it later)
   - `dist/` - General build output directory

3. **Added common IDE/editor files**

   - `.idea/` - JetBrains IDEs
   - `.vscode/` - VS Code settings
   - `*.swp`, `*.swo`, `*~` - Vim swap files

4. **Improved environment file handling**

   - `.env*` - Ignore all env files
   - `!.env.example` - But allow .env.example to be committed

5. **Added OS-specific files**
   - `Thumbs.db` - Windows thumbnail cache
   - `.DS_Store` - macOS folder metadata (was already there)

### Files Removed from Git Tracking

The following build artifacts were previously tracked and have been removed:

#### 1. Next.js Build Output (`apps/web/.next/`)

- All `.next` directory contents (hundreds of files)
- These are regenerated on every build

#### 2. TypeScript Compiled Output (`packages/shared/dist/`)

- `dist/db/schema.js` and `.d.ts` files
- `dist/lib/db.js` and `.d.ts` files
- `dist/lib/utils.js` and `.d.ts` files
- `dist/index.js` and `.d.ts` files
- All source maps (`.js.map`, `.d.ts.map`)

These files are now properly ignored and will be regenerated during builds.

## Updated .gitignore Structure

```gitignore
# dependencies
node_modules/

# testing
coverage/

# next.js (in apps/web and any future Next.js apps)
.next/
out/

# production builds
build/
dist/

# misc
.DS_Store
*.pem
.idea/
.vscode/
*.swp
*.swo
*~

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
lerna-debug.log*

# env files
.env*
!.env.example

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# turbo
.turbo

# monorepo specific
packages/shared/dist/

# OS files
.DS_Store
Thumbs.db
```

## Why This Matters

### Before (Issues)

- Build artifacts were being committed to git
- Repository size was unnecessarily large
- Merge conflicts on build files
- Different build outputs between developers

### After (Benefits)

- ✅ Clean git history without build artifacts
- ✅ Smaller repository size
- ✅ No merge conflicts on generated files
- ✅ Consistent builds across environments
- ✅ Proper monorepo support

## What Gets Committed

### ✅ Should be committed:

- Source code (`*.ts`, `*.tsx`, `*.js`, `*.jsx`)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Database migrations (`packages/shared/db/migrations/*.sql`)
- Static assets (`public/` directory)
- Documentation (`*.md`)
- `.env.example` (template for environment variables)

### ❌ Should NOT be committed:

- `node_modules/` - Dependencies (installed via pnpm)
- `.next/` - Next.js build output
- `dist/` - Compiled TypeScript output
- `*.tsbuildinfo` - TypeScript incremental build cache
- `.env`, `.env.local`, etc. - Environment variables with secrets
- Build logs and debug files

## Verification

After these changes, your git status should be clean of build artifacts:

```bash
# Check what's staged
git status

# You should see:
# - Modified: .gitignore
# - Deleted: apps/web/.next/* (many files)
# - Deleted: packages/shared/dist/* (many files)
```

## Next Steps

1. **Review the changes**:

   ```bash
   git diff .gitignore
   ```

2. **Commit the updates**:

   ```bash
   git add .gitignore
   git commit -m "chore: Update .gitignore for monorepo structure"
   ```

3. **Clean up (optional)**:

   ```bash
   # Remove all ignored files from working directory
   git clean -fdX

   # Or just rebuild
   pnpm build
   ```

## Important Notes

- The `.next` and `dist` directories will be regenerated on next build
- CI/CD pipelines should build these from scratch
- Vercel builds from source, so this doesn't affect deployment
- Local development will rebuild as needed

## Future Considerations

If you add more packages or apps:

- Add their build output directories to `.gitignore`
- Follow the pattern: `packages/[package-name]/dist/`
- Add any package-specific build artifacts
