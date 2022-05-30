import { POLYGON } from 'constants/chains'
import {
  ExchangeIssuanceZeroExMainnetAddress,
  ExchangeIssuanceZeroExPolygonAddress,
} from 'constants/ethContractAddresses'

export function get0xExchangeIssuanceContract(chainId: number = 1): string {
  if (chainId === POLYGON.chainId) return ExchangeIssuanceZeroExPolygonAddress
  return ExchangeIssuanceZeroExMainnetAddress
}
