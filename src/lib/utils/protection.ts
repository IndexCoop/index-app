import { getApiV2Protections } from '@/gen'

export async function getProtection(headers: Headers, address?: string) {
  const { data } = await getApiV2Protections(
    { address: address ?? undefined },
    {
      headers: {
        ...Object.fromEntries(headers.entries()),
        'ic-ip-address':
          headers.get('cf-connecting-ip') ??
          headers.get('x-forwarded-for') ??
          undefined,
        'ic-ip-country':
          headers.get('cf-ipcountry') ??
          headers.get('x-vercel-ip-country') ??
          undefined,
      },
    },
  )

  const { isForbiddenAddress, isNewUser, isRestrictedCountry, isUsingVpn } =
    data

  console.log({
    isForbiddenAddress,
    isNewUser,
    isRestrictedCountry,
    isUsingVpn,
  })

  return {
    isForbiddenAddress,
    isNewUser,
    isRestrictedCountry,
    isUsingVpn,
  }
}
