require('dotenv').config({ path: __dirname + '/.env.local' })
require('@nomicfoundation/hardhat-toolbox')

module.exports = {
  solidity: '0.8.17',
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      },
    },
  },
}
