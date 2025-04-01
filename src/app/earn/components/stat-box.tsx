export const StatBox = ({ label, value }: { label: string; value: string }) => (
  <div className='w-[calc(50%-8px)] space-y-9 rounded-lg border border-neutral-700 p-4 transition-all hover:bg-zinc-800/90'>
    <p className='text-xs font-medium text-neutral-400'>{label}</p>
    <p className='text-xl font-medium'>{value}</p>
  </div>
)
