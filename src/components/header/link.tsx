import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Path } from '.'

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
        isActive ? 'text-gray-950' : 'text-gray-500 hover:text-gray-700'
      )}
      href={href}
    >
      {label}
    </Link>
  )
}
