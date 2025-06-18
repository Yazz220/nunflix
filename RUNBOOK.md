# Nunflix Runbook

## 1. Introduction
This runbook provides operational guidance for maintaining the Nunflix service. It covers how to respond to alerts, troubleshoot common issues, and perform manual operations.

**On-Call Contact:**
*   **Primary:** [Name of primary on-call engineer]
*   **Secondary:** [Name of secondary on-call engineer]
*   **Escalation:** [Link to Slack channel or PagerDuty]

## 2. Responding to Sentry Alerts

### Alert Triage
1.  **Assess the Impact:** Determine the severity of the alert. Is it affecting all users or a small subset? Is it a critical path (e.g., login, video playback) or a non-critical feature?
2.  **Check for Recent Deployments:** Correlate the alert with recent deployments in the Vercel dashboard.
3.  **Review the Logs:** Use the Sentry dashboard to review the full error stack trace and any associated logs.

### Common Alerts & Resolutions
*   **High Error Rate:**
    *   **Cause:** Often caused by a recent deployment with a bug.
    *   **Resolution:**
        1.  Investigate the errors in Sentry.
        2.  If a recent deployment is the cause, consider rolling back to the previous version in the Vercel dashboard.
*   **Scraper Failures:**
    *   **Cause:** The structure of the target website may have changed, or the site may be down.
    *   **Resolution:** See the "Troubleshooting Scraper Failures" section below.

## 3. Troubleshooting Common Issues

### Scraper Failures
1.  **Check the Logs:** Review the logs for the `fallback-scraper` function in the Supabase dashboard.
2.  **Verify Scrape Targets:**
    *   Manually visit the URLs in the `SCRAPE_TARGETS` array in `nunflix-nextjs-frontend/supabase/functions/fallback-scraper/index.ts`.
    *   Ensure the HTML structure has not changed and the CSS selectors are still valid.

### Deployment Failures
1.  **Check the GitHub Actions Logs:** All deployments are handled automatically by the CI/CD pipeline. Review the logs for the failed deployment in the "Actions" tab of the GitHub repository.
2.  **Check the Vercel Logs:** If the GitHub Actions workflow succeeds but the deployment fails, review the build and deployment logs in the Vercel dashboard.
3.  **Validate on Preview URL:** Before merging a fix, validate it on the Vercel preview URL, which is automatically generated for each pull request.

## 4. Manual Operations

### Manual Cache Refresh
To manually trigger a cache refresh, invoke the `cache-refresh` Supabase function. This can be done via the Supabase dashboard or the Supabase CLI.

### Manual Provider Health Check
To manually trigger a provider health check, invoke the `provider-health-check` Supabase function. This can be done via the Supabase dashboard or the Supabase CLI.