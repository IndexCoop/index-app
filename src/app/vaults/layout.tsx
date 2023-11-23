'use client'

import { Providers } from './providers'

type LayoutProps = {
  children: React.ReactNode
}

export default function VaultsLayout({ children }: LayoutProps) {
  return <Providers>{children}</Providers>
}
