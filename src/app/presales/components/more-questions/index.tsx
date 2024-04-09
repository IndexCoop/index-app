import Link from 'next/link'

// FIXME: add blog link
export function MoreQuestions() {
  return (
    <div className='text-ic-gray-600 mt-16 text-sm font-medium'>
      Have more questions? More presale info{' '}
      <Link className='underline' href='' target='_blank'>
        here
      </Link>
    </div>
  )
}
