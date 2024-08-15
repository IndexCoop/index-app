require('dotenv').config({ path: __dirname + '/.env.local' })
require('@nomicfoundation/hardhat-toolbox')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    hardhat: {
      forking: {
        chainId: 31337,
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      },
    },
    custom: {
      url: 'http://127.0.0.1:8545/',
    },
  },
}

task('accounts', 'prints the list of accounts', async (_, hre) => {
  console.log(hre.ethers)
  console.log('network:', hre.network.name)
  // format: [token, whale, amount]
  const tokens = [
    [
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      '0xda9ce944a37d218c3302f6b82a094844c6eceb17',
      '1000000000',
    ],
    [
      '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0', // wstETH
      '0x5ef0f3C15b2371E7355f5b6594F706aB7417655e',
      '1000000000000000000',
    ],
  ]
  const account = process.env.HARDHAT_FUNDING_ACCOUNT
  console.log('Funding account', account)
  const signer = await hre.ethers.provider.getSigner(account)
  let tokenPromises = tokens.map((token) =>
    transferFromWhale(
      token[1],
      account,
      token[2],
      token[0],
      hre.ethers.provider,
    ),
  )
  await Promise.all(tokenPromises)
  const contract = createERC20Contract(tokens[0][0], signer)
  const balance = await contract.balanceOf(account)
  console.log(balance.toString(), '\tbalance of account')
})

task(
  'start',
  'Starts a local Ethereum node and runs accounts task',
  async (taskArgs, hre) => {
    const network = taskArgs.network
    console.log('NETWORK:', network)
    await hre.run('node') // Start the local Ethereum node
    console.log('NETWORK:', network)
    // await hre.run('accounts', { network: 'custom' }) // Run the accounts task
  },
)

async function transferFromWhale(
  whale, // : string,
  to, // : string,
  amount, // : BigNumber,
  erc20Address, // : string,
  provider, // : JsonRpcProvider
) {
  console.log(whale, erc20Address)
  const signer = await provider.getSigner(whale)
  const contract = createERC20Contract(erc20Address, signer)
  const balance = await contract.balanceOf(whale)
  console.log(balance.toString(), '\tbalance of whale', whale)
  // Does not know `lt` function in this context
  // if (balance.lt(amount)) {
  //   throw new Error(
  //     `Not enough balance to steal ${amount} ${erc20Address} from ${whale}: ${balance}`,
  //   )
  // }
  await provider.send('hardhat_impersonateAccount', [whale])
  const transferTx = await contract.transfer(to, amount, {
    // If you can't get the token to transfer sometimes gas is the issue (increase)
    gasLimit: 200_000,
  })
  await transferTx.wait()
  await provider.send('hardhat_stopImpersonatingAccount', [whale])
}

function createERC20Contract(
  erc20Address, //: string,
  providerOrSigner, //: JsonRpcProvider | JsonRpcSigner | Wallet
) {
  const abi = [
    // Read-Only Functions
    'function allowance(address account, address spender) external view returns (uint)',
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    // Authenticated Functions
    'function approve(address spender, uint rawAmount) external returns (bool)',
    'function transfer(address to, uint amount) returns (bool)',
  ]
  return new hre.ethers.Contract(erc20Address, abi, providerOrSigner)
}
