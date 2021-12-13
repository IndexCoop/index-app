import {
  Box,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Image,
} from "@chakra-ui/react";
import {useEthers} from "@usedapp/core";
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";
import metamaskIcon from "assets/metamask.png";
import walletconnectIcon from "assets/walletconnect.svg";
import {POLYGON} from "constants/chains";

type Props = {
  isOpen: any;
  onClose: any;
};

export default function ConnectModal({isOpen, onClose}: Props) {
  const {activateBrowserWallet, activate, account} = useEthers();

  const handleMetamask = () => {
    activateBrowserWallet();
  };

  const handleWalletConnect = () => {
    const wc = new WalletConnectConnector({
      rpc: {[POLYGON.chainId]: POLYGON.rpcUrl},
      chainId: POLYGON.chainId,
    });
    activate(wc, (err) => {
      console.error(err);
    });

    console.log(account);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent
        background="gray.900"
        border="1px"
        borderStyle="solid"
        borderColor="gray.700"
      >
        <ModalHeader color="white" px={4} fontSize="lg" fontWeight="medium">
          Connect to wallet
        </ModalHeader>
        <ModalCloseButton
          color="white"
          fontSize="sm"
          _hover={{
            color: "whiteAlpha.700",
          }}
        />
        <ModalBody pt={0} px={4}>
          <Box
            border="1px"
            borderStyle="solid"
            borderColor="gray.600"
            backgroundColor="gray.700"
            onClick={handleMetamask}
            _hover={{borderColor: "blue.600"}}
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={3}>
              <Text color="white" fontSize="lg">
                MetaMask
              </Text>
              <Image src={metamaskIcon} width={"10%"} />
            </Flex>
          </Box>
          <Box
            border="1px"
            borderStyle="solid"
            borderColor="gray.600"
            backgroundColor="gray.700"
            onClick={handleWalletConnect}
            _hover={{borderColor: "blue.600"}}
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={3}>
              <Text color="white" fontSize="lg">
                WalletConnect
              </Text>
              <Image src={walletconnectIcon} width={"10%"} />
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
