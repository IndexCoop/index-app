#!/usr/bin/env node

require('dotenv').config()

const API_URL = 'http://127.0.0.1:4000/documentation/json'
const MAX_RETRIES = 30
const RETRY_INTERVAL = 2000 // 2 seconds

async function waitForApi() {
  // Skip if not local environment
  if (process.env.KUBB_ENV !== 'local') {
    console.log(`KUBB_ENV="${process.env.KUBB_ENV || ''}", skipping API wait`)
    return
  }

  console.log(`Waiting for local API at ${API_URL}...`)

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(API_URL)
      if (response.ok) {
        console.log('API is ready!')
        process.exit(0)
      }
    } catch {
      // API not ready yet
    }

    console.log(
      `Attempt ${i + 1}/${MAX_RETRIES} - API not ready, retrying in ${RETRY_INTERVAL / 1000}s...`,
    )
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL))
  }

  console.error(`API did not become ready after ${MAX_RETRIES} attempts`)
  process.exit(1)
}

waitForApi()
