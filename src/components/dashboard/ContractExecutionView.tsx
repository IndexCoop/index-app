import { Flex, Link, Text } from '@chakra-ui/react'

type ContractExecutionViewProps = {
  blockExplorerUrl: string
  contractAddress: string
  name: string
}

export const ContractExecutionView = (props: ContractExecutionViewProps) => (
  <Flex
    direction='column'
    align='center'
    justify='center'
    mt='16px'
    fontSize='11px'
  >
    <Text>
      {`This trade will be executed on contract:`}
      <br />
    </Text>
    <Link
      href={props.blockExplorerUrl}
      isExternal
      style={{ textDecoration: 'underline' }}
    >
      {props.contractAddress}
    </Link>
  </Flex>
)
