import SafeApiKit from '@safe-global/api-kit'
import { EIP712TypedData as LegacyEIP712TypedData } from '@safe-global/api-kit/dist/src/types/safeTransactionServiceTypes'
import Safe, {
  buildSignatureBytes,
  EthSafeSignature,
  hashSafeMessage,
  SigningMethod,
} from '@safe-global/protocol-kit'
import { EIP712TypedData } from '@safe-global/safe-core-sdk-types'
import { useEffect, useMemo, useState } from 'react'
import { useConnectorClient } from 'wagmi'

import { useWallet } from '@/lib/hooks/use-wallet'

export function useSafeClient() {
  const { address } = useWallet()
  const [protocolKit, setProtocolKit] = useState<Safe | null>(null)
  const [safeAddress, setSafeAddress] = useState<string | null>(null)
  const [safes, setSafes] = useState<string[] | null>(null)
  const apiKit = useMemo(() => new SafeApiKit({ chainId: BigInt(1) }), [])
  const { data: connectorClient } = useConnectorClient()

  useEffect(() => {
    async function loadProtocolKit() {
      if (!address || !safeAddress || !connectorClient) return

      const protocolKit = await Safe.init({
        provider: connectorClient.transport,
        safeAddress,
        signer: address,
      })
      setProtocolKit(protocolKit)
    }
    loadProtocolKit()
  }, [address, connectorClient, protocolKit, safeAddress])

  useEffect(() => {
    async function fetchSafes() {
      if (!apiKit) return

      if (!address) {
        setSafes([])
        return
      }

      const { safes } = await apiKit.getSafesByOwner(address)
      if (safes.length === 1) setSafeAddress(safes[0])

      setSafes(safes)
    }
    fetchSafes()
  }, [apiKit, address])

  const validSafeSignature = async (typedData: EIP712TypedData) => {
    if (!protocolKit) return null

    try {
      const messageHash = hashSafeMessage(typedData)
      const safeMessageHash = await protocolKit.getSafeMessageHash(messageHash)
      const safeMessage = await apiKit.getMessage(safeMessageHash)
      const isValid = await protocolKit.isValidSignature(
        messageHash,
        safeMessage.preparedSignature,
      )
      return isValid ? safeMessage.preparedSignature : null
    } catch {
      // apiKit.getMessage throws if the safeMessageHash is not found
      // e.g. the message does not exist and the signature is not valid
      return null
    }
  }

  const signTypedData = async (typedData: EIP712TypedData) => {
    if (!protocolKit || !safeAddress || !address) return

    let safeMessage = protocolKit.createMessage(typedData)
    safeMessage = await protocolKit.signMessage(
      safeMessage,
      SigningMethod.ETH_SIGN_TYPED_DATA_V4,
    )

    const messageHash = hashSafeMessage(typedData)
    const safeMessageHash = await protocolKit.getSafeMessageHash(messageHash)
    const signature = safeMessage.getSignature(address) as EthSafeSignature
    try {
      const confirmedMessage = await apiKit.getMessage(safeMessageHash)
      if (confirmedMessage) {
        // Message exists and is already signed
        await apiKit.addMessageSignature(
          safeMessageHash,
          buildSignatureBytes([signature]),
        )
      }
    } catch (e) {
      console.error('e', e)
      // Message not created yet
      await apiKit.addMessage(safeAddress, {
        message: typedData as unknown as LegacyEIP712TypedData,
        signature: buildSignatureBytes([signature]),
      })
    }
  }

  return {
    safes,
    safeAddress,
    setSafeAddress,
    signTypedData,
    validSafeSignature,
  }
}
