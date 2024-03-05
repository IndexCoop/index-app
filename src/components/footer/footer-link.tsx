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
        className='text-sm leading-6 text-ic-gray-600 hover:text-ic-gray-900'
      >
        {children}
      </Link>
    </li>
  )
}
