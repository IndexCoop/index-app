'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Path } from '@/constants/paths'

type Props = {
  href: string
  label: string
}

export function HeaderLink({ href, label }: Props) {
  const pathname = usePathname()
  const isActive =
    href === Path.TRADE ? pathname.startsWith(href) : pathname === href
  return (
    <Link
      className={clsx(
        'font-semibold',
        isActive
          ? 'text-ic-gray-950 dark:text-ic-gray-50'
          : 'text-ic-gray-500 hover:text-ic-gray-700 dark:hover:text-ic-gray-100 dark:text-ic-gray-300',
      )}
      href={href}
    >
      {label}
    </Link>
  )
}
