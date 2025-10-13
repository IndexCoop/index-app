import { cn } from '@/lib/utils/tailwind'

export enum ToggleState {
  auto,
  custom,
}

type ToggleButtonProps = {
  label: string
  isDisabled: boolean
  selected: boolean
  onClick: () => void
}

const ToggleButton = (props: ToggleButtonProps) => (
  <div
    onClick={props.onClick}
    className={cn(
      'flex flex-1 cursor-pointer justify-center rounded-[10px] px-4 py-2.5',
      props.selected ? 'bg-ic-gray-100' : 'bg-ic-white',
    )}
  >
    <p
      className={cn(
        'text-sm font-medium',
        props.isDisabled ? 'text-ic-gray-100' : 'text-ic-gray-900',
      )}
    >
      {props.label}
    </p>
  </div>
)

type ToggleProps = {
  toggleState: ToggleState
  labelLeft: string
  labelRight: string
  isDisabled: boolean
  onClick: (toggleState: ToggleState) => void
}

export const Toggle = (props: ToggleProps) => (
  <div className='bg-ic-white border-ic-gray-100 flex justify-center rounded-xl border p-1'>
    <ToggleButton
      isDisabled={props.isDisabled && props.toggleState === ToggleState.custom}
      label={props.labelLeft}
      onClick={() => props.onClick(ToggleState.auto)}
      selected={props.toggleState === ToggleState.auto}
    />
    <ToggleButton
      isDisabled={props.isDisabled && props.toggleState === ToggleState.auto}
      label={props.labelRight}
      onClick={() => props.onClick(ToggleState.custom)}
      selected={props.toggleState === ToggleState.custom}
    />
  </div>
)
