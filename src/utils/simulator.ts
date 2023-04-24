import { PopulatedTransaction } from 'ethers'

export class TxSimulator {
  /**
   * @param accessKey A Tenderly access key.
   */
  constructor(
    private readonly accessKey: string,
    private readonly user: string,
    private readonly project: string
  ) {
    if (!accessKey) {
      throw Error(
        'You must provide a Tenderly access key for simulations to work.'
      )
    }
    if (!user || !project) {
      throw Error('You must provide the user and the project name.')
    }
  }

  /**
   * Simulates a given transaction request on Tenderly.
   * @param tx A PopulatedTransaction to be simulated on the specified chain.
   * @returns A boolean whether the simulation was successful.
   */
  async simulate(tx: PopulatedTransaction): Promise<boolean> {
    const apiUrl = `https://api.tenderly.co/api/v1/account/${this.user}/project/${this.project}/simulate`
    const body = {
      network_id: tx.chainId ?? 1,
      from: tx.from,
      to: tx.to,
      input: tx.data,
      gas: tx.gasLimit?.toNumber() ?? 0,
      gas_price: 0,
      value: tx.value?.toString() ?? '0',
      access_list: [],
      // simulation config (tenderly specific)
      save_if_fails: true,
      save: false,
      // simulation_type: 'quick',
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-Access-Key': this.accessKey,
    }

    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }

    const res = await fetch(apiUrl, requestOptions)
    if (res.status === 403) {
      throw Error('Tenderly simulation quota reached')
    }
    const data = await res.json()
    return data.simulation.status === true
  }
}
