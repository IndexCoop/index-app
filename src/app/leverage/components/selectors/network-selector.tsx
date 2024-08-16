type NetworkSelectorProps = {
  onSelectNetwork: (chainId: number) => void
}

export function NetworkSelector(props: NetworkSelectorProps) {
  return (
    <div className='flex flex-col'>
      <div className='text-xs font-normal text-gray-100'>Network</div>
      <div></div>
    </div>
  )
}
