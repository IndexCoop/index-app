import { POLYGON } from 'constants/chains'
import {
  ExchangeIssuanceLeveragedMainnetAddress,
  ExchangeIssuanceLeveragedPolygonAddress,
  ExchangeIssuanceZeroExMainnetAddress,
  ExchangeIssuanceZeroExPolygonAddress,
} from 'constants/ethContractAddresses'

export function get0xExchangeIssuanceContract(chainId: number = 1): string {
  if (chainId === POLYGON.chainId) return ExchangeIssuanceZeroExPolygonAddress
  return ExchangeIssuanceZeroExMainnetAddress
}

export function getLeveragedExchangeIssuanceContract(
  chainId: number = 1
): string {
  if (chainId === POLYGON.chainId)
    return ExchangeIssuanceLeveragedPolygonAddress
  return ExchangeIssuanceLeveragedMainnetAddress
}
