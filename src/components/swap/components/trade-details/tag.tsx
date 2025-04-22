interface TagProps {
  label: string
}

export const Tag = ({ label }: TagProps) => (
  <p className='text-ic-gray-600 text-xs font-semibold'>{label}</p>
)
