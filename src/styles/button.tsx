export const Button = {
  baseStyle: {
    border: '2px solid',
    fontSize: 'md',
    fontWeight: 'bold',
    px: 6,
    py: 4,
    _disabled: {
      backgroundColor: 'rgba(132, 132, 132, 0.12)',
      borderColor: '#555555',
      color: '#555555',
    },
  },
  // TODO: update variants with correct imported colors
  variants: {
    green: {
      backgroundColor: 'rgba(9, 170, 116, 0.12)',
      borderColor: '#09AA74',
      color: '#09AA74',
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
