import Link from 'next/link'

export function MoreQuestions() {
  return (
    <div className='text-ic-gray-600 mt-16 text-sm font-medium'>
      Have other questions? More staking info{' '}
      <Link
        className='underline'
        href='https://indexcoop.com/TODO'
        target='_blank'
      >
        here
      </Link>
    </div>
  )
}
