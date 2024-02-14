'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  href: string
  label: string
}

export function HeaderLink({ href, label }: Props) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      className={clsx(
        'font-semibold',
        isActive ? 'text-gray-950' : 'text-gray-500 hover:text-gray-700',
      )}
      href={href}
    >
      {label}
    </Link>
  )
}
