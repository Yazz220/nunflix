import { createClient } from '@supabase/supabase-js';
import * as Sentry from 'sentry';

// Initialize Sentry
if (Deno.env.get('SENTRY_DSN')) {
  Sentry.init({ dsn: Deno.env.get('SENTRY_DSN') });
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (_req: Request) => {
  try {
    const { data: providers, error: fetchError } = await supabase
      .from('embed_providers')
      .select('id, base_url');

    if (fetchError) {
      Sentry.captureException(fetchError);
      throw new Error('Failed to fetch providers from database');
    }

    if (!providers) {
      throw new Error('No providers found');
    }

    for (const provider of providers) {
      let isActive = false;
      try {
        // Use a dummy ID for the health check
        const url = provider.base_url.includes('?')
          ? `${provider.base_url}1`
          : `${provider.base_url}/movie/1`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

        const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeoutId);

        isActive = response.ok;

      } catch (e: any) {
        // Any error (fetch error, timeout) means the provider is not active
        console.warn(`Health check failed for ${provider.base_url}:`, e.message);
        isActive = false;
      }

      const { error: updateError } = await supabase
        .from('embed_providers')
        .update({
          is_active: isActive,
          last_checked_at: new Date().toISOString(),
        })
        .eq('id', provider.id);

      if (updateError) {
        Sentry.captureException(updateError);
        console.error(`Failed to update provider ${provider.id}:`, updateError);
      }
    }

    return new Response(JSON.stringify({ message: 'Health checks complete' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    Sentry.captureException(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});