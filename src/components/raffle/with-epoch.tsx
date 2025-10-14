import { useRaffleEpoch } from '@/lib/hooks/use-raffle-epoch'

export const withEpoch = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  const WrappedComponent = (props: P) => {
    const { data: raffleEpoch } = useRaffleEpoch()

    // Only render if there's an active epoch AND it's not silent
    if (!raffleEpoch || raffleEpoch.silent) {
      return null
    }

    return <Component {...props} />
  }

  WrappedComponent.displayName = `withEpoch(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}
