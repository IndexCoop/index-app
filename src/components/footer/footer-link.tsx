'use client'

import Link from 'next/link'
import { HTMLAttributeAnchorTarget } from 'react'

import { useAnalytics } from '@/lib/hooks/use-analytics'

type Props = {
  children: string
  href: string
  target?: HTMLAttributeAnchorTarget | undefined
}

export function FooterLink({ children, href, target }: Props) {
  const { logEvent } = useAnalytics()
  return (
    <li>
      <Link
        target={target ?? '_blank'}
        href={href}
        className='text-ic-gray-600 hover:text-ic-gray-900 dark:hover:text-ic-gray-400 dark:text-ic-gray-200 text-sm leading-6'
        onClick={() => logEvent('Header Link Clicked', { href })}
      >
        {children}
      </Link>
    </li>
  )
}
