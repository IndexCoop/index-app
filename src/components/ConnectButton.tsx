import {Button, Box, Text, useDisclosure} from "@chakra-ui/react";
import {ChainId, useEthers} from "@usedapp/core";
import {useState, useEffect} from "react";

import ConnectModal from "./ConnectModal";

const ConnectButton = (props: {handleOpenModal: any}) => {
  const {account} = useEthers();
  const {isOpen, onOpen, onClose} = useDisclosure();

  const handleConnectWallet = () => {
    onOpen();
  };

  useEffect(() => {
    console.log(account);
  }, [account]);

  return (
    <div>
      <Button
        onClick={handleConnectWallet}
        bg="blue.800"
        color="blue.300"
        fontSize="lg"
        fontWeight="medium"
        border="1px solid transparent"
        _hover={{
          borderColor: "blue.700",
          color: "blue.400",
        }}
        _active={{
          backgroundColor: "blue.800",
          borderColor: "blue.700",
        }}
      >
        Connect
      </Button>
      <ConnectModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
export default ConnectButton;
