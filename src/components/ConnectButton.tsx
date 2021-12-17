import {Button, useDisclosure} from "@chakra-ui/react";
import {useEthers} from "@usedapp/core";
import {useEffect} from "react";

import ConnectModal from "./ConnectModal";

const ConnectButton = (props: {handleOpenModal: any}) => {
  const {account, deactivate} = useEthers();
  const {isOpen, onOpen, onClose} = useDisclosure();

  const handleConnectWallet = () => {
    console.log("handleConnectWallet", account, deactivate);
    onOpen();
  };

  const handleDisconnect = () => {
    deactivate();
    onClose();
  };

  useEffect(() => {
    console.log(account);
  }, [account]);

  const connectButton = () => {
    return (
      <div>
        <Button
          onClick={handleConnectWallet}
          bg="black"
          color="gray.300"
          fontSize="lg"
          fontWeight="medium"
          border="1px solid white"
          borderRadius="0"
          _hover={{
            borderColor: "gray.700",
            color: "gray.400",
          }}
          _active={{
            backgroundColor: "gray.800",
            borderColor: "gray.700",
          }}
        >
          Connect
        </Button>
        <ConnectModal isOpen={isOpen} onClose={onClose} />
      </div>
    );
  };

  const disconnectButton = () => {
    return (
      <Button
        onClick={handleDisconnect}
        bg="black"
        color="gray.300"
        fontSize="lg"
        fontWeight="medium"
        border="1px solid white"
        borderRadius="0"
        _hover={{
          borderColor: "gray.700",
          color: "gray.400",
        }}
        _active={{
          backgroundColor: "gray.800",
          borderColor: "gray.700",
        }}
      >
        Disconnect
      </Button>
    );
  };

  return account ? disconnectButton() : connectButton();
};
export default ConnectButton;
