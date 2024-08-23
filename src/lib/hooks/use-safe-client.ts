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
  const { address, rpcUrl } = useWallet()
  const [protocolKit, setProtocolKit] = useState<Safe | null>(null)
  const [safeAddress, setSafeAddress] = useState<string | null>(null)
  const apiKit = useMemo(() => new SafeApiKit({ chainId: BigInt(1) }), [])
  const { data: connectorClient } = useConnectorClient()

  useEffect(() => {
    async function loadProtocolKit() {
      if (!address || !connectorClient) return

      // const safeAccounts = await apiKit.getSafesByOwner(address)
      // FIXME: Determine correct safe account
      // const safeAddress = address
      // safeAccounts.safes.length > 0 ? safeAccounts.safes[0] : null
      // if (!safeAddress) return

      console.log('address', address)

      setSafeAddress(address)
      const protocolKit = await Safe.init({
        // provider: connectorClient.transport,
        provider: rpcUrl,
        safeAddress: address,
        // signer: address,
      })
      setProtocolKit(protocolKit)
    }
    loadProtocolKit()
  }, [address, apiKit, connectorClient, rpcUrl])

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
      console.log('isvalidhere', isValid)
      console.log('prep', safeMessage.preparedSignature)
      return isValid ? safeMessage.preparedSignature : null
    } catch {
      // apiKit.getMessage throws if the safeMessageHash is not found
      // e.g. the message does not exist and the signature is not valid
      return null
    }
  }

  const signTypedData = async (typedData: EIP712TypedData) => {
    console.log('signing', { protocolKit: !!protocolKit, address: !!address })
    if (!protocolKit || !connectorClient || !safeAddress || !address) return

    let safeMessage = protocolKit.createMessage(typedData)
    const modifiedProtocolKit = await protocolKit.connect({
      provider: connectorClient.transport,
      signer: '0x9F07803Aa18EDBEf8f5284A6060B490992Bb4682',
    })
    safeMessage = await modifiedProtocolKit.signMessage(
      safeMessage,
      SigningMethod.ETH_SIGN_TYPED_DATA_V4,
    )

    console.log('safeMessage', safeMessage)

    const messageHash = hashSafeMessage(typedData)
    const safeMessageHash =
      await modifiedProtocolKit.getSafeMessageHash(messageHash)
    const encodedSignatures = safeMessage.encodedSignatures()
    const isValid = await modifiedProtocolKit.isValidSignature(
      messageHash,
      encodedSignatures,
    )
    console.log('isvalid signature', isValid)
    if (isValid) return encodedSignatures

    const signature = safeMessage.getSignature(address) as EthSafeSignature
    console.log('signature123', signature)
    try {
      const confirmedMessage = await apiKit.getMessage(safeMessageHash)
      if (confirmedMessage) {
        console.log('exists', confirmedMessage)
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
    validSafeSignature,
    signTypedData,
  }
}
