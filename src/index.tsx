import React from "react";
import ReactDOM from "react-dom";
import {ChakraProvider} from "@chakra-ui/react";
import {
  Mainnet,
  DAppProvider,
  useEtherBalance,
  useEthers,
  Config,
} from "@usedapp/core";

import "./index.css";
import App from "./App";

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]:
      "https://mainnet.infura.io/v3/62687d1a985d4508b2b7a24827551934",
  },
};

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <DAppProvider config={config}>
        <App />
      </DAppProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
