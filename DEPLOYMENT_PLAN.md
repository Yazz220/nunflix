# CI/CD & Deployment Plan (P4)

## 1. GitHub Actions -> Vercel
- **Add a workflow file:** Create `.github/workflows/ci.yml` in your repo.
- **Trigger on:**
  - `pull_request` -> run lint, type-check, and any unit/integration tests.
  - `push` to `main` -> run the same checks, then build and deploy.
- **Install & run scripts:**
  - `pnpm install` (or `npm ci`)
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`
  - `npx vercel --prod --token $VERCEL_TOKEN`
- **Store secrets:** In GitHub repo Settings -> Secrets:
  - `VERCEL_TOKEN` (for deployments)
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TMDB_KEY`, `SENTRY_DSN`, etc.
- **Vercel project hook:**
  - Link your repo in Vercel.
  - Ensure Vercel picks up the same environment variables.
  - Verify that after a merge to `main`, Vercel automatically deploys the new build.

## 2. Preview Environments
- **Enable branch previews:** In your Vercel project settings, turn on "Create a Preview Deployment for every Git push."
- **Test the flow:**
  - Open a feature branch, push a small change (e.g. tweak a button color), and confirm:
    - GitHub shows a "Vercel Preview" check on the PR.
    - Vercel provides a unique preview URL.
    - All dynamic env vars (TMDB_KEY, Supabase URL, etc.) work in the preview.
- **Review & promote:**
  - Team members can review UI & functionality in the preview.
  - When approved, merge into `main` and let the production deployment go live.

## 3. Supabase Migrations
- **Commit your SQL migrations:** If you haven’t already, generate migration files via `supabase migrations new …`.
- **Commit the resulting `migrations/*.sql` files to your repo.**
- **Wire migrations into CI:** In your GitHub Actions workflow (after `pnpm build`, before `deploy`), add:
  ```bash
  npx supabase db push \
    --project-url $SUPABASE_URL \
    --admin-key $SUPABASE_SERVICE_ROLE_KEY
  ```
- **Version control & rollback:** Each migration file is versioned in Git—if you ever need to roll back, you can revert the commit and re-run `supabase db push` to reverse the schema change.

## 🔑 Success Criteria
- Green CI pipeline. Any bad code or lint errors are caught before merging.
- Preview URLs. Every branch has a live staging site identical to prod.
- Automated migrations. Your DB schema stays in sync with your code without manual steps.