'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Path } from '@/constants/paths'
import { useAnalytics } from '@/lib/hooks/use-analytics'

type Props = {
  href: string
  label: string
}

export function HeaderLink({ href, label }: Props) {
  const pathname = usePathname()
  const { logEvent } = useAnalytics()
  const isActive =
    href === Path.SWAP ? pathname.startsWith(href) : pathname === href
  return (
    <Link
      className={clsx(
        'text-sm font-medium',
        isActive
          ? 'text-ic-gray-950 dark:text-ic-white'
          : 'text-ic-gray-500 hover:text-ic-gray-700 dark:hover:text-ic-gray-100 dark:text-ic-gray-300',
      )}
      href={href}
      onClick={() => logEvent('Header Link Clicked', { href })}
    >
      {label}
    </Link>
  )
}
