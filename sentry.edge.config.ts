// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://56a0c37921d966ca831647a0bb314226@o4507393908211712.ingest.de.sentry.io/4507393908605008',
  enabled: process.env.NODE_ENV === 'production',
  // Turn on if you wanna log the console
  // integrations: [Sentry.captureConsoleIntegration()],
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
})
