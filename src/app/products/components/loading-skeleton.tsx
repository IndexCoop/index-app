import clsx from 'clsx'

type Props = {
  className?: string
}
export function LoadingSkeleton({ className }: Props) {
  return (
    <div
      className={clsx(
        'bg-ic-gray-200 ml-auto h-6 w-20 animate-pulse rounded-lg',
        className,
      )}
    />
  )
}
