import { Checkbox } from '@chakra-ui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

type OverrideProps = {
  onChange: (isChecked: boolean) => void
}

export const Override = (props: OverrideProps) => {
  return (
    <div className='bg-ic-gray-100 flex flex-col items-start gap-2 rounded-xl p-4'>
      <div className='items-top flex'>
        <ExclamationTriangleIcon className='text-ic-black mt-1 size-6 flex-none' />
        <p className='text-ic-black mx-4 text-sm'>
          This tx will likely fail. Check override and press the trade button
          again to execute anyway.
        </p>
      </div>
      <Checkbox onChange={(e) => props.onChange(e.target.checked)}>
        Override?
      </Checkbox>
    </div>
  )
}
