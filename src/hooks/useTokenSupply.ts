import { useCallback, useEffect, useState } from 'react'

import { Contract, providers } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'

import { IndexToken } from 'constants/tokens'
import { useReadOnlyProvider } from 'hooks/useReadOnlyProvider'
import { ERC20_ABI } from 'utils/abi/ERC20'
import { IndexApi } from 'utils/api/indexApi'

const getIndexSupply = async (provider: providers.JsonRpcProvider) => {
  const indexContract = new Contract(IndexToken.address!, ERC20_ABI, provider)
  const supply = await indexContract.totalSupply()
  return supply
}

export const useTokenSupply = (
  indexTokenAddress: string,
  chainId: number
): BigNumber => {
  const provider = useReadOnlyProvider(1)
  const [tokenSupply, setTokenSupply] = useState(BigNumber.from(0))

  const fetchSupply = useCallback(async () => {
    try {
      if (indexTokenAddress === IndexToken.address) {
        const supply = await getIndexSupply(provider)
        setTokenSupply(supply)
        return
      }
      const indexApi = new IndexApi()
      const path = `/supply?address=${indexTokenAddress}&chainId=${chainId}`
      const { supply } = await indexApi.get(path)
      setTokenSupply(BigNumber.from(supply))
    } catch (error) {
      console.log('Error fetching current supply', error)
      setTokenSupply(BigNumber.from(0))
    }
  }, [chainId, indexTokenAddress])

  useEffect(() => {
    fetchSupply()
  }, [fetchSupply])

  return tokenSupply
}
