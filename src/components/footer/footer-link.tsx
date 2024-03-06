import Link from 'next/link'

type Props = {
  children: string
  href: string
}

export function FooterLink({ children, href }: Props) {
  return (
    <li>
      <Link
        target='_blank'
        href={href}
        className='text-ic-gray-600 hover:text-ic-gray-900 dark:hover:text-ic-gray-600 dark:text-ic-gray-400 text-sm leading-6'
      >
        {children}
      </Link>
    </li>
  )
}
