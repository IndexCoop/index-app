import clsx from 'clsx'

type Props = {
  className?: string
}
export function LoadingSkeleton({ className }: Props) {
  return (
    <div
      className={clsx(
        'w-20 h-6 rounded-lg bg-ic-gray-200 animate-pulse ml-auto',
        className,
      )}
    />
  )
}
