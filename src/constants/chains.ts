export type ChainData = {
  name: string;
  chainId: number;
  rpcUrl: string;
  icon: string;
  coingeckoId: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export const MAINNET: ChainData = {
  name: "Ethereum",
  chainId: 1,
  rpcUrl: "https://mainnet.eth.aragon.network/",
  icon: "https://raw.githubusercontent.com/sushiswap/icons/master/network/mainnet.jpg",
  coingeckoId: "ethereum",
  blockExplorerUrl: "https://etherscan.io/",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETHER",
    decimals: 18,
  },
};

export const POLYGON: ChainData = {
  name: "Polygon",
  chainId: 137,
  rpcUrl: "https://rpc-mainnet.maticvigil.com/",
  icon: "https://raw.githubusercontent.com/sushiswap/icons/master/network/polygon.jpg",
  coingeckoId: "polygon-pos",
  blockExplorerUrl: "https://polygonscan.com/",
  nativeCurrency: {
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
  },
};

const switchNetwork = (
  chaindata: ChainData,
  library: any,
  account: string | null | undefined
) => {
  if (chaindata.chainId === MAINNET.chainId) {
    library?.send("wallet_switchEthereumChain", [
      {chainId: MAINNET.chainId},
      account,
    ]);
  } else {
    library?.send("wallet_addEthereumChain", [
      {
        chainId: chaindata.chainId,
        chainName: chaindata.name,
        nativeCurrency: chaindata.nativeCurrency,
        rpcUrls: [chaindata.rpcUrl],
        blockExplorerUrls: [chaindata.blockExplorerUrl],
      },
      account,
    ]);
  }
};
