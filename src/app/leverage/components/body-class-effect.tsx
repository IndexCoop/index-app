'use client'

import { useEffect } from 'react'

export function BodyClassEffect() {
  useEffect(() => {
    document.body.classList.add('dark', 'bg-zinc-950')
    return () => {
      document.body.classList.remove('dark', 'bg-zinc-950')
    }
  }, [])

  return null
}
