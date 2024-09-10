import { cn } from '@/lib/utils/tailwind'
import { FC } from 'react'

type SkeletonLoaderProps = {
  delay?: number
  className?: string
}

export const SkeletonLoader: FC<SkeletonLoaderProps> = ({
  className,
  delay = 0,
}) => {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg bg-black bg-opacity-30 shadow-xl',
        'transition-all duration-500',
        className,
      )}
    >
      <div
        className='animate-shine absolute left-0 top-0 h-full w-full skew-x-[-30deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]'
        style={{
          animationDelay: `${delay}ms`,
        }}
      />
    </div>
  )
}
