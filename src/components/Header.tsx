import {useDisclosure} from "@chakra-ui/hooks";
import {Image} from "@chakra-ui/image";
import {Flex} from "@chakra-ui/layout";
import ConnectButton from "./ConnectButton";

import indexLogoFullBlack from "assets/index-logo-full-black.png";
import indexLogoFullWhite from "assets/index-logo-full-white.png";
import indexLogoBlack from "assets/index-logo-black.png";
import indexLogoWhite from "assets/index-logo-white.png";
import {useColorMode} from "@chakra-ui/system";

const Header = () => {
  const {onOpen} = useDisclosure();
  const {colorMode} = useColorMode();
  let logo;

  if (window.innerWidth > 450)
    logo = colorMode === "dark" ? indexLogoFullWhite : indexLogoFullBlack;
  else logo = colorMode === "dark" ? indexLogoWhite : indexLogoBlack;

  return (
    <Flex justifyContent="space-between" width="100vw" padding="20px">
      <Image src={logo} alt="Index Coop Logo" minWidth="24px" height="24px" />
      <ConnectButton handleOpenModal={onOpen} />
    </Flex>
  );
};

export default Header;
