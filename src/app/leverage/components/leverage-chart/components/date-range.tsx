function DateRangeItem({ label }: { label: string }) {
  return <div className='text-ic-gray-400 text-xs font-medium'>{label}</div>
}

const range = ['Dec 26', 'Dec 30', 'Jan 02', 'Jan 09', 'Jan 13', 'Jan 20']
export function DateRange() {
  return (
    <div className='mx-5 flex flex-row justify-between'>
      {range.map((range, index) => (
        <DateRangeItem key={index} label={range} />
      ))}
    </div>
  )
}
