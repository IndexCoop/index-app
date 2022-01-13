export const Button = {
  baseStyle: {
    border: '2px solid',
    fontSize: 'md',
    fontWeight: 'bold',
    px: 6,
    py: 4,
  },
  // TODO: update variants with correct imported colors
  variants: {
    gray: {
      backgroundColor: 'rgba(128, 128, 128, 0.2)',
      borderColor: 'gray',
      color: 'gray',
    },
    green: {
      backgroundColor: 'rgba(0, 128, 0, 0.2)',
      borderColor: 'green',
      color: 'green',
    },
    purple: {
      backgroundColor: 'rgba(128, 0, 128, 0.2)',
      borderColor: 'purple.500',
      color: 'purple.500',
    },
  },
  defaultProps: {
    variant: 'green',
  },
}
