import React from "react";
import ReactDOM from "react-dom";
import {ChakraProvider, ColorModeScript} from "@chakra-ui/react";
import {Mainnet, DAppProvider, Config} from "@usedapp/core";

import "./index.css";
import App from "./App";
import theme from "theme";
import {MarketDataProvider} from "contexts/MarketData/MarketDataProvider";

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]:
      "https://mainnet.infura.io/v3/62687d1a985d4508b2b7a24827551934",
  },
};

console.log("theme", theme.config);

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <DAppProvider config={config}>
        <MarketDataProvider>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </MarketDataProvider>
      </DAppProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
