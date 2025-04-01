import { cn } from '@/lib/utils/tailwind'

export const ProductTag = ({
  text,
  className,
}: {
  text: string
  className?: string
}) => (
  <div
    key={`tag-item-${text}`}
    className={cn('rounded-[4px] bg-neutral-700 px-2 py-1', className)}
  >
    <p className='text-[0.625rem] font-medium tracking-[0.03em]'>{text}</p>
  </div>
)
