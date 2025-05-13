import type { QuoteTransaction } from '@/lib/hooks/use-best-quote/types'

export class TxSimulator {
  /**
   * @param accessKey A Tenderly access key.
   */
  constructor(
    private readonly accessKey: string,
    private readonly user: string,
    private readonly project: string,
  ) {
    if (!accessKey) {
      throw Error(
        'You must provide a Tenderly access key for simulations to work.',
      )
    }
    if (!user || !project) {
      throw Error('You must provide the user and the project name.')
    }
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-Access-Key': this.accessKey,
    }
  }

  /**
   * Gives public access to passed simulation and outputs public url to console.
   * @param simulationId ID of the simulation to be made public.
   */
  async share(simulationId: string) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'X-Access-Key': this.accessKey,
      },
    }
    const url = `https://api.tenderly.co/api/v1/account/${this.user}/project/${this.project}/simulations/${simulationId}/share`
    await fetch(url, requestOptions)
    const shareUrl = `https://www.tdly.co/shared/simulation/${simulationId}`
    // This log is here on purpose - as for now we only log the url to the console.
    console.log('tenderly:', shareUrl)
  }

  /**
   * Simulates a given transaction request on Tenderly.
   * @param tx A PopulatedTransaction to be simulated on the specified chain.
   * @returns A boolean whether the simulation was successful.
   */
  async simulate(tx: QuoteTransaction): Promise<boolean> {
    const apiUrl = `https://api.tenderly.co/api/v1/account/${this.user}/project/${this.project}/simulate`
    const body = {
      network_id: tx.chainId ?? 1,
      from: tx.from,
      to: tx.to,
      input: tx.data,
      gas: Number(tx.gas),
      gas_price: 0,
      value: tx.value?.toString() ?? '0',
      access_list: [],
      // simulation config (tenderly specific)
      save_if_fails: true,
      save: true,
    }

    const requestOptions = {
      method: 'POST',
      headers: this.getHeaders(),
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
