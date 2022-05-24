import { Button, Flex, Spinner, Text } from '@chakra-ui/react'

const backgroundColor = '#000'
const textColor = '#fff'
const fontSize = 'md'
const fontWeight = 700

// TODO: add states (pending, success, failed)

type TransactionStateHeaderProps = {
  onClick: () => void
}

const TransactionStateHeader = ({ onClick }: TransactionStateHeaderProps) => (
  <Flex>
    <Button
      onClick={onClick}
      background={textColor}
      borderColor={backgroundColor}
      borderRadius='32'
      color={backgroundColor}
      fontSize={fontSize}
      fontWeight={fontWeight}
      padding='6px 16px'
      _hover={{
        transform:
          'translate3d(0px, 2px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      <Spinner size='sm' mr='16px' /> 1 Pending
    </Button>
  </Flex>
)

export default TransactionStateHeader
