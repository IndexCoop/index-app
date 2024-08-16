import SafeApiKit from '@safe-global/api-kit'
import { EIP712TypedData as LegacyEIP712TypedData } from '@safe-global/api-kit/dist/src/types/safeTransactionServiceTypes'
import Safe, {
  buildSignatureBytes,
  EthSafeSignature,
  hashSafeMessage,
} from '@safe-global/protocol-kit'
import { EIP712TypedData } from '@safe-global/safe-core-sdk-types'
import { useEffect, useState } from 'react'

import { useWallet } from '@/lib/hooks/use-wallet'

export function useSafeClient() {
  const { address, rpcUrl } = useWallet()
  const [protocolKit, setProtocolKit] = useState<Safe | null>(null)
  const apiKit = new SafeApiKit({ chainId: BigInt(1) })

  // FIXME: Source safeAddress
  const safeAddress = '0xSAFE'

  useEffect(() => {
    async function load() {
      if (!rpcUrl || !address) return
      const protocolKit = await Safe.init({
        provider: rpcUrl,
        safeAddress,
      })
      setProtocolKit(protocolKit)
    }
    load()
  }, [address, rpcUrl])

  const validSafeSignature = async (typedData: EIP712TypedData) => {
    if (!protocolKit) return null

    const messageHash = hashSafeMessage(typedData)
    const safeMessage = protocolKit.createMessage(typedData)
    const encodedSignatures = safeMessage.encodedSignatures()
    const isValid = await protocolKit.isValidSignature(
      messageHash,
      encodedSignatures,
    )
    return isValid ? encodedSignatures : null
  }

  const signTypedData = async (typedData: EIP712TypedData) => {
    if (!protocolKit || !address) return

    const safeMessage = protocolKit.createMessage(typedData)
    const signature = safeMessage.getSignature(address) as EthSafeSignature
    const safeMessageHash = await protocolKit.getSafeMessageHash(
      hashSafeMessage(typedData),
    )
    const confirmedMessage = await apiKit.getMessage(safeMessageHash)
    if (confirmedMessage.confirmations.length > 0) {
      // Message exists and is already signed
      await apiKit.addMessageSignature(
        safeMessageHash,
        buildSignatureBytes([signature]),
      )
    } else {
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
