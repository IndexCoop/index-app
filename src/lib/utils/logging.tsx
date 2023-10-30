import React from 'react'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import BugsnagPerformance from '@bugsnag/browser-performance'

const apiKey = process.env.NEXT_PUBLIC_BUGSNAG!

Bugsnag.start({
  apiKey,
  plugins: [new BugsnagPluginReact()],
})
BugsnagPerformance.start({ apiKey })

export const ErrorBoundary =
  Bugsnag.getPlugin('react')!.createErrorBoundary(React)
