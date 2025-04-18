import { Checkbox } from '@chakra-ui/react'
import { Field, Label } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

type OverrideProps = {
  onChange: (isChecked: boolean) => void
  override: boolean
}

export const Override = ({ onChange, override }: OverrideProps) => {
  return (
    <div className='bg-ic-gray-100 flex flex-col items-start gap-2 rounded-xl p-4'>
      <div className='items-top flex'>
        <ExclamationTriangleIcon className='text-ic-black mt-1 size-6 flex-none' />
        <p className='text-ic-black mx-4 text-sm'>
          This tx will likely fail. Check override and press the trade button
          again to execute anyway.
        </p>
      </div>
      <Field className='flex cursor-pointer items-center gap-2'>
        <Checkbox
          checked={override}
          className='data-[checked]:bg-ic-blue-500 bg-ic-white group block size-4 rounded border'
          onChange={() => onChange(!override)}
        >
          <svg
            className='stroke-white opacity-0 group-data-[checked]:opacity-100'
            viewBox='0 0 14 14'
            fill='none'
          >
            <path
              d='M3 8L6 11L11 3.5'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </Checkbox>
        <Label className='text-ic-black mx-4 cursor-pointer text-sm font-bold'>
          Override?
        </Label>
      </Field>
    </div>
  )
}
